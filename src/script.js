// Application State
let appState = {
    activeModule: 'invoice',
    activeTabs: {
        invoice: 'create',
        payment: 'process',
        history: 'invoices',
        discounts: 'manage'
    },
    invoiceItems: [
        {
            id: '1',
            service: 'Consultation',
            category: 'Medical',
            quantity: 1,
            unitPrice: 2000,
            total: 2000,
            taxable: true
        },
        {
            id: '2',
            service: 'Blood Test',
            category: 'Laboratory',
            quantity: 2,
            unitPrice: 1500,
            total: 3000,
            taxable: true
        },
        {
            id: '3',
            service: 'X-Ray',
            category: 'Radiology',
            quantity: 1,
            unitPrice: 3500,
            total: 3500,
            taxable: true
        }
    ],
    patientInfo: {
        patientId: '',
        patientName: '',
        visitDate: '',
        roomType: '',
        contactNumber: '',
        address: '',
        doctor: '',
        notes: ''
    },
    discountRate: 0,
    invoiceNotes: ''
};

// Mock Data
const mockData = {
    patientSearchResults: [
        { id: 'PT-12345', name: 'Juan Dela Cruz', phone: '09171234567', lastVisit: '2024-01-10' },
        { id: 'PT-12346', name: 'Maria Santos', phone: '09181234567', lastVisit: '2024-01-15' },
        { id: 'PT-12347', name: 'Roberto Gonzales', phone: '09191234567', lastVisit: '2024-01-08' }
    ],
    serviceTemplates: [
        { id: '1', name: 'General Consultation', category: 'Medical', basePrice: 2000, description: 'General medical consultation' },
        { id: '2', name: 'Emergency Consultation', category: 'Medical', basePrice: 3500, description: 'Emergency medical consultation' },
        { id: '3', name: 'Blood Chemistry', category: 'Laboratory', basePrice: 1500, description: 'Complete blood chemistry panel' },
        { id: '4', name: 'CBC', category: 'Laboratory', basePrice: 800, description: 'Complete blood count' },
        { id: '5', name: 'Chest X-Ray', category: 'Radiology', basePrice: 2000, description: 'Chest X-Ray examination' },
        { id: '6', name: 'CT Scan', category: 'Radiology', basePrice: 8000, description: 'CT scan imaging' },
        { id: '7', name: 'Room Charge - Private', category: 'Accommodation', basePrice: 3000, description: 'Private room per day' },
        { id: '8', name: 'Room Charge - ICU', category: 'Accommodation', basePrice: 8000, description: 'ICU room per day' }
    ],
    billingRecords: [
        {
            id: 'INV-001',
            patientName: 'Juan Dela Cruz',
            patientId: 'PT-12345',
            invoiceDate: '2024-01-15',
            dueDate: '2024-02-14',
            totalAmount: 62500.00,
            paidAmount: 62500.00,
            outstandingBalance: 0,
            status: 'Paid',
            paymentMethod: 'Credit Card'
        },
        {
            id: 'INV-002',
            patientName: 'Maria Santos',
            patientId: 'PT-12346',
            invoiceDate: '2024-01-16',
            dueDate: '2024-02-15',
            totalAmount: 42537.50,
            paidAmount: 25000.00,
            outstandingBalance: 17537.50,
            status: 'Partially Paid',
            paymentMethod: 'Cash'
        },
        {
            id: 'INV-003',
            patientName: 'Roberto Gonzales',
            patientId: 'PT-12347',
            invoiceDate: '2024-01-17',
            dueDate: '2024-02-16',
            totalAmount: 105025.00,
            paidAmount: 0,
            outstandingBalance: 105025.00,
            status: 'Outstanding',
            paymentMethod: 'Pending'
        },
        {
            id: 'INV-004',
            patientName: 'Sarah Reyes',
            patientId: 'PT-12348',
            invoiceDate: '2024-01-14',
            dueDate: '2024-02-13',
            totalAmount: 33750.00,
            paidAmount: 33750.00,
            outstandingBalance: 0,
            status: 'Paid',
            paymentMethod: 'GCash'
        },
        {
            id: 'INV-005',
            patientName: 'Miguel Ramos',
            patientId: 'PT-12349',
            invoiceDate: '2024-01-13',
            dueDate: '2024-01-28',
            totalAmount: 21262.50,
            paidAmount: 0,
            outstandingBalance: 21262.50,
            status: 'Overdue',
            paymentMethod: 'Pending'
        }
    ]
};

