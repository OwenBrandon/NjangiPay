-- ============================================================
-- SEED DATA — Cameroon Regions, Tax Types, Article Categories
-- Primary target: Buea Municipality, East Region
-- ============================================================

INSERT INTO regions (id, name, code, tax_office, taxpayer_count, revenue_target, revenue_collected) VALUES
  (uuid_generate_v4(), 'East (Est)', 'ES', 'Bertoua Regional Tax Office', 18000, 42000000, 36000000),
  (uuid_generate_v4(), 'Centre', 'CE', 'Yaoundé Central Tax Office', 65000, 180000000, 152000000),
  (uuid_generate_v4(), 'Littoral', 'LT', 'Douala Tax Office', 55000, 160000000, 138000000),
  (uuid_generate_v4(), 'Adamawa (Adamaoua)', 'AD', 'Ngaoundéré Tax Office', 12000, 28000000, 23000000),
  (uuid_generate_v4(), 'Far North (Extrême-Nord)', 'EN', 'Maroua Tax Office', 15000, 32000000, 27000000),
  (uuid_generate_v4(), 'North (Nord)', 'NO', 'Garoua Tax Office', 14000, 30000000, 25000000),
  (uuid_generate_v4(), 'Northwest (Nord-Ouest)', 'NW', 'Bamenda Tax Office', 20000, 48000000, 41000000),
  (uuid_generate_v4(), 'South (Sud)', 'SU', 'Ebolowa Tax Office', 13000, 28000000, 24000000),
  (uuid_generate_v4(), 'Southwest (Sud-Ouest)', 'SW', 'Buea Tax Office', 22000, 52000000, 45000000),
  (uuid_generate_v4(), 'West (Ouest)', 'OU', 'Bafoussam Tax Office', 25000, 58000000, 50000000);

INSERT INTO tax_types (id, name, code, rate, description, filing_frequency) VALUES
  (uuid_generate_v4(), 'Value Added Tax', 'VAT', 19.25, 'TVA - Taxe sur la Valeur Ajoutée', 'monthly'),
  (uuid_generate_v4(), 'Corporate Income Tax', 'CIT', 33.00, 'Impôt sur les Sociétés', 'annually'),
  (uuid_generate_v4(), 'Personal Income Tax', 'PIT', 35.00, 'Impôt sur le Revenu des Personnes Physiques', 'annually'),
  (uuid_generate_v4(), 'Business License Tax', 'BLT', 0.00, 'Patente - Taxe sur les Activités Commerciales', 'annually'),
  (uuid_generate_v4(), 'Property Tax', 'PT', 0.50, 'Impôt Foncier', 'annually');

INSERT INTO article_categories (id, name, description, color) VALUES
  (uuid_generate_v4(), 'Announcements', 'Communiqués officiels et alertes de délais', 'bg-orange-500'),
  (uuid_generate_v4(), 'Tax Guides', 'Guides pratiques pour les contribuables', 'bg-blue-500'),
  (uuid_generate_v4(), 'Tax Laws', 'Documents juridiques et réglementations', 'bg-emerald-500'),
  (uuid_generate_v4(), 'Forms & Documents', 'Formulaires téléchargeables et modèles', 'bg-purple-500'),
  (uuid_generate_v4(), 'FAQs', 'Questions fréquemment posées', 'bg-pink-500'),
  (uuid_generate_v4(), 'News', 'Dernières nouvelles de la DGI', 'bg-cyan-500');
