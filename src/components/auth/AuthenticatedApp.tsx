import { MediCareBilling } from "../MediCareBilling";
import { Dashboard } from "../Dashboard";
import { Patients } from "../Patients";
import { Appointments } from "../Appointments";
import { Settings } from "../Settings";
import { Pharmacy } from "../Pharmacy";
import { InvoiceGeneration } from "../InvoiceGeneration";
import { PaymentProcessing } from "../PaymentProcessing";
import { BillingHistory } from "../BillingHistory";
import { DiscountsPromotions } from "../DiscountsPromotions";
import { MainLayout } from "../MainLayout";
import { UserSession } from "../../hooks/useAuth";

interface AuthenticatedAppProps {
  currentView: string;
  userSession: UserSession;
  onNavigateToView: (view: string) => void;
}

export function AuthenticatedApp({ currentView, userSession, onNavigateToView }: AuthenticatedAppProps) {
  // Get page title and description based on current view
  const getPageInfo = () => {
    switch (currentView) {
      case "dashboard":
        return {
          title: "Dashboard",
          description: "Welcome to the Hospital Information Management System (HIMS). This dashboard provides an overview of the system's key functionalities."
        };
      case "patients":
        return {
          title: "Patient Records",
          description: "Manage patient information, medical histories, and electronic medical records."
        };
      case "appointments":
        return {
          title: "Appointments",
          description: "Schedule, manage, and track patient appointments with healthcare providers."
        };
      case "pharmacy":
        return {
          title: "Pharmacy Integration",
          description: "Manage integrated pharmacy systems, medication inventory, and patient prescriptions."
        };
      case "medicare-billing":
        return {
          title: "Billing Dashboard",
          description: "Overview of billing operations and key performance metrics"
        };
      case "invoice":
        return {
          title: "Invoice Generation",
          description: "Create and manage patient invoices for services rendered."
        };
      case "payment":
        return {
          title: "Payment Processing",
          description: "Process patient payments through various payment methods."
        };
      case "history":
        return {
          title: "Billing History",
          description: "View billing records, payment history, and pharmacy transactions."
        };
      case "discounts":
        return {
          title: "Discounts & Promotions",
          description: "Manage discount codes, promotional offers, and special pricing."
        };
      case "settings":
        return {
          title: "Settings",
          description: "Configure system settings and user preferences."
        };
      default:
        return {
          title: "HIMS",
          description: "Hospital Information Management System."
        };
    }
  };

  // Check if current view is a billing module
  const billingModules = ["medicare-billing", "invoice", "payment", "history", "discounts"];
  const isBillingModule = billingModules.includes(currentView);

  // Render billing content
  const renderBillingContent = () => {
    switch (currentView) {
      case "medicare-billing":
        return <MediCareBilling onNavigateToView={onNavigateToView} />;
      case "invoice":
        return <InvoiceGeneration onNavigateToView={onNavigateToView} />;
      case "payment":
        return <PaymentProcessing onNavigateToView={onNavigateToView} />;
      case "history":
        return <BillingHistory onNavigateToView={onNavigateToView} />;
      case "discounts":
        return <DiscountsPromotions onNavigateToView={onNavigateToView} />;
      default:
        return <MediCareBilling onNavigateToView={onNavigateToView} />;
    }
  };

  // Render content based on current view
  const renderContent = () => {
    if (isBillingModule) {
      return renderBillingContent();
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigateToModule={onNavigateToView} />;
      case "patients":
        return <Patients onNavigateToView={onNavigateToView} />;
      case "appointments":
        return <Appointments onNavigateToView={onNavigateToView} />;
      case "pharmacy":
        return <Pharmacy onNavigateToView={onNavigateToView} />;
      case "settings":
        return <Settings onNavigateToView={onNavigateToView} />;
      default:
        return <Dashboard onNavigateToModule={onNavigateToView} />;
    }
  };

  const pageInfo = getPageInfo();

  return (
    <MainLayout
      currentView={currentView}
      onNavigateToView={onNavigateToView}
      pageTitle={pageInfo.title}
      pageDescription={pageInfo.description}
      userSession={userSession}
    >
      {renderContent()}
    </MainLayout>
  );
}