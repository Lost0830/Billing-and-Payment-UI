// models/Billing.js
import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientId: {
    type: String,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Outstanding'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'GCash', 'PayMaya', 'Bank Transfer', 'Pending']
  },
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number
  }],
  pharmacyItems: [{
    medicationName: String,
    quantity: Number,
    unitPrice: Number,
    total: Number,
    pharmacyId: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Billing', billingSchema);