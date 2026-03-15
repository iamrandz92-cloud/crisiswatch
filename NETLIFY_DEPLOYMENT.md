# Deploy to Netlify - Quick Guide

Your War Intelligence Platform is ready to deploy to Netlify! Follow these steps:

## Prerequisites

1. A GitHub account
2. A Netlify account (free at https://netlify.com)
3. Your Supabase credentials (already in your .env file)

## Step 1: Push to GitHub

```bash
# Create a new repository on GitHub (e.g., "war-intelligence-platform")
# Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)

## Step 3: Add Environment Variables

In Netlify dashboard → Site settings → Environment variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://qlhfjqrniyudeqtbmuop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k
```

## Step 4: Deploy

Click "Deploy site" and Netlify will:
- Install dependencies
- Build your Next.js app
- Deploy to a live URL

## Step 5: Configure Custom Domain (Optional)

1. In Netlify dashboard → Domain settings
2. Add your custom domain
3. Update DNS settings as instructed

## What's Included

Your deployment includes:
- ✅ All 123 source files
- ✅ Next.js 13 with App Router
- ✅ Supabase database integration
- ✅ All intelligence features
- ✅ Market tracking
- ✅ Interactive maps
- ✅ Real-time updates
- ✅ Edge functions for automation

## Automatic Deployments

After initial setup, every `git push` to your main branch will trigger a new deployment automatically!

## Need Help?

- Netlify Docs: https://docs.netlify.com/
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

**Note:** Your Supabase database is already set up with all data and will work immediately upon deployment!
