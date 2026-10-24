# NjangiPay — Municipal Tax Administration Platform

A multi-platform tax management system for a Cameroonian municipality (Buea). Taxpayers register and pay from their phones. Field officers assess, invoice and collect on the ground. Eight staff roles run everything else from a single web portal. All three apps share one Supabase/PostgreSQL backend, where Row-Level Security enforces who can see what.

> B.Tech Computer Engineering capstone, Biaka University Institute of Buea, 2026.

<!-- Add a hero screenshot or a short GIF here, e.g. docs/screenshots/hero.png -->

---

## Why it exists

Municipal tax collection in many Cameroonian councils still runs on paper registers, cash receipts and spreadsheets. That makes it hard to know who owes what, easy for payments to go unrecorded, and slow to chase defaulters. NjangiPay digitises the whole cycle:

**register → assess → invoice → pay → receipt → follow up**

The cycle also leaves an audit trail at every step.

---

## Architecture

```
 ┌────────────────────┐   ┌────────────────────┐   ┌──────────────────────────┐
 │  Taxpayer App      │   │  Field Officer App │   │  Administration Portal   │
 │  Flutter (iOS/And.)│   │  Flutter           │   │  React 18 + TS + Vite    │
 └─────────┬──────────┘   └─────────┬──────────┘   └────────────┬─────────────┘
           │                        │                           │
           └────────────────────────┼───────────────────────────┘
                                    │  supabase-js / supabase_flutter
                       ┌────────────▼─────────────┐
                       │        Supabase          │
                       │  Auth · PostgreSQL · RLS │
                       │  PL/pgSQL tax engine     │
                       │  Triggers & audit log    │
                       └──────────────────────────┘
```

| Folder | Stack | Who uses it |
|---|---|---|
| `web-portal/` | React 18, TypeScript, Vite, Tailwind, Radix/shadcn UI | Staff (7 roles) and taxpayers on the web |
| `taxpayer-portal/` | Flutter / Dart, `supabase_flutter`, `qr_flutter` | Taxpayers (mobile) |
| `field-officer-app/flutter_app/` | Flutter / Dart, `supabase_flutter` | Field officers (mobile) |
| `web-portal/supabase/` | PostgreSQL migrations, RLS policies, seed data | Shared backend |

---

## Roles

Access is role-based end to end. The UI routes by role, and the database enforces the same rules with RLS, so a client can't bypass it.

| Role | Main responsibilities |
|---|---|
| **Super Admin** | Users, roles and permissions, regions, tax types and rates, system config, monitoring, audit logs |
| **Tax Admin** | Approve registrations and businesses, create and edit assessments, penalties, compliance, field operations, analytics |
| **Accountant** | Payment management, reconciliation, refunds and adjustments, payment exceptions, revenue analytics, financial reports |
| **Auditor** | Audit cases, taxpayer audit view, risk and fraud detection, audit reports |
| **Field Officer** | Taxpayer search, on-site visit logs, invoicing, recording payments, receipts, defaulter tracking |
| **Support Staff** | Ticket queue, ticket responses, user lookup, support reports |
| **Content Manager** | Public articles, categories, announcements |
| **Taxpayer** | Register, manage businesses and branches, view obligations and assessments, file returns, pay, receipts, disputes, support |

---

## Key features

**Tax engine in the database (PL/pgSQL)**
- Calculation functions based on Cameroonian tax rules: VAT (19.25%), Corporate Income Tax (33%), progressive Personal Income Tax brackets, *Patente* (business licence tax), property tax, and late-payment penalties
- `create_assessment_with_invoice` creates an assessment and its invoice in a single transaction
- `check_overdue_assessments` flags overdue liabilities for follow-up
- Payment triggers (`on_payment_completed`, `on_payment_status_change`) update balances and issue receipts automatically

**Security**
- Supabase Auth with an `on_auth_user_created` trigger that provisions a profile for each new user
- About 60 Row-Level Security policies, using helper functions (`get_user_role`, `is_staff`, `get_taxpayer_id`) so each role and each taxpayer only sees their own data
- TIN system: pre-registered Taxpayer Identification Numbers that taxpayers claim through `claim_tin`
- `log_audit` and an `audit_logs` table record sensitive actions

**Payments and receipts**
- Mobile-money payment flow (MTN MoMo and Orange Money) with OTP verification, plus bank transfer and card. Currently a sandbox simulator, not a live gateway
- QR-coded digital receipts in the taxpayer app

**Operations**
- Business registration with branches and supporting documents
- Field-visit logging and on-site invoicing
- Disputes, support tickets and notifications
- Public site with tax information, articles and contact form

---

## Data model

27 tables, including:

`users` · `taxpayers` · `pre_registered_tins` · `businesses` · `branches` · `documents` · `regions` · `tax_types` · `taxpayer_tax_types` · `assessments` · `invoices` · `invoice_items` · `tax_returns` · `payments` · `payment_simulations` · `receipts` · `field_visits` · `audit_cases` · `fraud_reports` · `audit_logs` · `support_tickets` · `support_ticket_responses` · `notifications` · `user_notifications` · `articles` · `article_categories` · `contact_messages`

Migrations are in [`web-portal/supabase/migrations`](web-portal/supabase/migrations), in order:

| # | Migration |
|---|---|
| 001 | Initial schema |
| 002 | RLS policies |
| 003 / 005 | Auth trigger (and fix) |
| 004 | TIN system and admin seed |
| 006 | Tax billing logic |
| 007 | Business registration |

<!-- Consider adding an ERD image here: docs/erd.png -->

---

## Screenshots

<!-- Replace with real screenshots -->
| Admin dashboard | Taxpayer app | Field officer app |
|---|---|---|
| `docs/screenshots/admin-dashboard.png` | `docs/screenshots/taxpayer-app.png` | `docs/screenshots/field-officer.png` |

---

## Getting started

### 1. Backend (Supabase)
1. Create a Supabase project.
2. Run the migrations in `web-portal/supabase/migrations` in numeric order (SQL editor or `supabase db push`).
3. Optionally load the demo data from `web-portal/supabase/seed/`.

See [`web-portal/supabase/SETUP.md`](web-portal/supabase/SETUP.md) for details.

### 2. Web portal
```bash
cd web-portal
cp .env.example .env.local   # then fill in the values below
# VITE_SUPABASE_URL=https://<your-project>.supabase.co
# VITE_SUPABASE_ANON_KEY=<your-anon-key>
npm install
npm run dev
```

### 3. Flutter apps
Set your Supabase URL and anon key in each app's `supabase_config.dart`, then:
```bash
cd taxpayer-portal            # or field-officer-app/flutter_app
flutter pub get
flutter run
```

---

## Status and roadmap

- [x] Shared schema, RLS, auth and tax engine
- [x] Admin portal: 68 pages across all staff roles
- [x] Taxpayer and field officer mobile apps
- [ ] Live mobile-money gateway integration (currently a sandbox simulator)
- [ ] Offline-first sync for field officers in low-connectivity areas
- [ ] Automated test suite and CI

---

## Author

**Owan Brandon Leku**, Software Engineer, Buea, Cameroon
[GitHub](https://github.com/OwenBrandon) · [Email](mailto:owanbrandon6@gmail.com)
