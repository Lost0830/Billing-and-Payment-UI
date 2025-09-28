import { IntegrationStatus } from './integrationConfig';
import { configManager } from './configManager';

// Pharmacy Data Types
export interface PharmacyTransaction {
  id: string;
  transactionId: string;
  patientId: string;
  patientName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  transactionDate: string;
  transactionTime: string;
  prescriptionId?: string;
  doctorId?: string;
  doctorName?: string;
  items: PharmacyItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Partial' | 'Cancelled';
  syncStatus: 'Pending' | 'Synced' | 'Failed';
  syncedAt?: string;
  notes?: string;
}

export interface PharmacyItem {
  id: string;
  medicationId: string;
  medicationName: string;
  genericName: string;
  brand: string;
  strength: string;
  dosageForm: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionRequired: boolean;
  batchNumber: string;
  expiryDate: string;
}

export interface PharmacyInventory {
  id: string;
  medicationId: string;
  medicationName: string;
  genericName: string;
  brand: string;
  strength: string;
  dosageForm: string;
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

export interface PharmacyPrescription {
  id: string;
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  prescriptionDate: string;
  medications: {
    medicationId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions: string;
  }[];
  status: 'Active' | 'Filled' | 'Expired' | 'Cancelled';
  filledAt?: string;
  filledBy?: string;
}

// Pharmacy API Service Class
export class PharmacyIntegrationService {
  private get config() {
    return configManager.getConfig().pharmacy;
  }
  private status: IntegrationStatus['pharmacy'] = {
    connected: false,
    lastSync: null,
    lastError: null,
    totalSynced: 0
  };

  // Test connection to pharmacy system
  async testConnection(): Promise<boolean> {
    try {
      // Mock API call - replace with actual pharmacy API endpoint
      const response = await this.makeRequest('/health');
      this.status.connected = true;
      this.status.lastError = null;
      return true;
    } catch (error) {
      this.status.connected = false;
      this.status.lastError = `Connection failed: ${error}`;
      return false;
    }
  }

  // Fetch pharmacy transactions
  async getTransactions(
    patientId?: string, 
    dateFrom?: string, 
    dateTo?: string, 
    unsyncedOnly: boolean = false
  ): Promise<PharmacyTransaction[]> {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: PharmacyTransaction[] = [
        {
          id: "pharm_001",
          transactionId: "PH-TXN-2024-001",
          patientId: "PAT-2024-001",
          patientName: "Maria Santos",
          pharmacyId: "PHARM-001",
          pharmacyName: "MedPlus Pharmacy",
          pharmacyAddress: "Ground Floor, Medical Center Building, Quezon City",
          transactionDate: "2024-01-25",
          transactionTime: "15:30",
          prescriptionId: "RX-2024-001",
          doctorId: "DOC-001",
          doctorName: "Dr. Sarah Rodriguez",
          items: [
            {
              id: "item_001",
              medicationId: "MED-001",
              medicationName: "Metformin Hydrochloride",
              genericName: "Metformin",
              brand: "Glucophage",
              strength: "500mg",
              dosageForm: "Tablet",
              quantity: 30,
              unitPrice: 15,
              totalPrice: 450,
              prescriptionRequired: true,
              batchNumber: "MT240125",
              expiryDate: "2025-12-31"
            },
            {
              id: "item_002",
              medicationId: "MED-002", 
              medicationName: "Amlodipine Besylate",
              genericName: "Amlodipine",
              brand: "Norvasc",
              strength: "5mg",
              dosageForm: "Tablet",
              quantity: 30,
              unitPrice: 8,
              totalPrice: 240,
              prescriptionRequired: true,
              batchNumber: "AM240125",
              expiryDate: "2025-11-30"
            }
          ],
          subtotal: 690,
          tax: 82.8,
          discount: 0,
          totalAmount: 772.8,
          paymentMethod: "GCash",
          paymentStatus: "Paid",
          syncStatus: "Pending",
          notes: "Prescription filled for diabetes and hypertension management"
        },
        {
          id: "pharm_002",
          transactionId: "PH-TXN-2024-002", 
          patientId: "PAT-2024-002",
          patientName: "Jose Dela Cruz",
          pharmacyId: "PHARM-001",
          pharmacyName: "MedPlus Pharmacy",
          pharmacyAddress: "Ground Floor, Medical Center Building, Quezon City",
          transactionDate: "2024-01-26",
          transactionTime: "11:15",
          prescriptionId: "RX-2024-002",
          doctorId: "DOC-002",
          doctorName: "Dr. Michael Tan",
          items: [
            {
              id: "item_003",
              medicationId: "MED-003",
              medicationName: "Salbutamol Sulfate",
              genericName: "Salbutamol",
              brand: "Ventolin",
              strength: "100mcg/dose",
              dosageForm: "Inhaler",
              quantity: 1,
              unitPrice: 280,
              totalPrice: 280,
              prescriptionRequired: true,
              batchNumber: "SB240126",
              expiryDate: "2025-10-31"
            }
          ],
          subtotal: 280,
          tax: 33.6,
          discount: 0,
          totalAmount: 313.6,
          paymentMethod: "Credit Card",
          paymentStatus: "Paid",
          syncStatus: "Synced",
          syncedAt: "2024-01-26T11:30:00Z",
          notes: "Emergency inhaler refill"
        }
      ];

      let filteredTransactions = mockTransactions;

      if (patientId) {
        filteredTransactions = filteredTransactions.filter(t => t.patientId === patientId);
      }

      if (dateFrom) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionDate >= dateFrom);
      }

      if (dateTo) {
        filteredTransactions = filteredTransactions.filter(t => t.transactionDate <= dateTo);
      }

