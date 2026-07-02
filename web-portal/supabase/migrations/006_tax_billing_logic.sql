-- ============================================================
-- TAX BILLING LOGIC — Cameroon Tax Law (Buea Municipality)
-- Calculation functions, auto-triggers, receipt generation
-- ============================================================

-- ============================================================
-- 1. TAX CALCULATION FUNCTIONS
-- ============================================================

-- VAT: 19.25% of taxable revenue
CREATE OR REPLACE FUNCTION calculate_vat(p_revenue NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_revenue * 0.1925, 0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- CIT: 33% of corporate profit
CREATE OR REPLACE FUNCTION calculate_cit(p_profit NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_profit * 0.33, 0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- PIT: Progressive rate (Cameroon brackets)
-- 0 - 2,000,000: 11%
-- 2,000,001 - 3,000,000: 16.5%
-- 3,000,001 - 5,000,000: 27.5%
-- 5,000,001+: 35%
CREATE OR REPLACE FUNCTION calculate_pit(p_income NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  v_tax NUMERIC := 0;
  v_remaining NUMERIC := p_income;
BEGIN
  IF v_remaining <= 0 THEN RETURN 0; END IF;

  -- Bracket 1: 0 - 2M at 11%
  IF v_remaining > 2000000 THEN
    v_tax := v_tax + (2000000 * 0.11);
    v_remaining := v_remaining - 2000000;
  ELSE
    RETURN ROUND(v_remaining * 0.11, 0);
  END IF;

  -- Bracket 2: 2M - 3M at 16.5%
  IF v_remaining > 1000000 THEN
    v_tax := v_tax + (1000000 * 0.165);
    v_remaining := v_remaining - 1000000;
  ELSE
    RETURN ROUND(v_tax + (v_remaining * 0.165), 0);
  END IF;

  -- Bracket 3: 3M - 5M at 27.5%
  IF v_remaining > 2000000 THEN
    v_tax := v_tax + (2000000 * 0.275);
    v_remaining := v_remaining - 2000000;
  ELSE
    RETURN ROUND(v_tax + (v_remaining * 0.275), 0);
  END IF;

  -- Bracket 4: 5M+ at 35%
  v_tax := v_tax + (v_remaining * 0.35);
  RETURN ROUND(v_tax, 0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Patente (Business License): Fixed fee by business category
CREATE OR REPLACE FUNCTION calculate_patente(p_category TEXT)
RETURNS NUMERIC AS $$
BEGIN
  CASE p_category
    WHEN 'small' THEN RETURN 50000;
    WHEN 'medium' THEN RETURN 150000;
    WHEN 'large' THEN RETURN 350000;
    ELSE RETURN 50000;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Property Tax: 0.5% of property value
CREATE OR REPLACE FUNCTION calculate_property_tax(p_value NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(p_value * 0.005, 0);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Late Payment Penalty: 10% flat + 1.5% per month overdue
CREATE OR REPLACE FUNCTION calculate_penalty(p_amount NUMERIC, p_days_overdue INTEGER)
RETURNS NUMERIC AS $$
DECLARE
  v_months INTEGER;
  v_penalty NUMERIC;
BEGIN
  IF p_days_overdue <= 0 THEN RETURN 0; END IF;
  v_months := GREATEST(1, CEIL(p_days_overdue / 30.0));
  v_penalty := ROUND(p_amount * 0.10, 0); -- 10% flat
  v_penalty := v_penalty + ROUND(p_amount * 0.015 * v_months, 0); -- 1.5% per month
  RETURN v_penalty;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Master calculator: routes to the correct function by tax type
CREATE OR REPLACE FUNCTION calculate_tax(p_tax_type TEXT, p_taxable_amount NUMERIC, p_category TEXT DEFAULT 'small')
RETURNS NUMERIC AS $$
BEGIN
  CASE p_tax_type
    WHEN 'VAT' THEN RETURN calculate_vat(p_taxable_amount);
    WHEN 'CIT' THEN RETURN calculate_cit(p_taxable_amount);
    WHEN 'PIT' THEN RETURN calculate_pit(p_taxable_amount);
    WHEN 'BLT' THEN RETURN calculate_patente(p_category);
    WHEN 'PT' THEN RETURN calculate_property_tax(p_taxable_amount);
    ELSE RETURN ROUND(p_taxable_amount * 0.1925, 0); -- default to VAT rate
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- 2. AUTO-GENERATE ASSESSMENT + INVOICE
-- ============================================================

CREATE OR REPLACE FUNCTION create_assessment_with_invoice(
  p_taxpayer_id UUID,
  p_tax_type TEXT,
  p_period TEXT,
  p_taxable_amount NUMERIC,
  p_business_category TEXT DEFAULT 'small',
  p_assessed_by UUID DEFAULT NULL,
  p_due_date DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_assessment_id UUID;
  v_invoice_id UUID;
  v_tax_amount NUMERIC;
  v_taxpayer_name TEXT;
  v_business_name TEXT;
  v_ref_number TEXT;
  v_inv_number TEXT;
  v_actual_due DATE;
BEGIN
  -- Calculate tax
  v_tax_amount := calculate_tax(p_tax_type, p_taxable_amount, p_business_category);

  -- Get taxpayer info
  SELECT name, COALESCE(business_name, name) INTO v_taxpayer_name, v_business_name
  FROM taxpayers WHERE id = p_taxpayer_id;

  -- Generate reference numbers
  v_ref_number := 'ASS-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || LPAD((FLOOR(RANDOM() * 999999))::TEXT, 6, '0');
  v_inv_number := 'INV-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || LPAD((FLOOR(RANDOM() * 999999))::TEXT, 6, '0');

  -- Default due date: 30 days from now
  v_actual_due := COALESCE(p_due_date, CURRENT_DATE + INTERVAL '30 days');

  -- Create assessment
  INSERT INTO assessments (
    id, taxpayer_id, business_name, reference_number, description,
    tax_type, amount, amount_paid, period, status,
    assessed_by, assessment_date, due_date
  ) VALUES (
    uuid_generate_v4(), p_taxpayer_id, v_business_name, v_ref_number,
    p_tax_type || ' Assessment - ' || p_period,
    p_tax_type, v_tax_amount, 0, p_period, 'unpaid',
    p_assessed_by, CURRENT_DATE, v_actual_due
  ) RETURNING id INTO v_assessment_id;

  -- Create invoice with line items
  INSERT INTO invoices (
    id, invoice_number, taxpayer_id, taxpayer_name,
    amount, due_date, created_date, status
  ) VALUES (
    uuid_generate_v4(), v_inv_number, p_taxpayer_id, v_taxpayer_name,
    v_tax_amount, v_actual_due, CURRENT_DATE, 'unpaid'
  ) RETURNING id INTO v_invoice_id;

  -- Invoice line item: main tax
  INSERT INTO invoice_items (invoice_id, description, amount)
  VALUES (v_invoice_id, p_tax_type || ' - ' || p_period || ' (Base: ' || p_taxable_amount::TEXT || ' FCFA × rate)', v_tax_amount);

  -- Update taxpayer outstanding amount
  UPDATE taxpayers
  SET outstanding_amount = COALESCE(outstanding_amount, 0) + v_tax_amount
  WHERE id = p_taxpayer_id;

  RETURN v_assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. PAYMENT TRIGGERS — Auto receipt + assessment sync
-- ============================================================

-- When a payment is inserted with status 'completed':
-- 1. Auto-generate a receipt
-- 2. Update the linked assessment's amount_paid and status
-- 3. Recalculate taxpayer outstanding_amount
CREATE OR REPLACE FUNCTION on_payment_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_receipt_num TEXT;
  v_tp_name TEXT;
  v_assessment_amount NUMERIC;
  v_new_paid NUMERIC;
BEGIN
  -- Only trigger for completed/confirmed payments
  IF NEW.status NOT IN ('completed', 'confirmed') THEN
    RETURN NEW;
  END IF;

  -- Generate receipt
  v_receipt_num := 'RCP-' || EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || LPAD((FLOOR(RANDOM() * 999999))::TEXT, 6, '0');

  SELECT COALESCE(name, '') INTO v_tp_name FROM taxpayers WHERE id = NEW.taxpayer_id;

  BEGIN
    INSERT INTO receipts (payment_id, receipt_number, business_name, amount, date, tax_period, tax_type, qr_code, verified)
    VALUES (
      NEW.id,
      v_receipt_num,
      v_tp_name,
      NEW.amount,
      CURRENT_DATE,
      COALESCE((SELECT period FROM assessments WHERE id = NEW.assessment_id), 'N/A'),
      NEW.tax_type,
      'QR-' || v_receipt_num || '-' || LEFT(NEW.id::TEXT, 8),
      true
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Receipt creation failed: %', SQLERRM;
  END;

  -- Update receipt_number on the payment itself
  NEW.receipt_number := v_receipt_num;

  -- If linked to an assessment, update it
  IF NEW.assessment_id IS NOT NULL THEN
    -- Get current assessment
    SELECT amount INTO v_assessment_amount FROM assessments WHERE id = NEW.assessment_id;

    IF v_assessment_amount IS NOT NULL THEN
      -- Add payment to amount_paid
      UPDATE assessments
      SET amount_paid = COALESCE(amount_paid, 0) + NEW.amount,
          status = CASE
            WHEN (COALESCE(amount_paid, 0) + NEW.amount) >= amount THEN 'paid'::assessment_status
            WHEN (COALESCE(amount_paid, 0) + NEW.amount) > 0 THEN 'partial'::assessment_status
            ELSE status
          END
      WHERE id = NEW.assessment_id;

      -- Update linked invoice status too
      UPDATE invoices
      SET status = CASE
        WHEN (SELECT amount_paid FROM assessments WHERE id = NEW.assessment_id) >= v_assessment_amount THEN 'paid'::invoice_status
        ELSE status
      END
      WHERE taxpayer_id = NEW.taxpayer_id
        AND amount = v_assessment_amount
        AND status = 'unpaid';
    END IF;
  END IF;

  -- Recalculate taxpayer outstanding amount
  UPDATE taxpayers
  SET outstanding_amount = GREATEST(0, COALESCE(outstanding_amount, 0) - NEW.amount)
  WHERE id = NEW.taxpayer_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'on_payment_completed failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on payment insert
DROP TRIGGER IF EXISTS tr_payment_completed ON payments;
CREATE TRIGGER tr_payment_completed
  BEFORE INSERT ON payments
  FOR EACH ROW
  WHEN (NEW.status IN ('completed', 'confirmed'))
  EXECUTE FUNCTION on_payment_completed();

-- Also trigger when payment status is UPDATED to completed
CREATE OR REPLACE FUNCTION on_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'completed' AND NEW.status IN ('completed', 'confirmed') THEN
    -- Generate receipt for newly completed payment
    PERFORM on_payment_completed();
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. OVERDUE CHECK FUNCTION
-- ============================================================

-- Call periodically or on-demand to mark overdue assessments
CREATE OR REPLACE FUNCTION check_overdue_assessments()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE assessments
  SET status = 'overdue'
  WHERE status IN ('unpaid', 'pending', 'approved')
    AND due_date < CURRENT_DATE
    AND amount_paid < amount;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. DISPUTE LINKING — Add assessment_id to support_tickets
-- ============================================================

-- Add column for linking disputes to specific assessments
DO $$ BEGIN
  ALTER TABLE support_tickets ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES assessments(id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================================
-- 6. GRANT EXECUTE TO AUTHENTICATED USERS
-- ============================================================

GRANT EXECUTE ON FUNCTION calculate_tax TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_vat TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_cit TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_pit TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_patente TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_property_tax TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_penalty TO authenticated;
GRANT EXECUTE ON FUNCTION create_assessment_with_invoice TO authenticated;
GRANT EXECUTE ON FUNCTION check_overdue_assessments TO authenticated;
