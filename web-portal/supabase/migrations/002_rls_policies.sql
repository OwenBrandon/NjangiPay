-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's internal ID
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
  SELECT id FROM users WHERE auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's taxpayer ID (if taxpayer)
CREATE OR REPLACE FUNCTION get_taxpayer_id()
RETURNS UUID AS $$
  SELECT t.id FROM taxpayers t
  JOIN users u ON u.id = t.user_id
  WHERE u.auth_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check if user is staff (any non-taxpayer role)
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM users
    WHERE auth_id = auth.uid()
    AND role != 'taxpayer'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxpayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS
-- ============================================================

-- Users can read their own profile
CREATE POLICY users_self_read ON users FOR SELECT USING (auth_id = auth.uid());
-- Staff can read all users
CREATE POLICY users_staff_read ON users FOR SELECT USING (is_staff());
-- Super admin can manage users
CREATE POLICY users_admin_write ON users FOR ALL USING (get_user_role() = 'super_admin');

-- ============================================================
-- REGIONS & TAX TYPES (public read, admin write)
-- ============================================================

CREATE POLICY regions_read ON regions FOR SELECT USING (true);
CREATE POLICY regions_admin_write ON regions FOR ALL USING (get_user_role() = 'super_admin');

CREATE POLICY tax_types_read ON tax_types FOR SELECT USING (true);
CREATE POLICY tax_types_admin_write ON tax_types FOR ALL USING (get_user_role() = 'super_admin');

-- ============================================================
-- TAXPAYERS
-- ============================================================

-- Taxpayers see their own record
CREATE POLICY taxpayers_self ON taxpayers FOR SELECT USING (user_id = get_user_id());
-- Staff can read all taxpayers
CREATE POLICY taxpayers_staff_read ON taxpayers FOR SELECT USING (is_staff());
-- Tax admin + super admin can write
CREATE POLICY taxpayers_admin_write ON taxpayers FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin')
);
-- Taxpayers can update their own profile
CREATE POLICY taxpayers_self_update ON taxpayers FOR UPDATE USING (user_id = get_user_id());

-- ============================================================
-- BUSINESSES (taxpayer sees own, staff sees all)
-- ============================================================

CREATE POLICY businesses_self ON businesses FOR SELECT USING (
  taxpayer_id = get_taxpayer_id()
);
CREATE POLICY businesses_staff ON businesses FOR SELECT USING (is_staff());
CREATE POLICY businesses_taxpayer_write ON businesses FOR INSERT WITH CHECK (
  taxpayer_id = get_taxpayer_id()
);
CREATE POLICY businesses_admin_write ON businesses FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin')
);

-- Branches & Documents follow business access
CREATE POLICY branches_read ON branches FOR SELECT USING (true);
CREATE POLICY documents_read ON documents FOR SELECT USING (true);

-- ============================================================
-- ASSESSMENTS
-- ============================================================

CREATE POLICY assessments_self ON assessments FOR SELECT USING (
  taxpayer_id = get_taxpayer_id()
);
CREATE POLICY assessments_staff_read ON assessments FOR SELECT USING (is_staff());
CREATE POLICY assessments_admin_write ON assessments FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin', 'accountant')
);

-- ============================================================
-- PAYMENTS & RECEIPTS
-- ============================================================

CREATE POLICY payments_self ON payments FOR SELECT USING (taxpayer_id = get_taxpayer_id());
CREATE POLICY payments_staff ON payments FOR SELECT USING (is_staff());
CREATE POLICY payments_taxpayer_insert ON payments FOR INSERT WITH CHECK (taxpayer_id = get_taxpayer_id());
CREATE POLICY payments_staff_write ON payments FOR ALL USING (
  get_user_role() IN ('super_admin', 'accountant', 'field_officer')
);

CREATE POLICY receipts_self ON receipts FOR SELECT USING (
  payment_id IN (SELECT id FROM payments WHERE taxpayer_id = get_taxpayer_id())
);
CREATE POLICY receipts_staff ON receipts FOR SELECT USING (is_staff());

-- ============================================================
-- INVOICES
-- ============================================================

