import { Button } from "./ui/button";
import {
  Calculator,
  FileText,
  CreditCard,
  History,
  Tag,
} from "lucide-react";

interface BillingSubLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  onNavigateToModule: (module: string) => void;
}

export function BillingSubLayout({ 
  children, 
  currentModule, 
  onNavigateToModule 
}: BillingSubLayoutProps) {
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

  return (
    <div className="space-y-6">
      {/* Billing Module Navigation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex space-x-1 overflow-x-auto">
          {billingModules.map((module) => {
            const IconComponent = module.icon;
            const isActive = currentModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => onNavigateToModule(module.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded-md ${
                  isActive
                    ? "text-white border border-transparent"
                    : "text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                }`}
                style={isActive ? { backgroundColor: "#358E83" } : {}}
              >
                <IconComponent className="h-4 w-4" />
                <span>{module.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Billing Content */}
      {children}
    </div>
  );
}