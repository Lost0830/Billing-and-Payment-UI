import { IntegrationStatus } from './integrationConfig';
import { configManager } from './configManager';

// EMR Data Types
export interface EMRPatient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  lastVisit: string;
  status: 'Active' | 'Inactive' | 'Deceased';
}

export interface EMRAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // in minutes
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Lab Test';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  notes: string;
  cost: number;
}

export interface EMRTreatment {
  id: string;
  patientId: string;
  appointmentId: string;
  treatmentDate: string;
  diagnosis: string;
  treatment: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    cost: number;
  }[];
  procedures: {
    name: string;
    code: string;
    cost: number;
  }[];
  doctorNotes: string;
  totalCost: number;
  billable: boolean;
}

// EMR API Service Class
export class EMRIntegrationService {
  private get config() {
    return configManager.getConfig().emr;
  }
  private status: IntegrationStatus['emr'] = {
    connected: false,
    lastSync: null,
    lastError: null,
    totalSynced: 0
  };

  // Test connection to EMR system
  async testConnection(): Promise<boolean> {
    try {
      // Mock API call - replace with actual EMR API endpoint
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

  // Fetch patient data from EMR
  async getPatients(limit: number = 50, offset: number = 0): Promise<EMRPatient[]> {
    try {
      // Mock data - replace with actual API call
      const mockPatients: EMRPatient[] = [
        {
          id: "emr_001",
          patientId: "PAT-2024-001",
          firstName: "Maria",
          lastName: "Santos",
          dateOfBirth: "1985-03-15",
          gender: "Female",
          contactNumber: "+63917123456",
          email: "maria.santos@email.com",
          address: "123 Rizal Street, Quezon City, Metro Manila",
          emergencyContact: {
            name: "Juan Santos",
            relationship: "Spouse",
            phone: "+63917123457"
          },
          medicalHistory: ["Hypertension", "Diabetes Type 2"],
          allergies: ["Penicillin", "Shellfish"],
          currentMedications: ["Metformin 500mg", "Amlodipine 5mg"],
          lastVisit: "2024-01-15",
          status: "Active"
        },
        {
          id: "emr_002", 
          patientId: "PAT-2024-002",
          firstName: "Jose",
          lastName: "Dela Cruz",
          dateOfBirth: "1978-08-22",
          gender: "Male",
          contactNumber: "+63918234567",
          email: "jose.delacruz@email.com",
          address: "456 EDSA, Makati City, Metro Manila",
          emergencyContact: {
            name: "Anna Dela Cruz",
            relationship: "Wife",
            phone: "+63918234568"
          },
          medicalHistory: ["Asthma", "High Cholesterol"],
          allergies: ["Peanuts"],
          currentMedications: ["Salbutamol Inhaler", "Atorvastatin 20mg"],
          lastVisit: "2024-01-20",
          status: "Active"
        }
      ];

      this.status.lastSync = new Date();
      this.status.totalSynced += mockPatients.length;
      return mockPatients;
    } catch (error) {
      this.status.lastError = `Failed to fetch patients: ${error}`;
      throw error;
    }
  }

  // Fetch appointments from EMR
  async getAppointments(patientId?: string, dateFrom?: string, dateTo?: string): Promise<EMRAppointment[]> {
    try {
      // Mock data - replace with actual API call
      const mockAppointments: EMRAppointment[] = [
        {
          id: "appt_001",
          patientId: "PAT-2024-001",
          doctorId: "DOC-001",
          doctorName: "Dr. Sarah Rodriguez",
          department: "Internal Medicine",
          appointmentDate: "2024-01-25",
          appointmentTime: "10:00",
          duration: 30,
          type: "Consultation",
          status: "Completed",
          notes: "Routine checkup for diabetes management",
          cost: 1500
        },
        {
          id: "appt_002",
          patientId: "PAT-2024-002", 
          doctorId: "DOC-002",
          doctorName: "Dr. Michael Tan",
          department: "Pulmonology",
          appointmentDate: "2024-01-26",
          appointmentTime: "14:00",
          duration: 45,
          type: "Follow-up",
          status: "Scheduled",
          notes: "Asthma follow-up and medication review",
          cost: 2000
        }
      ];

      return patientId 
        ? mockAppointments.filter(apt => apt.patientId === patientId)
        : mockAppointments;
    } catch (error) {
      this.status.lastError = `Failed to fetch appointments: ${error}`;
      throw error;
    }
  }

  // Fetch treatment records for billing
  async getTreatments(patientId?: string, unbilledOnly: boolean = false): Promise<EMRTreatment[]> {
    try {
      // Mock data - replace with actual API call  
      const mockTreatments: EMRTreatment[] = [
        {
          id: "treat_001",
          patientId: "PAT-2024-001",
          appointmentId: "appt_001",
          treatmentDate: "2024-01-25",
          diagnosis: "Type 2 Diabetes Mellitus (E11.9)",
          treatment: "Medication adjustment and lifestyle counseling",
          medications: [
            {
              name: "Metformin 500mg",
              dosage: "500mg",
              frequency: "Twice daily",
              duration: "30 days",
              cost: 450
            }
          ],
          procedures: [
            {
              name: "Blood Glucose Test",
              code: "82947",
              cost: 200
            },
            {
              name: "HbA1c Test", 
              code: "83036",
              cost: 800
            }
          ],
          doctorNotes: "Patient responding well to current medication. Continue monitoring.",
          totalCost: 2950,
          billable: true
        }
      ];

      let filteredTreatments = mockTreatments;
      
      if (patientId) {
        filteredTreatments = filteredTreatments.filter(t => t.patientId === patientId);
      }
      
      if (unbilledOnly) {
        filteredTreatments = filteredTreatments.filter(t => t.billable);
      }

      return filteredTreatments;
    } catch (error) {
      this.status.lastError = `Failed to fetch treatments: ${error}`;
      throw error;
    }
  }

  // Mark treatment as billed in EMR system
  async markTreatmentAsBilled(treatmentId: string, invoiceId: string): Promise<boolean> {
    try {
      // Mock API call - replace with actual EMR API
      console.log(`Marking treatment ${treatmentId} as billed with invoice ${invoiceId}`);
      return true;
    } catch (error) {
      this.status.lastError = `Failed to mark treatment as billed: ${error}`;
      return false;
    }
  }

  // Get integration status
  getStatus(): IntegrationStatus['emr'] {
    return this.status;
  }

  // Private method to make API requests
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.config.baseUrl}${this.config.endpoints.patients || endpoint}`;
    
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
      throw new Error(`EMR API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Sync data with EMR system
  async syncData(): Promise<void> {
    try {
      console.log('Starting EMR data synchronization...');
      
      // Test connection first
      const connected = await this.testConnection();
      if (!connected) {
        throw new Error('Cannot connect to EMR system');
      }

      // Sync patients, appointments, and treatments
      await this.getPatients();
      await this.getAppointments();
      await this.getTreatments();

      console.log('EMR data synchronization completed successfully');
    } catch (error) {
      console.error('EMR synchronization failed:', error);
      this.status.lastError = `Sync failed: ${error}`;
      throw error;
    }
  }
}

// Export singleton instance
export const emrService = new EMRIntegrationService();