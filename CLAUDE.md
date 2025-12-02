# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

London Star Marketplace is a premium e-commerce marketplace built with vanilla JavaScript, HTML5, and CSS3. It supports three user roles (buyers, sellers, admin) with Supabase backend integration and localStorage fallback for demo mode.

**Key Architecture Pattern**: Static frontend with Supabase backend (no build process required).

## Running the Application

### Development Server
```bash
npm start        # Start server on port 8000
npm run dev      # Start server on port 3000
npm run open     # Start server and open in browser
```

The app runs as static HTML - just open `index.html` in a browser or use Python's built-in server.

### Entry Points
- `index.html` - Authentication page (sign in/sign up)
- `home.html` - Public homepage (landing page)
- `marketplace.html` - Buyer product browsing
- `seller.html` - Seller product management dashboard
- `admin.html` - Admin platform management
- `admin-cards.html` - Admin homepage card management

### Admin Access
- Create admin account through signup form
- Run SQL to upgrade user role to 'admin'
- Login with admin credentials to access admin panel

## Code Architecture

### Authentication Flow
1. User signs in via `auth.html` → `js/auth.js` handles Supabase auth
2. On success → `js/session-manager.js` creates session in localStorage
3. Role-based redirect: seller → `seller.html`, buyer → `marketplace.html`, admin → `admin.html`

### Supabase Integration Pattern
The app uses a **dual-mode system**:
- **Demo mode**: localStorage for data persistence (current default)
- **Production mode**: Supabase database (requires setup)

**Critical files**:
- `js/supabase-config.js` - Supabase client initialization
- `js/supabase-init.js` - Database initialization helpers
- `js/supabase-homepage.js` - Homepage data (hero background, cards)
- `js/auth.js` - Authentication handler class
- `js/session-manager.js` - Session management with localStorage
- `js/product-manager.js` - Product CRUD operations

### Database Schema
Run `supabase-schema.sql` in Supabase SQL Editor to create:
- `users` - User profiles (extends auth.users)
- `products` - Product listings with JSONB images
- `orders` - Order tracking
- `payment_info` - Seller payment details
- `reviews` - Product reviews
- `cart_items` - Shopping cart persistence
- `platform_settings` - Global settings (JSONB key-value)
- `homepage_settings` - Homepage hero background (id=1)
- `homepage_cards` - Homepage cards data (id=1, JSONB)

### Homepage Customization System
**Admin-controlled homepage elements**:
- **Hero Background**: Upload images (JPG, PNG, GIF including animated) via `admin-cards.html`
- **Homepage Cards**: Dynamic grid cards managed via `admin-cards.html`

**Implementation**:
- `js/supabase-homepage.js` provides `HomepageDB` helper functions
- Hero background stored in `homepage_settings.hero_background` (Base64)
- Cards stored in `homepage_cards.cards_data` (JSONB array)
- Max image size: 5MB

**Functions**:
```javascript
HomepageDB.saveHeroBackground(imageData)
HomepageDB.getHeroBackground()
HomepageDB.removeHeroBackground()
HomepageDB.saveCards(cardsData)
HomepageDB.getCards()
```

### Styling System
- `css/main.css` - Single stylesheet with CSS custom properties
- Amazon-inspired design: Dark navy header (`#131921`), yellow accents (`#febd69`)
- No CSS preprocessors or frameworks
- Mobile-first responsive design

**Key CSS variables**:
```css
--primary-color: #131921    /* Dark navy */
--secondary-color: #232f3e  /* Lighter navy */
--accent-color: #ff9900     /* Orange */
--accent-hover: #e88b00
```

## Database Setup

### Required Supabase Tables (Production)
Execute `supabase-schema.sql` to create all tables with RLS policies, triggers, and indexes.

### Storage Buckets
- `product-images` - Product photos (public)
- `profile-pictures` - User avatars (public)

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Users can view all products (active only)
- Sellers can CRUD their own products
- Buyers can create orders and reviews
- Users manage their own cart and profile

## Current Migration Status

**⚠️ Active Migration: localStorage → Supabase**

**Completed**:
- Hero background functions migrated to Supabase (`js/supabase-homepage.js`)
- `admin-cards.html` hero background upload uses `HomepageDB.saveHeroBackground()`

