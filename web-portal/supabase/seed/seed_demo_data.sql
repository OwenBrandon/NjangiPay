-- ============================================================
-- DEMO DATA SEED — Run in Supabase SQL Editor
-- ============================================================

-- 1. Taxpayers
INSERT INTO taxpayers (name, tin, email, phone, address, region, registration_date, status, qr_code, outstanding_amount) VALUES
('Jean-Pierre Mbarga', 'TIN-2026-0001', 'jpmbarga@mbargacommerce.cm', '+237 699 123 456', '15 Rue du Marché Central, Buea', 'Southwest (Sud-Ouest)', '2024-01-15', 'active', 'QR-0001', 0),
('Françoise Ngo Biyack', 'TIN-2026-0002', 'francoise@chefrancoise.cm', '+237 677 234 567', '42 Avenue Commerciale, Buea', 'Southwest (Sud-Ouest)', '2024-03-20', 'active', 'QR-0002', 28000),
('Emmanuel Tchoupo', 'TIN-2026-0003', 'etchoupo@tchoupoconst.cm', '+237 655 345 678', '8 Quartier Industriel, Buea', 'Southwest (Sud-Ouest)', '2024-06-10', 'active', 'QR-0003', 125000),
('Aïssatou Saidou', 'TIN-2026-0004', 'aissatou@saidouconsult.cm', '+237 690 456 789', '21 Rue de la Paix, Buea', 'Southwest (Sud-Ouest)', '2024-08-05', 'pending', 'QR-0004', 18000),
('Paul-Henri Fotso', 'TIN-2026-0005', 'phfotso@fotsoindustries.cm', '+237 670 567 890', '65 Zone Industrielle, Buea', 'Southwest (Sud-Ouest)', '2023-11-25', 'active', 'QR-0005', 89000),
('Sandrine Ekotto', 'TIN-2026-0006', 'sekotto@ekottotech.cm', '+237 681 678 901', '12 Rue de la Technologie, Buea', 'Southwest (Sud-Ouest)', '2024-02-14', 'suspended', 'QR-0006', 45000),
('Marcel Nkeng', 'TIN-2026-0007', 'mnkeng@nkengtransport.cm', '+237 674 111 222', '30 Boulevard du Transport, Buea', 'Southwest (Sud-Ouest)', '2024-05-18', 'defaulter', 'QR-0007', 210000),
('Hélène Tabi', 'TIN-2026-0008', 'htabi@pharmacietabi.cm', '+237 692 333 444', '5 Carrefour Santé, Buea', 'Southwest (Sud-Ouest)', '2024-07-01', 'active', 'QR-0008', 15000);

UPDATE pre_registered_tins SET status = 'claimed', claimed_at = now()
WHERE tin IN ('TIN-2026-0001','TIN-2026-0002','TIN-2026-0003','TIN-2026-0004','TIN-2026-0005','TIN-2026-0006','TIN-2026-0007','TIN-2026-0008');

-- 2. Assessments
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Ets Mbarga Commerce', 'ASS-2026-001001', 'VAT Q1 2026', 'VAT', 450000, 450000, '2026-Q1', 'paid', '2026-01-15'::date, '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0001';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Boutique Françoise', 'ASS-2026-001002', 'VAT Q1 2026', 'VAT', 280000, 0, '2026-Q1', 'unpaid', '2026-01-15'::date, '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0002';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Tchoupo Construction', 'ASS-2026-001003', 'CIT FY2025', 'CIT', 1250000, 500000, '2025', 'partial', '2026-02-01'::date, '2026-06-30'::date FROM taxpayers t WHERE t.tin='TIN-2026-0003';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Fotso Industries', 'ASS-2026-001005', 'VAT Q4 2025', 'VAT', 890000, 0, '2025-Q4', 'overdue', '2025-10-15'::date, '2026-01-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0005';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Nkeng Transport', 'ASS-2026-001007', 'BLT 2026', 'BLT', 350000, 0, '2026', 'overdue', '2026-01-01'::date, '2026-03-31'::date FROM taxpayers t WHERE t.tin='TIN-2026-0007';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Nkeng Transport', 'ASS-2026-001007B', 'VAT Q1 2026', 'VAT', 560000, 0, '2026-Q1', 'disputed', '2026-01-15'::date, '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0007';
INSERT INTO assessments (taxpayer_id, business_name, reference_number, description, tax_type, amount, amount_paid, period, status, assessment_date, due_date)
SELECT t.id, 'Pharmacie Tabi', 'ASS-2026-001008', 'VAT Q1 2026', 'VAT', 150000, 150000, '2026-Q1', 'paid', '2026-01-15'::date, '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0008';

