import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  CalendarIcon, 
  Download, 
  Search, 
  Eye, 
  AlertCircle, 
  DollarSign, 
  FileText,
  Bell,
  User,
  Pill,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';

interface BillingHistoryProps {
  onNavigateToView?: (view: string) => void;
}

export function BillingHistory({ onNavigateToView }: BillingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();



  const billingRecords = [
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
  ];

  const paymentHistory = [
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      patientName: 'Juan Dela Cruz',
      amount: 62500.00,
      paymentDate: '2024-01-20',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-789456123',
      status: 'Completed'
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-002',
      patientName: 'Maria Santos',
      amount: 25000.00,
      paymentDate: '2024-01-18',
      paymentMethod: 'Cash',
      transactionId: 'TXN-789456124',
      status: 'Completed'
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-004',
      patientName: 'Sarah Reyes',
      amount: 33750.00,
      paymentDate: '2024-01-19',
      paymentMethod: 'GCash',
      transactionId: 'TXN-789456125',
      status: 'Completed'
    }
  ];

  // Pharmacy transactions from external pharmacy system
  const pharmacyTransactions = [
    {
      id: 'PH-001',
      patientName: 'Maria Santos',
      patientId: 'PT-12346',
      transactionDate: '2024-01-20',
      medications: [
        { name: 'Paracetamol 500mg', quantity: 20, unitPrice: 5.50, total: 110.00 }
      ],
      totalAmount: 110.00,
      paymentMethod: 'GCash',
      pharmacyId: 'PHARM-001',
      pharmacyName: 'MediCare Pharmacy - Main Branch',
      prescriptionNumber: 'RX-2024-00123',
      pharmacist: 'Juan Dela Cruz, RPh',
      billingStatus: 'Synced',
      syncDate: '2024-01-20 14:35:00'
    },
    {
      id: 'PH-002',
      patientName: 'Roberto Gonzales',
      patientId: 'PT-12347',
      transactionDate: '2024-01-19',
      medications: [
        { name: 'Amoxicillin 500mg', quantity: 21, unitPrice: 12.75, total: 267.75 },
        { name: 'Vitamin C 500mg', quantity: 30, unitPrice: 3.25, total: 97.50 }
      ],
      totalAmount: 365.25,
      paymentMethod: 'Cash',
      pharmacyId: 'PHARM-002',
      pharmacyName: 'MediCare Pharmacy - Branch 2',
      prescriptionNumber: 'RX-2024-00124',
      pharmacist: 'Ana Rodriguez, RPh',
      billingStatus: 'Pending',
      syncDate: null
    },
    {
      id: 'PH-003',
      patientName: 'Sarah Reyes',
      patientId: 'PT-12348',
      transactionDate: '2024-01-18',
      medications: [
        { name: 'Losartan 50mg', quantity: 30, unitPrice: 8.25, total: 247.50 },
        { name: 'Metformin 500mg', quantity: 60, unitPrice: 4.75, total: 285.00 }
      ],
      totalAmount: 532.50,
      paymentMethod: 'PayMaya',
      pharmacyId: 'PHARM-001',
      pharmacyName: 'MediCare Pharmacy - Main Branch',
      prescriptionNumber: 'RX-2024-00125',
      pharmacist: 'Miguel Santos, RPh',
      billingStatus: 'Synced',
      syncDate: '2024-01-18 16:20:00'
    }
  ];

  const outstandingBalances = billingRecords.filter(record => record.outstandingBalance > 0);
  const totalOutstanding = outstandingBalances.reduce((sum, record) => sum + record.outstandingBalance, 0);
  const totalRevenue = billingRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const overdueCount = billingRecords.filter(record => record.status === 'Overdue').length;
  const pharmacyRevenue = pharmacyTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
  const pendingPharmacySync = pharmacyTransactions.filter(transaction => transaction.billingStatus === 'Pending').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Outstanding':
        return 'bg-orange-100 text-orange-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Synced':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">₱{totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-gray-600">Hospital services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2" style={{color: "#358E83"}} />
                Pharmacy Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">₱{pharmacyRevenue.toFixed(2)}</div>
              <p className="text-sm text-gray-600">External pharmacy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">₱{totalOutstanding.toFixed(2)}</div>
              <p className="text-sm text-gray-600">{outstandingBalances.length} invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-red-600" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{overdueCount}</div>
              <p className="text-sm text-gray-600">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{pendingPharmacySync}</div>
              <p className="text-sm text-gray-600">Pharmacy transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by patient name, ID, or invoice..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partially paid">Partially Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="invoices">Invoice History</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy Transactions</TabsTrigger>
            <TabsTrigger value="outstanding">Outstanding Balances</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Invoice History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Invoice Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Outstanding</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.id}</TableCell>
                        <TableCell>{record.patientName}</TableCell>
                        <TableCell>{record.patientId}</TableCell>
                        <TableCell>{record.invoiceDate}</TableCell>
                        <TableCell>{record.dueDate}</TableCell>
                        <TableCell>₱{record.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>₱{record.paidAmount.toLocaleString()}</TableCell>
                        <TableCell>₱{record.outstandingBalance.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Payment History</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.invoiceId}</TableCell>
                        <TableCell>{payment.patientName}</TableCell>
                        <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.paymentDate}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{payment.transactionId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pharmacy">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-5 w-5" style={{color: "#358E83"}} />
                    <CardTitle>Pharmacy Transactions</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      External Integration
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Transactions automatically synced from external pharmacy system to billing records
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Pharmacy</TableHead>
                      <TableHead>Sync Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacyTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono">{transaction.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.patientName}</div>
                            <div className="text-sm text-gray-500">{transaction.patientId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.transactionDate}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {transaction.medications.map((med, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-gray-500"> × {med.quantity}</span>
                              </div>
                            ))}
                            {transaction.prescriptionNumber && (
                              <div className="text-xs text-blue-600">Rx: {transaction.prescriptionNumber}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₱{transaction.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{transaction.pharmacyName}</div>
                            <div className="text-gray-500">{transaction.pharmacist}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="secondary" className={getStatusColor(transaction.billingStatus)}>
                              {transaction.billingStatus}
                            </Badge>
                            {transaction.syncDate && (
                              <div className="text-xs text-gray-500">
                                {new Date(transaction.syncDate).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {transaction.billingStatus === 'Pending' && (
                              <Button size="sm" style={{backgroundColor: "#E94D61"}} className="text-white hover:opacity-90">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outstanding">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Outstanding Balances</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Outstanding Balance</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstandingBalances.map((record) => {
                      const daysOverdue = record.status === 'Overdue' ? 
                        Math.floor((new Date().getTime() - new Date(record.dueDate).getTime()) / (1000 * 3600 * 24)) : 0;
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{record.id}</TableCell>
                          <TableCell>{record.patientName}</TableCell>
                          <TableCell>₱{record.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>₱{record.paidAmount.toLocaleString()}</TableCell>
                          <TableCell>₱{record.outstandingBalance.toLocaleString()}</TableCell>
                          <TableCell>{record.dueDate}</TableCell>
                          <TableCell>{daysOverdue > 0 ? `${daysOverdue} days` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Follow Up
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}