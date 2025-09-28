import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginPageProps {
  system: string;
  onLogin: (credentials: { email: string; password: string; role: string; system: string }) => void;
  onBack: () => void;
}

export function LoginPage({ system, onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("✅ " + data.message);
        onLogin({ 
          email: data.user.email, 
          password, 
          role: data.user.role, 
          system 
        });
      } else {
        alert("❌ " + (data.message || 'Login failed. Please check your credentials.'));
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Failed to connect to backend server. Make sure the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const getSystemInfo = () => {
    switch (system) {
      case "billing":
        return {
          title: "Billing Management",
          subtitle: "Enter your credentials to access the billing management system.",
          welcomeTitle: "Welcome to Billing HIMS",
          welcomeDescription:
            "Your dedicated portal for efficient and secure billing management. Streamline your workflow and enhance financial processes.",
          department: "Billing Management"
        };
      case "pharmacy":
        return {
          title: "Pharmacy Management",
          subtitle: "Enter your credentials to access the pharmacy management system.",
          welcomeTitle: "Welcome to Pharmacy HIMS",
          welcomeDescription:
            "Your dedicated portal for efficient and secure pharmacy management. Streamline your workflow and enhance patient care.",
          department: "Pharmacy Management"
        };
      case "emr":
        return {
          title: "Electronic Medical Records",
          subtitle: "Enter your credentials to access the EMR system.",
          welcomeTitle: "Welcome to EMR HIMS",
          welcomeDescription:
            "Your dedicated portal for efficient and secure medical records management. Streamline patient care and data management.",
          department: "Electronic Medical Records"
        };
      default:
        return {
          title: "HIMS Login",
          subtitle: "Enter your credentials to access the system.",
          welcomeTitle: "Welcome to HIMS",
          welcomeDescription: "Your dedicated portal for hospital information management.",
          department: "Hospital Information Management"
        };
    }
  };

  const systemInfo = getSystemInfo();

  return (
    <div className="bg-[#F0FDF4] dark:bg-[#18181B] min-h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl shadow-xl rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#358E83] items-center justify-center p-12 text-white flex-col text-center">
          <h1 className="text-4xl font-bold mb-4">{systemInfo.welcomeTitle}</h1>
          <p className="text-lg">{systemInfo.welcomeDescription}</p>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 bg-white dark:bg-[#27272A] p-8 sm:p-12">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-left mb-8">
              <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 p-0 h-auto text-[#358E83] hover:text-[#358E83]/80"
              >
                ← Back to Home
              </Button>
              <h2 className="text-3xl font-bold text-[#333333] dark:text-[#E4E4E7]">
                {systemInfo.title}
              </h2>
              <p className="text-[#6B7280] dark:text-[#A1A1AA] mt-2">
                {systemInfo.subtitle}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Department Field */}
              <div>
                <Label
                  htmlFor="department"
                  className="block text-sm font-medium text-[#333333] dark:text-[#E4E4E7] mb-1"
                >
                  Department
                </Label>
                <div className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-[#E5E7EB] dark:border-[#3F3F46] text-[#6B7280] dark:text-[#A1A1AA]">
                  {systemInfo.department}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#333333] dark:text-[#E4E4E7] mb-1"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#F0FDF4] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#3F3F46] text-[#333333] dark:text-[#E4E4E7] placeholder-[#6B7280] dark:placeholder-[#A1A1AA]"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#333333] dark:text-[#E4E4E7] mb-1"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[#F0FDF4] dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#3F3F46] text-[#333333] dark:text-[#E4E4E7] placeholder-[#6B7280] dark:placeholder-[#A1A1AA] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#6B7280] dark:text-[#A1A1AA]"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#358E83] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#358E83]/90 transition-colors"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-6">
              <a href="#" className="text-sm font-medium text-[#358E83] hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-[#E5E7EB] dark:border-[#3F3F46] text-center text-[#6B7280] dark:text-[#A1A1AA] text-sm">
            <p>© 2025 Hospital Information Management System</p>
            <div className="mt-2">
              <a href="#" className="hover:text-[#358E83] dark:hover:text-[#358E83] transition-colors">
                Privacy Policy
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-[#358E83] dark:hover:text-[#358E83] transition-colors">
                Terms of Use
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}