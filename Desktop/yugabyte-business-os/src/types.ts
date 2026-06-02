export type SectorType = 'Jewellery' | 'Manufacturing' | 'Distribution' | 'Trading' | 'Wholesale';

export interface CommunicationHistory {
  date: string;
  type: 'Email' | 'Call' | 'Meeting' | 'Inquiry';
  summary: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Lead In' | 'Contacted' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  value: number;
  sector: SectorType;
  assignedTo: string; // name
  communicationHistory: CommunicationHistory[];
  createdAt: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Contract' | 'Closed Won' | 'Closed Lost';
  probability: number; // 0 to 100
  expectedRevenue: number;
  forecastDate: string;
  sector: SectorType;
}

export interface QuotationLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  // Specific sectors fields:
  gramWeight?: number; // Jewellery
  karats?: number; // Jewellery
  materialCost?: number; // Manufacturing
  laborCost?: number; // Manufacturing
  multiTierDiscount?: number; // Wholesales/Distribution bulk discount
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  date: string;
  items: QuotationLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  discountTotal: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
  sector: SectorType;
  notes?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  originalQuotationId?: string;
  customerName: string;
  companyName: string;
  date: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentReceived: number;
  outstandingAmount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Unpaid' | 'Overdue';
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'Follow-up' | 'Meeting' | 'Reminder';
  clientName: string;
  dateTime: string;
  description: string;
  completed: boolean;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface AutomationRule {
  id: string;
  title: string;
  triggerEvent: string;
  actionEffect: string;
  isActive: boolean;
  description: string;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  ruleTitle: string;
  details: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  code: string;
}

export interface UserRole {
  level: 'Admin' | 'Manager' | 'Sales' | 'Auditor';
  departmentsAllowed: string[]; // e.g. "Sales", "Finance", "Operations", "AI Insights", "Security"
}

export interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  history: number[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
