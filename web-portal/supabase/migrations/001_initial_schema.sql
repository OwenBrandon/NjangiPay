-- ============================================================
-- GRA TaxMS — Full Database Schema
-- Unified across: Web Portal, Taxpayer App, Field Officer App
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'super_admin', 'tax_admin', 'accountant', 'auditor',
  'support_staff', 'content_manager', 'taxpayer', 'field_officer'
);

CREATE TYPE taxpayer_status AS ENUM (
  'active', 'pending', 'suspended', 'inactive', 'in_review', 'defaulter'
);

CREATE TYPE business_type AS ENUM ('physical', 'virtual');

CREATE TYPE assessment_status AS ENUM (
  'pending', 'approved', 'unpaid', 'paid', 'overdue', 'partial', 'disputed'
);

CREATE TYPE payment_method AS ENUM (
  'bank_transfer', 'mobile_money', 'card', 'cash', 'pos', 'check'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'processing', 'completed', 'confirmed', 'failed', 'cancelled', 'refunded'
);

CREATE TYPE invoice_status AS ENUM ('unpaid', 'paid', 'overdue');

CREATE TYPE tax_return_status AS ENUM ('filed', 'not_filed', 'overdue', 'pending_review');

CREATE TYPE audit_case_status AS ENUM ('open', 'in_progress', 'closed', 'flagged');
CREATE TYPE audit_case_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE support_ticket_status AS ENUM (
  'open', 'in_progress', 'under_review', 'resolved', 'closed', 'rejected'
);
CREATE TYPE support_ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE inspection_purpose AS ENUM ('collection', 'inspection', 'verification', 'follow_up');
CREATE TYPE inspection_outcome AS ENUM ('successful', 'not_available', 'refused', 'rescheduled');
CREATE TYPE inspection_status AS ENUM ('completed', 'pending_review', 'approved');

CREATE TYPE article_status AS ENUM ('draft', 'published', 'scheduled', 'archived');

CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

CREATE TYPE filing_frequency AS ENUM ('monthly', 'quarterly', 'annually');

-- ============================================================
-- TABLES
-- ============================================================

-- Users (all roles including taxpayers and field officers)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'taxpayer',
  region TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Regions / Zones
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  tax_office TEXT NOT NULL,
  taxpayer_count INTEGER DEFAULT 0,
  revenue_target NUMERIC(15,2) DEFAULT 0,
  revenue_collected NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tax Types
CREATE TABLE tax_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  rate NUMERIC(5,2) NOT NULL,
  description TEXT,
  filing_frequency filing_frequency NOT NULL DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Taxpayers (the taxpayer profile — linked to a user)
CREATE TABLE taxpayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tin TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  region TEXT NOT NULL,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status taxpayer_status NOT NULL DEFAULT 'pending',
  qr_code TEXT,
  outstanding_amount NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses (1 taxpayer can own multiple businesses)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_type business_type NOT NULL DEFAULT 'physical',
  registration_number TEXT,
  tin TEXT,
  status taxpayer_status NOT NULL DEFAULT 'active',
  registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
  address TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Business Branches
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  is_headquarters BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Business Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT,
  uploaded_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Taxpayer Tax Types (many-to-many)
CREATE TABLE taxpayer_tax_types (
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id) ON DELETE CASCADE,
  tax_type_id UUID NOT NULL REFERENCES tax_types(id) ON DELETE CASCADE,
  PRIMARY KEY (taxpayer_id, tax_type_id)
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  business_name TEXT,
  reference_number TEXT UNIQUE NOT NULL,
  description TEXT,
  tax_type TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  amount_paid NUMERIC(15,2) DEFAULT 0,
  period TEXT NOT NULL,
  status assessment_status NOT NULL DEFAULT 'pending',
  assessed_by UUID REFERENCES users(id),
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  assessment_id UUID REFERENCES assessments(id),
  amount NUMERIC(15,2) NOT NULL,
  tax_type TEXT NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  transaction_ref TEXT UNIQUE,
  receipt_number TEXT,
  payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_time TEXT,
  reconciled_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Receipts
CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID NOT NULL REFERENCES payments(id),
  receipt_number TEXT UNIQUE NOT NULL,
  business_name TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tax_period TEXT NOT NULL,
  tax_type TEXT NOT NULL,
  qr_code TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  taxpayer_name TEXT,
  amount NUMERIC(15,2) NOT NULL,
  due_date DATE NOT NULL,
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status invoice_status NOT NULL DEFAULT 'unpaid',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice Items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL
);

-- Tax Returns
CREATE TABLE tax_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  period TEXT NOT NULL,
  tax_type TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  status tax_return_status NOT NULL DEFAULT 'not_filed',
  filing_date DATE,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Field Visits / Inspection Reports
CREATE TABLE field_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  officer_id UUID NOT NULL REFERENCES users(id),
  business_name TEXT NOT NULL,
  location TEXT NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_time TEXT,
  purpose inspection_purpose NOT NULL DEFAULT 'inspection',
  findings TEXT,
  violations TEXT[] DEFAULT '{}',
  outcome inspection_outcome NOT NULL DEFAULT 'successful',
  status inspection_status NOT NULL DEFAULT 'completed',
  notes TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Cases
CREATE TABLE audit_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taxpayer_id UUID NOT NULL REFERENCES taxpayers(id),
  case_number TEXT UNIQUE NOT NULL,
  status audit_case_status NOT NULL DEFAULT 'open',
  priority audit_case_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  opened_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closed_date DATE,
  findings TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support Tickets / Disputes
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  taxpayer_id UUID REFERENCES taxpayers(id),
  category TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status support_ticket_status NOT NULL DEFAULT 'open',
  priority support_ticket_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  created_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_date TIMESTAMPTZ,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support Ticket Responses
CREATE TABLE support_ticket_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_official BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id)
);

-- Articles (CMS)
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  status article_status NOT NULL DEFAULT 'draft',
  author TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  publish_date TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Article Categories
CREATE TABLE article_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'bg-blue-500',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- System Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  target_audience user_role,
  target_all BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_count INTEGER DEFAULT 0
);

-- User Notifications (read tracking)
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  UNIQUE(user_id, notification_id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL DEFAULT 'System',
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details TEXT,
  ip_address INET,
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fraud Reports
CREATE TABLE fraud_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  reported_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_taxpayers_tin ON taxpayers(tin);
CREATE INDEX idx_taxpayers_region ON taxpayers(region);
CREATE INDEX idx_taxpayers_status ON taxpayers(status);
CREATE INDEX idx_businesses_taxpayer ON businesses(taxpayer_id);
CREATE INDEX idx_assessments_taxpayer ON assessments(taxpayer_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_payments_taxpayer ON payments(taxpayer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_tax_returns_taxpayer ON tax_returns(taxpayer_id);
CREATE INDEX idx_field_visits_officer ON field_visits(officer_id);
CREATE INDEX idx_field_visits_taxpayer ON field_visits(taxpayer_id);
CREATE INDEX idx_audit_cases_taxpayer ON audit_cases(taxpayer_id);
CREATE INDEX idx_support_tickets_taxpayer ON support_tickets(taxpayer_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_taxpayers_updated_at BEFORE UPDATE ON taxpayers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_audit_cases_updated_at BEFORE UPDATE ON audit_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