-- 3. Payments
INSERT INTO payments (taxpayer_id, amount, tax_type, payment_method, status, transaction_ref, receipt_number, payment_date)
SELECT t.id, 450000, 'VAT', 'mobile_money', 'completed', 'MOMO-20260320-0001', 'RCP-2026-0001', '2026-03-20 10:30:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0001';
INSERT INTO payments (taxpayer_id, amount, tax_type, payment_method, status, transaction_ref, receipt_number, payment_date)
SELECT t.id, 500000, 'CIT', 'bank_transfer', 'completed', 'BANK-20260415-0002', 'RCP-2026-0002', '2026-04-15 14:00:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0003';
INSERT INTO payments (taxpayer_id, amount, tax_type, payment_method, status, transaction_ref, receipt_number, payment_date)
SELECT t.id, 150000, 'VAT', 'card', 'completed', 'CARD-20260401-0003', 'RCP-2026-0003', '2026-04-01 09:15:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0008';
INSERT INTO payments (taxpayer_id, amount, tax_type, payment_method, status, transaction_ref, payment_date)
SELECT t.id, 125000, 'VAT', 'mobile_money', 'pending', 'MOMO-20260620-0004', '2026-06-20 16:45:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0002';
INSERT INTO payments (taxpayer_id, amount, tax_type, payment_method, status, transaction_ref, payment_date)
SELECT t.id, 200000, 'BLT', 'cash', 'failed', 'CASH-20260515-0005', '2026-05-15 11:00:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0007';

-- 4. Tax Returns
INSERT INTO tax_returns (taxpayer_id, period, tax_type, amount, status, filing_date, due_date)
SELECT t.id, '2026-Q1', 'VAT', 450000, 'filed', '2026-04-05'::date, '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0001';
INSERT INTO tax_returns (taxpayer_id, period, tax_type, amount, status, due_date)
SELECT t.id, '2026-Q1', 'VAT', 280000, 'not_filed', '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0002';
INSERT INTO tax_returns (taxpayer_id, period, tax_type, amount, status, filing_date, due_date)
SELECT t.id, '2025', 'CIT', 1250000, 'filed', '2026-03-28'::date, '2026-06-30'::date FROM taxpayers t WHERE t.tin='TIN-2026-0003';
INSERT INTO tax_returns (taxpayer_id, period, tax_type, amount, status, due_date)
SELECT t.id, '2025-Q4', 'VAT', 890000, 'overdue', '2026-01-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0005';
INSERT INTO tax_returns (taxpayer_id, period, tax_type, amount, status, due_date)
SELECT t.id, '2026-Q1', 'VAT', 560000, 'not_filed', '2026-04-10'::date FROM taxpayers t WHERE t.tin='TIN-2026-0007';

-- 5. Field Visits
INSERT INTO field_visits (taxpayer_id, officer_id, business_name, location, visit_date, visit_time, purpose, findings, violations, outcome, status, notes)
SELECT t.id, u.id, 'Nkeng Transport', '30 Blvd du Transport, Buea', '2026-06-10'::date, '09:30', 'collection', 'Owner refused.', ARRAY['Refused payment'], 'refused', 'pending_review', 'Follow-up needed.'
FROM taxpayers t, users u WHERE t.tin='TIN-2026-0007' AND u.email='officer@dgi.cm';
INSERT INTO field_visits (taxpayer_id, officer_id, business_name, location, visit_date, visit_time, purpose, findings, violations, outcome, status, notes)
SELECT t.id, u.id, 'Ets Mbarga Commerce', '15 Rue du Marché, Buea', '2026-06-12'::date, '10:00', 'inspection', 'All compliant.', ARRAY[]::TEXT[], 'successful', 'completed', 'Passed.'
FROM taxpayers t, users u WHERE t.tin='TIN-2026-0001' AND u.email='officer@dgi.cm';
INSERT INTO field_visits (taxpayer_id, officer_id, business_name, location, visit_date, visit_time, purpose, findings, violations, outcome, status, notes)
SELECT t.id, u.id, 'Fotso Industries', '65 Zone Industrielle, Buea', '2026-06-15'::date, '14:30', 'verification', 'Premises closed.', ARRAY['Closed during hours'], 'not_available', 'pending_review', 'Rescheduled.'
FROM taxpayers t, users u WHERE t.tin='TIN-2026-0005' AND u.email='officer@dgi.cm';

