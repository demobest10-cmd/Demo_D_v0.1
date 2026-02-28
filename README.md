# ReserveLink SaaS

This repository now includes a **working no-build frontend** (HTML/CSS/JS) that matches the requested SaaS flow and can run immediately.

## Quick run (works without npm install)

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Included pages (SPA)

- Landing (hero left + login card right)
- Dashboard with sidebar and sections:
  - Dashboard
  - Book Appointment
  - My Appointments
  - History
  - Alerts
  - Settings
  - Logout

## Book Appointment structure kept

- Service dropdown
- Date picker
- Available time slots selector
- Notes textarea
- Submit button
- Success confirmation message

## Data

Dummy data and local persistence are handled via `localStorage` key:

- `reserveLinkSaaSData`

## Next.js scaffold

The Next.js/Tailwind/TypeScript scaffold is still present in the repo for future migration, but this static SPA mode is what works immediately in restricted environments.
