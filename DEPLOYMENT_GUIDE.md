# Quick Deployment Guide

## 🚀 Easy Push to GitHub & Deploy

### First Time Setup

1. **Run the deploy script:**
   ```bash
   ./deploy.sh
   ```

2. **Enter your GitHub repository URL when prompted:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

3. **Connect to Netlify:**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables from `.env` file

### Subsequent Deployments

Just run:
```bash
./deploy.sh
```

The script will:
- ✅ Check for changes
- ✅ Commit your changes
- ✅ Push to GitHub
- ✅ Trigger automatic Netlify deployment

### Manual Git Commands

If you prefer manual control:

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push

# First time push
git push -u origin main
```

### Saved Repository Info

Your git remote is saved locally in `.git/config`. To view:
```bash
git remote -v
```

To update remote URL:
```bash
git remote set-url origin NEW_URL
```

## 🔄 Force Netlify Redeploy

If changes don't appear on your site:

1. **Clear cache deploy:**
   - Netlify Dashboard → Deploys
   - "Trigger deploy" → "Clear cache and deploy site"

2. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Check build logs:**
   - Netlify Dashboard → Deploys → Click on latest deploy
   - Check for any errors

## 📋 Environment Variables Needed in Netlify

```
NEXT_PUBLIC_SUPABASE_URL=https://qlhfjqrniyudeqtbmuop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsaGZqcXJuaXl1ZGVxdGJtdW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjUxODMsImV4cCI6MjA4OTAwMTE4M30.aLjpbPFWI7MQLFXrUHhzapZHqS4oYtCUxwY7O4wJ21k
```

## 🆘 Troubleshooting

**Problem:** Changes not showing on site
- Clear Netlify cache and redeploy
- Hard refresh browser
- Check if environment variables are set in Netlify
- Verify correct branch is deployed (should be `main`)

**Problem:** Build fails
- Check Netlify deploy logs
- Ensure all dependencies are in package.json
- Verify build command is `npm run build`
- Verify publish directory is `.next`

**Problem:** Can't push to GitHub
- Check if remote is configured: `git remote -v`
- Verify GitHub credentials
- Try: `git push -f origin main` (careful - force push)

## 📞 Quick Reference

- **Netlify Dashboard:** https://app.netlify.com/
- **GitHub Repository:** Run `git remote -v` to see your repo URL
- **Supabase Dashboard:** https://supabase.com/dashboard

---

**Tip:** The deploy script saves your repository URL automatically after first setup, so you only need to configure it once!