-- 6. Support Tickets
INSERT INTO support_tickets (ticket_number, taxpayer_id, category, subject, description, status, priority, created_date)
SELECT 'TKT-2026-0001', t.id, 'assessment', 'Incorrect VAT Amount', 'Q1 VAT assessment appears incorrect.', 'open', 'high', '2026-06-01 10:00:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0002';
INSERT INTO support_tickets (ticket_number, taxpayer_id, category, subject, description, status, priority, created_date)
SELECT 'TKT-2026-0002', t.id, 'payment', 'Payment Not Reflected', 'MoMo payment not reflected.', 'in_progress', 'medium', '2026-06-18 14:30:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0007';
INSERT INTO support_tickets (ticket_number, taxpayer_id, category, subject, description, status, priority, created_date)
SELECT 'TKT-2026-0003', t.id, 'registration', 'Name Change', 'Update business name.', 'resolved', 'low', '2026-05-20 09:00:00+00'::timestamptz FROM taxpayers t WHERE t.tin='TIN-2026-0005';

-- 7. Invoices
INSERT INTO invoices (invoice_number, taxpayer_id, taxpayer_name, amount, due_date, created_date, status)
SELECT 'INV-2026-0001', t.id, 'Marcel Nkeng', 910000, '2026-07-31'::date, '2026-06-01'::date, 'unpaid' FROM taxpayers t WHERE t.tin='TIN-2026-0007';
INSERT INTO invoices (invoice_number, taxpayer_id, taxpayer_name, amount, due_date, created_date, status)
SELECT 'INV-2026-0002', t.id, 'Françoise Ngo Biyack', 280000, '2026-07-10'::date, '2026-06-15'::date, 'unpaid' FROM taxpayers t WHERE t.tin='TIN-2026-0002';

INSERT INTO invoice_items (invoice_id, description, amount) SELECT i.id, 'Business License Tax', 350000 FROM invoices i WHERE i.invoice_number='INV-2026-0001';
INSERT INTO invoice_items (invoice_id, description, amount) SELECT i.id, 'VAT Q1 2026 (Disputed)', 560000 FROM invoices i WHERE i.invoice_number='INV-2026-0001';
INSERT INTO invoice_items (invoice_id, description, amount) SELECT i.id, 'VAT Q1 2026', 280000 FROM invoices i WHERE i.invoice_number='INV-2026-0002';

-- 8. Articles
INSERT INTO articles (title, slug, content, category, status, author, publish_date, tags, created_date, updated_date) VALUES
('New VAT Filing Procedures for 2026', 'new-vat-filing-2026', 'Starting April 2026, all VAT taxpayers must use the new online filing system.', 'Announcements', 'published', 'Blaise Ndjock', '2026-03-01'::date, ARRAY['VAT','Filing'], '2026-02-25', '2026-02-28'),
('Understanding CIT Deductions', 'cit-deductions-guide', 'This guide explains allowable deductions for corporate income tax in Cameroon.', 'Tax Guides', 'published', 'Blaise Ndjock', '2026-02-15'::date, ARRAY['CIT','Deductions'], '2026-02-10', '2026-02-14'),
('Q2 2026 Deadline Extended', 'q2-2026-deadline', 'Q2 2026 VAT filing deadline extended from July 10 to July 20.', 'Announcements', 'draft', 'Blaise Ndjock', NULL, ARRAY['Deadline','Q2'], '2026-06-08', '2026-06-09');

-- 9. Audit Logs
INSERT INTO audit_logs (user_name, action, resource, status) VALUES
('Pierre Nkoulou', 'Assessment Created', 'ASS-2026-001001', 'success'),
('Cécile Manga', 'Payment Reconciled', 'MOMO-20260320-0001', 'success'),
('Hervé Biya', 'Field Visit Logged', 'Nkeng Transport, Buea', 'success'),
('Marie-Thérèse Atangana', 'User Role Updated', 'officer@dgi.cm', 'success'),
('Nadège Meka', 'Ticket Resolved', 'TKT-2026-0003', 'success');

-- Verify
SELECT 'Taxpayers' as entity, COUNT(*)::text as total FROM taxpayers
UNION ALL SELECT 'Assessments', COUNT(*)::text FROM assessments
UNION ALL SELECT 'Payments', COUNT(*)::text FROM payments
UNION ALL SELECT 'Tax Returns', COUNT(*)::text FROM tax_returns
UNION ALL SELECT 'Field Visits', COUNT(*)::text FROM field_visits
UNION ALL SELECT 'Tickets', COUNT(*)::text FROM support_tickets
UNION ALL SELECT 'Invoices', COUNT(*)::text FROM invoices
UNION ALL SELECT 'Articles', COUNT(*)::text FROM articles
UNION ALL SELECT 'Available TINs', COUNT(*)::text FROM pre_registered_tins WHERE status='available';
