# Deploy Your Site NOW - Step by Step

Your site is ready to go live! Follow these exact steps to deploy and get your ads.txt file working.

## Step 1: Push to GitHub (5 minutes)

1. Go to https://github.com/new
2. Create a new repository (name it whatever you want, e.g., "war-intelligence-platform")
3. **DO NOT** initialize with README, .gitignore, or license
4. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/REPO_NAME.git`)
5. Run these commands in your terminal:

```bash
cd /tmp/cc-agent/64662283/project
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git commit -m "Initial commit with ads.txt fix"
git push -u origin main
```

## Step 2: Deploy to Netlify (3 minutes)

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Authorize Netlify to access your GitHub
5. Select your repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Leave everything else as default
7. Click **"Deploy site"**

## Step 3: Add Environment Variables (2 minutes)

While the site is deploying:

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"** and add these TWO variables:

**Variable 1:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://qlhfjqrniyudeqtbmuop.supabase.co`

**Variable 2:**
- Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k`

3. Go back to **Deploys** tab
4. Click **"Trigger deploy"** → **"Deploy site"**

## Step 4: Verify ads.txt (1 minute)

Once deployment completes:

1. Your site will have a URL like: `https://YOUR_SITE_NAME.netlify.app`
2. Visit: `https://YOUR_SITE_NAME.netlify.app/ads.txt`
3. You should see:
   ```
   google.com, pub-5040534732303778, DIRECT, f08c47fec0942fa0
   ```

## Step 5: Update AdSense (24-48 hours)

1. Go to your AdSense dashboard
2. Update your site URL to your Netlify URL (or custom domain)
3. Wait 24-48 hours for Google to crawl your ads.txt file
4. The warning will disappear once verified

## Using a Custom Domain (Optional)

If you want to use your own domain:

1. In Netlify dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Follow the DNS instructions provided
4. Once connected, ads.txt will be at: `https://yourdomain.com/ads.txt`

## Troubleshooting

**Build fails?**
- Check that environment variables are set correctly
- Make sure you selected the right repository

**ads.txt not found?**
- Wait a few minutes after deployment
- Clear your browser cache
- Try incognito/private mode

**AdSense still shows warning?**
- Google takes 24-48 hours to crawl
- Make sure the URL in AdSense matches your live site
- Verify ads.txt is accessible publicly

## What Happens Next?

After deployment:
- Every time you push code to GitHub, Netlify automatically redeploys
- Your site will be live 24/7
- ads.txt will be served correctly
- AdSense will start working once verified

---

**Ready to deploy?** Start with Step 1 above!
