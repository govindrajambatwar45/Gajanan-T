const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// PERSISTENT DATA LAYER — GitHub 'live-data' Branch + Local /tmp
// Guarantees lifetime persistence across all Vercel cold starts
// ============================================================
const BUNDLED_DATA_DIR = path.join(__dirname, 'data');
const IS_VERCEL = !!process.env.VERCEL;
const TMP_DATA_DIR = IS_VERCEL ? '/tmp/gt-data' : BUNDLED_DATA_DIR;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = 'govindrajambatwar45';
const GITHUB_REPO = 'Gajanan-T';
const GITHUB_BRANCH = 'live-data';

// In-memory data store & SHA cache
const memoryStore = {};
const shaCache = {};
const syncLocks = {};

// Ensure /tmp/gt-data exists on Vercel
if (IS_VERCEL) {
  try { fs.mkdirSync(TMP_DATA_DIR, { recursive: true }); } catch (e) { /* ok */ }
}

// GitHub API helper with automatic retry
function githubRequest(method, endpoint, body = null, retries = 2) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_OWNER}/${GITHUB_REPO}${endpoint}`,
      method,
      headers: {
        'User-Agent': 'Gajanan-Traders-Server/1.0',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      },
      timeout: 8000
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
        } else if (res.statusCode === 404) {
          resolve(null);
        } else {
          resolve(null);
        }
      });
    });

    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => githubRequest(method, endpoint, body, retries - 1).then(resolve).catch(reject), 400);
      } else {
        resolve(null);
      }
    });

    if (postData) req.write(postData);
    req.end();
  });
}

// Fetch file from GitHub live-data branch
async function fetchFromGitHub(filename) {
  try {
    const res = await githubRequest('GET', `/contents/data/${filename}?ref=${GITHUB_BRANCH}`);
    if (res && res.content) {
      const raw = Buffer.from(res.content, 'base64').toString('utf8');
      const parsed = JSON.parse(raw);
      shaCache[filename] = res.sha;
      memoryStore[filename] = parsed;

      // Mirror to /tmp
      const tmpPath = path.join(TMP_DATA_DIR, filename);
      try { fs.writeFileSync(tmpPath, raw, 'utf8'); } catch (e) {}
      return parsed;
    }
  } catch (err) {
    console.warn(`[GitHub Fetch Warning] Could not fetch ${filename}:`, err.message);
  }
  return null;
}

// Sync updated file to GitHub live-data branch
async function saveToGitHub(filename, data) {
  if (syncLocks[filename]) return;
  syncLocks[filename] = true;

  try {
    // If we don't have SHA, retrieve it first
    if (!shaCache[filename]) {
      const existing = await githubRequest('GET', `/contents/data/${filename}?ref=${GITHUB_BRANCH}`);
      if (existing && existing.sha) {
        shaCache[filename] = existing.sha;
      }
    }

    const contentBase64 = Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64');
    const updateRes = await githubRequest('PUT', `/contents/data/${filename}`, {
      message: `Sync ${filename} [Live Data]`,
      content: contentBase64,
      sha: shaCache[filename] || undefined,
      branch: GITHUB_BRANCH
    });

    if (updateRes && updateRes.content && updateRes.content.sha) {
      shaCache[filename] = updateRes.content.sha;
      console.log(`[GitHub Sync Success] ${filename} saved to ${GITHUB_BRANCH} branch (SHA: ${shaCache[filename].slice(0, 7)})`);
    } else {
      // Retry once by refetching SHA
      const refetched = await githubRequest('GET', `/contents/data/${filename}?ref=${GITHUB_BRANCH}`);
      if (refetched && refetched.sha) {
        shaCache[filename] = refetched.sha;
        const retryRes = await githubRequest('PUT', `/contents/data/${filename}`, {
          message: `Sync ${filename} [Retry]`,
          content: contentBase64,
          sha: shaCache[filename],
          branch: GITHUB_BRANCH
        });
        if (retryRes && retryRes.content) {
          shaCache[filename] = retryRes.content.sha;
        }
      }
    }
  } catch (err) {
    console.error(`[GitHub Sync Error] ${filename}:`, err.message);
  } finally {
    syncLocks[filename] = false;
  }
}

// Synchronous local read with immediate return
function readData(filename) {
  if (memoryStore[filename]) {
    return memoryStore[filename];
  }

  // 1. Check local /tmp (Vercel) or bundled data
  const tmpPath = path.join(TMP_DATA_DIR, filename);
  if (fs.existsSync(tmpPath)) {
    try {
      const raw = fs.readFileSync(tmpPath, 'utf8');
      memoryStore[filename] = JSON.parse(raw);
      // Trigger background sync from GitHub in case it's fresher
      fetchFromGitHub(filename);
      return memoryStore[filename];
    } catch (e) {}
  }

  // 2. Check bundled data directory
  const bundledPath = path.join(BUNDLED_DATA_DIR, filename);
  if (fs.existsSync(bundledPath)) {
    try {
      const raw = fs.readFileSync(bundledPath, 'utf8');
      memoryStore[filename] = JSON.parse(raw);
      if (IS_VERCEL) {
        try { fs.writeFileSync(tmpPath, raw, 'utf8'); } catch (e) {}
      }
      // Trigger background sync from GitHub
      fetchFromGitHub(filename);
      return memoryStore[filename];
    } catch (e) {}
  }

  memoryStore[filename] = [];
  return [];
}

// Async read ensuring GitHub sync on first retrieval
async function readDataAsync(filename) {
  if (memoryStore[filename]) {
    return memoryStore[filename];
  }
  const fromGithub = await fetchFromGitHub(filename);
  if (fromGithub) return fromGithub;
  return readData(filename);
}

// Write data locally and persist to GitHub live-data branch
async function writeData(filename, data) {
  memoryStore[filename] = data;
  const filePath = path.join(TMP_DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing local ${filename}:`, err.message);
  }

  // Persist to GitHub with timeout safeguard
  try {
    await Promise.race([
      saveToGitHub(filename, data),
      new Promise(resolve => setTimeout(resolve, 2500))
    ]);
  } catch (e) {}

  return true;
}

