# Editable Sections Guide

## Admin Panel (admin.html)

### Homepage Tab - Background Images

#### 1. **Homepage Hero Background**
- **Location**: Homepage hero banner section
- **Recommended Size**: 1920x600px
- **File Types**: JPG, PNG, GIF (max 5MB)
- **Database Key**: `hero_background`
- **Affects**: `index.html` `.hero-banner` background

#### 2. **Marketplace Hero Background**
- **Location**: Marketplace hero section
- **Recommended Size**: 1920x400px
- **File Types**: JPG, PNG, GIF (max 5MB)
- **Database Key**: `marketplace_hero_background`
- **Affects**: `marketplace.html` `.hero-section` background

---

## Homepage (index.html)

### Editable Sections

#### 1. **Hero Banner** (Lines 1110-1129)
```html
<div class="hero-banner">
```

**Currently Editable via Admin:**
- ✅ Background image

**Hardcoded Elements:**
```html
<img src="images/logo-new.svg" alt="London Star Marketplace" style="height: 240px;">
<p>Your Premium Marketplace</p>
<p>Trusted sellers • Quality products • Worldwide shipping</p>
<button>Start Shopping</button>
<button>Become a Seller</button>
```

**Can Be Made Editable:**
- Logo image path
- "Your Premium Marketplace" text
- Subtitle text
- Button labels and links

---

#### 2. **Hot Products Promo Banner** (Lines 1123-1127)
```html
<div class="hero-promo-banner">
    <div class="promo-item" id="promo1"></div>
    <div class="promo-item" id="promo2"></div>
    <div class="promo-item" id="promo3"></div>
</div>
```

**Status**: ✅ Auto-populated from database
- Pulls top 3 products by views
- Shows product image, name, price, description
- Badges: "🔥 HOT", "⭐ TRENDING", "💎 TOP PICK"

---

#### 3. **Featured Products Section** (Lines 1259-1304)

**Featured Products Banner** (Lines 1261-1273)
```html
<div style="background: linear-gradient(to right, #c2410c 0%, #f97316 50%, #fb923c 100%);">
```

**Hardcoded Elements:**
```html
<h2>Featured Products from Our Marketplace</h2>
<p>Discover quality products from trusted sellers across Jamaica & worldwide.</p>
```

**Can Be Made Editable:**
- Banner title
- Banner description
- Background gradient colors

**"Top Picks" Section** (Lines 1278-1281)
```html
<h2>Top Picks</h2>
```

**Can Be Made Editable:**
- Section title
- Underline width/color

**Products Grid** (Line 1284)
```html
<div id="featuredProducts" class="featured-products-grid">
```

**Status**: ✅ Auto-populated from database
- Shows 8 most recent products
- Product cards auto-generated

---

#### 4. **Secondary Navigation** (Lines 1094-1107)
```html
<div class="secondary-nav">
    <a href="marketplace.html">All Products</a>
    <a href="marketplace.html?filter=new">New Arrivals</a>
    <a href="marketplace.html?filter=trending">Trending</a>
    <!-- ... more categories -->
</div>
```

**Status**: Hardcoded
**Can Be Made Editable:**
- Category links and labels
- Filter options
- Display order

---

## Marketplace (marketplace.html)

### Editable Sections

#### 1. **Hero Section** (Lines 279-284)
```html
<div class="hero-section">
    <div class="hero-content">
        <h1>Discover Premium Products</h1>
        <p>Shop from thousands of sellers worldwide</p>
    </div>
</div>
```

**Currently Editable via Admin:**
- ✅ Background image

**Hardcoded Elements:**
```html
<h1>Discover Premium Products</h1>
<p>Shop from thousands of sellers worldwide</p>
```

**Can Be Made Editable:**
- Hero title
- Hero subtitle

---

#### 2. **Category Navigation** (Lines 288-297)
```html
<div class="category-nav">
    <button class="category-btn active" onclick="filterByCategory('all')">All Products</button>
    <button class="category-btn" onclick="filterByCategory('electronics')">Electronics</button>
    <!-- ... more categories -->
</div>
```

**Status**: Hardcoded
**Can Be Made Editable:**
- Category list
- Category labels
- Display order

---

## Summary of Editable vs Hardcoded

### ✅ Currently Editable via Admin Panel

1. **Homepage Hero Background** - Upload via Admin → Homepage tab
2. **Marketplace Hero Background** - Upload via Admin → Homepage tab
3. **Products** - Manage via Admin → Products tab
4. **Hot Products Promo** - Auto-populated from top products
5. **Featured Products** - Auto-populated from recent products

### 🔧 Hardcoded (Can Be Made Editable)

#### **Text Content**
- Homepage hero title: "Your Premium Marketplace"
- Homepage hero subtitle: "Trusted sellers • Quality products • Worldwide shipping"
- Featured products banner title: "Featured Products from Our Marketplace"
- Featured products banner description
- Top Picks section title
- Marketplace hero title: "Discover Premium Products"
- Marketplace hero subtitle: "Shop from thousands of sellers worldwide"
- Button labels

#### **Navigation**
- Secondary navigation links and categories
- Category navigation buttons
- Filter options

#### **Styling**
- Featured products banner gradient colors
- Logo image paths
- Decorative elements

---

## Recommendations for Future Editability

### High Priority
1. **Hero Section Text Editor**
   - Homepage hero title & subtitle
   - Marketplace hero title & subtitle
   - Store in `platform_settings` as `homepage_hero_text` and `marketplace_hero_text`

2. **Featured Banner Editor**
   - Title and description
   - Background colors/gradients
   - Store in `platform_settings` as `featured_banner_settings`

### Medium Priority
3. **Navigation Manager**
   - Add/edit/remove secondary nav links
   - Manage category filters
   - Store in database table `navigation_items`

4. **Button Customization**
   - Edit button labels
   - Change button links
   - Store in `platform_settings`

### Low Priority
5. **Logo Manager**
   - Upload custom logo
   - Logo sizing options
   - Store in `platform_settings` as `site_logo`

6. **Color Scheme Editor**
   - Edit gradient colors
   - Change accent colors
   - Store in `platform_settings` as `theme_colors`

---

## Database Structure

All editable content is stored in the `platform_settings` table:

```sql
CREATE TABLE platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Current Settings:**
- `hero_background` - Homepage hero background image
- `marketplace_hero_background` - Marketplace hero background image

**Potential Settings:**
- `homepage_hero_text` - Hero section text content
- `marketplace_hero_text` - Marketplace hero text content
- `featured_banner_settings` - Featured products banner config
- `navigation_items` - Secondary nav configuration
- `button_settings` - Button labels and links
- `site_logo` - Logo configuration
- `theme_colors` - Color scheme settings