// Utility Functions
function formatCurrency(amount) {
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateId() {
    return Date.now().toString();
}

// Module Navigation
function switchModule(moduleId) {
    // Update active module
    appState.activeModule = moduleId;
    
    // Update navigation buttons
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-module="${moduleId}"]`).classList.add('active');
    
    // Update module title
    const moduleNames = {
        invoice: 'Invoice Generation',
        payment: 'Payment Processing',
        history: 'Billing History',
        discounts: 'Discounts & Promotions'
    };
    document.getElementById('module-title').textContent = `${moduleNames[moduleId]} Module`;
    
    // Show/hide modules
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });
    document.getElementById(`${moduleId}-module`).classList.add('active');
    
    // Initialize module specific content
    if (moduleId === 'history') {
        populateInvoiceHistory();
    }
}

// Tab Navigation
function switchTab(moduleId, tabId) {
    appState.activeTabs[moduleId] = tabId;
    
    // Update tab buttons for the current module
    const moduleElement = document.getElementById(`${moduleId}-module`);
    if (moduleElement) {
        const tabButtons = moduleElement.querySelectorAll('.tab-button');
        const tabContents = moduleElement.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            }
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    }
}

// Invoice Functions
function updateInvoiceItemsTable() {
    const tbody = document.getElementById('invoiceItemsBody');
    tbody.innerHTML = '';
    
    appState.invoiceItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="font-medium">${item.service}</div>
                ${!item.taxable ? '<span class="badge">Tax Exempt</span>' : ''}
            </td>
            <td><span class="badge">${item.category}</span></td>
            <td>
                <input type="number" min="1" value="${item.quantity}" 
                       onchange="updateItemQuantity('${item.id}', this.value)" 
                       style="width: 80px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem;">
            </td>
            <td>
                <input type="number" min="0" step="0.01" value="${item.unitPrice}" 
                       onchange="updateItemPrice('${item.id}', this.value)" 
                       style="width: 100px; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem;">
            </td>
            <td>${formatCurrency(item.total)}</td>
            <td>
                <button onclick="removeItem('${item.id}')" class="btn-outline btn-sm text-red">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateInvoiceSummary();
}

function updateInvoiceSummary() {
    const subtotal = appState.invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (appState.discountRate / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const vat = discountedSubtotal * 0.12; // Philippines VAT is 12%
    const total = discountedSubtotal + vat;
    
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('vat').textContent = formatCurrency(vat);
    document.getElementById('total').textContent = formatCurrency(total);
    
    const discountRow = document.querySelector('.discount-row');
    if (appState.discountRate > 0) {
        discountRow.classList.remove('hidden');
        document.getElementById('discount-label').textContent = `Discount (${appState.discountRate}%):`;
        document.getElementById('discount-amount').textContent = `-${formatCurrency(discountAmount)}`;
    } else {
        discountRow.classList.add('hidden');
    }
}

function addItem() {
    const service = document.getElementById('customService').value.trim();
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const unitPrice = parseFloat(document.getElementById('unitPrice').value) || 0;
    
    if (!service || unitPrice <= 0) {
        alert('Please enter service name and valid unit price.');
        return;
    }
    
    const newItem = {
        id: generateId(),
        service,
        category,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        taxable: true
    };
    
    appState.invoiceItems.push(newItem);
    updateInvoiceItemsTable();
    
    // Clear form
    document.getElementById('customService').value = '';
    document.getElementById('quantity').value = '1';
    document.getElementById('unitPrice').value = '';
}

function addServiceTemplate() {
    const templateId = document.getElementById('serviceTemplate').value;
    if (!templateId) {
        alert('Please select a service template.');
        return;
    }
    
    const template = mockData.serviceTemplates.find(t => t.id === templateId);
    if (template) {
        const newItem = {
            id: generateId(),
            service: template.name,
            category: template.category,
            quantity: 1,
            unitPrice: template.basePrice,
            total: template.basePrice,
            taxable: true
        };
        
        appState.invoiceItems.push(newItem);
        updateInvoiceItemsTable();
        
        // Clear selection
        document.getElementById('serviceTemplate').value = '';
    }
}

function removeItem(itemId) {
    appState.invoiceItems = appState.invoiceItems.filter(item => item.id !== itemId);
    updateInvoiceItemsTable();
}

function updateItemQuantity(itemId, quantity) {
    const qty = parseInt(quantity) || 1;
    const item = appState.invoiceItems.find(item => item.id === itemId);
    if (item) {
        item.quantity = qty;
        item.total = qty * item.unitPrice;
        updateInvoiceItemsTable();
    }
}

function updateItemPrice(itemId, price) {
    const unitPrice = parseFloat(price) || 0;
    const item = appState.invoiceItems.find(item => item.id === itemId);
    if (item) {
        item.unitPrice = unitPrice;
        item.total = item.quantity * unitPrice;
        updateInvoiceItemsTable();
    }
}

function updateDiscountRate() {
    const rate = parseFloat(document.getElementById('discountRate').value) || 0;
    appState.discountRate = Math.max(0, Math.min(100, rate));
    updateInvoiceSummary();
}

// Patient Search Functions
function setupPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    const resultsContainer = document.getElementById('patient-results');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            resultsContainer.classList.add('hidden');
            return;
        }
        
        const filteredPatients = mockData.patientSearchResults.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm) ||
            patient.id.toLowerCase().includes(searchTerm)
        );
        
        if (filteredPatients.length > 0) {
            resultsContainer.innerHTML = '';
            filteredPatients.slice(0, 3).forEach(patient => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="search-result-name">${patient.name}</div>
                    <div class="search-result-details">${patient.id} • ${patient.phone}</div>
                `;
                item.addEventListener('click', () => selectPatient(patient));
                resultsContainer.appendChild(item);
            });
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.classList.add('hidden');
        }
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.classList.add('hidden');
        }
    });
}

