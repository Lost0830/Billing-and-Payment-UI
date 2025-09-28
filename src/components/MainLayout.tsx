import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  Search,
  Activity,
  User,
  LogOut,
  ChevronDown,
  Calculator,
  FileText,
  CreditCard,
  History,
  Tag,
  Settings,
  Bell,
  ChevronLeft,
} from "lucide-react";

interface UserSession {
  email: string;
  role: string;
  system: string;
}

interface MainLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigateToView: (view: string) => void;
  pageTitle?: string;
  pageDescription?: string;
  userSession?: UserSession | null;
}

export function MainLayout({ 
  children, 
  currentView, 
  onNavigateToView,
  pageTitle,
  pageDescription,
  userSession
}: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Check if we're in the billing system to show sidebar
  const isBillingSystem = userSession?.system === "billing" || 
    ["medicare-billing", "invoice", "payment", "history", "discounts"].includes(currentView);

  // Get navigation items for billing sidebar
  const getBillingSidebarItems = () => [
    { 
      id: "medicare-billing", 
      label: "Dashboard", 
      icon: Calculator,
      description: "Billing overview and metrics"
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
    { 
      id: "settings", 
      label: "Settings", 
      icon: Settings,
      description: "System configuration"
    },
  ];

  // Get navigation items based on user's system (for non-billing systems)
  const getNavigationItems = () => {
    if (userSession?.system === "pharmacy") {
      return [
        { id: "pharmacy", label: "Pharmacy" },
        { id: "settings", label: "Settings" },
      ];
    } else if (userSession?.system === "emr") {
      return [
        { id: "emr", label: "EMR" },
        { id: "settings", label: "Settings" },
      ];
    } else {
      // Default navigation for dashboard/admin users
      return [
        { id: "dashboard", label: "Dashboard" },
        { id: "emr", label: "EMR" },
        { id: "pharmacy", label: "Pharmacy" },
        { id: "billing", label: "Billing" },
        { id: "settings", label: "Settings" },
      ];
    }
  };

  const navigationItems = getNavigationItems();
  const billingSidebarItems = getBillingSidebarItems();

  const getActiveItem = (itemId: string) => {
    if (itemId === "dashboard" && currentView === "dashboard") return true;
    if (itemId === "emr" && (currentView === "patients" || currentView === "appointments")) return true;
    if (itemId === "pharmacy" && currentView === "pharmacy") return true;
    if (itemId === "billing" && ["medicare-billing", "invoice", "payment", "history", "discounts"].includes(currentView)) return true;
    if (itemId === "settings" && currentView === "settings") return true;
    return false;
  };

  const getActiveBillingSidebarItem = (itemId: string) => {
    return currentView === itemId;
  };

  const handleNavigation = (itemId: string) => {
    // Restrict navigation based on user's system
    if (userSession?.system === "billing" && itemId !== "billing" && itemId !== "settings") {
      return; // Prevent navigation to other systems from billing
    } else if (userSession?.system === "pharmacy" && itemId !== "pharmacy" && itemId !== "settings") {
      return; // Prevent navigation to other systems from pharmacy
    } else if (userSession?.system === "emr" && itemId !== "emr" && itemId !== "settings") {
      return; // Prevent navigation to other systems from EMR
    }

    if (itemId === "dashboard") {
      onNavigateToView("dashboard");
    } else if (itemId === "emr") {
      onNavigateToView("patients");
    } else if (itemId === "pharmacy") {
      onNavigateToView("pharmacy");
    } else if (itemId === "billing") {
      onNavigateToView("medicare-billing");
    } else {
      onNavigateToView(itemId);
    }
  };

  const handleBillingSidebarNavigation = (itemId: string) => {
    onNavigateToView(itemId);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render billing sidebar layout
  if (isBillingSystem) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#358E83] rounded-md flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">HIMS</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-gray-400 hover:text-gray-600"
                onClick={() => onNavigateToView("dashboard")}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs ml-1">Back to HIMS</span>
              </Button>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 p-4">
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                NAVIGATION
              </h3>
              <nav className="space-y-1">
                {billingSidebarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = getActiveBillingSidebarItem(item.id);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleBillingSidebarNavigation(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={isActive ? { backgroundColor: "#358E83" } : {}}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-1">
                  {pageTitle || "Billing System"}
                </h1>
                <p className="text-gray-600">
                  {pageDescription || "Comprehensive billing management for hospital services"}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-gray-50 border-gray-200"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                      <div className="w-8 h-8 bg-[#358E83] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      {userSession && (
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">{userSession.role}</div>
                          <div className="text-xs text-gray-500">{userSession.system}</div>
                        </div>
                      )}
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userSession && (
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{userSession.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{userSession.role} - {userSession.system}</p>
                      </div>
                    )}
                    <DropdownMenuItem 
                      onClick={() => onNavigateToView("logout")}
                      className="text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Original layout for non-billing systems
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* HIMS Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#358E83] rounded-md flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-gray-900">HIMS</span>
                  {userSession?.system && (
                    <span className="text-xs text-[#358E83] capitalize font-medium">
                      {userSession.system === "emr" ? "EMR System" : `${userSession.system} System`}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="hidden md:flex space-x-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      getActiveItem(item.id)
                        ? "text-[#358E83] border-b-2 border-[#358E83]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side - Search and User */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-gray-50 border-gray-200"
                />
              </div>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <div className="w-8 h-8 bg-[#358E83] rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    {userSession && (
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-900">{userSession.role}</div>
                        <div className="text-xs text-gray-500">{userSession.system}</div>
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userSession && (
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{userSession.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{userSession.role} - {userSession.system}</p>
                    </div>
                  )}
                  {/* Only show settings in dropdown for non-system users */}
                  {!userSession?.system && (
                    <DropdownMenuItem onClick={() => onNavigateToView("settings")}>
                      Settings
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => onNavigateToView("logout")}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Page Header */}
        {pageTitle && (
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{pageTitle}</h1>
            {pageDescription && (
              <p className="text-gray-600">{pageDescription}</p>
            )}
          </div>
        )}

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}