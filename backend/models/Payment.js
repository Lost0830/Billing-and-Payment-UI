// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  invoiceId: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'GCash', 'PayMaya', 'Bank Transfer']
  },
  transactionId: String,
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Failed'],
    default: 'Completed'
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('Payment', paymentSchema);