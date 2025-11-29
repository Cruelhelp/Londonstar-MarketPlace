# London Star Marketplace - Logo Assets

## Logo Files

### `logo.svg`
Full horizontal logo with icon + "marketplace" text
- **Use for**: Landing pages, hero sections, large displays
- **Dimensions**: 500x200px viewBox
- **Format**: SVG vector

### `logo-icon.svg`
Icon-only version with "LONDON" text in star
- **Use for**: App icons, favicons, small spaces
- **Dimensions**: 200x200px viewBox
- **Format**: SVG vector

### `logols.png`
Original source logo (reference)
- **Format**: PNG raster

## Logo Variants (in `js/logo.js`)

The logo JavaScript file contains multiple programmatic variants:

- `LondonStarLogo.full` - Full logo with text
- `LondonStarLogo.icon` - Icon only with LONDON text
- `LondonStarLogo.loading` - Loading screen version (white text)
- `LondonStarLogo.compact` - Compact horizontal version for headers

## Design Specifications

### Colors
- **Primary Orange**: `#ff9900` - Circles and star
- **Dark Text**: `#131921` - "star" text and "LONDON" text
- **Gray Text**: `#565959` - "MARKETPLACE" subtitle
- **White**: `#ffffff` - Loading screen variant

### Typography
- **Font Family**: Arial, Helvetica, sans-serif
- **"LONDON"**: 14-16px, bold (700), letter-spacing 1-1.5px
- **"marketplace"**: 32-68px, bold (700)

### Star Geometry
5-pointed star centered in concentric circles
- **Outer circle**: 85px radius, 3px stroke
- **Middle circle**: 75px radius, 4px stroke
- **Inner circle**: 65px radius, 4.5px stroke

## Usage Guidelines

### Header Navigation
```html
<svg class="logo" viewBox="0 0 200 200">
  <!-- Icon with LONDON text -->
</svg>
<span class="brand-name">marketplace</span>
```

### Loading Screen
```html
<svg class="loading-logo" viewBox="0 0 200 200">
  <!-- Icon with white LONDON text -->
</svg>
```

### Authentication Pages
```html
<svg width="100" height="50" viewBox="0 0 280 80">
  <!-- Compact horizontal logo -->
</svg>
```

## Responsive Behavior

- **Desktop**: Full logo or compact version
- **Tablet**: Icon + "star" text
- **Mobile**: Icon only

## File Locations

```
images/
├── logo.svg              # Full horizontal logo
├── logo-icon.svg         # Icon only
├── logols.png           # Original reference
└── README.md            # This file

js/
└── logo.js              # Programmatic variants
```

## Brand Consistency

Always maintain:
- Orange (#ff9900) as primary brand color
- Concentric circle motif
- 5-pointed star as central element
- "LONDON" text in caps within the star
- "marketplace" in lowercase as brand name
- Logo icon + "marketplace" text format

## Updates

Logo integrated across:
- ✅ index.html (login page)
- ✅ marketplace.html (buyer interface)
- ✅ seller.html (seller dashboard)
- ✅ seller-profile.html (seller profile)
- ✅ admin.html (admin panel)
- ✅ quickstart.html (setup guide)
- ✅ setup-database.html (database setup)

---

**London Star Marketplace** - Premium E-commerce Experience
