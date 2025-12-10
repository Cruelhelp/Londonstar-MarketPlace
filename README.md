# 🛍️ London Star Marketplace

A premium e-commerce marketplace built with vanilla JavaScript, HTML5, and CSS3. Supports three user roles (buyers, sellers, admin) with Supabase backend integration.

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit `http://localhost:8000` to access the marketplace.

## 📁 Project Structure

```
london-star-marketplace/
├── css/                    # Stylesheets
├── js/                     # JavaScript modules
├── images/                 # Assets and logos
├── components/             # Reusable HTML components
├── migrations/             # Database migrations and schema
├── docs/                   # Full documentation
├── index.html              # Authentication page
├── marketplace.html        # Product browsing
├── seller.html            # Seller dashboard
├── admin.html             # Admin panel
└── package.json           # Dependencies
```

## 🎯 Key Features

- ✅ **Multi-role system** (Buyer, Seller, Admin)
- ✅ **Advanced product management** (SKU, featured products, status)
- ✅ **Image carousel** with reordering
- ✅ **Smart caching** for performance
- ✅ **Mobile-optimized** responsive design
- ✅ **Supabase backend** with RLS

## 📚 Documentation

Full documentation available in the `docs/` folder:

- [Setup Guide](docs/SUPABASE-SETUP-GUIDE.md) - Database setup and configuration
- [Seller Registration](docs/SELLER-REGISTRATION-SETUP.md) - Seller onboarding flow
- [Authentication](docs/AUTH-BACKGROUND-SETUP.md) - Custom background setup
- [Features](docs/EDITABLE-SECTIONS.md) - Editable platform sections
- [UI Components](docs/TOAST-NOTIFICATIONS.md) - Toast notification system

## 🔧 Configuration

### Database Setup

Run the main schema:
```bash
# In Supabase SQL Editor
migrations/supabase-schema.sql
```

Apply product feature migrations:
```sql
-- Run latest migrations from migrations/ folder
migrations/migration-*.sql
```

### Environment

No `.env` file needed - Supabase config is in `js/supabase-config.js`

## 🎨 Tech Stack

- **Frontend**: HTML5, CSS3 (custom), Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Caching**: LocalStorage with TTL
- **Assets**: SVG logos, Base64 encoded images

## 👥 User Roles

- **Buyer**: Browse products, add to cart, checkout
- **Seller**: Manage products, view orders, edit profile
- **Admin**: Platform management, user approval, bulk operations

## 🛠️ Development

```bash
npm run dev     # Start dev server on port 3000
npm start       # Start server on port 8000
npm run open    # Start and open in browser
```

## 📝 License

© 2025 London Star Marketplace. All rights reserved.

---

**Maintained by**: Ruel McNeil
**Organization**: CLI SENPEI
