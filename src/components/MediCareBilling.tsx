import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  AlertTriangle,
  Calendar,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Clock,
  CheckCircle,
} from "lucide-react";

interface MediCareBillingProps {
  onNavigateToView?: (view: string) => void;
}

interface DashboardMetrics {
  totalRevenue: number;
  pendingInvoices: number;
  dueThisWeek: number;
  processedPayments: number;
  totalOutstanding: number;
  overdueCount: number;
}

export function MediCareBilling({ onNavigateToView }: MediCareBillingProps) {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics>({
    totalRevenue: 0,
    pendingInvoices: 0,
    dueThisWeek: 0,
    processedPayments: 0,
    totalOutstanding: 0,
    overdueCount: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const [invoicesRes, paymentsRes] = await Promise.all([
        fetch('http://localhost:5000/api/billing/invoices'),
        fetch('http://localhost:5000/api/billing/payments?limit=10')
      ]);
      
      const invoicesData = await invoicesRes.json();
      const paymentsData = await paymentsRes.json();
      
      if (invoicesData.success && paymentsData.success) {
        const invoices = invoicesData.data;
        const payments = paymentsData.data;

        // Calculate dashboard metrics
        const totalRevenue = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
        const pendingInvoices = invoices.filter((invoice: any) => invoice.status === 'Pending').length;
        const processedPayments = payments.length;
        
        // Calculate due this week
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        const dueThisWeek = invoices.filter((invoice: any) => {
          const dueDate = new Date(invoice.dueDate);
          return dueDate <= oneWeekFromNow && invoice.outstandingBalance > 0;
        }).length;

        // Calculate outstanding balances
        const outstandingBalances = invoices.filter((invoice: any) => invoice.outstandingBalance > 0);
        const totalOutstanding = outstandingBalances.reduce((sum: number, invoice: any) => sum + invoice.outstandingBalance, 0);
        const overdueCount = invoices.filter((invoice: any) => invoice.status === 'Overdue').length;

        setDashboardData({
          totalRevenue,
          pendingInvoices,
          dueThisWeek,
          processedPayments,
          totalOutstanding,
          overdueCount
        });

        // Prepare recent activities
        const activities = payments.slice(0, 4).map((payment: any) => ({
          id: payment._id,
          type: 'payment',
          description: `Payment received from ${payment.patientName}`,
          amount: `₱${payment.amount.toLocaleString()}`,
          time: formatTimeAgo(new Date(payment.paymentDate))
        }));

        // Add invoice activities if needed
        const recentInvoices = invoices.slice(0, 2);
        recentInvoices.forEach((invoice: any) => {
          activities.push({
            id: invoice._id,
            type: 'invoice',
            description: `Invoice ${invoice.invoiceId} generated`,
            amount: `₱${invoice.totalAmount.toLocaleString()}`,
            time: formatTimeAgo(new Date(invoice.invoiceDate))
          });
        });

        setRecentActivities(activities.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Mock data for dashboard metrics (will be replaced by actual data)
  const dashboardMetrics = [
    {
      title: "Total Revenue",
      value: `₱${dashboardData.totalRevenue.toLocaleString()}`,
      change: "+18% from yesterday",
      positive: true,
      icon: DollarSign,
      bgColor: "bg-teal-50",
      iconColor: "#358E83",
    },
    {
      title: "Pending Invoices",
      value: dashboardData.pendingInvoices.toString(),
      change: `${dashboardData.pendingInvoices > 5 ? '5 critical items' : 'All under control'}`,
      positive: dashboardData.pendingInvoices > 5 ? false : null,
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      iconColor: "#E94D61",
    },
    {
      title: "Due This Week",
      value: dashboardData.dueThisWeek.toString(),
      change: "Next 7 days",
      positive: null,
      icon: Calendar,
      bgColor: "bg-yellow-50",
      iconColor: "#F59E0B",
    },
    {
      title: "Processed Payments",
      value: `₱${dashboardData.totalRevenue.toLocaleString()}`,
      change: "+24% from yesterday",
      positive: true,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "#10B981",
    },
  ];

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">Billing Dashboard</h1>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#358E83]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Billing Dashboard</h1>
          <p className="text-gray-600">Overview of billing operations and key performance metrics</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Clock className="h-4 w-4 mr-1" />
            Last updated: Just now
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-400">{getCurrentDateTime()}</p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className={`${metric.bgColor} border-0`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-white/80">
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ color: metric.iconColor }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <p className={`text-xs flex items-center ${
                    metric.positive === true ? 'text-green-600' : 
                    metric.positive === false ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.positive === true && <TrendingUp className="h-3 w-3 mr-1" />}
                    {metric.positive === false && <TrendingDown className="h-3 w-3 mr-1" />}
                    {metric.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue Trends */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" style={{color: "#358E83"}} />
              <CardTitle className="text-lg">Revenue Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Total Revenue: ₱{dashboardData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Outstanding: ₱{dashboardData.totalOutstanding.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" style={{color: "#358E83"}} />
              <CardTitle className="text-lg">Invoice Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Pending: {dashboardData.pendingInvoices}</p>
                <p className="text-xs text-gray-400">Overdue: {dashboardData.overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" style={{color: "#358E83"}} />
              <CardTitle className="text-lg">Payments Processed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Total Payments: {dashboardData.processedPayments}</p>
                <p className="text-xs text-gray-400">This week: {dashboardData.dueThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start h-auto p-4"
              style={{backgroundColor: "#358E83"}}
              onClick={() => onNavigateToView?.('invoice')}
            >
              <FileText className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Generate Invoice</div>
                <div className="text-xs opacity-90">Create new patient invoice</div>
              </div>
            </Button>
            
            <Button 
              className="w-full justify-start h-auto p-4"
              style={{backgroundColor: "#E94D61"}}
              onClick={() => onNavigateToView?.('payment')}
            >
              <DollarSign className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Process Payment</div>
                <div className="text-xs opacity-90">Record patient payment</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => onNavigateToView?.('discounts')}
            >
              <Badge className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">Apply Discount</div>
                <div className="text-xs text-gray-600">Manage promotions</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4"
              onClick={() => onNavigateToView?.('history')}
            >
              <Activity className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">View Reports</div>
                <div className="text-xs text-gray-600">Billing analytics</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'payment' ? 'bg-green-100' :
                        activity.type === 'invoice' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                        {activity.type === 'invoice' && <FileText className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'discount' && <Badge className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        activity.amount.startsWith('-') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No recent activity</p>
                <Button variant="outline" onClick={handleRefresh} className="mt-2">
                  Refresh Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}