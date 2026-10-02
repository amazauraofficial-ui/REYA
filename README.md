# REYA Luxury Spa & Wellness Sanctuary / Clinical Aesthetics Platform

A full-stack luxury medical aesthetics and holistic spa application featuring client-side Google Calendar OAuth synchronization, persistent Firebase Firestore database with deployed security rules, role-based portals (Patient, Provider, Staff, Admin), automated aftercare charting, and double-booking prevention.

---

## HIPAA IMPLEMENTATION REQUIREMENTS

> **CRITICAL COMPLIANCE NOTICE**:
> 
> The inclusion of end-to-end encryption, authentication safeguards, and role-based access control (RBAC) in this application provides technical architecture readiness, but **DOES NOT** by itself constitute legal or regulatory HIPAA compliance.
>
> Production HIPAA compliance mandates:
> 1. **Business Associate Agreements (BAAs)**: Formal, legally binding BAAs executed with cloud providers (Google Cloud Platform, Firebase, database hosts), payment processors, and telecommunication carriers before any Protected Health Information (PHI) is processed.
> 2. **Administrative & Workforce Safeguards**: Documented policies and procedures, designated Privacy and Security Officers, mandatory recurring workforce training, employee sanction policies, and breach incident response plans.
> 3. **Physical & Environmental Safeguards**: Facility access controls, device and workstation management, and secure media disposal.
> 4. **Technical Safeguards**: Strict Least Privilege access enforcement, automatic session termination, immutable audit trails for all record reads and modifications, and AES-256 at-rest and TLS 1.3 in-transit encryption.
> 5. **Formal Risk Assessment**: Periodic third-party penetration testing and vulnerability assessments.
>
> **Portfolio Mode**: This project runs with `DEMO_MODE=true` and exclusively uses synthetic, fictional guest records and test payment simulation. No actual patient PHI is stored or transmitted.

---

## Core Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Motion.
- **Database & Persistence**: Google Cloud Firestore (`portfolio-3d62d`) with active Firestore security rules (`firestore.rules`) and Blueprint IR (`firebase-blueprint.json`).
- **OAuth & Calendar Sync**: Google Calendar API v3 integration with client-side OAuth Bearer token caching in memory (zero storage in localStorage for security).
- **Authentication & RBAC**:
  - `PATIENT`: View appointments, request sessions, view clinical aftercare, access invoices, and sync directly to Google Calendar.
  - `PROVIDER`: Daily treatment schedule, clinical notes recorder, procedure charting, and aftercare instruction publisher.
  - `STAFF` / `ADMIN`: Operational analytics dashboard (revenue, occupancy, retention), master appointment manager, room allocation, clinic configuration (`America/Los_Angeles`), and immutable security audit logs.
- **Double-Booking Prevention**: Transactional server-side checks verifying room, practitioner, and time slot availability prior to reservation commit.

---

## Google Calendar Integration

The application integrates with the Google Calendar API:
- Scopes:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`
- Allows end users to click **"Add to Google Calendar"** on any confirmed session or through their Guest Portal.
- Uses OAuth 2.0 access token via Firebase Auth with direct Web intent fallback.

---

## Environment Variables (.env.example)

```bash
# Mode
DEMO_MODE="true"

# PostgreSQL / Relational Database (Optional full-stack ORM connection)
DATABASE_URL="postgresql://user:password@localhost:5432/reya_spa?schema=public"

# Session & Authentication Secret
SESSION_SECRET="your_long_random_session_secret_key_here"

# Stripe Test Keys
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_signing_secret"

# Notification Provider Keys
EMAIL_PROVIDER_KEY="your_sendgrid_or_resend_api_key"
SMS_PROVIDER_KEY="your_twilio_sms_api_key"
PUSH_PUBLIC_KEY="your_vapid_public_push_key"
PUSH_PRIVATE_KEY="your_vapid_private_push_key"
```

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