function selectPatient(patient) {
    document.getElementById('patientId').value = patient.id;
    document.getElementById('patientName').value = patient.name;
    document.getElementById('contactNumber').value = patient.phone;
    document.getElementById('patientSearch').value = '';
    document.getElementById('patient-results').classList.add('hidden');
}

// Payment Processing Functions
function setupPaymentForm() {
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const cardDetailsSection = document.getElementById('cardDetails');
    
    paymentMethodSelect.addEventListener('change', function() {
        const method = this.value;
        if (method === 'credit-card' || method === 'debit-card') {
            cardDetailsSection.classList.remove('hidden');
        } else {
            cardDetailsSection.classList.add('hidden');
        }
    });
}

function processPayment() {
    const invoice = document.getElementById('paymentInvoice').value;
    const method = document.getElementById('paymentMethod').value;
    const amount = document.getElementById('paymentAmount').value;
    
    if (!invoice || !method || !amount) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate processing
    const btn = document.getElementById('processPaymentBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(() => {
        alert(`Payment of ${formatCurrency(parseFloat(amount))} processed successfully!\nTransaction ID: TXN-${Date.now()}\nReceipt sent via email.`);
        
        // Reset form
        document.getElementById('paymentInvoice').value = '';
        document.getElementById('paymentMethod').value = '';
        document.getElementById('paymentAmount').value = '';
        document.getElementById('cardNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';
        document.getElementById('cardholderName').value = '';
        document.getElementById('cardDetails').classList.add('hidden');
        
        btn.disabled = false;
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
            </svg>
            Process Payment
        `;
    }, 2000);
}

// Billing History Functions
function populateInvoiceHistory() {
    const tbody = document.getElementById('invoiceHistoryBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    mockData.billingRecords.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.patientName}</td>
            <td>${record.patientId}</td>
            <td>${record.invoiceDate}</td>
            <td>${record.dueDate}</td>
            <td>${formatCurrency(record.totalAmount)}</td>
            <td>${formatCurrency(record.paidAmount)}</td>
            <td>${formatCurrency(record.outstandingBalance)}</td>
            <td><span class="badge-red">${record.status}</span></td>
            <td>
                <button class="btn-outline btn-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Discount Management Functions
function createDiscount() {
    const name = document.getElementById('discountName').value.trim();
    const type = document.getElementById('discountType').value;
    const value = parseFloat(document.getElementById('discountValue').value) || 0;
    
    if (!name || value <= 0) {
        alert('Please enter discount name and valid value.');
        return;
    }
    
    alert('Discount created successfully!');
    
    // Clear form
    document.getElementById('discountName').value = '';
    document.getElementById('discountValue').value = '';
    document.getElementById('maxUsage').value = '';
    document.getElementById('validFrom').value = '';
    document.getElementById('validTo').value = '';
    document.getElementById('applicableServices').value = 'all';
    document.getElementById('discountDescription').value = '';
}

function updateDiscountValueLabel() {
    const type = document.getElementById('discountType').value;
    const label = document.querySelector('label[for="discountValue"]');
    const input = document.getElementById('discountValue');
    
    if (type === 'percentage') {
        label.textContent = 'Discount Value (%)';
        input.setAttribute('max', '100');
        input.setAttribute('step', '1');
        input.setAttribute('placeholder', 'Enter percentage');
    } else {
        label.textContent = 'Discount Value (₱)';
        input.removeAttribute('max');
        input.setAttribute('step', '0.01');
        input.setAttribute('placeholder', 'Enter amount');
    }
}

// Action Functions
function generateInvoice() {
    const patientName = document.getElementById('patientName').value.trim();
    if (!patientName || appState.invoiceItems.length === 0) {
        alert('Please fill in patient information and add at least one service item.');
        return;
    }
    
    const subtotal = appState.invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (appState.discountRate / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const vat = discountedSubtotal * 0.12;
    const total = discountedSubtotal + vat;
    
    alert(`Invoice generated successfully!\nTotal: ${formatCurrency(total)}\nInvoice will be sent to patient.`);
}

function saveDraft() {
    const patientName = document.getElementById('patientName').value.trim();
    if (!patientName) {
        alert('Please enter patient name to save draft.');
        return;
    }
    alert('Invoice saved as draft!');
}

function sendInvoice() {
    const patientName = document.getElementById('patientName').value.trim();
    if (!patientName || appState.invoiceItems.length === 0) {
        alert('Please complete the invoice before sending.');
        return;
    }
    alert('Invoice sent to patient via email/SMS!');
}

function printInvoice() {
    alert('Invoice sent to printer!');
}

function exportToPDF() {
    alert('Invoice exported as PDF!');
}

function duplicateInvoice() {
    alert('Invoice duplicated!');
}

// Event Listeners Setup
function setupEventListeners() {
    // Module navigation
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const moduleId = button.dataset.module;
            switchModule(moduleId);
        });
    });
    
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            const moduleElement = button.closest('.module');
            const moduleId = moduleElement.id.replace('-module', '');
            switchTab(moduleId, tabId);
        });
    });
    
    // Invoice form elements
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) addItemBtn.addEventListener('click', addItem);
    
    const addTemplateBtn = document.getElementById('addTemplateBtn');
    if (addTemplateBtn) addTemplateBtn.addEventListener('click', addServiceTemplate);
    
    const discountInput = document.getElementById('discountRate');
    if (discountInput) discountInput.addEventListener('input', updateDiscountRate);
    
    // Action buttons
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) generateBtn.addEventListener('click', generateInvoice);
    
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) saveDraftBtn.addEventListener('click', saveDraft);
    
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.addEventListener('click', sendInvoice);
    
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', printInvoice);
    
    const pdfBtn = document.getElementById('pdfBtn');
    if (pdfBtn) pdfBtn.addEventListener('click', exportToPDF);
    
    const duplicateBtn = document.getElementById('duplicateBtn');
    if (duplicateBtn) duplicateBtn.addEventListener('click', duplicateInvoice);
    
    // Payment processing
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    if (processPaymentBtn) processPaymentBtn.addEventListener('click', processPayment);
    
    // Discount management
    const createDiscountBtn = document.getElementById('createDiscountBtn');
    if (createDiscountBtn) createDiscountBtn.addEventListener('click', createDiscount);
    
    const discountType = document.getElementById('discountType');
    if (discountType) discountType.addEventListener('change', updateDiscountValueLabel);
}

// Initialize Application
function initializeApp() {
    setupEventListeners();
    setupPatientSearch();
    setupPaymentForm();
    updateInvoiceItemsTable();
    
    // Set initial states
    switchModule('invoice');
    switchTab('invoice', 'create');
    switchTab('payment', 'process');
    switchTab('history', 'invoices');
    switchTab('discounts', 'manage');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);