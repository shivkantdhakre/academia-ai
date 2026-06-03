# Academia AI - Intelligent Learning Workspace

Academia AI is an enterprise-grade, multi-tenant SaaS learning platform built to help students study smarter. It features personalized AI curriculum generation, RAG-powered vector search chat over study materials, analytics, and billing, packaged inside a gorgeous client interface.

This codebase has been optimized for high performance, serverless stability, observability, and safety under the Next.js 16 (React 19) runtime.

---

## 🚀 Key Architectural Pillars

### 1. Asynchronous Background Job Processing (Inngest)
To prevent serverless function timeouts on massive PDF uploads, processing has been offloaded to an asynchronous background worker powered by **Inngest v4**:
- **Immediate Response**: The upload API uploads raw documents directly to Supabase storage, inserts a tracking record, triggers an Inngest event, and instantly returns a `200 OK` to the UI.
- **Asynchronous Processing**: An Inngest background function downloads the document, parses it (via `pdf-parse`), splits it into semantic chunks, generates vectors using Gemini Embeddings, and inserts them into the Vector Database.
- **Live Status Polling**: The frontend polls a status check endpoint `/api/course-materials/upload/status` to show real-time processing indicators (processing, completed, or failed with error details).

### 2. High-Performance Caching System (`unstable_cache`)
To scale database resource consumption, database read operations are aggressively cached at the edge:
- **Cached Queries**: User profile information and active course libraries are cached using Next.js `unstable_cache`.
- **On-Demand Tag-Based Revalidation**: When mutations occur (such as adding a course, completing a course lesson, sending a message, verifying a payment, or updating settings), the cache is programmatically invalidated via `revalidateTag`.
- **Webhook Integration**: Razorpay verification webhooks automatically invalidate cached tags to reflect subscription updates instantly.

### 3. Pre-Flight AI Content Moderation
Before triggering costly Gemini text generation or vector searches, all user prompt submissions are screened by a custom safety moderation utility:
- **Safety Screening**: Prompts are analyzed using Gemini to detect violence, self-harm, hate speech, harassment, or sexually explicit requests.
- **Graceful Blocking**: Offending inputs are rejected early with a `400 Bad Request` safety violation block, keeping AI costs down and user boundaries safe.

### 4. Robust Testing Suite (CI/CD Ready)
- **Unit Tests (Vitest)**: Fast unit test suite covering semantic text chunking logic and Gemini AI safety moderation rules.
- **E2E Tests (Playwright)**: Full browser E2E test suite covering landing page rendering and correct routing redirects (e.g. unauthenticated users being redirected to `/login` when trying to access `/dashboard`).

### 5. Production Observability & Guardrails
- **Rate Limiting**: Sliding window rate limiter (10 requests/minute) utilizing Upstash Redis. Falls back gracefully in local dev when credentials are absent.
- **Observability**: Complete frontend and backend error telemetry tracking integrated via Sentry.
- **Product Analytics**: Click tracking and AI copilot usage metrics sent to PostHog.
- **Credit Enforcements**: Courses API checks remaining user credits and atomic transactions deduct credits on successful generation.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16 (React 19)](https://nextjs.org) with Turbopack compiling
- **Styling**: Vanilla CSS with tailored utility variables supporting light/dark theme toggling, custom glassmorphism panels, and interactive hover mechanics.
- **Database / Auth**: [Supabase](https://supabase.com) (PostgreSQL vector storage, Row-Level Security, Storage Buckets, and Email/Google Auth)
- **AI Engine**: [Google Gemini SDK](https://github.com/google/generative-ai-js) via AI SDK
- **Task Queue**: [Inngest v4](https://inngest.com)
- **Billing**: [Razorpay](https://razorpay.com) subscription integration
- **Observability**: [Sentry](https://sentry.io) & [PostHog](https://posthog.com)

---

## 📦 Directory Structure
```bash
├── src
│   ├── app
│   │   ├── (dashboard)                  # Authenticated student dashboard (Dark-mode only)
│   │   │   ├── courses                  # Course catalogs, details, and study materials
│   │   │   ├── dashboard                # Progress metrics bento grid
│   │   │   ├── pricing                  # Billing checkout and subscriptions
│   │   │   └── settings                 # Profile configuration
│   │   ├── (marketing)                  # Scalable landing page (Light/Dark toggle)
│   │   ├── api
│   │   │   ├── chat                     # Vector search & AI tutor copilot
│   │   │   ├── course-materials         # File uploading and status tracking
│   │   │   ├── inngest                  # Serve endpoint for Inngest background workers
│   │   │   └── razorpay                 # Order verification & webhook handlers
│   │   └── layout.tsx                   # Theme sync & analytics providers
│   ├── components                       # Shared UI components
│   ├── types                            # Database and billing TypeScript mappings
│   └── utils                            # Caching, chunking, moderation, and API helper keys
├── tests
│   ├── e2e                              # Playwright browser automation
│   └── unit                             # Vitest unit tests
```

---

## ⚙️ Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root of the project with the following parameters:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# Inngest Configuration
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Sentry
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_client_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 2. Local Installation & Development
```bash
# Install dependencies
npm install

# Start the Next.js development server
npm run dev

# Start the Inngest local dev server (to intercept background jobs)
npx inngest-cli dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application. Open [http://localhost:8288](http://localhost:8288) to view the Inngest local dashboard.

---

## 🧪 Testing

### Running Unit Tests
Executes the fast Vitest suite for chunking and prompt moderation checks:
```bash
npm run test:unit
```

### Running End-to-End Tests
Executes Playwright browser navigation tests (launches the local server dynamically):
```bash
npm run test:e2e
```
