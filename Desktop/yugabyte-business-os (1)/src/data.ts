import { 
  Lead, 
  Deal, 
  Quotation, 
  Invoice, 
  Task, 
  AutomationRule, 
  Branch, 
  Branch as BranchType,
  SectorType
} from './types';

export const initialBranches: Branch[] = [
  { id: 'b1', name: 'Mumbai Retail HQ', location: 'Bandra Electro-Zone, Mumbai', code: 'YB-MUM-01' },
  { id: 'b2', name: 'Dubai Jewelry Vault', location: 'Gold Souk District, Deira, Dubai', code: 'YB-DXB-02' },
  { id: 'b3', name: 'New York Logistics Hub', location: 'Queens Wholesale Area, New York', code: 'YB-NYC-03' },
  { id: 'b4', name: 'London Precision Plant', location: 'Birmingham Foundry Row, UK', code: 'YB-LDN-04' }
];

export const initialLeads: Lead[] = [
  {
    id: 'l1',
    name: 'Devendra Jhanwar',
    company: 'Rajputana Royal Jewelers',
    email: 'devendra@rajputanajewels.com',
    phone: '+91 98290 12345',
    status: 'Negotiation',
    value: 85000,
    sector: 'Jewellery',
    assignedTo: 'Ashok Mahajan',
    communicationHistory: [
      { date: '2026-05-28', type: 'Inquiry', summary: 'Requested custom catalog for 22K polki bridal sets' },
      { date: '2026-05-30', type: 'Call', summary: 'Discussed metal weight margins and labor wastage percentage' }
    ],
    createdAt: '2026-05-27'
  },
  {
    id: 'l2',
    name: 'Aarav Sharma',
    company: 'Hindustan Aero Engines',
    email: 'asharma@hindustanaero.com',
    phone: '+91 90045 12345',
    status: 'Lead In',
    value: 340000,
    sector: 'Manufacturing',
    assignedTo: 'Shreya Patra',
    communicationHistory: [
      { date: '2026-06-01', type: 'Inquiry', summary: 'Submitted technical blueprints for custom fuel nozzle casting' }
    ],
    createdAt: '2026-06-01'
  },
  {
    id: 'l3',
    name: 'Vikram Malhotra',
    company: 'Taj Spice Traders',
    email: 'v.malhotra@tajspicetraders.in',
    phone: '+91 91122 33445',
    status: 'Contacted',
    sector: 'Trading',
    value: 120000,
    assignedTo: 'Sultan Khan',
    communicationHistory: [
      { date: '2026-05-25', type: 'Email', summary: 'Expressed interest in seasonal organic saffron container rates' },
      { date: '2026-05-29', type: 'Meeting', summary: 'Finalized shipping timelines to Rotterdam port' }
    ],
    createdAt: '2026-05-24'
  },
  {
    id: 'l4',
    name: 'Kabir Sen',
    company: 'Narmada Wellness Dist',
    email: 'sales@narmadawellness.com',
    phone: '+91 99887 76655',
    status: 'Closed Won',
    value: 45000,
    sector: 'Distribution',
    assignedTo: 'Sakshi Shaw',
    communicationHistory: [
      { date: '2026-05-15', type: 'Inquiry', summary: 'Bulk pricing request for organic soap bases' },
      { date: '2026-05-18', type: 'Email', summary: 'Finalized tiered wholesale contract margins' }
    ],
    createdAt: '2026-05-15'
  },
  {
    id: 'l5',
    name: 'Rajesh Verma',
    company: 'Prism Bharat Wholesale',
    email: 'rajesh@prismbharat.com',
    phone: '+91 94567 12345',
    status: 'Closed Lost',
    value: 65000,
    sector: 'Wholesale',
    assignedTo: 'Shreya Patra',
    communicationHistory: [
      { date: '2026-05-10', type: 'Email', summary: 'Quoted shipping rate parameters from New York warehouse.' },
      { date: '2026-05-16', type: 'Call', summary: 'Client opted for regional German supplier due to currency fees.' }
    ],
    createdAt: '2026-05-09'
  }
];

