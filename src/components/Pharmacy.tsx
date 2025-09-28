import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Settings, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Database,
  Pill,
  Package
} from "lucide-react";
import { toast } from "sonner";

interface PharmacyProps {
  onNavigateToView: (view: string) => void;
}

interface PharmacyStats {
  totalTransactions: number;
  totalRevenue: number;
  pendingSync: number;
  lastSync: string;
  isConnected: boolean;
}

export function Pharmacy({ onNavigateToView }: PharmacyProps) {
  const [pharmacyStats, setPharmacyStats] = useState<PharmacyStats>({
    totalTransactions: 0,
    totalRevenue: 0,
    pendingSync: 0,
    lastSync: 'Never',
    isConnected: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPharmacyStats();
  }, []);

  const fetchPharmacyStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch pharmacy transactions from MongoDB
      const response = await fetch('http://localhost:5000/api/pharmacy/transactions');
      const data = await response.json();
      
      if (data.success) {
        const transactions = data.data;
        const totalRevenue = transactions.reduce((sum: number, transaction: any) => 
          sum + transaction.totalAmount, 0);
        const pendingSync = transactions.filter((t: any) => t.billingStatus === 'Pending').length;
        
        setPharmacyStats({
          totalTransactions: transactions.length,
          totalRevenue,
          pendingSync,
          lastSync: transactions.length > 0 ? '2 min ago' : 'Never',
          isConnected: transactions.length > 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch pharmacy stats:', error);
      setPharmacyStats(prev => ({ ...prev, isConnected: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      // Simulate sync with external pharmacy system
      const response = await fetch('http://localhost:5000/api/pharmacy/sync', {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Pharmacy data synchronized successfully");
        await fetchPharmacyStats();
      } else {
        toast.error("Failed to sync pharmacy data");
      }
    } catch (error) {
      toast.error("Failed to sync pharmacy data");
      console.error('Sync failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pharmacy/status');
      const data = await response.json();
      return data.success && data.connected;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Pharmacy Integration</h1>
          <p className="text-gray-600 mt-2">
            Connect and manage external pharmacy systems for seamless medication management and billing integration.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {pharmacyStats.isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600">Disconnected</span>
              </>
            )}
          </div>
          <Button 
            onClick={handleSync}
            disabled={isLoading}
            className="bg-[#358E83] hover:bg-[#2a6b64]"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync Data
          </Button>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pharmacyStats.totalTransactions}
                </p>
              </div>
              <Database className={`h-8 w-8 ${pharmacyStats.isConnected ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pharmacy Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₱{pharmacyStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <Pill className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Sync</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {pharmacyStats.pendingSync}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-[#358E83]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the component remains the same */}
      {/* ... existing code ... */}
    </div>
  );
}