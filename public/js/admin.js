// Admin ERP & Billing Portal JavaScript for Gajanan Traders

let currentToken = localStorage.getItem('gt_token');
let activeTab = 'dashboard';
let currentPrintInvoice = null;
let currentAdminLang = localStorage.getItem('gt_admin_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupNavigation();
  setupLoginForm();
  setupInvoiceForm();
  setupProductForm();
  setupEmployeeForm();
  setupAdminLanguage();
});

// Authentication check
function checkAuth() {
  const loginModal = document.getElementById('loginModal');
  const erpApp = document.getElementById('erpApp');

  if (currentToken) {
    if (loginModal) loginModal.classList.add('hidden');
    if (erpApp) erpApp.classList.remove('hidden');
    loadActiveTabData();
  } else {
    if (loginModal) loginModal.classList.remove('hidden');
    if (erpApp) erpApp.classList.add('hidden');
  }
}

// Login form submission
function setupLoginForm() {
  const form = document.getElementById('adminLoginForm');
  const errDiv = document.getElementById('loginError');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errDiv.classList.add('hidden');

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        currentToken = data.token;
        localStorage.setItem('gt_token', currentToken);
        checkAuth();
      } else {
        errDiv.textContent = data.message || 'Invalid username or password';
        errDiv.classList.remove('hidden');
      }
    } catch (err) {
      console.error(err);
      errDiv.textContent = 'Server connection error. Please try again.';
      errDiv.classList.remove('hidden');
    }
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('gt_token');
      currentToken = null;
      checkAuth();
    });
  }

  // Password visibility toggle
  const togglePassBtn = document.getElementById('toggleLoginPasswordBtn');
  const loginPassInput = document.getElementById('loginPassword');
  const toggleIcon = document.getElementById('toggleLoginPasswordIcon');
  if (togglePassBtn && loginPassInput && toggleIcon) {
    togglePassBtn.addEventListener('click', () => {
      if (loginPassInput.type === 'password') {
        loginPassInput.type = 'text';
        toggleIcon.className = 'fa-solid fa-eye-slash';
      } else {
        loginPassInput.type = 'password';
        toggleIcon.className = 'fa-solid fa-eye';
      }
    });
  }

  // Forgot Password modal controls
  const forgotBtn = document.getElementById('forgotPasswordBtn');
  const forgotModal = document.getElementById('forgotPasswordModal');
  const loginModal = document.getElementById('loginModal');
  const closeForgotBtn = document.getElementById('closeForgotModalBtn');
  const forgotForm = document.getElementById('forgotPasswordForm');
  const resetStatus = document.getElementById('resetStatus');

  if (forgotBtn && forgotModal) {
    forgotBtn.addEventListener('click', () => {
      if (loginModal) loginModal.classList.add('hidden');
      forgotModal.classList.remove('hidden');
      if (resetStatus) resetStatus.classList.add('hidden');
      forgotForm.reset();
    });
  }

  if (closeForgotBtn && forgotModal) {
    closeForgotBtn.addEventListener('click', () => {
      forgotModal.classList.add('hidden');
      if (loginModal) loginModal.classList.remove('hidden');
    });
  }

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetStatus.className = 'hidden text-xs p-2.5 rounded-lg border text-center font-semibold';

      const username = document.getElementById('resetUsername').value.trim();
      const phone = document.getElementById('resetPhone').value.trim();
      const newPassword = document.getElementById('resetNewPassword').value.trim();
      const confirmPassword = document.getElementById('resetConfirmPassword').value.trim();

      if (newPassword !== confirmPassword) {
        resetStatus.textContent = 'New password and confirm password do not match.';
        resetStatus.className = 'text-xs p-2.5 rounded-lg border text-center font-semibold bg-red-50 text-red-600 border-red-200 block';
        return;
      }

      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, phone, newPassword })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          resetStatus.textContent = data.message || 'Password updated successfully!';
          resetStatus.className = 'text-xs p-2.5 rounded-lg border text-center font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 block';

          setTimeout(() => {
            forgotModal.classList.add('hidden');
            if (loginModal) {
              loginModal.classList.remove('hidden');
              document.getElementById('loginUsername').value = username;
              document.getElementById('loginPassword').value = '';
              document.getElementById('loginPassword').focus();
            }
          }, 1500);
        } else {
          resetStatus.textContent = data.message || 'Failed to reset password. Please check your details.';
          resetStatus.className = 'text-xs p-2.5 rounded-lg border text-center font-semibold bg-red-50 text-red-600 border-red-200 block';
        }
      } catch (err) {
        console.error(err);
        resetStatus.textContent = 'Server connection error. Please try again.';
        resetStatus.className = 'text-xs p-2.5 rounded-lg border text-center font-semibold bg-red-50 text-red-600 border-red-200 block';
      }
    });
  }
}

// Navigation Tabs
function setupNavigation() {
  const tabButtons = document.querySelectorAll('.nav-tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll('.nav-tab').forEach(b => {
    if (b.getAttribute('data-tab') === tabName) {
      b.classList.add('text-amber-400', 'border-b-2', 'border-amber-400');
      b.classList.remove('text-slate-300');
    } else {
      b.classList.remove('text-amber-400', 'border-b-2', 'border-amber-400');
      b.classList.add('text-slate-300');
    }
  });

  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
  const activeSec = document.getElementById(`tab-${tabName}`);
  if (activeSec) activeSec.classList.remove('hidden');

  loadActiveTabData();
}

