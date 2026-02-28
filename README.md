# ReserveLink SaaS (Next.js)

Modern SaaS appointment booking frontend built with:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn-style UI components

## Pages

- `/` Landing page with hero (left) and login form card (right)
- `/dashboard` Dashboard page with sidebar + main content
- `/dashboard/book` Book Appointment page

## Sidebar items

- Dashboard
- Book Appointment
- My Appointments
- History
- Alerts
- Settings
- Logout

## Booking structure

The booking page keeps the required structure:

- Service dropdown
- Date picker
- Available time slot selector
- Notes textarea
- Submit button
- Success confirmation message

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.
