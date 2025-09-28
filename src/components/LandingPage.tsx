import { Hospital, Settings, FlaskConical, Heart, CreditCard } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onNavigateToLogin: (system: string) => void;
}

export function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#1A202C]">
      {/* Navigation */}
      <nav className="bg-white dark:bg-[#2D3748] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Hospital className="text-3xl text-[#358E83] mr-2" size={32} />
                <span className="text-2xl font-bold text-gray-800 dark:text-white">HIMS</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                className="bg-[#358E83]/10 hover:bg-[#358E83]/20 text-[#358E83] font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 ease-in-out"
              >
                <Settings className="mr-2" size={20} />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="mb-12 text-center">
          <div className="inline-block bg-[#358E83]/10 p-4 rounded-full mb-4">
            <Hospital className="text-4xl text-[#358E83]" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Hospital Information Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Explore our integrated subsystems
          </p>
        </div>

        {/* Subsystem Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl">
          {/* Pharmacy Card */}
          <div className="bg-white dark:bg-[#2D3748] p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-5 rounded-full bg-[#358E83]/10 mb-6">
              <FlaskConical className="text-5xl text-[#358E83]" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Pharmacy
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 flex-grow">
              Manage prescriptions, inventory, and dispensing of medications efficiently and safely.
            </p>
            <Button 
              className="w-full bg-[#358E83] hover:bg-[#358E83]/90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
              onClick={() => onNavigateToLogin('pharmacy')}
            >
              Access Pharmacy
            </Button>
          </div>

          {/* EMR Card - Featured */}
          <div className="bg-white dark:bg-[#2D3748] p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border-2 border-[#358E83]">
            <div className="p-5 rounded-full bg-[#358E83]/10 mb-6">
              <Heart className="text-5xl text-[#358E83]" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Electronic Medical Records
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 flex-grow">
              Securely access and manage patient health information and medical histories.
            </p>
            <Button 
              className="w-full bg-[#358E83] hover:bg-[#358E83]/90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
              onClick={() => onNavigateToLogin('emr')}
            >
              Access EMR
            </Button>
          </div>

          {/* Billing Card */}
          <div className="bg-white dark:bg-[#2D3748] p-8 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
            <div className="p-5 rounded-full bg-[#358E83]/10 mb-6">
              <CreditCard className="text-5xl text-[#358E83]" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Billing
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6 flex-grow">
              Streamline patient billing, and financial reporting processes
            </p>
            <Button 
              className="w-full bg-[#358E83] hover:bg-[#358E83]/90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out"
              onClick={() => onNavigateToLogin('billing')}
            >
              Access Billing
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-12">
          © 2025 Hospital Information Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}