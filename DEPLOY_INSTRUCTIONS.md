# Complete Deployment Guide

Your CrisisWatch Intelligence Platform is ready for deployment! I've initialized the git repository and created the first commit with all 128 files.

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `crisiswatch-platform` (or your preferred name)
3. Set to **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Connect and Push to GitHub

After creating the repository, run these commands in your terminal:

```bash
cd /tmp/cc-agent/64662283/project

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Authentication Options:**

If you get an authentication error:

**Option A: Personal Access Token (Recommended)**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "CrisisWatch Deploy"
4. Check the `repo` scope
5. Click "Generate token"
6. Copy the token
7. When pushing, use: `git push -u origin main`
   - Username: your GitHub username
   - Password: paste your token

**Option B: GitHub CLI**
```bash
# Install GitHub CLI if not installed
# Then authenticate and push
gh auth login
git push -u origin main
```

## Step 3: Deploy to Netlify

### Option A: Using Netlify Dashboard (Easiest)

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Click "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select your `crisiswatch-platform` repository
6. Netlify will auto-detect settings from `netlify.toml`:
   - Build command: `npx next build`
   - Publish directory: `.next`
7. Click "Add environment variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://qlhfjqrniyudeqtbmuop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k
   ```
8. Click "Deploy site"

### Option B: Using Netlify CLI (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Select your team
# - Site name: crisiswatch-platform
# - Build command: npx next build
# - Publish directory: .next

# Deploy
netlify deploy --prod
```

## Step 4: Configure Environment Variables (If using Netlify CLI)

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://qlhfjqrniyudeqtbmuop.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k"
```

## What's Deployed

Your platform includes:
- 128 production-ready files
- Next.js 13 with App Router
- Supabase database (already configured)
- 11 Supabase Edge Functions for automation
- Real-time conflict monitoring
- Market intelligence tracking
- Interactive maps with Leaflet
- OSINT intelligence feeds
- Threat prediction models
- Multi-language support
- Humanitarian crisis tracking

## After Deployment

Once deployed, you'll get a URL like:
- `https://your-site-name.netlify.app`

### Automatic Deployments
Every time you push to GitHub, Netlify will automatically rebuild and deploy your site!

### Custom Domain (Optional)
1. In Netlify: Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

## Troubleshooting

**Build fails on Netlify:**
- Check that environment variables are set correctly
- Review build logs in Netlify dashboard
- Ensure Node.js version is 18.x or higher

**Can't push to GitHub:**
- Make sure you've created the repository first
- Verify you're using the correct authentication method
- Try SSH instead of HTTPS if tokens aren't working

**Site loads but features don't work:**
- Verify environment variables in Netlify
- Check browser console for errors
- Ensure Supabase URL and key are correct

## Need Help?

- GitHub Docs: https://docs.github.com/
- Netlify Docs: https://docs.netlify.com/
- Netlify CLI: https://docs.netlify.com/cli/get-started/

---

**Ready to Deploy!** Your code is committed and ready to push to GitHub.
