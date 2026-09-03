export interface ModuleData {
  id: string;
  code: string;
  title: string;
  shortDescription: string;
  overview: string;
  capabilities: string[];
  icon: string;
  orbitPos?: { top: string; left: string };
}

export interface FlowNode {
  id: string;
  step: string;
  title: string;
  icon: string;
}

export interface BenefitCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const MODULES_DATA: ModuleData[] = [
  {
    id: 'fico',
    code: 'FICO',
    title: 'Finance & Accounting',
    shortDescription: 'Manage financial transactions, GL, AR/AP, budgets and reports.',
    overview: 'Streamline your enterprise financial management with connected accounting workflows, automated ledgers, real-time balance sheets, and tax compliance.',
    capabilities: [
      'General Ledger (GL) Management',
      'Accounts Payable & Receivable (AP/AR)',
      'Automated Financial Reporting & Balance Sheets',
      'Budget Planning & Variance Analysis',
      'Multi-Currency & Tax Compliance',
      'Bank Reconciliation Engine',
    ],
    icon: 'bar-chart',
    orbitPos: { top: '2%', left: '50%' },
  },
  {
    id: 'mm',
    code: 'MM',
    title: 'Materials Management',
    shortDescription: 'Handle purchases, inventory, warehouses and material movement.',
    overview: 'Gain end-to-end visibility over inventory stock, automated purchase requisitions, warehouse logistics, and batch tracking.',
    capabilities: [
      'Real-Time Inventory & Stock Valuation',
      'Automated Purchase Orders & Requisitions',
      'Multi-Warehouse Logistics & Transfer',
      'Goods Receipt & Inspection Workflows',
      'Batch, Serial & Barcode Tracking',
      'Vendor Performance Analytics',
    ],
    icon: 'package',
    orbitPos: { top: '22%', left: '86%' },
  },
  {
    id: 'crm',
    code: 'CRM',
    title: 'Customer Management',
    shortDescription: 'Manage leads, customers, follow-ups and build stronger relationships.',
    overview: 'Empower your sales and support teams with unified customer profiles, lead pipelines, interaction history, and automated follow-ups.',
    capabilities: [
      'Unified 360° Customer Profiles',
      'Lead Acquisition & Deal Pipeline Tracking',
      'Automated Task & Activity Reminders',
      'Customer Support Ticket System',
      'Email & WhatsApp Communication Logs',
      'Customer Retention & LTV Metrics',
    ],
    icon: 'users',
    orbitPos: { top: '22%', left: '14%' },
  },
  {
    id: 'sales',
    code: 'SALES',
    title: 'Sales & Order Management',
    shortDescription: 'Create orders, manage deliveries, track sales and returns efficiently.',
    overview: 'Accelerate order processing from quotation creation to delivery dispatch, invoicing, and revenue recognition.',
    capabilities: [
      'Quotation & Sales Order Generation',
      'Automated Delivery Notes & Packing Slips',
      'Real-Time Order Status & Dispatch',
      'Sales Return & Credit Note Handling',
      'Commission & Sales Representative Tracking',
      'Dynamic Pricing Rules & Discounts',
    ],
    icon: 'shopping-cart',
    orbitPos: { top: '72%', left: '14%' },
  },
  {
    id: 'billing',
    code: 'BILLING',
    title: 'Billing & Invoicing',
    shortDescription: 'Create, manage and automate invoices, quotes, recurring billing and more.',
    overview: 'Automate multi-currency invoicing, GST/tax calculations, PDF invoice generation, and recurring customer billing schedules.',
    capabilities: [
      'Automated PDF Invoice Generation',
      'GST & Multi-Tax Calculation',
      'Razorpay Payment Link Integration',
      'Custom Invoice Template Customization',
      'Proforma Invoices & Quotations',
      'Recurring Subscription Billing',
    ],
    icon: 'file-text',
    orbitPos: { top: '72%', left: '86%' },
  },
  {
    id: 'payments',
    code: 'PAYMENTS',
    title: 'Payments & Reconciliation',
    shortDescription: 'Manage payments, razorpay links, webhooks and reconciliation.',
    overview: 'Seamlessly capture customer payments via instant payment links, auto-verify webhooks, and reconcile incoming transactions.',
    capabilities: [
      'Instant Razorpay Payment Links',
      'Automated Payment Webhook Listener',
      'Partial Payment & Deposit Handling',
      'Automated Bank & Ledger Reconciliation',
      'Payment Failure Auto-Retry Notifications',
      'Transaction Fee & Settlement Reports',
    ],
    icon: 'wallet',
    orbitPos: { top: '94%', left: '50%' },
  },
];

export const CONNECTED_FLOW_NODES: FlowNode[] = [
  { id: 'lead', step: '01', title: 'Lead', icon: 'user-plus' },
  { id: 'order', step: '02', title: 'Order', icon: 'shopping-bag' },
  { id: 'delivery', step: '03', title: 'Delivery', icon: 'truck' },
  { id: 'invoice', step: '04', title: 'Invoice', icon: 'file-spreadsheet' },
  { id: 'payment', step: '05', title: 'Payment', icon: 'credit-card' },
  { id: 'accounting', step: '06', title: 'Accounting', icon: 'calculator' },
  { id: 'analytics', step: '07', title: 'Analytics', icon: 'pie-chart' },
];

export const BENEFITS_DATA: BenefitCard[] = [
  {
    id: 'secure',
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee.',
    icon: 'shield-check',
  },
  {
    id: 'scalable',
    title: 'Scalable for Growth',
    description: 'Built to scale with your business from startup to enterprise.',
    icon: 'trending-up',
  },
  {
    id: 'support',
    title: 'Support You Can Trust',
    description: 'Our expert team is always here to help you succeed.',
    icon: 'headphones',
  },
];
