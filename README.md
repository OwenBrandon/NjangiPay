# BB-Tax-Platform — GRA TaxMS

**Buea Municipality Tax Management System** — B.Tech Final Year Project  
Government Revenue Authority (GRA), Buea, Cameroon

## Project Structure

| Folder | Platform | Description |
|--------|----------|-------------|
| `web-portal/` | React 18 + TypeScript + Vite + Tailwind | Tax Admin & Support Staff web portal |
| `taxpayer-portal/` | Flutter / Dart | Taxpayer mobile app (iOS & Android) |
| `field-officer-app/` | Flutter / Dart | Field officer mobile app |

## Backend

All three clients connect to a shared **Supabase** backend (PostgreSQL + Auth + RLS).

## Getting Started

### Web Portal
```bash
cd web-portal
npm install
npm run dev
```

### Flutter Apps
```bash
cd taxpayer-portal   # or field-officer-app/flutter_app
flutter pub get
flutter run
```
