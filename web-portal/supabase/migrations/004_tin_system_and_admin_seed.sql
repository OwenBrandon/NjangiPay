-- ============================================================
-- PRE-REGISTERED TIN SYSTEM + ADMIN ACCOUNT SETUP
-- ============================================================

-- 1. Pre-Registered TINs table
-- TINs are issued by the tax office FIRST, then taxpayers
-- use their assigned TIN to create an account.

CREATE TABLE pre_registered_tins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tin TEXT UNIQUE NOT NULL,
  taxpayer_name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT,
  region TEXT NOT NULL DEFAULT 'Southwest (Sud-Ouest)',
  status TEXT NOT NULL DEFAULT 'available', -- available, claimed, expired
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pre_tins_tin ON pre_registered_tins(tin);
CREATE INDEX idx_pre_tins_status ON pre_registered_tins(status);

-- RLS: public can check if a TIN exists, staff can manage
ALTER TABLE pre_registered_tins ENABLE ROW LEVEL SECURITY;

CREATE POLICY pre_tins_public_read ON pre_registered_tins
  FOR SELECT USING (true);

CREATE POLICY pre_tins_staff_write ON pre_registered_tins
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND role IN ('super_admin', 'tax_admin'))
  );

-- Function to validate and claim a TIN during registration
CREATE OR REPLACE FUNCTION claim_tin(p_tin TEXT, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pre_registered_tins WHERE tin = p_tin AND status = 'available'
  ) INTO v_exists;

  IF v_exists THEN
    UPDATE pre_registered_tins
    SET status = 'claimed', claimed_by = p_user_id, claimed_at = now()
    WHERE tin = p_tin AND status = 'available';
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Seed pre-registered TINs for Buea Municipality
INSERT INTO pre_registered_tins (tin, taxpayer_name, business_name, phone, region) VALUES
  ('TIN-2026-0001', 'Jean-Pierre Mbarga', 'Ets Mbarga Commerce Général', '+237 699 123 456', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0002', 'Françoise Ngo Biyack', 'Boutique Chez Françoise', '+237 677 234 567', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0003', 'Emmanuel Tchoupo', 'Tchoupo Construction SARL', '+237 655 345 678', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0004', 'Aïssatou Saidou', 'Cabinet Saidou Consulting', '+237 690 456 789', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0005', 'Paul-Henri Fotso', 'Fotso Industries SA', '+237 670 567 890', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0006', 'Sandrine Ekotto', 'Ekotto Tech Solutions', '+237 681 678 901', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0007', 'Marcel Nkeng', 'Nkeng Transport & Logistics', '+237 674 111 222', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0008', 'Hélène Tabi', 'Pharmacie Sainte Hélène', '+237 692 333 444', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0009', 'Didier Ngono', 'Ngono Agro-Business', '+237 655 555 666', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0010', 'Claudine Essama', 'Essama Fashion & Design', '+237 678 777 888', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0011', 'Félix Njoya', 'Njoya Hardware Store', '+237 699 888 999', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0012', 'Berthe Ndam', 'Hotel Ndam Palace', '+237 677 100 200', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0013', 'Gustave Mbi', 'Mbi & Sons Building Materials', '+237 691 300 400', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0014', 'Rose Ekane', 'Restaurant Le Délice', '+237 656 500 600', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0015', 'Thierry Ngwa', 'Ngwa Electronics Repair', '+237 670 700 800', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0016', 'Patricia Fon', 'Fon Beauty Salon', '+237 681 900 100', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0017', 'Alain Taku', 'Taku Printing Press', '+237 674 200 300', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0018', 'Viviane Che', 'Che Supermarket', '+237 692 400 500', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0019', 'Bertrand Wani', 'Wani Auto Parts', '+237 655 600 700', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0020', 'Elise Tabi', 'Tabi Tailoring Workshop', '+237 678 800 900', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0021', 'Raymond Shu', 'Shu Bakery & Pastries', '+237 699 100 300', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0022', 'Florence Ashu', 'Ashu Legal Services', '+237 677 400 600', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0023', 'Michel Enow', 'Enow Fishing Enterprise', '+237 691 700 900', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0024', 'Isabelle Mbu', 'Mbu Day Care Centre', '+237 656 200 400', 'Southwest (Sud-Ouest)'),
  ('TIN-2026-0025', 'Charles Ako', 'Ako Poultry Farm', '+237 670 500 700', 'Southwest (Sud-Ouest)');

-- 3. Staff/Admin accounts seeding function
-- This creates admin accounts that can be used to log in.
-- Run this ONCE after setting up the project.

CREATE OR REPLACE FUNCTION seed_admin_accounts()
RETURNS TEXT AS $$
DECLARE
  v_auth_id UUID;
  v_count INTEGER;
BEGIN
  -- Check if admins already exist
  SELECT COUNT(*) INTO v_count FROM users WHERE role = 'super_admin';
  IF v_count > 0 THEN
    RETURN 'Admin accounts already exist. Skipping seed.';
  END IF;

  -- NOTE: Admin accounts must be created via Supabase Auth Dashboard
  -- or via the service_role key. This function only creates the
  -- public.users rows AFTER the auth accounts exist.
  --
  -- INSTRUCTIONS:
  -- 1. Go to Supabase Dashboard → Authentication → Users
  -- 2. Click "Add User" for each admin:
  --    - admin@dgi.cm / Admin@2026! (super_admin)
  --    - taxadmin@dgi.cm / Admin@2026! (tax_admin)
  --    - accountant@dgi.cm / Admin@2026! (accountant)
  --    - auditor@dgi.cm / Admin@2026! (auditor)
  --    - support@dgi.cm / Admin@2026! (support_staff)
  --    - content@dgi.cm / Admin@2026! (content_manager)
  --    - officer@dgi.cm / Admin@2026! (field_officer)
  -- 3. The auth trigger will auto-create their users rows.
  -- 4. Then run the UPDATE statements below to set correct roles:

  RETURN 'Please create admin auth accounts via Supabase Dashboard first. See migration comments for instructions.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. After creating admin accounts in the Dashboard, run these
-- to set their correct roles (the trigger defaults to 'taxpayer'):
-- UPDATE users SET role = 'super_admin', name = 'Marie-Thérèse Atangana' WHERE email = 'admin@dgi.cm';
-- UPDATE users SET role = 'tax_admin', name = 'Pierre Nkoulou', region = 'Southwest (Sud-Ouest)' WHERE email = 'taxadmin@dgi.cm';
-- UPDATE users SET role = 'accountant', name = 'Cécile Manga' WHERE email = 'accountant@dgi.cm';
-- UPDATE users SET role = 'auditor', name = 'Jean-Baptiste Onana' WHERE email = 'auditor@dgi.cm';
-- UPDATE users SET role = 'support_staff', name = 'Nadège Meka' WHERE email = 'support@dgi.cm';
-- UPDATE users SET role = 'content_manager', name = 'Blaise Ndjock' WHERE email = 'content@dgi.cm';
-- UPDATE users SET role = 'field_officer', name = 'Hervé Biya', region = 'Buea Centre' WHERE email = 'officer@dgi.cm';

-- 5. Payment simulation table (transaction logs for the mock gateway)
CREATE TABLE payment_simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_id UUID REFERENCES payments(id),
  method TEXT NOT NULL, -- mobile_money, bank_transfer, card
  provider TEXT, -- MTN, Orange, Afriland, etc.
  phone_number TEXT, -- for mobile money
  account_number TEXT, -- for bank transfer
  card_last_four TEXT, -- for card payments
  otp_code TEXT, -- simulated OTP
  status TEXT NOT NULL DEFAULT 'initiated', -- initiated, otp_sent, processing, completed, failed
  amount NUMERIC(15,2) NOT NULL,
  transaction_ref TEXT UNIQUE,
  initiated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE payment_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY payment_sims_auth ON payment_simulations FOR ALL USING (auth.uid() IS NOT NULL);