export const initialDeals: Deal[] = [
  {
    id: 'd1',
    title: 'Polki Gold Sets Order',
    company: 'Rajputana Royal Jewelers',
    value: 85000,
    stage: 'Negotiation',
    probability: 75,
    expectedRevenue: 63750,
    forecastDate: '2026-07-15',
    sector: 'Jewellery'
  },
  {
    id: 'd2',
    title: 'Custom Casting Contract',
    company: 'Hindustan Aero Engines',
    value: 340000,
    stage: 'Proposal',
    probability: 40,
    expectedRevenue: 136000,
    forecastDate: '2026-10-01',
    sector: 'Manufacturing'
  },
  {
    id: 'd3',
    title: 'Drygoods Rotterdam Lot',
    company: 'Taj Spice Traders',
    value: 120000,
    stage: 'Discovery',
    probability: 20,
    expectedRevenue: 24000,
    forecastDate: '2026-09-10',
    sector: 'Trading'
  },
  {
    id: 'd4',
    title: 'Annual Soap Supply Lot',
    company: 'Narmada Wellness Dist',
    value: 45000,
    stage: 'Closed Won',
    probability: 100,
    expectedRevenue: 45005,
    forecastDate: '2026-06-15',
    sector: 'Distribution'
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: 'q1',
    quotationNumber: 'BOS-Q-26-0091',
    customerName: 'Devendra Jhanwar',
    companyName: 'Rajputana Royal Jewelers',
    email: 'devendra@rajputanajewels.com',
    date: '2026-05-31',
    items: [
      {
        description: '22K Gold Handcrafted Bridal Choker',
        quantity: 2,
        unitPrice: 32000,
        gramWeight: 450,
        karats: 22,
        lineTotal: 64000
      },
      {
        description: '24K Kundan Traditional Jhumkas',
        quantity: 3,
        unitPrice: 7000,
        gramWeight: 90,
        karats: 24,
        lineTotal: 21000
      }
    ],
    subtotal: 85000,
    taxPercent: 3,
    taxAmount: 2550,
    discountTotal: 2000,
    total: 85550,
    status: 'Sent',
    sector: 'Jewellery'
  },
  {
    id: 'q2',
    quotationNumber: 'BOS-Q-26-0158',
    customerName: 'Aarav Sharma',
    companyName: 'Hindustan Aero Engines',
    email: 'asharma@hindustanaero.com',
    date: '2026-06-02',
    items: [
      {
        description: 'Nickel-Alloy Precision Turbine Castings',
        quantity: 50,
        unitPrice: 6000,
        materialCost: 3500,
        laborCost: 1200,
        lineTotal: 300000
      },
      {
        description: 'Custom Tooling & Mold Configuration',
        quantity: 1,
        unitPrice: 40000,
        materialCost: 15000,
        laborCost: 20000,
        lineTotal: 40000
      }
    ],
    subtotal: 340000,
    taxPercent: 5,
    taxAmount: 17000,
    discountTotal: 10000,
    total: 347000,
    status: 'Draft',
    sector: 'Manufacturing'
  },
  {
    id: 'q3',
    quotationNumber: 'BOS-Q-26-0044',
    customerName: 'Kabir Sen',
    companyName: 'Narmada Wellness Dist',
    email: 'sales@narmadawellness.com',
    date: '2026-05-18',
    items: [
      {
        description: 'Organic Premium Soap Bases (Bulk Barrels)',
        quantity: 100,
        unitPrice: 500,
        multiTierDiscount: 10, // 10% wholesale volume discount
        lineTotal: 45000
      }
    ],
    subtotal: 50000,
    taxPercent: 0,
    taxAmount: 0,
    discountTotal: 5000,
    total: 45000,
    status: 'Approved',
    sector: 'Distribution'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'i1',
    invoiceNumber: 'BOS-INV-26-4402',
    originalQuotationId: 'q3',
    customerName: 'Kabir Sen',
    companyName: 'Narmada Wellness Dist',
    date: '2026-05-20',
    dueDate: '2026-06-20',
    items: [
      { description: 'Organic Premium Soap Bases (Bulk Barrels)', quantity: 100, unitPrice: 450, lineTotal: 45000 }
    ],
    subtotal: 45000,
    taxAmount: 0,
    total: 45000,
    paymentReceived: 45000,
    outstandingAmount: 0,
    status: 'Paid'
  },
  {
    id: 'i2',
    invoiceNumber: 'BOS-INV-26-4510',
    customerName: 'Kiran Jaiswal',
    companyName: 'Zaveri Jewels',
    date: '2026-05-10',
    dueDate: '2026-06-01',
    items: [
      { description: 'Polished Solitaire Loose Diamonds (0.5ct G/VVS1)', quantity: 10, unitPrice: 3200, lineTotal: 32000 }
    ],
    subtotal: 32000,
    taxAmount: 960,
    total: 32960,
    paymentReceived: 10000,
    outstandingAmount: 22960,
    status: 'Unpaid'
  },
  {
    id: 'i3',
    invoiceNumber: 'BOS-INV-26-4190',
    customerName: 'Vikram Malhotra',
    companyName: 'Taj Spice Traders',
    date: '2026-04-12',
    dueDate: '2026-05-12',
    items: [
      { description: 'Iranian Saffron Grade A (Premium Lot)', quantity: 12, unitPrice: 4500, lineTotal: 54000 }
    ],
    subtotal: 54000,
    taxAmount: 2700,
    total: 56700,
    paymentReceived: 0,
    outstandingAmount: 56700,
    status: 'Overdue'
  }
];

