import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  FileText,
  CreditCard,
  Calendar,
  Users,
  ClipboardList,
  DollarSign,
  ArrowRight,
  BarChart3,
  Pill,
  Package,
} from "lucide-react";

interface DashboardProps {
  onNavigateToModule: (moduleId: string) => void;
}

export function Dashboard({ onNavigateToModule }: DashboardProps) {
  return (
    <div>

        {/* Electronic Medical Records Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Electronic Medical Records (EMR)
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Records Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Patient Records
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Access and manage patient medical histories, diagnoses, treatments, and other relevant information.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("emr")}
                  >
                    View Records
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <ClipboardList className="h-8 w-8 text-gray-400" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Appointment Scheduling Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Appointment Scheduling
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Schedule, reschedule, or cancel patient appointments with doctors and specialists.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("appointments")}
                  >
                    Manage Appointments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <div className="relative">
                      <Calendar className="h-8 w-8 text-gray-400" />
                      <div className="absolute -top-1 -right-1 w-6 h-8 bg-green-100 rounded flex items-center justify-center">
                        <div className="w-3 h-6 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Pharmacy Integration Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Pharmacy Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pharmacy Management Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Medication Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage integrated pharmacy systems, medication inventory, and patient prescriptions.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("pharmacy")}
                  >
                    Manage Pharmacy
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <Pill className="h-8 w-8 text-green-500" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Package className="h-3 w-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Prescription Processing Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Prescription Processing
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Process patient prescriptions, track medication dispensing, and integrate with billing.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("pharmacy")}
                  >
                    Process Prescriptions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <ClipboardList className="h-8 w-8 text-blue-500" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">Rx</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Billing and Payment System Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Billing and Payment System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Management Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Invoice Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create, review, and send invoices to patients for services rendered. Track payment status.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("invoice")}
                  >
                    Manage Invoices
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-4 bg-orange-200 rounded transform rotate-12"></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Processing Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Payment Processing
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Process patient payments through various methods, including credit card, GCash, PayMaya, and cash.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("payment")}
                  >
                    Process Payments
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <CreditCard className="h-8 w-8 text-teal-500" />
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Billing History Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Billing History
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Review historical billing data, payment records, and generate financial reports.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("history")}
                  >
                    View History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Discounts & Promotions Card */}
            <Card className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Discounts & Promotions
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage discount codes, promotional offers, and special pricing for patients.
                  </p>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => onNavigateToModule("discounts")}
                  >
                    Manage Discounts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-32 bg-orange-100 flex items-center justify-center">
                  <div className="w-16 h-20 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">%</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Quick Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                    <p className="text-2xl font-semibold text-gray-900">2,847</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Appointments Today</p>
                    <p className="text-2xl font-semibold text-gray-900">43</p>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Invoices</p>
                    <p className="text-2xl font-semibold text-gray-900">15</p>
                  </div>
                  <FileText className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Revenue (MTD)</p>
                    <p className="text-2xl font-semibold text-gray-900">₱6.2M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
    </div>
  );
}