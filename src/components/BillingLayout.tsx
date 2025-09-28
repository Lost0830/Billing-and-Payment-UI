import { useState } from "react";
import { Button } from "./ui/button";
import { 
  Bell, 
  User, 
  FileText, 
  CreditCard, 
  History, 
  Tag,
  Calculator,
  ArrowLeft
} from "lucide-react";

interface BillingLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onNavigateToModule: (module: string) => void;
  onNavigateToView: (view: string) => void;
}

export function BillingLayout({ 
  children, 
  currentModule, 
  onNavigateToModule, 
  onNavigateToView 
}: BillingLayoutProps) {
  const mainNavigationItems = [
    { label: "Dashboard", active: false },
    { label: "Patients", active: false },
    { label: "Appointments", active: false },
    { label: "Billing", active: true },
    { label: "Reports", active: false },
    { label: "Settings", active: false },
  ];

  const billingModules = [
    { 
      id: "medicare-billing", 
      label: "Billing Center", 
      icon: Calculator,
      description: "Main billing interface"
    },
    { 
      id: "invoice", 
      label: "Invoice Generation", 
      icon: FileText,
      description: "Create and manage invoices"
    },
    { 
      id: "payment", 
      label: "Payment Processing", 
      icon: CreditCard,
      description: "Process payments and transactions"
    },
    { 
      id: "history", 
      label: "Billing History", 
      icon: History,
      description: "View billing records and reports"
    },
    { 
      id: "discounts", 
      label: "Discounts & Promotions", 
      icon: Tag,
      description: "Manage discounts and offers"
    },
  ];

  const currentModuleInfo = billingModules.find(module => module.id === currentModule);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* MediCare Solutions Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-semibold text-gray-900">MediSys</span>
              </div>

              {/* Main Navigation Menu */}
              <nav className="hidden md:flex space-x-6">
                {mainNavigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (item.label === "Dashboard") {
                        onNavigateToView("dashboard");
                      } else if (item.label === "Patients") {
                        onNavigateToView("patients");
                      } else if (item.label === "Appointments") {
                        onNavigateToView("appointments");
                      } else if (item.label === "Reports") {
                        onNavigateToView("reports");
                      } else if (item.label === "Settings") {
                        onNavigateToView("settings");
                      }
                    }}
                    className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      item.active
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side - Notifications and User */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Billing Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Billing Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToView("dashboard")}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Billing</span>
              {currentModuleInfo && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">{currentModuleInfo.label}</span>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToModule("invoice")}
                className="text-sm"
              >
                <FileText className="h-4 w-4 mr-1" />
                New Invoice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToModule("payment")}
                className="text-sm"
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Process Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Module Navigation */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {billingModules.map((module) => {
              const IconComponent = module.icon;
              const isActive = currentModule === module.id;
              
              return (
                <button
                  key={module.id}
                  onClick={() => onNavigateToModule(module.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-blue-700 border-b-2 border-blue-600 bg-blue-100"
                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{module.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Header */}
      {currentModuleInfo && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <currentModuleInfo.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{currentModuleInfo.label}</h1>
                <p className="text-gray-600 text-sm">{currentModuleInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-6 py-6">
        {children}
      </main>
    </div>
  );
}