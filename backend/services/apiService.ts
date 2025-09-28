const API_BASE = 'http://localhost:5000/api';

export const apiService = {
  // Billing endpoints
  async getInvoices(params = '') {
    const response = await fetch(`${API_BASE}/billing/invoices${params}`);
    return await response.json();
  },

  async createInvoice(invoiceData: any) {
    const response = await fetch(`${API_BASE}/billing/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    return await response.json();
  },

  async getPayments(params = '') {
    const response = await fetch(`${API_BASE}/billing/payments${params}`);
    return await response.json();
  },

  async createPayment(paymentData: any) {
    const response = await fetch(`${API_BASE}/billing/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  },

  // Dashboard data
  async getDashboardData() {
    const [invoices, payments] = await Promise.all([
      this.getInvoices(),
      this.getPayments()
    ]);
    
    return { invoices, payments };
  }
};