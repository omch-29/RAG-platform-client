# DocuRAG — Frontend

Next.js dashboard for the DocuRAG multi-tenant RAG platform. Sign up or log into your workspace, upload documents (text, PDF, or URL), and ask questions — answers stream in live, grounded only in your workspace's own data.

Backend repo: [omch-29/RAG-platform](https://github.com/omch-29/RAG-platform)

---

## What it looks like

A two-panel layout — document management on the left, streaming Q&A on the right.

**Left sidebar:**
- Create your workspace (signup) or log into an existing one (login with your org's slug)
- Add documents three ways: paste text, upload a PDF, or drop in a URL to scrape
- See all your workspace's ingested documents with their source type and status
- Invite teammates into your workspace (admin only)
- Live usage summary — request count, total tokens, estimated cost

**Right panel:**
- Ask any question about your ingested documents
- Answer streams in token by token (like ChatGPT), grounded only in your workspace's data
- Every answer shows a **retrieval ledger** — which chunks were used, their vector rank, BM25 rank, and fused RRF score. This is what makes the system transparent: you can see exactly why each answer came from what it did.
- Cache hits are labeled — so you can see when an answer was served instantly from Redis vs. freshly generated

---

## Setup

```bash
git clone https://github.com/omch-29/RAG-platform-frontend.git
cd RAG-platform-frontend
npm install
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Point this at your running backend. For local dev that's `localhost:4000`. For the live demo, replace with your EC2 public IP or HTTPS hostname.

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## First time flow

1. **Sign up** — enter an organization name, a unique slug (e.g. `acme-corp`), your email, and a password. This creates your workspace and your admin account.
2. **Ingest a document** — pick text/PDF/URL in the sidebar, give it a title, submit. Watch the status flip to `ready`.
3. **Ask a question** — type in the chat panel, hit Ask. The answer streams in, and the retrieval ledger below it shows exactly which chunks were used.
4. **Invite a teammate** — fill in their email and a temp password in the sidebar. They log in (not sign up) using your workspace slug + their credentials.

---

## Important: teammates log in, not sign up

Signing up always creates a **brand new, completely separate workspace**. If a colleague signs up instead of logging in, they'll create their own isolated tenant with no access to your documents. Give them your workspace slug and have them use the login form.

---

## Stack

- Next.js 14 (App Router)
- React 18
- Plain CSS with design tokens (no Tailwind, no component library)
- `EventSource` for SSE streaming (native browser API)
- `fetch` for all other API calls

---

## Design notes

The visual direction is intentionally "technical instrument" rather than generic SaaS — dark workspace, amber accent, IBM Plex Mono/Sans type pairing. The retrieval ledger (showing vector rank, BM25 rank, RRF score per chunk) is the deliberate signature element: most chat UIs hide retrieval entirely. This one makes it the centerpiece, because transparency about *why* an answer came from *what source* is the actual product value, not just a nice-to-have.

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. `http://localhost:4000` for local dev, your EC2 HTTPS URL for production. |