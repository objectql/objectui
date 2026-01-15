# Adding Vercel KV Storage

This guide explains how to add Vercel KV for persistent cloud storage in the Object UI Studio.

## Prerequisites

1. A Vercel account
2. The playground deployed to Vercel (or set up locally with Vercel CLI)

## Step 1: Install Vercel KV Package

Add the `@vercel/kv` package to the playground:

```bash
cd apps/playground
pnpm add @vercel/kv
```

Or if using the root:
```bash
pnpm add @vercel/kv --filter @apps/playground
```

## Step 2: Set Up Vercel KV Database

### Option A: Using Vercel Dashboard

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to the "Storage" tab
4. Click "Create Database" → "KV"
5. Name your database (e.g., `objectui-designs`)
6. Click "Create"
7. Copy the environment variables provided

### Option B: Using Vercel CLI

```bash
vercel env pull .env.local
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in `apps/playground/`:

```env
# Vercel KV
KV_URL="your_kv_url_here"
KV_REST_API_URL="your_kv_rest_api_url_here"
KV_REST_API_TOKEN="your_kv_rest_api_token_here"
KV_REST_API_READ_ONLY_TOKEN="your_kv_rest_api_read_only_token_here"
```

These will be automatically set in Vercel when you create the KV database.

## Step 4: Update serverStorage.ts

The storage module has been updated to support both in-memory (fallback) and Vercel KV storage.

Key changes:
- Detects if KV is available via environment variables
- Falls back to in-memory storage if KV is not configured
- Uses Redis-like commands for KV operations
- Stores designs with prefix `design:` and shared designs with prefix `shared:`

## Step 5: Update .gitignore

Add to your `.gitignore`:

```
.env*.local
.vercel
```

## Step 6: Deploy to Vercel

```bash
vercel deploy
```

The KV environment variables will be automatically available in production.

## Usage

No code changes needed in your API routes! The storage module automatically:
1. Uses Vercel KV if available (in production/Vercel environment)
2. Falls back to in-memory storage for local development

## Testing Locally with KV

To test KV locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull .env.local`
4. Run dev server: `pnpm dev`

## Data Structure in KV

```
design:{id} → JSON string of Design object
shared:{shareId} → JSON string of Design object
designs:all → Set of all design IDs
```

## Monitoring

View your KV database in Vercel Dashboard → Storage → Your KV Database

## Migration from localStorage

The current implementation keeps localStorage on the client side as a cache/fallback. To sync with KV:

1. Client components will make API calls to server routes
2. Server routes use KV for persistence
3. localStorage serves as client-side cache for offline support

## Cost

Vercel KV free tier includes:
- 256 MB storage
- 3000 requests per day

Perfect for prototyping and small projects!