// Pre-warm data collections from GitHub in background
const collections = ['products.json', 'enquiries.json', 'quotations.json', 'orders.json', 'invoices.json', 'customers.json', 'employees.json', 'expenses.json', 'users.json'];
collections.forEach(file => {
  readData(file);
});

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readDataAsync('users.json');
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({
      success: true,
      token: 'gt-admin-token-' + Date.now(),
      user: { id: user.id, username: user.username, name: user.name, role: user.role }
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { username, phone, newPassword } = req.body;
  if (!username || !phone || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const users = await readDataAsync('users.json');
  const cleanPhoneInput = String(phone).replace(/\D/g, '').slice(-10);
  
  const userIndex = users.findIndex(u => {
    const userPhoneClean = String(u.phone || '').replace(/\D/g, '').slice(-10);
    return u.username.toLowerCase() === username.trim().toLowerCase() && userPhoneClean === cleanPhoneInput;
  });

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Username or registered mobile number does not match our records.' });
  }

  users[userIndex].password = newPassword.trim();
  await writeData('users.json', users);

  res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
});

// --- PRODUCTS API ---
app.get('/api/products', async (req, res) => {
  const products = await readDataAsync('products.json');
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const products = await readDataAsync('products.json');
  const maxNum = products.reduce((max, p) => {
    const m = String(p.id || '').match(/PRD-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newProduct = {
    id: 'PRD-' + String(maxNum + 1).padStart(3, '0'),
    ...req.body,
    stockStatus: req.body.stockStatus || 'In Stock'
  };
  products.unshift(newProduct);
  await writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  let products = await readDataAsync('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    await writeData('products.json', products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  let products = await readDataAsync('products.json');
  products = products.filter(p => p.id !== req.params.id);
  await writeData('products.json', products);
  res.json({ success: true });
});

// --- WORKERS & EMPLOYEES API ---
app.get('/api/employees', async (req, res) => {
  res.json(await readDataAsync('employees.json'));
});

app.post('/api/employees', async (req, res) => {
  const employees = await readDataAsync('employees.json');
  const maxNum = employees.reduce((max, e) => {
    const m = String(e.id || '').match(/EMP-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newEmp = {
    id: 'EMP-' + String(maxNum + 1).padStart(3, '0'),
    ...req.body,
    joinDate: req.body.joinDate || new Date().toISOString().split('T')[0],
    status: req.body.status || 'Active'
  };
  employees.unshift(newEmp);
  await writeData('employees.json', employees);
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', async (req, res) => {
  let employees = await readDataAsync('employees.json');
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body };
    await writeData('employees.json', employees);
    res.json(employees[index]);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  let employees = await readDataAsync('employees.json');
  employees = employees.filter(e => e.id !== req.params.id);
  await writeData('employees.json', employees);
  res.json({ success: true });
});

// --- ENQUIRIES API ---
app.get('/api/enquiries', async (req, res) => {
  res.json(await readDataAsync('enquiries.json'));
});

app.post('/api/enquiries', async (req, res) => {
  const enquiries = await readDataAsync('enquiries.json');
  const maxNum = enquiries.reduce((max, e) => {
    const m = String(e.id || '').match(/ENQ-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newEnquiry = {
    id: 'ENQ-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    ...req.body,
    status: req.body.status || 'New',
    createdAt: new Date().toISOString()
  };
  enquiries.unshift(newEnquiry);
  await writeData('enquiries.json', enquiries);

  // Auto-upsert into customers list
  if (newEnquiry.phone) {
    const customers = await readDataAsync('customers.json');
    let cust = customers.find(c => c.phone === newEnquiry.phone);
    if (!cust) {
      const maxCustNum = customers.reduce((max, c) => {
        const m = String(c.id || '').match(/CUST-(\d+)/);
        const num = m ? parseInt(m[1], 10) : 0;
        return num > max ? num : max;
      }, 0);
      cust = {
        id: 'CUST-' + String(maxCustNum + 1).padStart(3, '0'),
        name: newEnquiry.customerName,
        phone: newEnquiry.phone,
        address: newEnquiry.city || 'Naigaon Bz',
        city: newEnquiry.city || 'Naigaon Bz',
        pincode: '431709',
        customerType: 'Retail Homeowner',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString()
      };
      customers.unshift(cust);
      await writeData('customers.json', customers);
    }
  }

  res.status(201).json(newEnquiry);
});

app.put('/api/enquiries/:id', async (req, res) => {
  let enquiries = await readDataAsync('enquiries.json');
  const index = enquiries.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    enquiries[index] = { ...enquiries[index], ...req.body };
    await writeData('enquiries.json', enquiries);
    res.json(enquiries[index]);
  } else {
    res.status(404).json({ message: 'Enquiry not found' });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  let enquiries = await readDataAsync('enquiries.json');
  enquiries = enquiries.filter(e => e.id !== req.params.id);
  await writeData('enquiries.json', enquiries);
  res.json({ success: true });
});

// --- CUSTOMERS API ---
app.get('/api/customers', async (req, res) => {
  res.json(await readDataAsync('customers.json'));
});

app.post('/api/customers', async (req, res) => {
  const customers = await readDataAsync('customers.json');
  const maxNum = customers.reduce((max, c) => {
    const m = String(c.id || '').match(/CUST-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newCustomer = {
    id: 'CUST-' + String(maxNum + 1).padStart(3, '0'),
    ...req.body,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString()
  };
  customers.unshift(newCustomer);
  await writeData('customers.json', customers);
  res.status(201).json(newCustomer);
});

app.delete('/api/customers/:id', async (req, res) => {
  let customers = await readDataAsync('customers.json');
  customers = customers.filter(c => c.id !== req.params.id);
  await writeData('customers.json', customers);
  res.json({ success: true });
});

// --- QUOTATIONS API ---
app.get('/api/quotations', async (req, res) => {
  res.json(await readDataAsync('quotations.json'));
});

app.post('/api/quotations', async (req, res) => {
  const quotations = await readDataAsync('quotations.json');
  const maxNum = quotations.reduce((max, q) => {
    const m = String(q.id || '').match(/QTN-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newQuotation = {
    id: 'QTN-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    date: new Date().toISOString().split('T')[0],
    ...req.body,
    status: req.body.status || 'Sent'
  };
  quotations.unshift(newQuotation);
  await writeData('quotations.json', quotations);

  // If created from an enquiry, mark enquiry as Quoted
  if (req.body.enquiryId) {
    let enquiries = await readDataAsync('enquiries.json');
    const enq = enquiries.find(e => e.id === req.body.enquiryId);
    if (enq) {
      enq.status = 'Quoted';
      await writeData('enquiries.json', enquiries);
    }
  }

  res.status(201).json(newQuotation);
});

app.put('/api/quotations/:id', async (req, res) => {
  let quotations = await readDataAsync('quotations.json');
  const index = quotations.findIndex(q => q.id === req.params.id);
  if (index !== -1) {
    quotations[index] = { ...quotations[index], ...req.body };
    await writeData('quotations.json', quotations);
    res.json(quotations[index]);
  } else {
    res.status(404).json({ message: 'Quotation not found' });
  }
});

app.delete('/api/quotations/:id', async (req, res) => {
  let quotations = await readDataAsync('quotations.json');
  quotations = quotations.filter(q => q.id !== req.params.id);
  await writeData('quotations.json', quotations);
  res.json({ success: true });
});

// --- ORDERS API ---
app.get('/api/orders', async (req, res) => {
  res.json(await readDataAsync('orders.json'));
});

app.post('/api/orders', async (req, res) => {
  const orders = await readDataAsync('orders.json');
  const maxNum = orders.reduce((max, o) => {
    const m = String(o.id || '').match(/ORD-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newOrder = {
    id: 'ORD-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    orderDate: new Date().toISOString().split('T')[0],
    ...req.body,
    orderStatus: req.body.orderStatus || 'Processing',
    paymentStatus: req.body.paymentStatus || 'Pending'
  };
  orders.unshift(newOrder);
  await writeData('orders.json', orders);

  // If converted from quotation, mark quotation status as Accepted
  if (req.body.quotationId) {
    let quotations = await readDataAsync('quotations.json');
    const qtn = quotations.find(q => q.id === req.body.quotationId);
    if (qtn) {
      qtn.status = 'Accepted';
      await writeData('quotations.json', quotations);
    }
  }

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', async (req, res) => {
  let orders = await readDataAsync('orders.json');
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...req.body };
    await writeData('orders.json', orders);
    res.json(orders[index]);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  let orders = await readDataAsync('orders.json');
  orders = orders.filter(o => o.id !== req.params.id);
  await writeData('orders.json', orders);
  res.json({ success: true });
});

// --- INVOICES API ---
app.get('/api/invoices', async (req, res) => {
  res.json(await readDataAsync('invoices.json'));
});

app.get('/api/invoices/:id', async (req, res) => {
  const invoices = await readDataAsync('invoices.json');
  const inv = invoices.find(i => i.id === req.params.id);
  if (inv) {
    res.json(inv);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

app.post('/api/invoices', async (req, res) => {
  const invoices = await readDataAsync('invoices.json');
  const maxNum = invoices.reduce((max, i) => {
    const m = String(i.id || '').match(/GT-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newInvoice = {
    id: 'GT-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
    status: req.body.status || 'Pending'
  };
  invoices.unshift(newInvoice);
  await writeData('invoices.json', invoices);

  // Update customer purchase metrics
  if (newInvoice.customerPhone) {
    let customers = await readDataAsync('customers.json');
    const cust = customers.find(c => c.phone === newInvoice.customerPhone || c.name === newInvoice.customerName);
    if (cust) {
      cust.totalOrders = (cust.totalOrders || 0) + 1;
      cust.totalSpent = (cust.totalSpent || 0) + (newInvoice.grandTotal || 0);
      await writeData('customers.json', customers);
    }
  }

  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', async (req, res) => {
  let invoices = await readDataAsync('invoices.json');
  const index = invoices.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    invoices[index] = { ...invoices[index], ...req.body };
    await writeData('invoices.json', invoices);
    res.json(invoices[index]);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

app.delete('/api/invoices/:id', async (req, res) => {
  let invoices = await readDataAsync('invoices.json');
  invoices = invoices.filter(i => i.id !== req.params.id);
  await writeData('invoices.json', invoices);
  res.json({ success: true });
});

// --- PAYMENTS API ---
app.get('/api/payments', async (req, res) => {
  res.json(await readDataAsync('payments.json'));
});

app.post('/api/payments', async (req, res) => {
  const payments = await readDataAsync('payments.json');
  const maxNum = payments.reduce((max, p) => {
    const m = String(p.id || '').match(/PAY-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newPayment = {
    id: 'PAY-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    paymentDate: req.body.paymentDate || new Date().toISOString().split('T')[0],
    ...req.body
  };
  payments.unshift(newPayment);
  await writeData('payments.json', payments);

  // Update linked invoice status
  if (newPayment.invoiceId) {
    let invoices = await readDataAsync('invoices.json');
    const inv = invoices.find(i => i.id === newPayment.invoiceId);
    if (inv) {
      const allPayments = payments.filter(p => p.invoiceId === newPayment.invoiceId);
      const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
      if (totalPaid >= inv.grandTotal) {
        inv.status = 'Paid';
      } else if (totalPaid > 0) {
        inv.status = 'Partially Paid';
      }
      await writeData('invoices.json', invoices);
    }
  }

  res.status(201).json(newPayment);
});

app.delete('/api/payments/:id', async (req, res) => {
  let payments = await readDataAsync('payments.json');
  payments = payments.filter(p => p.id !== req.params.id);
  await writeData('payments.json', payments);
  res.json({ success: true });
});

// --- EXPENSES API ---
app.get('/api/expenses', async (req, res) => {
  res.json(await readDataAsync('expenses.json'));
});

app.post('/api/expenses', async (req, res) => {
  const expenses = await readDataAsync('expenses.json');
  const maxNum = expenses.reduce((max, e) => {
    const m = String(e.id || '').match(/EXP-\d+-(\d+)/);
    const num = m ? parseInt(m[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const newExpense = {
    id: 'EXP-' + new Date().getFullYear() + '-' + String(maxNum + 1).padStart(3, '0'),
    expenseDate: req.body.expenseDate || new Date().toISOString().split('T')[0],
    ...req.body
  };
  expenses.unshift(newExpense);
  await writeData('expenses.json', expenses);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  let expenses = await readDataAsync('expenses.json');
  expenses = expenses.filter(e => e.id !== req.params.id);
  await writeData('expenses.json', expenses);
  res.json({ success: true });
});

// --- REPORTS SUMMARY API ---
app.get('/api/reports/summary', async (req, res) => {
  const invoices = await readDataAsync('invoices.json');
  const payments = await readDataAsync('payments.json');
  const expenses = await readDataAsync('expenses.json');
  const enquiries = await readDataAsync('enquiries.json');
  const orders = await readDataAsync('orders.json');
  const quotations = await readDataAsync('quotations.json');
  const employees = await readDataAsync('employees.json');

  const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.grandTotal || 0), 0);
  const totalGst = invoices.reduce((sum, i) => sum + Number(i.totalGst || 0), 0);
  const totalPaidReceived = payments.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const outstandingBalance = Math.max(0, totalInvoiced - totalPaidReceived);
  const netProfit = totalInvoiced - totalExpenses;

  res.json({
    totalInvoiced,
    totalGst,
    totalPaidReceived,
    outstandingBalance,
    totalExpenses,
    netProfit,
    countEnquiries: enquiries.length,
    countQuotations: quotations.length,
    countOrders: orders.length,
    countInvoices: invoices.length,
    countEmployees: employees.length
  });
});

// Fallback route for single page apps
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Gajanan Traders Web App & Mini ERP Server Running`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Admin ERP: http://localhost:${PORT}/admin.html`);
    console.log(` Location: Naigaon Bz, Nanded 431709`);
    console.log(` Phone: +91 9767228008`);
    console.log(` Data Persistence: GitHub Branch '${GITHUB_BRANCH}' + /tmp`);
    console.log(`====================================================`);
  });
}

module.exports = app;