function loadActiveTabData() {
  if (activeTab === 'dashboard') loadDashboard();
  else if (activeTab === 'enquiries') loadEnquiries();
  else if (activeTab === 'quotations') loadQuotations();
  else if (activeTab === 'orders') loadOrders();
  else if (activeTab === 'invoices') loadInvoices();
  else if (activeTab === 'payments') loadPayments();
  else if (activeTab === 'customers') loadCustomers();
  else if (activeTab === 'products') loadProducts();
  else if (activeTab === 'employees') loadEmployees();
  else if (activeTab === 'expenses') loadExpenses();
  else if (activeTab === 'reports') loadReports();
}

// 1. DASHBOARD
async function loadDashboard() {
  try {
    const resSummary = await fetch('/api/reports/summary');
    const summary = await resSummary.json();

    document.getElementById('dashTotalInvoiced').textContent = `₹${(summary.totalInvoiced || 0).toLocaleString('en-IN')}`;
    document.getElementById('dashTotalPaid').textContent = `₹${(summary.totalPaidReceived || 0).toLocaleString('en-IN')}`;
    document.getElementById('dashOutstanding').textContent = `₹${(summary.outstandingBalance || 0).toLocaleString('en-IN')}`;
    document.getElementById('dashNetProfit').textContent = `₹${(summary.netProfit || 0).toLocaleString('en-IN')}`;

    const resInvoices = await fetch('/api/invoices');
    const invoices = await resInvoices.json();
    const tbody = document.getElementById('dashRecentInvoicesTable');
    if (tbody) {
      tbody.innerHTML = invoices.slice(0, 5).map(inv => `
        <tr>
          <td class="p-2.5 font-bold text-slate-900">${inv.id}</td>
          <td class="p-2.5 font-semibold">${inv.customerName}</td>
          <td class="p-2.5 text-slate-500">${inv.date}</td>
          <td class="p-2.5 font-bold text-slate-900">₹${(inv.grandTotal || 0).toLocaleString('en-IN')}</td>
          <td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${inv.status}</span></td>
          <td class="p-2.5 text-right">
            <button onclick="viewPrintInvoice('${inv.id}')" class="text-blue-700 hover:underline font-bold text-xs"><i class="fa-solid fa-print"></i> View</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

// 2. ENQUIRIES
async function loadEnquiries() {
  const tbody = document.getElementById('enquiriesTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/enquiries');
    const enquiries = await res.json();

    tbody.innerHTML = enquiries.map(e => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${e.id}</td>
        <td class="p-3 font-semibold text-slate-800">${e.customerName}</td>
        <td class="p-3 text-slate-600">${e.phone || '-'} <br><span class="text-[10px] text-slate-400">${e.city || 'Naigaon'}</span></td>
        <td class="p-3"><span class="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">${e.brandPreference || 'Standard'}</span></td>
        <td class="p-3 text-slate-600 max-w-xs truncate">${e.message || `${e.quantity || 10} sheets of ${e.sheetLengthFt || 12}ft (${e.requiredColor || 'Standard'})`}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${e.status === 'Quoted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}">${e.status}</span></td>
        <td class="p-3 text-right">
          <button onclick="convertEnquiryToQuotation('${e.id}')" class="bg-blue-800 hover:bg-blue-900 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-sm">
            <i class="fa-solid fa-file-export mr-1"></i> Make Quote
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 3. QUOTATIONS
async function loadQuotations() {
  const tbody = document.getElementById('quotationsTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/quotations');
    const quotations = await res.json();

    tbody.innerHTML = quotations.map(q => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${q.id}</td>
        <td class="p-3 font-semibold text-slate-800">${q.customerName}</td>
        <td class="p-3 text-slate-500">${q.date}</td>
        <td class="p-3 font-medium">₹${(q.subtotal || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 text-slate-600">₹${(q.totalGst || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 font-black text-slate-900">₹${(q.grandTotal || 0).toLocaleString('en-IN')}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${q.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">${q.status}</span></td>
        <td class="p-3 text-right space-x-1">
          <button onclick="sendQuotationWhatsApp('${q.id}')" class="bg-emerald-600 text-white px-2 py-1 rounded text-[11px] font-bold">
            <i class="fa-brands fa-whatsapp"></i> WA
          </button>
          <button onclick="convertQuotationToOrder('${q.id}')" class="bg-slate-900 text-white px-2 py-1 rounded text-[11px] font-bold">
            <i class="fa-solid fa-check"></i> Convert Order
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 4. SALES ORDERS
async function loadOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${o.id}</td>
        <td class="p-3 font-semibold text-slate-800">${o.customerName}</td>
        <td class="p-3 text-slate-500">${o.orderDate}</td>
        <td class="p-3 font-bold text-slate-900">₹${(o.grandTotal || 0).toLocaleString('en-IN')}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">${o.orderStatus}</span></td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}">${o.paymentStatus}</span></td>
        <td class="p-3 text-right">
          <button onclick="convertOrderToInvoice('${o.id}')" class="bg-blue-800 text-white px-2.5 py-1 rounded text-[11px] font-bold">
            <i class="fa-solid fa-file-invoice"></i> Generate Invoice
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 5. INVOICES
async function loadInvoices() {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/invoices');
    const invoices = await res.json();

    tbody.innerHTML = invoices.map(inv => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${inv.id}</td>
        <td class="p-3 font-semibold text-slate-800">${inv.customerName}</td>
        <td class="p-3 text-slate-600">${inv.customerPhone || '-'}</td>
        <td class="p-3 text-slate-500">${inv.date}</td>
        <td class="p-3 font-medium">₹${(inv.subtotal || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 text-slate-600">₹${(inv.totalGst || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 font-black text-slate-900">₹${(inv.grandTotal || 0).toLocaleString('en-IN')}</td>
        <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${inv.status}</span></td>
        <td class="p-3 text-right space-x-1">
          <button onclick="viewPrintInvoice('${inv.id}')" class="bg-slate-800 text-white px-2 py-1 rounded text-[11px] font-bold">
            <i class="fa-solid fa-print"></i> Print
          </button>
          <button onclick="sendInvoiceWhatsApp('${inv.id}')" class="bg-emerald-600 text-white px-2 py-1 rounded text-[11px] font-bold">
            <i class="fa-brands fa-whatsapp"></i> WA Bill
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 6. PAYMENTS
async function loadPayments() {
  const tbody = document.getElementById('paymentsTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/payments');
    const payments = await res.json();

    tbody.innerHTML = payments.map(p => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${p.id}</td>
        <td class="p-3 font-semibold text-blue-800">${p.invoiceId || '-'}</td>
        <td class="p-3 font-semibold text-slate-800">${p.customerName}</td>
        <td class="p-3 font-black text-emerald-700">₹${(p.amountPaid || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 text-slate-500">${p.paymentDate}</td>
        <td class="p-3 font-medium">${p.paymentMethod}</td>
        <td class="p-3 text-slate-500">${p.transactionRef || '-'}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 7. CUSTOMERS
async function loadCustomers() {
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/customers');
    const customers = await res.json();

    tbody.innerHTML = customers.map(c => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${c.id}</td>
        <td class="p-3 font-semibold text-slate-800">${c.name}</td>
        <td class="p-3 text-slate-600">${c.phone}</td>
        <td class="p-3 text-slate-600">${c.city || 'Naigaon Bz'}</td>
        <td class="p-3"><span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">${c.customerType || 'Retail'}</span></td>
        <td class="p-3 font-bold text-center">${c.totalOrders || 0}</td>
        <td class="p-3 font-black text-slate-900">₹${(c.totalSpent || 0).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 8. PRODUCTS (With Edit Rate & Delete Actions)
let globalProductsList = [];

async function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/products');
    globalProductsList = await res.json();

    tbody.innerHTML = globalProductsList.map(p => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${p.id}</td>
        <td class="p-3"><span class="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase">${p.brand}</span></td>
        <td class="p-3 font-semibold text-slate-800">${p.name}</td>
        <td class="p-3 text-slate-600">${p.category}</td>
        <td class="p-3 font-black text-slate-900 text-sm">₹${p.ratePerUnit || p.ratePerSqFt || 0}</td>
        <td class="p-3 text-slate-500">${p.unit}</td>
        <td class="p-3"><span class="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">${p.stockStatus || 'In Stock'}</span></td>
        <td class="p-3 text-right space-x-1">
          <button onclick="openEditProductModal('${p.id}')" class="bg-blue-800 text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-blue-900 shadow-sm">
            <i class="fa-solid fa-pen-to-square"></i> Edit Rate
          </button>
          <button onclick="deleteProduct('${p.id}')" class="text-red-600 hover:text-red-800 px-2 py-1 font-bold text-xs">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// PRODUCT MANAGEMENT (ADD / EDIT / DELETE)
function setupProductForm() {
  const form = document.getElementById('productForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = document.getElementById('prdEditId').value;
    const name = document.getElementById('prdName').value.trim();
    const brand = document.getElementById('prdBrand').value;
    const category = document.getElementById('prdCategory').value;
    const ratePerUnit = parseFloat(document.getElementById('prdRate').value) || 0;
    const unit = document.getElementById('prdUnit').value;
    const stockStatus = document.getElementById('prdStockStatus').value;
    
    const thicknessRaw = document.getElementById('prdThicknessOptions').value.trim();
    const thicknessOptions = thicknessRaw ? thicknessRaw.split(',').map(s => s.trim()) : ['0.45 mm'];
    
    const colorsRaw = document.getElementById('prdColors').value.trim();
    const colors = colorsRaw ? colorsRaw.split(',').map(s => s.trim()) : ['Royal Blue', 'Tile Red', 'Off-White'];

    const description = document.getElementById('prdDescription').value.trim();

    const payload = {
      name,
      brand,
      category,
      ratePerUnit,
      unit,
      stockStatus,
      thicknessOptions,
      colors,
      description
    };

    try {
      let res;
      if (editId) {
        // Edit existing product
        res = await fetch(`/api/products/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new product
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        closeModal('productModal');
        form.reset();
        loadProducts();
        alert(editId ? 'Product rate and details updated!' : 'New product added successfully!');
      } else {
        alert('Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  });
}

function openNewProductModal() {
  const form = document.getElementById('productForm');
  if (form) form.reset();
  document.getElementById('prdEditId').value = '';
  document.getElementById('productModalTitle').innerHTML = '<i class="fa-solid fa-boxes-stacked text-blue-800 mr-2"></i> Add New Product';
  document.getElementById('productModal').classList.remove('hidden');
}

function openEditProductModal(productId) {
  const p = globalProductsList.find(item => item.id === productId);
  if (!p) return;

  document.getElementById('prdEditId').value = p.id;
  document.getElementById('prdName').value = p.name || '';
  document.getElementById('prdBrand').value = p.brand || 'TATA';
  document.getElementById('prdCategory').value = p.category || 'Color Coated Sheet';
  document.getElementById('prdRate').value = p.ratePerUnit || p.ratePerSqFt || 0;
  document.getElementById('prdUnit').value = p.unit || 'sq ft';
  document.getElementById('prdStockStatus').value = p.stockStatus || 'In Stock';
  document.getElementById('prdThicknessOptions').value = (p.thicknessOptions || []).join(', ');
  document.getElementById('prdColors').value = (p.colors || []).join(', ');
  document.getElementById('prdDescription').value = p.description || '';

  document.getElementById('productModalTitle').innerHTML = `<i class="fa-solid fa-pen-to-square text-blue-800 mr-2"></i> Edit Product Rate (${p.id})`;
  document.getElementById('productModal').classList.remove('hidden');
}

async function deleteProduct(productId) {
  if (confirm(`Are you sure you want to delete product ${productId}?`)) {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        loadProducts();
      }
    } catch (err) {
      console.error(err);
    }
  }
}

// 9. EXPENSES
async function loadExpenses() {
  const tbody = document.getElementById('expensesTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/expenses');
    const expenses = await res.json();

    tbody.innerHTML = expenses.map(e => `
      <tr>
        <td class="p-3 font-bold text-slate-900">${e.id}</td>
        <td class="p-3"><span class="bg-red-50 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold border border-red-100">${e.category}</span></td>
        <td class="p-3 font-medium text-slate-800">${e.description}</td>
        <td class="p-3 font-black text-red-600">₹${(e.amount || 0).toLocaleString('en-IN')}</td>
        <td class="p-3 text-slate-500">${e.expenseDate}</td>
        <td class="p-3 text-slate-600">${e.paidTo || '-'}</td>
        <td class="p-3 text-right">
          <button onclick="deleteExpense('${e.id}')" class="text-red-600 hover:underline font-bold text-xs"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

// 10. REPORTS
async function loadReports() {
  try {
    const res = await fetch('/api/reports/summary');
    const summary = await res.json();

    document.getElementById('repTotalInvoices').textContent = summary.countInvoices;
    document.getElementById('repGrossRev').textContent = `₹${(summary.totalInvoiced || 0).toLocaleString('en-IN')}`;
    document.getElementById('repGrossRev2').textContent = `₹${(summary.totalInvoiced || 0).toLocaleString('en-IN')}`;
    document.getElementById('repTotalGst').textContent = `₹${(summary.totalGst || 0).toLocaleString('en-IN')}`;
    document.getElementById('repTotalPaid').textContent = `₹${(summary.totalPaidReceived || 0).toLocaleString('en-IN')}`;
    document.getElementById('repOutstanding').textContent = `₹${(summary.outstandingBalance || 0).toLocaleString('en-IN')}`;
    document.getElementById('repExpenses').textContent = `₹${(summary.totalExpenses || 0).toLocaleString('en-IN')}`;
    document.getElementById('repNetProfit').textContent = `₹${(summary.netProfit || 0).toLocaleString('en-IN')}`;
  } catch (err) {
    console.error(err);
  }
}

// FORM CALCULATIONS & INVOICE CREATION
function setupInvoiceForm() {
  const form = document.getElementById('invoiceForm');
  if (!form) return;

  const lengthEl = document.getElementById('invLength');
  const qtyEl = document.getElementById('invQty');
  const rateEl = document.getElementById('invRate');
  const sqftEl = document.getElementById('invSqFt');

  function updateCalc() {
    const length = parseFloat(lengthEl.value) || 0;
    const qty = parseInt(qtyEl.value) || 0;
    const rate = parseFloat(rateEl.value) || 0;
    const weightPerSheet = 16; // Fixed 15.6-16 kg per sheet

    const totalWeight = weightPerSheet * qty;
    const subtotal = Math.round(totalWeight * rate);
    const gst = Math.round(subtotal * 0.18);
    const grandTotal = subtotal + gst;

    sqftEl.value = totalWeight.toFixed(1) + ' KG';
    document.getElementById('invCalcSubtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('invCalcGst').textContent = `₹${gst.toLocaleString('en-IN')}`;
    document.getElementById('invCalcGrandTotal').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  [lengthEl, qtyEl, rateEl].forEach(el => el.addEventListener('input', updateCalc));
  updateCalc();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const brand = document.getElementById('invBrand').value;
    const color = document.getElementById('invColor').value;
    const thickness = document.getElementById('invThickness').value;
    const rate = parseFloat(rateEl.value);
    const length = parseFloat(lengthEl.value);
    const qty = parseInt(qtyEl.value);
    const weightPerSheet = 16;
    const totalWeight = weightPerSheet * qty;
    const amount = Math.round(totalWeight * rate);
    const gst = Math.round(amount * 0.18);
    const grandTotal = amount + gst;

    const payload = {
      customerName: document.getElementById('invCustomerName').value.trim(),
      customerPhone: document.getElementById('invCustomerPhone').value.trim(),
      city: document.getElementById('invCity').value.trim(),
      items: [
        {
          brand,
          type: color ? 'Roofing Sheet' : brand,
          color,
          thickness,
          lengthFt: length,
          weightKg: totalWeight,
          quantity: qty,
          rate,
          amount
        }
      ],
      subtotal: amount,
      totalGst: gst,
      cgst: Math.round(gst / 2),
      sgst: Math.round(gst / 2),
      grandTotal,
      status: 'Pending'
    };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedInv = await res.json();
        closeModal('invoiceModal');
        form.reset();
        viewPrintInvoice(savedInv.id);
        loadActiveTabData();
      } else {
        alert('Failed to save invoice.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  });
}

// WORKFLOW CONVERSIONS
async function convertEnquiryToQuotation(enquiryId) {
  try {
    const res = await fetch('/api/enquiries');
    const enquiries = await res.json();
    const enq = enquiries.find(e => e.id === enquiryId);
    if (!enq) return;

    const payload = {
      enquiryId: enq.id,
      customerName: enq.customerName,
      customerPhone: enq.phone,
      customerAddress: enq.city || 'Naigaon Bz',
      items: [
        {
          description: `${enq.brandPreference || 'TATA Shaktee'} Sheet (${enq.requiredColor || 'Royal Blue'}, ${enq.thickness || '0.45 mm'})`,
          quantity: enq.quantity || 10,
          lengthFt: enq.sheetLengthFt || 12,
          totalSqFt: (enq.sheetLengthFt || 12) * 3.5 * (enq.quantity || 10),
          rate: 62,
          amount: (enq.sheetLengthFt || 12) * 3.5 * (enq.quantity || 10) * 62
        }
      ],
      subtotal: (enq.sheetLengthFt || 12) * 3.5 * (enq.quantity || 10) * 62,
      gstRate: 18,
      totalGst: Math.round(((enq.sheetLengthFt || 12) * 3.5 * (enq.quantity || 10) * 62) * 0.18),
      grandTotal: Math.round(((enq.sheetLengthFt || 12) * 3.5 * (enq.quantity || 10) * 62) * 1.18)
    };

    const resQ = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (resQ.ok) {
      alert(`Quotation generated from enquiry ${enquiryId}!`);
      switchTab('quotations');
    }
  } catch (err) {
    console.error(err);
  }
}

async function convertQuotationToOrder(quotationId) {
  try {
    const res = await fetch('/api/quotations');
    const quotations = await res.json();
    const qtn = quotations.find(q => q.id === quotationId);
    if (!qtn) return;

    const payload = {
      quotationId: qtn.id,
      customerName: qtn.customerName,
      customerPhone: qtn.customerPhone,
      deliveryAddress: qtn.customerAddress || 'Naigaon Bz',
      items: qtn.items,
      subtotal: qtn.subtotal,
      totalGst: qtn.totalGst,
      grandTotal: qtn.grandTotal
    };

    const resO = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (resO.ok) {
      alert(`Sales order generated from quotation ${quotationId}!`);
      switchTab('orders');
    }
  } catch (err) {
    console.error(err);
  }
}

async function convertOrderToInvoice(orderId) {
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const ord = orders.find(o => o.id === orderId);
    if (!ord) return;

    const payload = {
      customerName: ord.customerName,
      customerPhone: ord.customerPhone,
      city: ord.deliveryAddress || 'Naigaon Bz',
      items: ord.items,
      subtotal: ord.subtotal,
      totalGst: ord.totalGst,
      cgst: Math.round((ord.totalGst || 0) / 2),
      sgst: Math.round((ord.totalGst || 0) / 2),
      grandTotal: ord.grandTotal,
      status: 'Pending'
    };

    const resI = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (resI.ok) {
      const inv = await resI.json();
      alert(`Invoice ${inv.id} created from Sales Order!`);
      viewPrintInvoice(inv.id);
    }
  } catch (err) {
    console.error(err);
  }
}

// VIEW & PRINT INVOICE
async function viewPrintInvoice(invId) {
  try {
    const res = await fetch(`/api/invoices/${invId}`);
    const inv = await res.json();
    if (!inv) return;

    currentPrintInvoice = inv;

    document.getElementById('printInvNumber').textContent = `Invoice #: ${inv.id}`;
    document.getElementById('printInvDate').textContent = `Date: ${inv.date}`;
    document.getElementById('printCustName').textContent = inv.customerName;
    document.getElementById('printCustPhone').textContent = `Phone: ${inv.customerPhone || '-'}`;
    document.getElementById('printCustCity').textContent = `Location: ${inv.city || 'Naigaon Bz 431709'}`;
    document.getElementById('printPayStatus').textContent = inv.status === 'Paid' ? 'PAID IN FULL' : 'PAYMENT PENDING';
    document.getElementById('printPayStatus').className = inv.status === 'Paid' ? 'font-bold text-emerald-700' : 'font-bold text-amber-700';

    const tbody = document.getElementById('printInvoiceItemsBody');
    tbody.innerHTML = (inv.items || []).map((item, idx) => `
      <tr>
        <td class="p-2 border-r text-center font-semibold">${idx + 1}</td>
        <td class="p-2 border-r font-medium">${item.brand || 'Item'} ${item.color || ''} ${item.thickness ? '(' + item.thickness + ')' : ''} - ${item.quantity || 1} Pcs</td>
        <td class="p-2 border-r text-center">7210</td>
        <td class="p-2 border-r text-center">${item.weightKg ? item.weightKg + ' KG' : (item.sqft || '-')}</td>
        <td class="p-2 border-r text-right">₹${item.rate}/kg</td>
        <td class="p-2 text-right font-bold">₹${(item.amount || 0).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    document.getElementById('printSubtotal').textContent = `₹${(inv.subtotal || 0).toLocaleString('en-IN')}`;
    document.getElementById('printCgst').textContent = `₹${(inv.cgst || Math.round(inv.totalGst / 2)).toLocaleString('en-IN')}`;
    document.getElementById('printSgst').textContent = `₹${(inv.sgst || Math.round(inv.totalGst / 2)).toLocaleString('en-IN')}`;
    document.getElementById('printGrandTotal').textContent = `₹${(inv.grandTotal || 0).toLocaleString('en-IN')}`;

    const waBtn = document.getElementById('printModalWhatsAppBtn');
    if (waBtn) {
      waBtn.onclick = () => sendInvoiceWhatsApp(inv.id);
    }

    document.getElementById('printModal').classList.remove('hidden');
  } catch (err) {
    console.error(err);
  }
}

// WHATSAPP BILLING GENERATOR
function sendInvoiceWhatsApp(invId) {
  fetch(`/api/invoices/${invId}`).then(r => r.json()).then(inv => {
    const item = (inv.items && inv.items[0]) ? inv.items[0] : {};
    const msg = `*GAJANAN TRADERS - TAX INVOICE*
Near Uddhav Nagri, Nanded Road, Naigaon Bz (431709)
Phone: +91 9767228008 | GSTIN: 27ABNPM4468Q1ZN

Invoice #: ${inv.id}
Date: ${inv.date}
Customer: ${inv.customerName}

*Order Summary:*
- Material: ${item.brand || 'Roofing Sheet'} (${item.color || 'Custom'}, ${item.thickness || '0.45mm'})
- Quantity: ${item.quantity || 10} Sheets of ${item.lengthFt || 12} Ft
- Total Area: ${item.sqft || 420} Sq Ft

*Bill Breakdown:*
- Taxable Subtotal: ₹${(inv.subtotal || 0).toLocaleString('en-IN')}
- 18% GST Tax: ₹${(inv.totalGst || 0).toLocaleString('en-IN')}
- *Grand Total Amount:* ₹${(inv.grandTotal || 0).toLocaleString('en-IN')}
- Payment Status: ${inv.status || 'Pending'}

Thank you for choosing Gajanan Traders!`;

    const phone = inv.customerPhone ? inv.customerPhone.replace(/[^0-9]/g, '') : '919767228008';
    const targetPhone = phone.length === 10 ? '91' + phone : phone;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

function sendQuotationWhatsApp(qtnId) {
  fetch('/api/quotations').then(r => r.json()).then(quotations => {
    const qtn = quotations.find(q => q.id === qtnId);
    if (!qtn) return;

    const msg = `*GAJANAN TRADERS - OFFICIAL QUOTATION*
Near Uddhav Nagri, Nanded Road, Naigaon Bz (431709)
Call: +91 9767228008

Quotation #: ${qtn.id}
Date: ${qtn.date}
Valid Until: ${qtn.validUntil || '15 Days'}
Customer: ${qtn.customerName}

*Estimated Specification:*
Total Amount (incl. 18% GST): *₹${(qtn.grandTotal || 0).toLocaleString('en-IN')}*

Please review and reply to confirm your delivery order.`;

    const phone = qtn.customerPhone ? qtn.customerPhone.replace(/[^0-9]/g, '') : '919767228008';
    const targetPhone = phone.length === 10 ? '91' + phone : phone;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// MODAL CONTROLS & NEW ITEM TRIGGERS
function openNewInvoiceModal() {
  document.getElementById('invoiceModal').classList.remove('hidden');
}

function openNewQuotationModal() {
  const name = prompt('Customer Name:');
  const phone = prompt('Mobile Number:');
  if (name && phone) {
    fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        subtotal: 25000,
        totalGst: 4500,
        grandTotal: 29500
      })
    }).then(() => switchTab('quotations'));
  }
}

function openNewEnquiryModal() {
  const name = prompt('Customer Name:');
  const phone = prompt('Mobile Number:');
  if (name && phone) {
    fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: name,
        phone,
        city: 'Naigaon Bz',
        brandPreference: 'TATA Shaktee',
        message: 'Phone inquiry'
      })
    }).then(() => switchTab('enquiries'));
  }
}

function openNewPaymentModal() {
  const invId = prompt('Invoice ID (e.g. GT-2026-001):');
  const amount = prompt('Amount Paid (₹):');
  if (invId && amount) {
    fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId: invId,
        customerName: 'Customer',
        amountPaid: parseFloat(amount),
        paymentMethod: 'UPI / PhonePe',
        transactionRef: 'UPI-' + Date.now().toString().slice(-6)
      })
    }).then(() => switchTab('payments'));
  }
}

function openNewExpenseModal() {
  const category = prompt('Expense Category (e.g. Coil Material, Freight, Wages):');
  const amount = prompt('Expense Amount (₹):');
  const desc = prompt('Description:');
  if (category && amount) {
    fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        amount: parseFloat(amount),
        description: desc || category,
        paidTo: 'Vendor'
      })
    }).then(() => switchTab('expenses'));
  }
}

function deleteExpense(expId) {
  if (confirm('Delete expense record?')) {
    fetch(`/api/expenses/${expId}`, { method: 'DELETE' }).then(() => loadExpenses());
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 11. EMPLOYEE & WORKER MANAGEMENT
// ==========================================
async function loadEmployees() {
  const tbody = document.getElementById('employeesTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/employees');
    const employees = await res.json();

    if (employees.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-slate-400">No employee records found. Click "+ Add New Worker" to add.</td></tr>`;
      return;
    }

    tbody.innerHTML = employees.map(emp => `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-bold text-slate-900">${emp.id}</td>
        <td class="p-3 font-extrabold text-slate-800">${emp.name}</td>
        <td class="p-3 font-medium text-slate-600">${emp.role || '-'}</td>
        <td class="p-3 font-semibold text-slate-700">${emp.phone}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${emp.salaryType === 'Daily Wage' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}">
            ${emp.salaryType || 'Daily Wage'}
          </span>
        </td>
        <td class="p-3 font-bold text-slate-900">₹${Number(emp.rate || 0).toLocaleString('en-IN')} <span class="text-[10px] text-slate-500 font-normal">${emp.salaryType === 'Daily Wage' ? '/ day' : '/ month'}</span></td>
        <td class="p-3 text-slate-500">${emp.joinDate || '-'}</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : emp.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
            ${emp.status || 'Active'}
          </span>
        </td>
        <td class="p-3 text-right whitespace-nowrap space-x-2">
          <button onclick="openEditEmployeeModal('${emp.id}')" class="text-blue-600 hover:text-blue-800 font-bold text-xs" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deleteEmployee('${emp.id}')" class="text-red-500 hover:text-red-700 font-bold text-xs" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error loading employees:', err);
    tbody.innerHTML = `<tr><td colspan="9" class="p-4 text-center text-red-500">Failed to load workers.</td></tr>`;
  }
}

function openNewEmployeeModal() {
  document.getElementById('empId').value = '';
  document.getElementById('empName').value = '';
  document.getElementById('empRole').value = 'Machine Roll Forming Operator';
  document.getElementById('empPhone').value = '';
  document.getElementById('empSalaryType').value = 'Daily Wage';
  document.getElementById('empRate').value = '600';
  document.getElementById('empJoinDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('empStatus').value = 'Active';

  const title = document.getElementById('employeeModalTitle');
  if (title) title.textContent = currentAdminLang === 'mr' ? 'नवीन कामगार / कर्मचारी जोडा' : 'Add Worker / Employee';

  const saveBtn = document.querySelector('#employeeForm button[type="submit"]');
  if (saveBtn) saveBtn.textContent = currentAdminLang === 'mr' ? 'कामगार माहिती जतन करा' : 'Save Worker Details';

  const modal = document.getElementById('employeeModal');
  if (modal) modal.classList.remove('hidden');
}

async function openEditEmployeeModal(empId) {
  try {
    const res = await fetch('/api/employees');
    const employees = await res.json();
    const emp = employees.find(e => e.id === empId);
    if (!emp) return alert('Employee not found: ' + empId);

    document.getElementById('empId').value = emp.id;
    document.getElementById('empName').value = emp.name || '';
    document.getElementById('empRole').value = emp.role || 'Machine Roll Forming Operator';
    document.getElementById('empPhone').value = emp.phone || '';
    document.getElementById('empSalaryType').value = emp.salaryType || 'Daily Wage';
    document.getElementById('empRate').value = emp.rate || '';
    document.getElementById('empJoinDate').value = emp.joinDate || '';
    document.getElementById('empStatus').value = emp.status || 'Active';

    const title = document.getElementById('employeeModalTitle');
    if (title) title.textContent = currentAdminLang === 'mr' ? `कामगार माहिती बदला (${emp.id})` : `Edit Worker Details (${emp.id})`;

    const saveBtn = document.querySelector('#employeeForm button[type="submit"]');
    if (saveBtn) saveBtn.textContent = currentAdminLang === 'mr' ? 'माहिती अपडेट करा' : 'Update Worker Details';

    const modal = document.getElementById('employeeModal');
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('Error opening employee edit modal: ' + err.message);
  }
}

function setupEmployeeForm() {
  const form = document.getElementById('employeeForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const empId = document.getElementById('empId').value;
    const payload = {
      name: document.getElementById('empName').value.trim(),
      role: document.getElementById('empRole').value,
      phone: document.getElementById('empPhone').value.trim(),
      salaryType: document.getElementById('empSalaryType').value,
      rate: parseFloat(document.getElementById('empRate').value) || 0,
      joinDate: document.getElementById('empJoinDate').value,
      status: document.getElementById('empStatus').value
    };

    if (!payload.name) {
      alert(currentAdminLang === 'mr' ? 'कृपया कामगाराचे पूर्ण नाव प्रविष्ट करा' : 'Please enter employee name');
      return;
    }

    try {
      let res;
      if (empId) {
        res = await fetch(`/api/employees/${empId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        closeModal('employeeModal');
        await loadEmployees();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to save worker details');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving worker details: ' + err.message);
    }
  });
}

async function deleteEmployee(empId) {
  const confirmMsg = currentAdminLang === 'mr' ? 'खरोखर या कामगाराचा रेकॉर्ड हटवायचा आहे का?' : 'Are you sure you want to delete this worker record?';
  if (confirm(confirmMsg)) {
    try {
      await fetch(`/api/employees/${empId}`, { method: 'DELETE' });
      loadEmployees();
    } catch (err) {
      console.error(err);
      alert('Error deleting worker');
    }
  }
}

// ==========================================
// 12. ADMIN LANGUAGE TRANSLATION (English ↔ Marathi)
// ==========================================
const adminTranslations = {
  en: {
    public_site: "Public Website",
    logout: "Logout",
    tab_dashboard: "Dashboard",
    tab_enquiries: "Enquiries",
    tab_quotations: "Quotations",
    tab_orders: "Sales Orders",
    tab_invoices: "Invoices / Bills",
    tab_payments: "Payments",
    tab_customers: "Customers",
    tab_products: "Product Rates",
    tab_employees: "Workers / Employees",
    tab_expenses: "Expenses",
    tab_reports: "Reports",
    emp_title: "Workers & Factory Staff Management",
    emp_desc: "Manage roll forming operators, loaders, drivers, wages and salaries.",
    emp_add_btn: "+ Add New Worker",
    col_emp_id: "EMP ID",
    col_emp_name: "Name",
    col_emp_role: "Role / Job",
    col_emp_phone: "Mobile Number",
    col_emp_salary_type: "Salary Type",
    col_emp_rate: "Wage / Rate (₹)",
    col_emp_join_date: "Join Date",
    col_emp_status: "Status",
    col_action: "Action",
    modal_emp_title: "Add Worker / Employee",
    lbl_emp_name: "Full Name *",
    lbl_emp_role: "Role / Job Title *",
    lbl_emp_phone: "Mobile Number *",
    lbl_emp_salary_type: "Salary / Wage Type *",
    lbl_emp_rate: "Rate / Amount (₹) *",
    lbl_emp_join_date: "Join Date",
    lbl_emp_status: "Employment Status",
    btn_cancel: "Cancel",
    btn_save_emp: "Save Worker Details"
  },
  mr: {
    public_site: "मुख्य वेबसाईट",
    logout: "बाहेर पडा (Logout)",
    tab_dashboard: "डॅशबोर्ड",
    tab_enquiries: "चौकशी (Enquiries)",
    tab_quotations: "कोटेशन",
    tab_orders: "ऑर्डर्स",
    tab_invoices: "बिल / इनव्हॉइस",
    tab_payments: "जमा रकमा (Payments)",
    tab_customers: "ग्राहक यादी",
    tab_products: "उत्पादन दर (Rates)",
    tab_employees: "कामगार / कर्मचारी",
    tab_expenses: "खर्च (Expenses)",
    tab_reports: "आर्थिक अहवाल (Reports)",
    emp_title: "कामगार आणि कर्मचारी व्यवस्थापन",
    emp_desc: "रोल फॉर्मिंग ऑपरेटर, मदतनीस, ड्रायव्हर आणि मजुरी/पगार व्यवस्थापित करा.",
    emp_add_btn: "+ नवीन कामगार जोडा",
    col_emp_id: "कर्मचारी क्र.",
    col_emp_name: "नाव",
    col_emp_role: "काम / पद",
    col_emp_phone: "मोबाईल नंबर",
    col_emp_salary_type: "पगार प्रकार",
    col_emp_rate: "मजुरी / पगार (₹)",
    col_emp_join_date: "सामील तारीख",
    col_emp_status: "स्थिती",
    col_action: "कृती",
    modal_emp_title: "कामगार / कर्मचारी जोडा",
    lbl_emp_name: "पूर्ण नाव *",
    lbl_emp_role: "काम / पद *",
    lbl_emp_phone: "मोबाईल नंबर *",
    lbl_emp_salary_type: "पगार / मजुरी प्रकार *",
    lbl_emp_rate: "मजुरी / पगार रक्कम (₹) *",
    lbl_emp_join_date: "सामील तारीख",
    lbl_emp_status: "कामगार स्थिती",
    btn_cancel: "रद्द करा",
    btn_save_emp: "कामगार माहिती जतन करा"
  }
};

function switchAdminLanguage(lang) {
  currentAdminLang = lang;
  localStorage.setItem('gt_admin_lang', lang);

  const t = adminTranslations[lang] || adminTranslations.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  const btnEn = document.getElementById('adminLangEn');
  const btnMr = document.getElementById('adminLangMr');
  if (btnEn && btnMr) {
    if (lang === 'mr') {
      btnMr.className = "px-2.5 py-1 rounded-md font-bold text-amber-400 bg-slate-900 transition";
      btnEn.className = "px-2.5 py-1 rounded-md font-bold text-slate-300 hover:text-white transition";
    } else {
      btnEn.className = "px-2.5 py-1 rounded-md font-bold text-amber-400 bg-slate-900 transition";
      btnMr.className = "px-2.5 py-1 rounded-md font-bold text-slate-300 hover:text-white transition";
    }
  }
}

function setupAdminLanguage() {
  const btnEn = document.getElementById('adminLangEn');
  const btnMr = document.getElementById('adminLangMr');

  if (btnEn) btnEn.addEventListener('click', () => switchAdminLanguage('en'));
  if (btnMr) btnMr.addEventListener('click', () => switchAdminLanguage('mr'));

  switchAdminLanguage(currentAdminLang);
}

