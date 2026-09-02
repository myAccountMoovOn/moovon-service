export interface ServiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ContactInfoCard {
  id: string;
  type: 'email' | 'phone' | 'location';
  title: string;
  value: string;
  link: string;
  icon: string;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'billing',
    label: 'Billing & Subscription',
    description: 'Manage invoices, payments and subscriptions.',
    icon: 'document',
  },
  {
    id: 'it_software',
    label: 'IT & Software',
    description: 'Web, mobile and custom digital solutions.',
    icon: 'code',
  },
  {
    id: 'digital_marketing',
    label: 'Digital Marketing',
    description: 'Build your digital presence and drive growth.',
    icon: 'megaphone',
  },
  {
    id: 'graphic_design',
    label: 'Graphic Design',
    description: 'Branding, UI/UX and creative design.',
    icon: 'pen',
  },
  {
    id: 'other',
    label: 'Other Inquiries',
    description: 'General questions and custom requests.',
    icon: 'sparkles',
  },
];

export const DIRECT_CONTACT_CARDS: ContactInfoCard[] = [
  {
    id: 'email',
    type: 'email',
    title: 'EMAIL',
    value: 'hello@moovon.in',
    link: 'mailto:hello@moovon.in',
    icon: 'mail',
  },
  {
    id: 'phone',
    type: 'phone',
    title: 'PHONE',
    value: '+91 XXXXX XXXXX',
    link: 'tel:+919999999999',
    icon: 'phone',
  },
  {
    id: 'location',
    type: 'location',
    title: 'LOCATION',
    value: 'Bhubaneswar, India',
    link: 'https://maps.google.com/?q=Bhubaneswar,India',
    icon: 'map-pin',
  },
];

export const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
  { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
];
