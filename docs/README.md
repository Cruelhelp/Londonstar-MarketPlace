# London Star Marketplace

A premium, full-featured e-commerce marketplace built with vanilla JavaScript, HTML, and CSS. Features seller product management, admin panel, buyer marketplace, and Supabase integration.

## Features

### 🎯 Multi-Role System
- **Buyers**: Browse products, search, filter, add to cart, checkout
- **Sellers**: Upload products with images, manage inventory, payment setup
- **Admin**: Dashboard overview, product management, user management, platform settings

### 🛒 Buyer Features
- Modern Amazon-like interface
- Advanced product search and filtering
- Category navigation
- Product detail views
- Shopping cart with quantity management
- Smooth checkout process
- Responsive design

### 💼 Seller Features
- Intuitive product upload interface
- Multi-image upload with drag & drop
- Product management (edit/delete)
- Stock tracking
- Payment setup (Stripe, PayPal, Bank Transfer)
- Sales statistics dashboard
- Real-time inventory updates

### 👨‍💼 Admin Features
- Comprehensive dashboard with statistics
- Product management across all sellers
- User management
- Order tracking
- Platform settings configuration
- Revenue tracking

### 🎨 Design & UX
- Professional Amazon-inspired UI
- Smooth animations and transitions
- Loading screens with branded logo
- Responsive mobile-first design
- Custom SVG logo
- Color scheme optimized for e-commerce
- Shadow effects and hover states
- Toast notifications

### 🔧 Technical Features
- Supabase integration ready
- LocalStorage fallback for demo mode
- Image preview before upload
- Base64 image encoding
- Role-based authentication
- Clean, modular code structure
- No external UI frameworks needed

## Project Structure

```
london-star-marketplace/
├── index.html              # Login/Registration page
├── marketplace.html        # Buyer marketplace
├── seller.html            # Seller dashboard
├── admin.html             # Admin panel
├── README.md              # Documentation
├── css/
│   └── main.css           # Main stylesheet
├── js/
│   ├── supabase-config.js    # Supabase configuration
│   ├── auth.js               # Authentication handler
│   └── product-manager.js    # Product CRUD operations
└── images/                # Product images (auto-generated)
```

## Quick Start

### 1. Clone or Download
```bash
cd london-star-marketplace
```

### 2. Open in Browser
Simply open `index.html` in your web browser. No build process required!

### 3. Demo Login
- **Admin Access**: Username: `admin` (any password)
- **Seller Access**: Sign up and select "Seller" account type
- **Buyer Access**: Sign up and select "Buyer" account type

## Supabase Setup (Optional)

The application currently works with localStorage for demo purposes. To enable full Supabase integration:

### 1. Database Schema

Create these tables in your Supabase project:

```sql
-- Users table
CREATE TABLE users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    images JSONB,
    seller_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES users(id),
    total DECIMAL(10,2),
    status TEXT DEFAULT 'pending',
    items JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payment info table
CREATE TABLE payment_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    seller_id UUID REFERENCES users(id),
    payment_method TEXT,
    account_email TEXT,
    account_id TEXT,
    account_name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Storage Bucket

Create a storage bucket named `product-images` for product photos:

1. Go to Storage in Supabase dashboard
2. Create new bucket: `product-images`
3. Set to Public
4. Configure upload policies

### 3. Enable Row Level Security (RLS)

```sql
-- Users can read all products
CREATE POLICY "Products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert products"
ON products FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
ON products FOR UPDATE
USING (auth.uid() = seller_id);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
ON products FOR DELETE
USING (auth.uid() = seller_id);
```

### 4. Activate Supabase Integration

In the HTML files, uncomment the Supabase code blocks and comment out the localStorage demo code.

## Configuration

### Supabase Credentials
Update in `js/supabase-config.js`:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

Current demo credentials are already configured.

### Styling
Customize colors in `css/main.css`:
```css
:root {
    --primary-color: #131921;
    --secondary-color: #232f3e;
    --accent-color: #ff9900;
    /* ... more variables */
}
```

## User Guide

### For Sellers

1. **Sign Up**: Create account and select "Seller" role
2. **Add Products**:
   - Click "Add New Product"
   - Fill in product details
   - Upload images (drag & drop or click)
   - Set price and stock
   - Save product
3. **Manage Inventory**: Edit or delete products from dashboard
4. **Payment Setup**: Configure payment method to receive funds

### For Buyers

1. **Browse**: View all products or filter by category
2. **Search**: Use search bar for specific products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Review cart and proceed to checkout
5. **Sort**: Sort products by price or name

### For Admins

1. **Login**: Use username "admin"
2. **Dashboard**: View platform statistics
3. **Manage Products**: View/delete all products
4. **Manage Users**: View all registered users
5. **Settings**: Configure platform settings

## Features Deep Dive

### Product Upload
- Multi-image support
- Drag and drop interface
- Image preview before upload
- Base64 encoding for demo mode
- File validation (image types only)
- Real-time preview updates

### Shopping Cart
- Persistent across sessions (localStorage)
- Quantity adjustment
- Item removal
- Real-time total calculation
- Slide-out panel UI
- Cart badge counter

### Authentication
- Email/password sign up
- Role-based access control
- Admin bypass (username: "admin")
- Session persistence
- Automatic role routing

### Animations
- Fade in/out effects
- Slide up animations
- Loading spinners
- Smooth transitions
- Hover effects
- Modal animations

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Storage**: LocalStorage (demo), Supabase Storage (production)
- **Design**: Custom CSS with Amazon-inspired UI

## Performance

- No external dependencies (except Supabase SDK)
- Optimized CSS animations
- Lazy loading ready
- Efficient DOM manipulation
- Minimal file sizes

## Security Notes

- Never commit real Supabase keys to public repos
- Enable RLS policies in production
- Validate file uploads on server side
- Sanitize user inputs
- Use HTTPS in production
- Implement rate limiting for API calls

## Future Enhancements

- [ ] Real payment gateway integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Order tracking
- [ ] Multi-currency support
- [ ] Advanced search with filters
- [ ] Seller verification system
- [ ] Chat support

## Troubleshooting

### Products not showing?
- Check browser console for errors
- Verify localStorage is enabled
- Try clearing localStorage and adding new products

### Images not uploading?
- Check file size (should be < 5MB)
- Verify file type is image (PNG, JPG, etc.)
- Check browser console for errors

### Cart not persisting?
- Ensure localStorage is enabled in browser
- Check for private/incognito mode
- Verify no browser extensions blocking storage

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

Developed by: Ruel McNeil
Design Inspiration: Amazon
Icons: Custom SVG

---

**London Star Marketplace** - Premium E-commerce Experience
