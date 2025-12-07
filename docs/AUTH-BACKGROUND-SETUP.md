# Login Page Custom Background Setup

## Overview

You can now upload custom background images for the login/authentication page through the admin panel. The custom background will replace the default floating bubbles animation.

---

## Setup Instructions

### Step 1: Run Database Migration

Open your **Supabase SQL Editor** and run this migration:

```sql
-- Add auth_background column to homepage_settings table
ALTER TABLE homepage_settings
ADD COLUMN IF NOT EXISTS auth_background TEXT;
```

Or run the file: `migration-add-auth-background.sql`

### Step 2: Access Admin Panel

1. Log in to your admin account at `admin.html`
2. Navigate to the **"Customise Backgrounds"** tab
3. Scroll to the **"Login Page Background Image"** section

### Step 3: Upload Background

1. Click **"Choose File"** under "Upload Background Image"
2. Select an image (JPG, PNG, or GIF - max 5MB)
   - Recommended size: 1920x1080px or higher
3. Preview will appear automatically
4. Click **"Save Background"** button
5. Success toast will confirm upload

### Step 4: Verify on Login Page

1. Open `auth.html` (login page) in a new tab
2. The custom background should now be displayed
3. The default floating bubbles will be hidden

---

## Features

### Upload Interface
- **File validation**: Max 5MB, image files only
- **Live preview**: See your image before saving
- **Current background**: View what's currently set

### Remove Background
- Click **"Remove Background"** button
- Confirmation modal will appear
- Default floating bubbles will be restored

### Automatic Loading
- Background loads automatically on login page
- Falls back to default bubbles if no custom background is set
- No caching issues - always shows latest version

---

## Technical Details

### Files Modified

1. **`js/supabase-homepage.js`**
   - Added `saveAuthBackground(imageData)`
   - Added `getAuthBackground()`
   - Added `removeAuthBackground()`

2. **`auth.html`**
   - Added background CSS properties to body
   - Added `loadAuthBackground()` function
   - Hides bubbles when custom background exists
   - Script reference to `js/supabase-homepage.js`

3. **`admin.html`**
   - New "Login Page Background Image" section
   - Preview and upload interface
   - JavaScript functions for upload/remove/load
   - Calls `loadCurrentAuthBackground()` on page load

4. **`migration-add-auth-background.sql`**
   - Adds `auth_background` TEXT column to `homepage_settings`

### Database Schema

The auth background is stored in the `homepage_settings` table:

```sql
homepage_settings (
  id: integer (always 1)
  hero_background: TEXT
  auth_background: TEXT  -- NEW
  updated_at: timestamp
)
```

The image is stored as a Base64-encoded string (data URL format).

---

## Best Practices

### Image Selection
- Use high-quality images (1920x1080px or 2560x1440px)
- Ensure good contrast with white auth card
- Avoid busy patterns that make the form hard to read
- Test on mobile devices (responsive background)

### File Size
- Keep under 5MB for fast loading
- Optimize images before uploading (use tools like TinyPNG)
- Consider using JPG for photos, PNG for graphics

### Testing
- Test on different screen sizes
- Verify auth card remains readable
- Check loading performance

---

## Troubleshooting

### Background not showing
1. Check browser console for errors
2. Verify migration SQL ran successfully
3. Check Supabase for `auth_background` column exists
4. Hard refresh the page (Ctrl+Shift+R)

### Image too large
- Error will show "Image size must be less than 5MB"
- Reduce image size/quality before uploading
- Use online compression tools

### Background not saving
- Check Supabase connection in admin panel
- Verify `homepage_settings` table exists
- Check browser console for API errors

---

## Example Usage

```javascript
// Save background (from admin panel)
const result = await HomepageDB.saveAuthBackground(base64ImageData);
if (result.success) {
  console.log('Background saved!');
}

// Load background (on auth page)
const result = await HomepageDB.getAuthBackground();
if (result.success && result.data) {
  document.body.style.backgroundImage = `url(${result.data})`;
}

// Remove background
const result = await HomepageDB.removeAuthBackground();
if (result.success) {
  console.log('Background removed!');
}
```

---

## Summary

✅ Admin can upload custom login page backgrounds
✅ Automatic preview before saving
✅ Easy removal with one click
✅ Falls back to default bubbles if not set
✅ Responsive and mobile-friendly
✅ Stored in Supabase database
