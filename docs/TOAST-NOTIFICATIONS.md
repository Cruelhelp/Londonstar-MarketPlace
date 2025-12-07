# Toast Notification System

## Overview
Custom in-app notification system that replaces browser `alert()` popups with elegant toast notifications.

## Features
- ✅ 4 notification types: Success, Error, Warning, Info
- ✅ Auto-dismiss after configurable duration
- ✅ Smooth slide-in/out animations
- ✅ Stackable notifications (multiple can show at once)
- ✅ Manual close button
- ✅ Mobile responsive
- ✅ Color-coded with icons

## How to Use

### 1. Include the Script
Add to your HTML page (already added to admin.html):
```html
<script src="js/toast.js"></script>
```

### 2. Basic Usage

#### Success Notification
```javascript
showSuccess('Product added successfully!');
```

#### Error Notification
```javascript
showError('Failed to save data. Please try again.');
```

#### Warning Notification
```javascript
showWarning('Please select at least one image');
```

#### Info Notification
```javascript
showInfo('Your changes will be saved automatically');
```

### 3. Advanced Usage

#### Custom Duration (in milliseconds)
```javascript
showSuccess('Quick message', 2000);  // Shows for 2 seconds
showError('Important error', 10000);  // Shows for 10 seconds
```

#### Persistent Notification (won't auto-close)
```javascript
showToast('Critical alert - click to dismiss', 'error', 0);
```

#### Generic Toast
```javascript
showToast('Your message here', 'success', 4000);
```

### 4. Programmatic Control

#### Close Specific Toast
```javascript
const toastId = showSuccess('Processing...');
// Later...
closeToast(toastId);
```

#### Close All Toasts
```javascript
closeAllToasts();
```

## Replacing alert() Calls

### Before (Browser Alert)
```javascript
alert('Product added successfully!');
alert('Error: ' + error.message);
```

### After (Toast Notifications)
```javascript
showSuccess('Product added successfully!');
showError('Error: ' + error.message);
```

## Notification Types & Colors

| Type    | Color  | Use Case                          |
|---------|--------|-----------------------------------|
| Success | Green  | Successful operations             |
| Error   | Red    | Errors, failures, validation      |
| Warning | Yellow | Warnings, confirmations needed    |
| Info    | Blue   | Informational messages            |

## Examples in Code

### Product Management
```javascript
// Success
showSuccess('Product added successfully!');
showSuccess('Stock updated!');

// Error
showError('Failed to delete product: ' + error.message);

// Warning
showWarning('Please upload at least one image');
```

### User Management
```javascript
// Success
showSuccess('User role changed successfully');

// Info
showInfo('Email verification sent');
```

### Form Validation
```javascript
if (!productName) {
    showWarning('Product name is required');
    return;
}

if (price < 0) {
    showError('Price cannot be negative');
    return;
}

showSuccess('Form submitted successfully!');
```

## Styling
Styles are defined in `css/main.css` under the "TOAST NOTIFICATIONS" section.

### Customization
To customize colors, edit the CSS variables:
```css
.toast.success .toast-icon {
    background: #d1fae5;  /* Change this */
    color: #059669;       /* And this */
}
```

## Migration Guide

### Step 1: Add Script
Include `<script src="js/toast.js"></script>` in your HTML

### Step 2: Find & Replace
Search for `alert(` in your JavaScript and replace with appropriate toast function:
- `alert('Success...')` → `showSuccess('Success...')`
- `alert('Error...')` → `showError('Error...')`

### Step 3: Test
Verify notifications appear correctly and auto-dismiss

## Browser Support
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## Notes
- Maximum 10 toasts recommended at once (older ones auto-dismiss)
- Toast container positioned at top-right on desktop, full-width on mobile
- Z-index set to 10000 to appear above all content
- Animations: 300ms slide in/out

## Already Updated
The following pages have toast notifications implemented:
- ✅ admin.html (Product & Banner management)

## To Update
- marketplace.html
- cart.html
- checkout.html
- orders.html
- profile.html
- seller.html
- And other pages with alert() calls