export const initialTasks: Task[] = [
  {
    id: 't1',
    title: 'Metal Rate Validation & Quote',
    type: 'Follow-up',
    clientName: 'Devendra Jhanwar',
    dateTime: '2026-06-03T11:00',
    description: 'Verify Gold daily spot price (MCX India indexes) and finalize bridal choker estimate.',
    completed: false,
    assignedTo: 'Ashok Mahajan',
    priority: 'High'
  },
  {
    id: 't2',
    title: 'Blueprints Signoff Call',
    type: 'Meeting',
    clientName: 'Aarav Sharma',
    dateTime: '2026-06-04T15:30',
    description: 'Review casting wall tolerances and metallurgical chemical certificate requirements.',
    completed: false,
    assignedTo: 'Shreya Patra',
    priority: 'High'
  },
  {
    id: 't3',
    title: 'Port Clearance Verification',
    type: 'Reminder',
    clientName: 'Vikram Malhotra',
    dateTime: '2026-06-06T09:00',
    description: 'Confirm customs broker files are complete for Rotterdam seaport container arrival.',
    completed: true,
    assignedTo: 'Sultan Khan',
    priority: 'Medium'
  }
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: 'r1',
    title: 'Auto-Assign Jewellery Leads',
    triggerEvent: 'On Lead In (Sector: Jewellery)',
    actionEffect: 'Assign to Ashok Mahajan',
    isActive: true,
    description: 'Sends jewellery-related leads to Ashok Mahajan automatically.'
  },
  {
    id: 'r2',
    title: 'Auto-Task for Blueprints',
    triggerEvent: 'On Lead In (Sector: Manufacturing)',
    actionEffect: 'Create "Validate technical blueprints" task',
    isActive: true,
    description: 'Creates a review task when a customer uploads blueprints.'
  },
  {
    id: 'r3',
    title: 'Overdue Invoice Reminder',
    triggerEvent: 'On Overdue Status (Invoice)',
    actionEffect: 'Send reminder email',
    isActive: false,
    description: 'Sends a friendly payment reminder email for unpaid invoices.'
  }
];

// Rebranded Marketing assets for Landing View
export const bosProducts = [
  {
    id: 'leads',
    title: 'Customer & Lead Pipeline',
    subtitle: 'Track Leads from Start to Finish',
    description: 'Track customer messages, deal progress, and team assignments in one simple place.',
    keyFeatures: ['Lead communications history', 'Auto-lead assignment', 'Easy conversion rates']
  },
  {
    id: 'quote',
    title: 'Quotes & Estimates',
    subtitle: 'Create Quick, Correct Estimates',
    description: 'Create simple or detailed cost estimates for jewelry weight, raw materials, or wholesale bulk orders.',
    keyFeatures: ['Material cost calculators', 'Labor & raw materials lists', 'Custom bulk pricing']
  },
  {
    id: 'invoices',
    title: 'Invoices & Payments',
    subtitle: 'Quick Invoicing & Tracking',
    description: 'Create invoices, record payments, calculate taxes, and find unpaid bills automatically.',
    keyFeatures: ['Turn quotes into invoices', 'Payment due reminders', 'Tax & price calculations']
  },
  {
    id: 'branches',
    title: 'Multi-Branch Hub',
    subtitle: 'Manage All Locations',
    description: 'Switch between your branches easily. View sales, tasks, and notifications for each location.',
    keyFeatures: ['Branch-wise reports', 'Branch switching', 'Workplace summaries']
  },
  {
    id: 'ai_ops',
    title: 'AI Insights',
    subtitle: 'Useful AI Suggestions',
    description: 'Use Gemini AI to forecast sales trends, draft emails, and detect customer risk instantly.',
    keyFeatures: ['Smart sales trend forecasting', 'AI-drafted email templates', 'Customer risk scoring']
  }
];

export const whyBOSFeatures = [
  {
    title: 'All Business Tools in One Place',
    description: 'Combine your CRM, quotes, invoices, and tasks into one simple system instead of using many different apps.'
  },
  {
    title: 'Built for Your Industry',
    description: 'Whether you track gold by grams or materials by list, find tools tailored for jewellery, factories, trading, or wholesale.'
  },
  {
    title: 'Smart AI Features',
    description: 'Get help from built-in Gemini AI to write customer emails, predict sales, and suggest next steps safely.'
  },
  {
    title: 'Clear Permissions & Security',
    description: 'Keep your business data safe by deciding which staff members can see invoices, leads, or admin settings.'
  }
];

export const faqItems = [
  {
    question: 'How does the system calculate prices for jewelry and manufacturing?',
    answer: 'We have simple forms for different business types. For jewellery, you can enter gold karats and weights to get a price. For manufacturing, you can list labor and parts costs directly in the quote.'
  },
  {
    question: 'Is my customer data safe?',
    answer: 'Yes. Your data is stored securely. AI suggestions are processed privately and your data is never shared with third parties.'
  },
  {
    question: 'Can I manage more than one branch?',
    answer: 'Yes. You can add multiple locations and use the branch dropdown in the header to switch between them instantly. Each branch has its own dashboard and data.'
  },
  {
    question: 'How does the AI assistant work?',
    answer: 'The system uses Gemini AI to look at your sales trends, draft replies to customers, and forecast future revenue with a single click, saving you time.'
  }
];
