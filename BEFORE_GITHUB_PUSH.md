# ⚠️ BEFORE PUSHING TO GITHUB - READ THIS!

## 🔴 CRITICAL: Your Supabase Credentials Are Exposed!

Your actual Supabase URL and API key are currently in `js/supabase-config.js`.

**If you push this to GitHub, your credentials will be public and anyone can access your database!**

---

## ✅ Quick Fix (Choose One Option)

### Option 1: Replace with Placeholders (Recommended)

1. Open `js/supabase-config.js`
2. Replace lines 2-3 with:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

3. **Save your real credentials somewhere safe** (like a password manager)
4. Add a note in README telling users to add their own credentials

### Option 2: Use Git-Ignored Config File

1. Create a new file `js/supabase-config.local.js` with your real credentials:

```javascript
// js/supabase-config.local.js (NOT tracked by Git)
const SUPABASE_URL = 'https://klmfpofizmycjvlnrpwo.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-key-here';
```

2. Update `.gitignore` to exclude it:
```
js/supabase-config.local.js
```

3. In HTML files, load the local config instead

### Option 3: Use Environment Variables (Advanced)

Use a build tool like Vite or Webpack to inject credentials at build time.

---

## 📋 Pre-Push Checklist

Before running `git push`:

- [ ] Removed or replaced Supabase credentials in `js/supabase-config.js`
- [ ] Verified `.gitignore` is working (`git status` shouldn't show `.env` or sensitive files)
- [ ] Checked for any other hardcoded secrets (API keys, passwords, etc.)
- [ ] Tested that the app still runs locally after changes
- [ ] Updated README with setup instructions for new users

---

## 🚀 Safe to Push After:

```bash
# Check what will be committed
git status

# Make sure no sensitive files are listed
git add .

# Commit with a clear message
git commit -m "Initial commit - marketplace platform"

# Push to GitHub
git push origin main
```

---

## 🆘 If You Already Pushed Credentials:

**URGENT STEPS:**

1. **Immediately rotate your Supabase keys:**
   - Go to: https://supabase.com/dashboard/project/_/settings/api
   - Click "Rotate" on your anon key
   - Update your local files with new keys

2. **Remove the commit from history:**
   ```bash
   # Install BFG Repo-Cleaner
   # Then run:
   bfg --delete-files supabase-config.js
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

3. **Or** delete the repository and start fresh

---

## 📞 Need Help?

- Check: [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- Read: `SECURITY.md` in this project
