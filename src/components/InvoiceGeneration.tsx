import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Plus,
  Trash2,
  Calculator,
  FileText,
  Search,
  Save,
  Send,
  Download,
  Copy,
  Printer,
  Bell,
  User,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  service: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
}

interface ServiceTemplate {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
}

interface DraftInvoice {
  id: string;
  patientName: string;
  createdAt: string;
  totalAmount: number;
}

interface InvoiceGenerationProps {
  onNavigateToView?: (view: string) => void;
}

export function InvoiceGeneration({ onNavigateToView }: InvoiceGenerationProps) {
  const [patientInfo, setPatientInfo] = useState({
    patientId: "",
    patientName: "",
    visitDate: "",
    roomType: "",
    contactNumber: "",
    address: "",
    doctor: "",
    notes: "",
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      service: "Consultation",
      category: "Medical",
      quantity: 1,
      unitPrice: 2000,
      total: 2000,
      taxable: true,
    },
    {
      id: "2",
      service: "Blood Test",
      category: "Laboratory",
      quantity: 2,
      unitPrice: 1500,
      total: 3000,
      taxable: true,
    },
    {
      id: "3",
      service: "X-Ray",
      category: "Radiology",
      quantity: 1,
      unitPrice: 3500,
      total: 3500,
      taxable: true,
    },
  ]);

  const [newItem, setNewItem] = useState({
    service: "",
    category: "Medical",
    quantity: 1,
    unitPrice: 0,
    taxable: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [discountRate, setDiscountRate] = useState(0);



  // Service templates for quick selection
  const serviceTemplates: ServiceTemplate[] = [
    { id: "1", name: "General Consultation", category: "Medical", basePrice: 2000, description: "General medical consultation" },
    { id: "2", name: "Emergency Consultation", category: "Medical", basePrice: 3500, description: "Emergency medical consultation" },
    { id: "3", name: "Blood Chemistry", category: "Laboratory", basePrice: 1500, description: "Complete blood chemistry panel" },
    { id: "4", name: "CBC", category: "Laboratory", basePrice: 800, description: "Complete blood count" },
    { id: "5", name: "Chest X-Ray", category: "Radiology", basePrice: 2000, description: "Chest X-Ray examination" },
    { id: "6", name: "CT Scan", category: "Radiology", basePrice: 8000, description: "CT scan imaging" },
    { id: "7", name: "Room Charge - Private", category: "Accommodation", basePrice: 3000, description: "Private room per day" },
    { id: "8", name: "Room Charge - ICU", category: "Accommodation", basePrice: 8000, description: "ICU room per day" },
  ];

  // Draft invoices
  const draftInvoices: DraftInvoice[] = [
    { id: "DRAFT-001", patientName: "Juan Santos", createdAt: "2024-01-20", totalAmount: 15750 },
    { id: "DRAFT-002", patientName: "Maria Lopez", createdAt: "2024-01-19", totalAmount: 8900 },
  ];

  // Mock patient search results
  const patientSearchResults = [
    { id: "PT-12345", name: "Juan Dela Cruz", phone: "09171234567", lastVisit: "2024-01-10" },
    { id: "PT-12346", name: "Maria Santos", phone: "09181234567", lastVisit: "2024-01-15" },
    { id: "PT-12347", name: "Roberto Gonzales", phone: "09191234567", lastVisit: "2024-01-08" },
  ];

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discountRate / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const vat = discountedSubtotal * 0.12; // Philippines VAT is 12%
  const total = discountedSubtotal + vat;

  const addItem = () => {
    if (newItem.service && newItem.unitPrice > 0) {
      const item: InvoiceItem = {
        id: Date.now().toString(),
        service: newItem.service,
        category: newItem.category,
        quantity: newItem.quantity,
        unitPrice: newItem.unitPrice,
        total: newItem.quantity * newItem.unitPrice,
        taxable: newItem.taxable,
      };
      setInvoiceItems([...invoiceItems, item]);
      setNewItem({ service: "", category: "Medical", quantity: 1, unitPrice: 0, taxable: true });
    }
  };

  const addServiceTemplate = (templateId: string) => {
    const template = serviceTemplates.find(t => t.id === templateId);
    if (template) {
      const item: InvoiceItem = {
        id: Date.now().toString(),
        service: template.name,
        category: template.category,
        quantity: 1,
        unitPrice: template.basePrice,
        total: template.basePrice,
        taxable: true,
      };
      setInvoiceItems([...invoiceItems, item]);
      setSelectedTemplate("");
    }
  };

  const removeItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setInvoiceItems(invoiceItems.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const updateItemPrice = (id: string, unitPrice: number) => {
    setInvoiceItems(invoiceItems.map(item => 
      item.id === id 
        ? { ...item, unitPrice, total: item.quantity * unitPrice }
        : item
    ));
  };

  const generateInvoice = () => {
    if (!patientInfo.patientName || invoiceItems.length === 0) {
      alert("Please fill in patient information and add at least one service item.");
      return;
    }
    alert(`Invoice generated successfully!\nTotal: ₱${total.toFixed(2)}\nInvoice will be sent to patient.`);
  };

  const saveDraft = () => {
    if (!patientInfo.patientName) {
      alert("Please enter patient name to save draft.");
      return;
    }
    alert("Invoice saved as draft!");
  };

  const sendInvoice = () => {
    if (!patientInfo.patientName || invoiceItems.length === 0) {
      alert("Please complete the invoice before sending.");
      return;
    }
    alert("Invoice sent to patient via email/SMS!");
  };

  const printInvoice = () => {
    alert("Invoice sent to printer!");
  };

  const exportToPDF = () => {
    alert("Invoice exported as PDF!");
  };

  const selectPatient = (patient: any) => {
    setPatientInfo({
      ...patientInfo,
      patientId: patient.id,
      patientName: patient.name,
      contactNumber: patient.phone,
    });
    setSearchTerm("");
  };

  const loadDraft = (draft: DraftInvoice) => {
    alert(`Loading draft invoice ${draft.id}...`);
  };

  const filteredPatients = patientSearchResults.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="create">Create Invoice</TabsTrigger>
            <TabsTrigger value="drafts">Draft Invoices</TabsTrigger>
            <TabsTrigger value="templates">Service Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Invoice Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Patient Search */}
                    <div>
                      <Label htmlFor="patientSearch">Search Patient</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="patientSearch"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search by patient name or ID..."
                          className="pl-10"
                        />
                      </div>
                      {searchTerm && filteredPatients.length > 0 && (
                        <div className="mt-2 border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto">
                          {filteredPatients.slice(0, 3).map((patient) => (
                            <div
                              key={patient.id}
                              className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                              onClick={() => selectPatient(patient)}
                            >
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-gray-600">{patient.id} • {patient.phone}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientId">Patient ID</Label>
                        <Input
                          id="patientId"
                          value={patientInfo.patientId}
                          onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                          placeholder="Enter patient ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="patientName">Patient Name</Label>
                        <Input
                          id="patientName"
                          value={patientInfo.patientName}
                          onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })}
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={patientInfo.contactNumber}
                          onChange={(e) => setPatientInfo({ ...patientInfo, contactNumber: e.target.value })}
                          placeholder="Enter contact number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="visitDate">Visit Date</Label>
                        <Input
                          id="visitDate"
                          type="date"
                          value={patientInfo.visitDate}
                          onChange={(e) => setPatientInfo({ ...patientInfo, visitDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Service Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Add Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label htmlFor="serviceTemplate">Service Template</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service template" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name} - ₱{template.basePrice.toLocaleString()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => selectedTemplate && addServiceTemplate(selectedTemplate)}
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={!selectedTemplate}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Add Service */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add Custom Service/Item</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <Label htmlFor="service">Service/Item</Label>
                        <Input
                          id="service"
                          value={newItem.service}
                          onChange={(e) => setNewItem({ ...newItem, service: e.target.value })}
                          placeholder="Enter service name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newItem.category}
                          onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medical">Medical</SelectItem>
                            <SelectItem value="Laboratory">Laboratory</SelectItem>
                            <SelectItem value="Radiology">Radiology</SelectItem>
                            <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="Accommodation">Accommodation</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitPrice">Unit Price (₱)</Label>
                        <Input
                          id="unitPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.unitPrice}
                          onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <Button
                        onClick={addItem}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Items</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service/Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoiceItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.service}</div>
                              {!item.taxable && (
                                <Badge variant="secondary" className="mt-1">Tax Exempt</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>₱{item.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Summary and Actions */}
              <div className="space-y-6">
                {/* Invoice Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                    </div>
                    {discountRate > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount ({discountRate}%)</span>
                        <span>-₱{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (12%)</span>
                      <span>₱{vat.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Amount</span>
                        <span className="font-semibold text-lg">₱{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discount */}
                <Card>
                  <CardHeader>
                    <CardTitle>Discount & Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discountRate}
                        onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                        placeholder="Enter discount percentage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Invoice Notes</Label>
                      <Textarea
                        id="notes"
                        value={invoiceNotes}
                        onChange={(e) => setInvoiceNotes(e.target.value)}
                        placeholder="Add any notes or special instructions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={generateInvoice}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    size="lg"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </Button>
                  <Button
                    onClick={saveDraft}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={sendInvoice}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Invoice
                  </Button>
                  <Button
                    onClick={printInvoice}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drafts">
            <Card>
              <CardHeader>
                <CardTitle>Draft Invoices</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Draft ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftInvoices.map((draft) => (
                      <TableRow key={draft.id}>
                        <TableCell>{draft.id}</TableCell>
                        <TableCell>{draft.patientName}</TableCell>
                        <TableCell>{draft.createdAt}</TableCell>
                        <TableCell>₱{draft.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => loadDraft(draft)}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              Load
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

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Service Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell>₱{template.basePrice.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">{template.description}</TableCell>
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