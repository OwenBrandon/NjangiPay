# GRA TaxMS — Supabase Backend Setup

## Quick Start

### 1. Create a Supabase Project
1. Go to https://supabase.com → create a new project
2. Note your **Project URL** and **anon key** from Settings → API

### 2. Run the Migrations
In the Supabase SQL Editor (or via CLI), run these files in order:
1. `migrations/001_initial_schema.sql` — creates all tables, enums, indexes
2. `migrations/002_rls_policies.sql` — enables Row Level Security on every table
3. `seed/seed.sql` — inserts regions, tax types, article categories

### 3. Configure Environment Variables
Create a `.env` file in the web portal root:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

For Flutter apps, add to your config:
```dart
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

### 4. Auth Setup
The system uses Supabase Auth with email/password. On signup:
1. User signs up via `supabase.auth.signUp()`
2. A database trigger (or Edge Function) creates a row in the `users` table
3. The `role` determines their permissions via RLS policies

### 5. Connect the Frontends
- **Web Portal**: Install `@supabase/supabase-js`, replace MockDataContext
- **Taxpayer App**: Install `supabase_flutter`, replace ApiService
- **Field Officer App**: Install `supabase_flutter`, replace AppState mock data

## Database Schema Overview

### Core Tables (22 tables)
| Table | Purpose | Used By |
|-------|---------|---------|
| `users` | All system users (staff + taxpayers + officers) | All 3 |
| `taxpayers` | Taxpayer profiles with TIN, region, status | All 3 |
| `businesses` | Business entities (1 taxpayer → many businesses) | Taxpayer App, Web |
| `branches` | Business branch locations | Taxpayer App |
| `documents` | Uploaded business documents | Taxpayer App |
| `assessments` | Tax assessment obligations | All 3 |
| `payments` | Payment transactions | All 3 |
| `receipts` | Payment receipt records with QR | All 3 |
| `invoices` | Billing documents with line items | Field Officer, Web |
| `invoice_items` | Invoice line items | Field Officer, Web |
| `tax_returns` | Filed tax returns | Taxpayer App, Web |
| `field_visits` | Inspection/visit logs | Field Officer, Web |
| `audit_cases` | Tax audit investigations | Web (Auditor) |
| `support_tickets` | Help desk tickets / disputes | Taxpayer App, Web |
| `support_ticket_responses` | Ticket thread messages | Taxpayer App, Web |
| `articles` | CMS content for public portal | Web |
| `article_categories` | Content taxonomy | Web |
| `regions` | Regional config | All 3 |
| `tax_types` | Tax type definitions | All 3 |
| `notifications` | System-wide notifications | Web, Taxpayer App |
| `audit_logs` | System audit trail | Web (Admin) |
| `fraud_reports` | Anonymous fraud reports | Web (Public) |

### Role-Based Access (RLS)
| Role | Can Read | Can Write |
|------|----------|-----------|
| `super_admin` | Everything | Everything |
| `tax_admin` | All taxpayers, assessments | Taxpayers, assessments, field visits |
| `accountant` | Payments, assessments | Payments, reconciliation |
| `auditor` | All data, audit logs | Audit cases |
| `support_staff` | Tickets, taxpayers | Tickets, responses |
| `content_manager` | Articles | Articles, categories |
| `field_officer` | Assigned taxpayers | Payments, field visits, invoices |
| `taxpayer` | Own data only | Own payments, returns, tickets |
