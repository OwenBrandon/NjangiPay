-- ============================================================
-- ADMIN ACCOUNT SETUP — Run this AFTER creating auth accounts
-- ============================================================
--
-- STEP 1: Go to Supabase Dashboard → Authentication → Users
-- STEP 2: Click "Add User" and create these 7 accounts:
--
--   Email                  Password       Role
--   ─────────────────────  ─────────────  ──────────────
--   admin@dgi.cm           Admin@2026!    Super Admin
--   taxadmin@dgi.cm        Admin@2026!    Tax Admin
--   accountant@dgi.cm      Admin@2026!    Accountant
--   auditor@dgi.cm         Admin@2026!    Auditor
--   support@dgi.cm         Admin@2026!    Support Staff
--   content@dgi.cm         Admin@2026!    Content Manager
--   officer@dgi.cm         Admin@2026!    Field Officer
--
-- STEP 3: Come back here and run this SQL to set their roles:

UPDATE users SET role = 'super_admin', name = 'Marie-Thérèse Atangana' WHERE email = 'admin@dgi.cm';
UPDATE users SET role = 'tax_admin', name = 'Pierre Nkoulou', region = 'Southwest (Sud-Ouest)' WHERE email = 'taxadmin@dgi.cm';
UPDATE users SET role = 'accountant', name = 'Cécile Manga' WHERE email = 'accountant@dgi.cm';
UPDATE users SET role = 'auditor', name = 'Jean-Baptiste Onana' WHERE email = 'auditor@dgi.cm';
UPDATE users SET role = 'support_staff', name = 'Nadège Meka' WHERE email = 'support@dgi.cm';
UPDATE users SET role = 'content_manager', name = 'Blaise Ndjock' WHERE email = 'content@dgi.cm';
UPDATE users SET role = 'field_officer', name = 'Hervé Biya', region = 'Buea Centre' WHERE email = 'officer@dgi.cm';

-- Also delete any auto-created taxpayer rows for these admin users
-- (the auth trigger creates taxpayer rows by default)
DELETE FROM taxpayers WHERE email IN (
  'admin@dgi.cm', 'taxadmin@dgi.cm', 'accountant@dgi.cm',
  'auditor@dgi.cm', 'support@dgi.cm', 'content@dgi.cm', 'officer@dgi.cm'
);