**Pending**:
- Homepage cards in `admin-cards.html` still use localStorage
- `home.html` still loads hero background from localStorage
- Need to update `loadHomepageCards()` and `loadHeroBackground()` functions

**Migration Pattern**:
```javascript
// OLD (localStorage)
localStorage.setItem('homepageCards', JSON.stringify(cards));
const cards = JSON.parse(localStorage.getItem('homepageCards') || '[]');

// NEW (Supabase)
await HomepageDB.saveCards(cards);
const result = await HomepageDB.getCards();
const cards = result.data || [];
```

## Image Upload Pattern

**Base64 encoding for demo/simple storage**:
```javascript
const reader = new FileReader();
reader.onload = async function(e) {
    const imageData = e.target.result; // Base64 string
    await HomepageDB.saveHeroBackground(imageData);
};
reader.readAsDataURL(file);
```

**Supabase Storage for production images**:
```javascript
const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(fileName, file);
```

## Role-Based Routing Logic

**auth.html - Authentication flow**:
```javascript
// Supabase authentication
const role = await authHandler.getUserRole(user.id);
sessionManager.createSession(user, role);
if (role === 'seller') window.location.href = 'seller.html';
else if (role === 'admin') window.location.href = 'admin.html';
else window.location.href = 'marketplace.html';
```

## Common Development Patterns

### Session Management
Always check session before accessing protected pages:
```javascript
const session = sessionManager.getSession();
if (!session || !session.isAdmin) {
    window.location.href = 'index.html';
}
```

### Alert System
Use built-in alert function (not browser alert):
```javascript
showAlert('Message here', 'success'); // or 'error', 'info'
```

### Loading Screen Pattern
All pages include loading screen that hides after 1.5s:
```javascript
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1500);
});
```

### Form Submission Pattern
```javascript
async function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Processing...';

    try {
        // Do work
        showAlert('Success!', 'success');
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Submit';
    }
}
```

## File Organization

```
/
├── index.html              # Auth entry point
├── home.html               # Public landing page
├── marketplace.html        # Buyer product catalog
├── seller.html            # Seller dashboard
├── admin.html             # Admin platform management
├── admin-cards.html       # Admin homepage customization
├── css/
│   └── main.css           # Single stylesheet
├── js/
│   ├── supabase-config.js     # Supabase client init
│   ├── supabase-init.js       # Database helpers
│   ├── supabase-homepage.js   # Homepage data management
│   ├── auth.js                # AuthHandler class
│   ├── session-manager.js     # Session management
│   ├── product-manager.js     # Product CRUD
│   ├── demo-data.js           # Sample products
│   └── header-loader.js       # Dynamic header loading
├── images/                # Product/logo images
├── components/            # Reusable HTML components
├── supabase-schema.sql   # Complete database schema
└── SUPABASE-SETUP-GUIDE.md
```

## Debugging

### Check Supabase Connection
Open browser console and check:
```javascript
window.supabaseClient  // Should be defined
await supabaseClient.from('users').select('*').limit(1)
```

### Check Current Session
```javascript
sessionManager.getSession()  // Returns user data or null
localStorage.getItem('userRole')
localStorage.getItem('isAdmin')
```

### Common Issues
- **"relation does not exist"**: Run `supabase-schema.sql` in Supabase dashboard
- **Images not loading**: Check Base64 string length, verify 5MB limit
- **Admin access denied**: Ensure user role is 'admin' in database
- **RLS errors**: Check user is authenticated and has correct role

## Design Principles

1. **No build process**: Pure HTML/CSS/JS, works directly in browser
2. **Progressive enhancement**: Works with localStorage, enhanced with Supabase
3. **Mobile-first**: Responsive design from small screens up
4. **Role-based access**: Enforce on both client and database (RLS)
5. **Clean separation**: Auth → Session → Role → Page routing
6. **Amazon-inspired UI**: Professional e-commerce aesthetics

## Testing Workflow

1. **Demo Mode**: Open `auth.html`, sign up as buyer/seller
2. **Production Mode**: Set up Supabase, run schema, update config
3. **Admin Testing**: Create admin account, upgrade role via SQL, test admin features
4. **Cross-role Testing**: Create multiple accounts to test buyer/seller flows
