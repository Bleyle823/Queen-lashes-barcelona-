# Queenlashes Barcelona

## How can I edit this code?

Work locally in your preferred IDE.

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Stripe Checkout (hosted payment page)

Bookings use [Stripe Checkout](https://stripe.com/docs/payments/checkout): the pay step opens Stripe’s hosted page, then returns to `/booking/success`.

1. Copy `.env.example` to **`.env` in this project folder** (`perspective-viewpoint-guide-main`, next to `package.json`) and set **`STRIPE_SECRET_KEY`** (`sk_test_…`). Keys in a `.env` in some other folder or repo are **ignored** — only this project’s `.env` is loaded.
2. Set **`PUBLIC_SITE_URL`** to where the site runs locally (default `http://localhost:8080` matches Vite).
3. Run **`npm run dev`**, which starts the Vite app and the small API in `server/index.mjs` (port **4242**; Vite proxies **`/api`** to it).  
   **If `npm run dev` only prints the Vite server** (no `api`/`web` labels), the payment API never starts and checkout will fail; use the root `npm run dev` script (not `vite` alone) or run **`npm run dev:api`** in a second terminal.

Use Stripe [test cards](https://stripe.com/docs/testing): `4242 4242 4242 4242` for success.

For production, run the API alongside the static frontend (or deploy `server/index.mjs` as a service) and set `PUBLIC_SITE_URL` to your real site URL.

### Stripe webhook (recommended for production)

Set `STRIPE_WEBHOOK_SECRET` in `.env` and point Stripe at `POST /api/webhooks/stripe`. The handler:

- Verifies the signature.
- Persists the booking row (idempotent on `stripe_session_id`).
- Sends the customer confirmation + receipt email and (if `ADMIN_EMAIL` is set) a copy to the admin.

Locally you can test with the Stripe CLI: `stripe listen --forward-to localhost:4242/api/webhooks/stripe`.

## Database (Supabase) and email (Resend)

Both services are optional in development; sane fallbacks ship with the API:

| Concern | Configured | Fallback when env unset |
|---------|------------|--------------------------|
| Storage | `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | JSON file at `.data/store.json` |
| Email   | `RESEND_API_KEY` (and `EMAIL_FROM`)          | Email body printed to API console |

To use Supabase, run [`server/migrations/001_init.sql`](server/migrations/001_init.sql) in the **SQL Editor** of your project ([Dashboard](https://supabase.com/dashboard/project/_/sql) → paste → Run). Then set in `.env`:

```
SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role — from Settings → API>
```

For [Queenlashes Barcelona](https://supabase.com/dashboard/project/hmsfouyhnvswiufvrbol), the URL is `https://hmsfouyhnvswiufvrbol.supabase.co`.

**Note:** If you use Cursor’s Supabase MCP, it must be linked to the **same** Supabase project; otherwise tools may target a different database than the one you open in the dashboard.

The Express API uses the **service role** key; no client-side Supabase calls happen, so RLS is locked down by default.

## Admin dashboard

Visit [`/admin`](http://localhost:8080/admin). Sign in with the password set in `.env` as `ADMIN_PASSWORD`.

The dashboard provides:

- **Overview** — 30-day revenue, bookings, upcoming appointments
- **Bookings** — search, filter, status changes, CSV export, resend confirmation, refund
- **Payments** — Stripe payment list with receipt links
- **Availability** — block whole days, block specific slots, or open extra slots beyond the default hours
- **Treatments** — create/edit/disable services and prices
- **Settings** — business info and default booking rules

Admin sessions live in `localStorage` for 12 hours; the API verifies the signed token on every protected route.

## How can I deploy this project?
Build the site and deploy `dist/` to any static host (and deploy `server/index.mjs` as a separate Node service if you need bookings + Stripe).
