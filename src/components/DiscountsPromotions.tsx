import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  CalendarIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Percent, 
  Gift, 
  FileText,
  Bell,
  User
} from 'lucide-react';
import { format } from 'date-fns';

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  applicableServices: string[];
}

interface AuditLog {
  id: string;
  action: string;
  discountName: string;
  patientName: string;
  invoiceId: string;
  amount: number;
  appliedBy: string;
  timestamp: string;
}

interface DiscountsPromotionsProps {
  onNavigateToView?: (view: string) => void;
}

export function DiscountsPromotions({ onNavigateToView }: DiscountsPromotionsProps) {
  const [newDiscount, setNewDiscount] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    description: '',
    validFrom: '',
    validTo: '',
    maxUsage: '',
    applicableServices: [] as string[]
  });

  const [selectedValidFrom, setSelectedValidFrom] = useState<Date>();
  const [selectedValidTo, setSelectedValidTo] = useState<Date>();



  const discounts: Discount[] = [
    {
      id: 'DSC-001',
      name: 'Senior Citizen Discount',
      type: 'percentage',
      value: 15,
      description: 'Discount for patients 65 years and older',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      isActive: true,
      usageCount: 45,
      maxUsage: 1000,
      applicableServices: ['Consultation', 'Diagnostic Tests']
    },
    {
      id: 'DSC-002',
      name: 'Emergency Services Fee Waiver',
      type: 'fixed',
      value: 100,
      description: 'Emergency room fee waiver for qualifying patients',
      validFrom: '2024-01-01',
      validTo: '2024-06-30',
      isActive: true,
      usageCount: 23,
      maxUsage: 500,
      applicableServices: ['Emergency Services']
    },
    {
      id: 'DSC-003',
      name: 'Regular Patient Discount',
      type: 'percentage',
      value: 20,
      description: 'Discount for regular patients',
      validFrom: '2024-02-01',
      validTo: '2024-08-31',
      isActive: false,
      usageCount: 67,
      applicableServices: ['All Services']
    },
    {
      id: 'DSC-004',
      name: 'Vaccination Campaign',
      type: 'fixed',
      value: 25,
      description: 'Discount on all vaccination services',
      validFrom: '2024-01-15',
      validTo: '2024-03-15',
      isActive: true,
      usageCount: 156,
      maxUsage: 1000,
      applicableServices: ['Vaccinations']
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'LOG-001',
      action: 'Applied',
      discountName: 'Senior Citizen Discount',
      patientName: 'John Doe',
      invoiceId: 'INV-001',
      amount: 187.50,
      appliedBy: 'Dr. Smith',
      timestamp: '2024-01-20 14:30:00'
    },
    {
      id: 'LOG-002',
      action: 'Applied',
      discountName: 'Vaccination Campaign',
      patientName: 'Jane Smith',
      invoiceId: 'INV-002',
      amount: 25.00,
      appliedBy: 'Nurse Johnson',
      timestamp: '2024-01-20 11:15:00'
    },
    {
      id: 'LOG-003',
      action: 'Removed',
      discountName: 'Regular Patient Discount',
      patientName: 'Robert Wilson',
      invoiceId: 'INV-003',
      amount: 0,
      appliedBy: 'Admin Davis',
      timestamp: '2024-01-19 16:45:00'
    },
    {
      id: 'LOG-004',
      action: 'Applied',
      discountName: 'Emergency Services Fee Waiver',
      patientName: 'Sarah Brown',
      invoiceId: 'INV-004',
      amount: 100.00,
      appliedBy: 'Dr. Miller',
      timestamp: '2024-01-19 09:20:00'
    }
  ];

  const activeDiscounts = discounts.filter(d => d.isActive);
  const totalSavingsThisMonth = auditLogs
    .filter(log => log.action === 'Applied')
    .reduce((sum, log) => sum + log.amount, 0);

  const createDiscount = () => {
    if (newDiscount.name && newDiscount.value > 0) {
      alert('Discount created successfully!');
      setNewDiscount({
        name: '',
        type: 'percentage',
        value: 0,
        description: '',
        validFrom: '',
        validTo: '',
        maxUsage: '',
        applicableServices: []
      });
      setSelectedValidFrom(undefined);
      setSelectedValidTo(undefined);
    }
  };

  const toggleDiscountStatus = (id: string) => {
    alert(`Discount ${id} status toggled successfully!`);
  };

  const getDiscountTypeColor = (type: string) => {
    return type === 'percentage' 
      ? 'bg-blue-100 text-blue-800'
      : 'bg-green-100 text-green-800';
  };

  const getDiscountValue = (discount: Discount) => {
    return discount.type === 'percentage' 
      ? `${discount.value}%` 
      : `₱${discount.value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-600" />
                Active Discounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{activeDiscounts.length}</div>
              <p className="text-sm text-gray-600">Currently available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gift className="h-5 w-5 mr-2 text-green-600" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">₱{totalSavingsThisMonth.toFixed(2)}</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2 text-purple-600" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">291</div>
              <p className="text-sm text-gray-600">Total usage count</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{auditLogs.length}</div>
              <p className="text-sm text-gray-600">Recent activities</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="manage">Manage Discounts</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Active Discounts & Promotions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Discount Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid To</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{discount.name}</div>
                            <div className="text-sm text-gray-600">{discount.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getDiscountTypeColor(discount.type)}>
                            {discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getDiscountValue(discount)}</TableCell>
                        <TableCell>{discount.validFrom}</TableCell>
                        <TableCell>{discount.validTo}</TableCell>
                        <TableCell>
                          {discount.usageCount}
                          {discount.maxUsage && ` / ${discount.maxUsage}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={discount.isActive}
                              onCheckedChange={() => toggleDiscountStatus(discount.id)}
                            />
                            <span className="text-sm">
                              {discount.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Discount/Promotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="discountName">Discount Name</Label>
                      <Input
                        id="discountName"
                        value={newDiscount.name}
                        onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                        placeholder="Enter discount name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="discountType">Discount Type</Label>
                      <Select 
                        value={newDiscount.type} 
                        onValueChange={(value: 'percentage' | 'fixed') => setNewDiscount({...newDiscount, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="discountValue">
                        Discount Value {newDiscount.type === 'percentage' ? '(%)' : '(₱)'}
                      </Label>
                      <Input
                        id="discountValue"
                        type="number"
                        min="0"
                        step={newDiscount.type === 'percentage' ? '1' : '0.01'}
                        max={newDiscount.type === 'percentage' ? '100' : undefined}
                        value={newDiscount.value}
                        onChange={(e) => setNewDiscount({...newDiscount, value: parseFloat(e.target.value) || 0})}
                        placeholder={`Enter ${newDiscount.type === 'percentage' ? 'percentage' : 'amount'}`}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxUsage">Maximum Usage (Optional)</Label>
                      <Input
                        id="maxUsage"
                        type="number"
                        min="1"
                        value={newDiscount.maxUsage}
                        onChange={(e) => setNewDiscount({...newDiscount, maxUsage: e.target.value})}
                        placeholder="Leave empty for unlimited"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Valid From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedValidFrom ? format(selectedValidFrom, "PPP") : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedValidFrom}
                            onSelect={setSelectedValidFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Valid To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedValidTo ? format(selectedValidTo, "PPP") : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedValidTo}
                            onSelect={setSelectedValidTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="applicableServices">Applicable Services</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select applicable services" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic Tests</SelectItem>
                          <SelectItem value="emergency">Emergency Services</SelectItem>
                          <SelectItem value="vaccination">Vaccinations</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDiscount.description}
                    onChange={(e) => setNewDiscount({...newDiscount, description: e.target.value})}
                    placeholder="Enter detailed description of the discount"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={createDiscount}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Discount
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Discount Application Audit Logs</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Discount Name</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Amount Saved</TableHead>
                      <TableHead>Applied By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={log.action === 'Applied' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.discountName}</TableCell>
                        <TableCell>{log.patientName}</TableCell>
                        <TableCell>{log.invoiceId}</TableCell>
                        <TableCell>
                          {log.action === 'Applied' ? `₱${log.amount.toFixed(2)}` : '-'}
                        </TableCell>
                        <TableCell>{log.appliedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}