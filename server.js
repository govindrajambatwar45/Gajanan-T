const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_DIR = path.join(__dirname, 'data');

// Helper to read JSON file safely
function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return [];
  }
}

// Helper to write JSON file safely
function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// --- AUTH API ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData('users.json');
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

app.post('/api/auth/reset-password', (req, res) => {
  const { username, phone, newPassword } = req.body;
  if (!username || !phone || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
  }

  const users = readData('users.json');
  const cleanPhoneInput = String(phone).replace(/\D/g, '').slice(-10);
  
  const userIndex = users.findIndex(u => {
    const userPhoneClean = String(u.phone || '').replace(/\D/g, '').slice(-10);
    return u.username.toLowerCase() === username.trim().toLowerCase() && userPhoneClean === cleanPhoneInput;
  });

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'Username or registered mobile number does not match our records.' });
  }

  users[userIndex].password = newPassword.trim();
  writeData('users.json', users);

  res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
});

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  res.json(readData('products.json'));
});

app.post('/api/products', (req, res) => {
  const products = readData('products.json');
  const newProduct = {
    id: 'PRD-' + String(products.length + 1).padStart(3, '0'),
    ...req.body,
    stockStatus: req.body.stockStatus || 'In Stock'
  };
  products.unshift(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    writeData('products.json', products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  products = products.filter(p => p.id !== req.params.id);
  writeData('products.json', products);
  res.json({ success: true });
});

// --- WORKERS & EMPLOYEES API ---
app.get('/api/employees', (req, res) => {
  res.json(readData('employees.json'));
});

app.post('/api/employees', (req, res) => {
  const employees = readData('employees.json');
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
  writeData('employees.json', employees);
  res.status(201).json(newEmp);
});

app.put('/api/employees/:id', (req, res) => {
  let employees = readData('employees.json');
  const index = employees.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body };
    writeData('employees.json', employees);
    res.json(employees[index]);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  let employees = readData('employees.json');
  employees = employees.filter(e => e.id !== req.params.id);
  writeData('employees.json', employees);
  res.json({ success: true });
});

// --- ENQUIRIES API ---
app.get('/api/enquiries', (req, res) => {
  res.json(readData('enquiries.json'));
});

app.post('/api/enquiries', (req, res) => {
  const enquiries = readData('enquiries.json');
  const newEnquiry = {
    id: 'ENQ-' + new Date().getFullYear() + '-' + String(enquiries.length + 1).padStart(3, '0'),
    ...req.body,
    status: req.body.status || 'New',
    createdAt: new Date().toISOString()
  };
  enquiries.unshift(newEnquiry);
  writeData('enquiries.json', enquiries);

  // Auto-upsert into customers list
  const customers = readData('customers.json');
  let cust = customers.find(c => c.phone === newEnquiry.phone);
  if (!cust && newEnquiry.phone) {
    cust = {
      id: 'CUST-' + String(customers.length + 1).padStart(3, '0'),
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
    writeData('customers.json', customers);
  }

  res.status(201).json(newEnquiry);
});

app.put('/api/enquiries/:id', (req, res) => {
  let enquiries = readData('enquiries.json');
  const index = enquiries.findIndex(e => e.id === req.params.id);
  if (index !== -1) {
    enquiries[index] = { ...enquiries[index], ...req.body };
    writeData('enquiries.json', enquiries);
    res.json(enquiries[index]);
  } else {
    res.status(404).json({ message: 'Enquiry not found' });
  }
});

// --- CUSTOMERS API ---
app.get('/api/customers', (req, res) => {
  res.json(readData('customers.json'));
});

app.post('/api/customers', (req, res) => {
  const customers = readData('customers.json');
  const newCustomer = {
    id: 'CUST-' + String(customers.length + 1).padStart(3, '0'),
    ...req.body,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString()
  };
  customers.unshift(newCustomer);
  writeData('customers.json', customers);
  res.status(201).json(newCustomer);
});

// --- QUOTATIONS API ---
app.get('/api/quotations', (req, res) => {
  res.json(readData('quotations.json'));
});

app.post('/api/quotations', (req, res) => {
  const quotations = readData('quotations.json');
  const newQuotation = {
    id: 'QTN-' + new Date().getFullYear() + '-' + String(quotations.length + 1).padStart(3, '0'),
    date: new Date().toISOString().split('T')[0],
    ...req.body,
    status: req.body.status || 'Sent'
  };
  quotations.unshift(newQuotation);
  writeData('quotations.json', quotations);

  // If created from an enquiry, mark enquiry as Quoted
  if (req.body.enquiryId) {
    let enquiries = readData('enquiries.json');
    const enq = enquiries.find(e => e.id === req.body.enquiryId);
    if (enq) {
      enq.status = 'Quoted';
      writeData('enquiries.json', enquiries);
    }
  }

  res.status(201).json(newQuotation);
});

app.put('/api/quotations/:id', (req, res) => {
  let quotations = readData('quotations.json');
  const index = quotations.findIndex(q => q.id === req.params.id);
  if (index !== -1) {
    quotations[index] = { ...quotations[index], ...req.body };
    writeData('quotations.json', quotations);
    res.json(quotations[index]);
  } else {
    res.status(404).json({ message: 'Quotation not found' });
  }
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  res.json(readData('orders.json'));
});

app.post('/api/orders', (req, res) => {
  const orders = readData('orders.json');
  const newOrder = {
    id: 'ORD-' + new Date().getFullYear() + '-' + String(orders.length + 1).padStart(3, '0'),
    orderDate: new Date().toISOString().split('T')[0],
    ...req.body,
    orderStatus: req.body.orderStatus || 'Processing',
    paymentStatus: req.body.paymentStatus || 'Pending'
  };
  orders.unshift(newOrder);
  writeData('orders.json', orders);

  // If converted from quotation, mark quotation status as Accepted
  if (req.body.quotationId) {
    let quotations = readData('quotations.json');
    const qtn = quotations.find(q => q.id === req.body.quotationId);
    if (qtn) {
      qtn.status = 'Accepted';
      writeData('quotations.json', quotations);
    }
  }

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  let orders = readData('orders.json');
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...req.body };
    writeData('orders.json', orders);
    res.json(orders[index]);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// --- INVOICES API ---
app.get('/api/invoices', (req, res) => {
  res.json(readData('invoices.json'));
});

app.get('/api/invoices/:id', (req, res) => {
  const invoices = readData('invoices.json');
  const inv = invoices.find(i => i.id === req.params.id);
  if (inv) {
    res.json(inv);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

app.post('/api/invoices', (req, res) => {
  const invoices = readData('invoices.json');
  const newInvoice = {
    id: 'GT-' + new Date().getFullYear() + '-' + String(invoices.length + 1).padStart(3, '0'),
    date: req.body.date || new Date().toISOString().split('T')[0],
    ...req.body,
    status: req.body.status || 'Pending'
  };
  invoices.unshift(newInvoice);
  writeData('invoices.json', invoices);

  // Update customer purchase metrics
  if (newInvoice.customerPhone) {
    let customers = readData('customers.json');
    const cust = customers.find(c => c.phone === newInvoice.customerPhone || c.name === newInvoice.customerName);
    if (cust) {
      cust.totalOrders = (cust.totalOrders || 0) + 1;
      cust.totalSpent = (cust.totalSpent || 0) + (newInvoice.grandTotal || 0);
      writeData('customers.json', customers);
    }
  }

  res.status(201).json(newInvoice);
});

app.put('/api/invoices/:id', (req, res) => {
  let invoices = readData('invoices.json');
  const index = invoices.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    invoices[index] = { ...invoices[index], ...req.body };
    writeData('invoices.json', invoices);
    res.json(invoices[index]);
  } else {
    res.status(404).json({ message: 'Invoice not found' });
  }
});

// --- PAYMENTS API ---
app.get('/api/payments', (req, res) => {
  res.json(readData('payments.json'));
});

app.post('/api/payments', (req, res) => {
  const payments = readData('payments.json');
  const newPayment = {
    id: 'PAY-' + new Date().getFullYear() + '-' + String(payments.length + 1).padStart(3, '0'),
    paymentDate: req.body.paymentDate || new Date().toISOString().split('T')[0],
    ...req.body
  };
  payments.unshift(newPayment);
  writeData('payments.json', payments);

  // Update linked invoice status
  if (newPayment.invoiceId) {
    let invoices = readData('invoices.json');
    const inv = invoices.find(i => i.id === newPayment.invoiceId);
    if (inv) {
      const allPayments = payments.filter(p => p.invoiceId === newPayment.invoiceId);
      const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
      if (totalPaid >= inv.grandTotal) {
        inv.status = 'Paid';
      } else if (totalPaid > 0) {
        inv.status = 'Partially Paid';
      }
      writeData('invoices.json', invoices);
    }
  }

  res.status(201).json(newPayment);
});

// --- EXPENSES API ---
app.get('/api/expenses', (req, res) => {
  res.json(readData('expenses.json'));
});

app.post('/api/expenses', (req, res) => {
  const expenses = readData('expenses.json');
  const newExpense = {
    id: 'EXP-' + new Date().getFullYear() + '-' + String(expenses.length + 1).padStart(3, '0'),
    expenseDate: req.body.expenseDate || new Date().toISOString().split('T')[0],
    ...req.body
  };
  expenses.unshift(newExpense);
  writeData('expenses.json', expenses);
  res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req, res) => {
  let expenses = readData('expenses.json');
  expenses = expenses.filter(e => e.id !== req.params.id);
  writeData('expenses.json', expenses);
  res.json({ success: true });
});

// --- REPORTS SUMMARY API ---
app.get('/api/reports/summary', (req, res) => {
  const invoices = readData('invoices.json');
  const payments = readData('payments.json');
  const expenses = readData('expenses.json');
  const enquiries = readData('enquiries.json');
  const orders = readData('orders.json');
  const quotations = readData('quotations.json');
  const employees = readData('employees.json');

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

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Gajanan Traders Web App & Mini ERP Server Running`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Admin ERP: http://localhost:${PORT}/admin.html`);
  console.log(` Location: Naigaon Bz, Nanded 431709`);
  console.log(` Phone: +91 9767228008`);
  console.log(`====================================================`);
});
