# Security Guidelines

## ⚠️ Before Pushing to GitHub

### 1. **Protect Your Supabase Credentials**

**CRITICAL**: Your Supabase credentials in `js/supabase-config.js` are currently **EXPOSED**!

Before pushing to GitHub:

1. **Replace the actual credentials with placeholders:**

```javascript
// js/supabase-config.js
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

2. **Keep a local copy with real credentials** (not tracked by Git)
3. **Add the file to .gitignore** if you want to exclude it entirely

### 2. **Use Environment Variables (Recommended)**

For production, use environment variables:

1. Create a `config.js` that loads from environment
2. Use a build tool to inject credentials at build time
3. Never commit actual keys to version control

### 3. **Supabase Security Checklist**

- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Set proper authentication policies
- ✅ Use anon key for public access only
- ✅ Never expose service role key in frontend code
- ✅ Enable email confirmation for new users
- ✅ Configure proper CORS settings

### 4. **GitHub Repository Settings**

If you accidentally committed credentials:

1. **Rotate your Supabase keys immediately** in the Supabase dashboard
2. Remove the commit from history using `git filter-branch` or BFG Repo-Cleaner
3. Force push the cleaned history

### 5. **Additional Security Measures**

- Keep dependencies updated (`npm audit`)
- Use HTTPS in production
- Implement rate limiting on API calls
- Sanitize user inputs to prevent XSS
- Use Content Security Policy (CSP) headers

## 🔒 Current Exposed Credentials

**WARNING**: The following file contains your actual Supabase credentials:
- `js/supabase-config.js`

**ACTION REQUIRED**: Replace these with placeholders before pushing to GitHub!

## 📞 Report Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

Do NOT create a public GitHub issue for security vulnerabilities.