      if (unsyncedOnly) {
        filteredTransactions = filteredTransactions.filter(t => t.syncStatus === 'Pending');
      }

      this.status.lastSync = new Date();
      this.status.totalSynced += filteredTransactions.length;
      return filteredTransactions;
    } catch (error) {
      this.status.lastError = `Failed to fetch transactions: ${error}`;
      throw error;
    }
  }

  // Fetch pharmacy inventory
  async getInventory(medicationId?: string): Promise<PharmacyInventory[]> {
    try {
      // Mock data - replace with actual API call
      const mockInventory: PharmacyInventory[] = [
        {
          id: "inv_001",
          medicationId: "MED-001",
          medicationName: "Metformin Hydrochloride",
          genericName: "Metformin", 
          brand: "Glucophage",
          strength: "500mg",
          dosageForm: "Tablet",
          unitPrice: 15,
          stockQuantity: 150,
          reorderLevel: 50,
          status: "In Stock",
          lastUpdated: "2024-01-26T08:00:00Z"
        },
        {
          id: "inv_002",
          medicationId: "MED-002",
          medicationName: "Amlodipine Besylate",
          genericName: "Amlodipine",
          brand: "Norvasc", 
          strength: "5mg",
          dosageForm: "Tablet",
          unitPrice: 8,
          stockQuantity: 25,
          reorderLevel: 30,
          status: "Low Stock",
          lastUpdated: "2024-01-26T08:00:00Z"
        }
      ];

      return medicationId 
        ? mockInventory.filter(item => item.medicationId === medicationId)
        : mockInventory;
    } catch (error) {
      this.status.lastError = `Failed to fetch inventory: ${error}`;
      throw error;
    }
  }

  // Fetch prescriptions
  async getPrescriptions(patientId?: string, status?: string): Promise<PharmacyPrescription[]> {
    try {
      // Mock data - replace with actual API call
      const mockPrescriptions: PharmacyPrescription[] = [
        {
          id: "presc_001",
          prescriptionId: "RX-2024-001",
          patientId: "PAT-2024-001",
          doctorId: "DOC-001",
          prescriptionDate: "2024-01-25",
          medications: [
            {
              medicationId: "MED-001",
              medicationName: "Metformin Hydrochloride 500mg",
              dosage: "500mg",
              frequency: "Twice daily",
              duration: "30 days",
              quantity: 60,
              instructions: "Take with meals"
            }
          ],
          status: "Filled",
          filledAt: "2024-01-25T15:30:00Z",
          filledBy: "PharmTech-001"
        }
      ];

      let filteredPrescriptions = mockPrescriptions;

      if (patientId) {
        filteredPrescriptions = filteredPrescriptions.filter(p => p.patientId === patientId);
      }

      if (status) {
        filteredPrescriptions = filteredPrescriptions.filter(p => p.status === status);
      }

      return filteredPrescriptions;
    } catch (error) {
      this.status.lastError = `Failed to fetch prescriptions: ${error}`;
      throw error;
    }
  }

  // Mark transaction as synced in billing system
  async markTransactionAsSynced(transactionId: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual pharmacy API
      console.log(`Marking pharmacy transaction ${transactionId} as synced`);
      return true;
    } catch (error) {
      this.status.lastError = `Failed to mark transaction as synced: ${error}`;
      return false;
    }
  }

  // Create billing entry from pharmacy transaction
  async createBillingEntry(transaction: PharmacyTransaction): Promise<boolean> {
    try {
      // This would integrate with the billing system to create invoice entries
      const billingEntry = {
        patientId: transaction.patientId,
        serviceType: 'Pharmacy',
        description: `Pharmacy Purchase - ${transaction.pharmacyName}`,
        items: transaction.items.map(item => ({
          description: `${item.medicationName} (${item.strength}) x${item.quantity}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.totalPrice
        })),
        subtotal: transaction.subtotal,
        tax: transaction.tax,
        discount: transaction.discount,
        total: transaction.totalAmount,
        paymentMethod: transaction.paymentMethod,
        paymentStatus: transaction.paymentStatus,
        externalReference: transaction.transactionId,
        notes: transaction.notes
      };

      console.log('Creating billing entry for pharmacy transaction:', billingEntry);
      return true;
    } catch (error) {
      this.status.lastError = `Failed to create billing entry: ${error}`;
      return false;
    }
  }

  // Get integration status
  getStatus(): IntegrationStatus['pharmacy'] {
    return this.status;
  }

  // Private method to make API requests
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${this.config.endpoints.transactions || endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: this.config.timeout
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`Pharmacy API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Sync data with pharmacy system
  async syncData(): Promise<void> {
    try {
      console.log('Starting pharmacy data synchronization...');
      
      // Test connection first
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('Cannot connect to pharmacy system');
      }

      // Get unsynced transactions
      const unsyncedTransactions = await this.getTransactions(undefined, undefined, undefined, true);
      
      // Create billing entries for unsynced transactions
      for (const transaction of unsyncedTransactions) {
        try {
          const success = await this.createBillingEntry(transaction);
          if (success) {
            await this.markTransactionAsSynced(transaction.id);
          }
        } catch (error) {
          console.error(`Failed to sync transaction ${transaction.id}:`, error);
        }
      }

      console.log(`Pharmacy data synchronization completed. Synced ${unsyncedTransactions.length} transactions`);
    } catch (error) {
      console.error('Pharmacy synchronization failed:', error);
      this.status.lastError = `Sync failed: ${error}`;
      throw error;
    }
  }
}

// Export singleton instance
export const pharmacyService = new PharmacyIntegrationService();