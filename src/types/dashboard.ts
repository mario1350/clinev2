export interface Lead {
  id: string;
  // Contact Information
  name: string;
  email: string;
  phone: string;
  street_address: string;
  postal_address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  
  // Personal Information
  date_of_birth: Date;
  
  // Financial Information
  monthly_income: number;
  
  // Identity Information
  id_type: 'license' | 'realId';
  id_number: string;
  id_expiration: Date;
  ssn: string;
  
  // Payment Information
  payment_method: 'cash' | 'credit' | 'financed';
  financing_option?: 'sanBlas' | 'caribeFederal';
  
  // Status Information
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'archived';
  created_at: Date;
  last_contact: Date;
}