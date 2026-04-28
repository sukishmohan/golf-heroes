# Golf Heroes - Deployment Guide

## Project Information

**GitHub Repository:** https://github.com/sukishmohan/golf-heroes
**Branch:** main

## Quick Deployment to Vercel

### Step 1: Visit Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/sukishmohan/golf-heroes`
5. Click "Import"

### Step 2: Configure Environment Variables
In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
RESEND_API_KEY=re_placeholder
```

### Step 3: Deploy
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- You'll get a URL like: `https://golf-heroes-xxx.vercel.app`

## Deployment URLs (After Vercel Deployment)

Replace `golf-heroes-xxx` with your actual Vercel deployment name:

**Live Website URL:**
```
https://golf-heroes-xxx.vercel.app
```

**User Dashboard URL:**
```
https://golf-heroes-xxx.vercel.app/dashboard
```

**Admin Panel URL:**
```
https://golf-heroes-xxx.vercel.app/admin
```

**GitHub Repository:**
```
https://github.com/sukishmohan/golf-heroes
```

## Admin Credentials

**Email:** admin@golfheroes.com
**Password:** AdminGolfHeroes123!

### How to Access Admin Panel
1. Go to https://golf-heroes-xxx.vercel.app/login
2. Enter admin credentials
3. You'll be redirected to dashboard, then can access /admin

## Testing Credentials

For user testing, use any email/password combination:
- Email: test@example.com
- Password: TestPassword123!

## Features Available

- ✅ User Registration with Charity Selection
- ✅ User Login & Authentication
- ✅ User Dashboard with Score Tracking
- ✅ Admin Panel (Charities, Users, Draws, Reports, Winners)
- ✅ Responsive Design
- ✅ Mock Authentication (works with placeholder Supabase)
- ✅ Ready for real Supabase/Stripe/Resend integration

## Notes

- The app uses mock authentication with placeholder credentials
- All data is stored locally during development
- When ready, replace placeholder credentials with real ones in Vercel environment variables
- Admin panel is fully functional for demonstration
