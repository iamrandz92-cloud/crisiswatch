# Deployment Guide

This guide will walk you through deploying your Next.js application to Netlify with GitHub integration.

## Prerequisites

- GitHub account (with repository access)
- Netlify account
- Supabase project (already configured)

## Step 1: Push Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - News Intelligence Platform"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Replace `YOUR_GITHUB_REPO_URL` with your actual GitHub repository URL.

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account if prompted
   - Select your repository from the list

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - These should be auto-detected from your `netlify.toml` file

4. **Add Environment Variables**
   Click "Show advanced" → "New variable" and add:

   | Variable Name | Value |
   |--------------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://qlhfjqrniyudeqtbmuop.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k` |

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at a URL like `https://random-name-123456.netlify.app`

6. **Custom Domain (Optional)**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow the instructions to connect your domain

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Connect to your GitHub repository
# - Configure build settings (use defaults from netlify.toml)
# - Add environment variables when prompted

# Deploy
netlify deploy --prod
```

## Step 3: Verify Deployment

1. Visit your Netlify site URL
2. Test the following features:
   - Home page loads with news articles
   - Map view displays correctly
   - Intelligence page shows OSINT feeds
   - Timeline view works
   - Briefing page generates content
   - Safety alerts display

## Step 4: Set Up Continuous Deployment

Netlify automatically sets up continuous deployment when you connect your GitHub repository. This means:

- Every push to your `main` branch triggers a new deployment
- Pull requests create deploy previews
- You can roll back to previous deployments anytime

## Environment Variables Reference

Your application requires these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qlhfjqrniyudeqtbmuop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k
```

These are already configured in your local `.env` file and need to be added to Netlify's environment variables.

## Troubleshooting

### Build Fails

- Check the build logs in Netlify dashboard
- Verify all environment variables are set correctly
- Ensure your `package.json` has all required dependencies

### Site Loads but Features Don't Work

- Verify environment variables in Netlify dashboard
- Check browser console for errors
- Ensure Supabase database is accessible

### Database Connection Issues

- Verify Supabase project is active
- Check that RLS policies allow public access where needed
- Ensure environment variables match your Supabase project

## Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] All pages are accessible
- [ ] Map displays correctly
- [ ] News articles load from database
- [ ] Real-time updates work
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active (automatic with Netlify)
- [ ] Analytics configured (optional)

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

## Support

If you encounter issues:
1. Check Netlify build logs
2. Review browser console errors
3. Verify environment variables
4. Check Supabase dashboard for database issues
