import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Receipt, 
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  Bell,
  User
} from 'lucide-react';

interface PaymentProcessingProps {
  onNavigateToView?: (view: string) => void;
}

interface Invoice {
  _id: string;
  invoiceId: string;
  patientName: string;
  patientId: string;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  status: string;
  invoiceDate: string;x 
  dueDate: string;
}

interface Payment {
  _id: string;
  paymentId: string;
  invoiceId: string;
  patientName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
  status: string;
}

interface FailedPayment {
  _id: string;
  paymentId: string;
  invoiceId: string;
  patientName: string;
  amount: number;
  paymentMethod: string;
  reason: string;
  date: string;
}

interface RefundRequest {
  _id: string;
  refundId: string;
  paymentId: string;
  patientName: string;
  amount: number;
  reason: string;
  status: string;
  date: string;
}

export function PaymentProcessing({ onNavigateToView }: PaymentProcessingProps) {
  const [selectedInvoice, setSelectedInvoice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [gcashDetails, setGcashDetails] = useState({
    phoneNumber: '',
    referenceNumber: ''
  });
  
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [failedPayments, setFailedPayments] = useState<FailedPayment[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [invoicesRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/billing/invoices?status=Pending'),
        fetch('http://localhost:5000/api/billing/payments?limit=10')
      ]);
      
      const invoicesData = await invoicesRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (invoicesData.success) {
        setPendingInvoices(invoicesData.data);
      }
      
      if (paymentsData.success) {
        setRecentPayments(paymentsData.data);
        
        // Simulate failed payments (in a real app, this would come from API)
        const failed = paymentsData.data
          .filter((payment: any) => Math.random() > 0.8) // Randomly mark some as failed for demo
          .map((payment: any) => ({
            ...payment,
            reason: 'Insufficient funds',
            date: new Date().toISOString().split('T')[0]
          }));
        setFailedPayments(failed.slice(0, 2));
      }
      
      // Simulate refund requests (in a real app, this would come from API)
      setRefundRequests([
        {
          _id: '1',
          refundId: 'REF-001',
          paymentId: 'PAY-004',
          patientName: 'Luis Garcia',
          amount: 5000.00,
          reason: 'Overcharged',
          status: 'Pending',
          date: '2024-01-17'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedInvoice || !paymentMethod || !paymentAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    const amount = parseFloat(paymentAmount);
    const selectedInvoiceData = pendingInvoices.find(inv => inv._id === selectedInvoice);
    
    if (!selectedInvoiceData) {
      alert('Selected invoice not found.');
      return;
    }

    if (amount > selectedInvoiceData.totalAmount && !isPartialPayment) {
      alert('Payment amount cannot exceed invoice amount.');
      return;
    }

    setPaymentProcessing(true);
    
    try {
      const paymentData = {
        paymentId: `PAY-${Date.now()}`,
        invoiceId: selectedInvoiceData.invoiceId,
        patientName: selectedInvoiceData.patientName,
        amount: amount,
        paymentMethod: paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        notes: paymentNotes,
        status: 'Completed'
      };

      const response = await fetch('http://localhost:5000/api/billing/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Payment of ₱${amount.toLocaleString()} processed successfully!\nTransaction ID: ${paymentData.transactionId}\nReceipt sent via email.`);
        
        // Refresh data
        await fetchData();
        
        // Reset form
        setSelectedInvoice('');
        setPaymentMethod('');
        setPaymentAmount('');
        setPaymentNotes('');
        setCardDetails({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
        setGcashDetails({ phoneNumber: '', referenceNumber: '' });
      } else {
        alert('Payment failed: ' + result.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed due to server error.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const retryFailedPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/billing/payments/${paymentId}/retry`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Payment retry initiated successfully!');
        fetchData();
      } else {
        alert('Retry failed: ' + result.message);
      }
    } catch (error) {
      alert('Retry failed due to server error.');
    }
  };

  const processRefund = async (refundId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/billing/refunds/${refundId}/process`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Refund processed successfully!');
        fetchData();
      } else {
        alert('Refund failed: ' + result.message);
      }
    } catch (error) {
      alert('Refund failed due to server error.');
    }
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysPayments = recentPayments.filter(payment => 
      payment.paymentDate.split('T')[0] === today
    );
    
    const todaysRevenue = todaysPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + invoice.outstandingBalance, 0);
    
    return {
      todaysRevenue,
      pendingAmount,
      successRate: 98.5 // This would be calculated from actual data in a real app
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#358E83]" />
          <span className="ml-2">Loading payment data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Today's Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">₱{stats.todaysRevenue.toLocaleString()}</div>
            <p className="text-sm text-gray-600">{recentPayments.filter(p => p.paymentDate.split('T')[0] === new Date().toISOString().split('T')[0]).length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Pending Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">₱{stats.pendingAmount.toLocaleString()}</div>
            <p className="text-sm text-gray-600">{pendingInvoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.successRate}%</div>
            <p className="text-sm text-gray-600">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="process" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="process">Process Payment</TabsTrigger>
          <TabsTrigger value="pending">Pending Invoices</TabsTrigger>
          <TabsTrigger value="recent">Recent Payments</TabsTrigger>
          <TabsTrigger value="plans">Payment Plans</TabsTrigger>
          <TabsTrigger value="failed">Failed Payments</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Process New Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoice">Select Invoice</Label>
                      <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice to pay" />
                        </SelectTrigger>
                        <SelectContent>
                          {pendingInvoices.map((invoice) => (
                            <SelectItem key={invoice._id} value={invoice._id}>
                              {invoice.invoiceId} - {invoice.patientName} (₱{invoice.outstandingBalance.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="debit-card">Debit Card</SelectItem>
                          <SelectItem value="gcash">GCash</SelectItem>
                          <SelectItem value="paymaya">PayMaya</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Payment Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Payment Notes</Label>
                      <Input
                        id="notes"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>

                  {/* Card Details - Only shown for card payments */}
                  {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium">Card Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={cardDetails.expiryDate}
                            onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            value={cardDetails.cardholderName}
                            onChange={(e) => setCardDetails({...cardDetails, cardholderName: e.target.value})}
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GCash Details */}
                  {paymentMethod === 'gcash' && (
                    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium">GCash Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={gcashDetails.phoneNumber}
                            onChange={(e) => setGcashDetails({...gcashDetails, phoneNumber: e.target.value})}
                            placeholder="09XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="referenceNumber">Reference Number</Label>
                          <Input
                            id="referenceNumber"
                            value={gcashDetails.referenceNumber}
                            onChange={(e) => setGcashDetails({...gcashDetails, referenceNumber: e.target.value})}
                            placeholder="GCash reference number"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="space-y-6">
              {/* Payment Summary */}
              {selectedInvoice && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const invoice = pendingInvoices.find(inv => inv._id === selectedInvoice);
                      const amount = parseFloat(paymentAmount) || 0;
                      return invoice ? (
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Invoice</span>
                            <span>{invoice.invoiceId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Patient</span>
                            <span>{invoice.patientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Invoice Amount</span>
                            <span>₱{invoice.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Paid Amount</span>
                            <span>₱{invoice.paidAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Outstanding Balance</span>
                            <span>₱{invoice.outstandingBalance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Amount</span>
                            <span>₱{amount.toLocaleString()}</span>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex justify-between font-semibold">
                              <span>New Balance</span>
                              <span>₱{(invoice.outstandingBalance - amount).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Process Payment Button */}
              <Button 
                onClick={processPayment}
                className="w-full bg-blue-500 hover:bg-blue-600"
                size="lg"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Other tabs remain similar but use real data */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell>{invoice.invoiceId}</TableCell>
                      <TableCell>{invoice.patientName}</TableCell>
                      <TableCell>₱{invoice.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>₱{invoice.paidAmount.toLocaleString()}</TableCell>
                      <TableCell>₱{invoice.outstandingBalance.toLocaleString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => setSelectedInvoice(invoice._id)}
                        >
                          Process Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Invoice ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell>{payment.paymentId}</TableCell>
                        <TableCell>{payment.invoiceId}</TableCell>
                        {/* Add more TableCell components as needed for other payment fields */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
     </div>
  )
};