CREATE POLICY invoices_self ON invoices FOR SELECT USING (taxpayer_id = get_taxpayer_id());
CREATE POLICY invoices_staff ON invoices FOR SELECT USING (is_staff());
CREATE POLICY invoices_officer_write ON invoices FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin', 'field_officer', 'accountant')
);

-- ============================================================
-- TAX RETURNS
-- ============================================================

CREATE POLICY tax_returns_self ON tax_returns FOR SELECT USING (taxpayer_id = get_taxpayer_id());
CREATE POLICY tax_returns_staff ON tax_returns FOR SELECT USING (is_staff());
CREATE POLICY tax_returns_taxpayer_insert ON tax_returns FOR INSERT WITH CHECK (taxpayer_id = get_taxpayer_id());
CREATE POLICY tax_returns_admin_write ON tax_returns FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin')
);

-- ============================================================
-- FIELD VISITS
-- ============================================================

CREATE POLICY field_visits_officer ON field_visits FOR SELECT USING (officer_id = get_user_id());
CREATE POLICY field_visits_staff ON field_visits FOR SELECT USING (is_staff());
CREATE POLICY field_visits_officer_write ON field_visits FOR INSERT WITH CHECK (
  get_user_role() IN ('field_officer', 'tax_admin')
);
CREATE POLICY field_visits_admin_write ON field_visits FOR ALL USING (
  get_user_role() IN ('super_admin', 'tax_admin')
);

-- ============================================================
-- AUDIT CASES
-- ============================================================

CREATE POLICY audit_cases_staff ON audit_cases FOR SELECT USING (is_staff());
CREATE POLICY audit_cases_auditor_write ON audit_cases FOR ALL USING (
  get_user_role() IN ('super_admin', 'auditor')
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================

CREATE POLICY tickets_self ON support_tickets FOR SELECT USING (taxpayer_id = get_taxpayer_id());
CREATE POLICY tickets_staff ON support_tickets FOR SELECT USING (is_staff());
CREATE POLICY tickets_taxpayer_insert ON support_tickets FOR INSERT WITH CHECK (taxpayer_id = get_taxpayer_id());
CREATE POLICY tickets_staff_write ON support_tickets FOR ALL USING (
  get_user_role() IN ('super_admin', 'support_staff')
);

CREATE POLICY ticket_responses_read ON support_ticket_responses FOR SELECT USING (true);
CREATE POLICY ticket_responses_write ON support_ticket_responses FOR INSERT WITH CHECK (
  get_user_role() IN ('super_admin', 'support_staff') OR
  (SELECT taxpayer_id FROM support_tickets WHERE id = ticket_id) = get_taxpayer_id()
);

-- ============================================================
-- ARTICLES (public read for published, staff manages)
-- ============================================================

CREATE POLICY articles_public ON articles FOR SELECT USING (status = 'published');
CREATE POLICY articles_staff_read ON articles FOR SELECT USING (is_staff());
CREATE POLICY articles_content_write ON articles FOR ALL USING (
  get_user_role() IN ('super_admin', 'content_manager')
);

CREATE POLICY article_categories_read ON article_categories FOR SELECT USING (true);
CREATE POLICY article_categories_write ON article_categories FOR ALL USING (
  get_user_role() IN ('super_admin', 'content_manager')
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE POLICY notifications_read ON notifications FOR SELECT USING (true);
CREATE POLICY notifications_admin_write ON notifications FOR ALL USING (
  get_user_role() = 'super_admin'
);

CREATE POLICY user_notifications_self ON user_notifications FOR SELECT USING (user_id = get_user_id());
CREATE POLICY user_notifications_self_update ON user_notifications FOR UPDATE USING (user_id = get_user_id());

-- ============================================================
-- AUDIT LOGS (read-only for admins, auto-inserted by triggers)
-- ============================================================

CREATE POLICY audit_logs_admin ON audit_logs FOR SELECT USING (
  get_user_role() IN ('super_admin', 'auditor')
);
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- PUBLIC FORMS (contact messages, fraud reports)
-- ============================================================

CREATE POLICY contact_messages_insert ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY contact_messages_staff ON contact_messages FOR SELECT USING (is_staff());

CREATE POLICY fraud_reports_insert ON fraud_reports FOR INSERT WITH CHECK (true);
CREATE POLICY fraud_reports_staff ON fraud_reports FOR SELECT USING (is_staff());
