-- ============================================================
-- BUSINESS REGISTRATION FLOW
-- Change default status to 'pending' so new registrations
-- require admin approval before becoming active
-- ============================================================

-- Change default status from 'active' to 'pending'
ALTER TABLE businesses ALTER COLUMN status SET DEFAULT 'pending';

-- Ensure taxpayers can insert their own businesses
-- (The existing policy businesses_taxpayer_write covers INSERT,
--  but we need an UPDATE policy so admins can approve/reject)
CREATE POLICY businesses_admin_update ON businesses FOR UPDATE USING (
  get_user_role() IN ('super_admin', 'tax_admin', 'field_officer')
);

-- Allow taxpayers to see their pending businesses
-- (Already covered by businesses_self policy for SELECT)

-- ============================================================
-- GRANT: Allow authenticated users to read business types
-- ============================================================
