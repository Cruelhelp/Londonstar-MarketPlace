// Demo Data Generator for London Star Marketplace
// Use this to populate the marketplace with sample products

const DEMO_CATEGORIES = [
    'electronics', 'fashion', 'home', 'sports', 'books', 'toys', 'beauty', 'other'
];

const DEMO_PRODUCTS = [
    {
        name: "Wireless Bluetooth Headphones",
        price: "79.99",
        category: "electronics",
        description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals.",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"]
    },
    {
        name: "Smart Watch Pro",
        price: "299.99",
        category: "electronics",
        description: "Advanced smartwatch with health monitoring, GPS tracking, and 5-day battery life. Stay connected and healthy.",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"]
    },
    {
        name: "Minimalist Leather Backpack",
        price: "129.99",
        category: "fashion",
        description: "Handcrafted genuine leather backpack with laptop compartment. Stylish and functional for daily use.",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"]
    },
    {
        name: "Designer Sunglasses",
        price: "159.99",
        category: "fashion",
        description: "UV400 protection polarized sunglasses with premium frames. Make a statement while protecting your eyes.",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400"]
    },
    {
        name: "Ceramic Coffee Mug Set",
        price: "34.99",
        category: "home",
        description: "Set of 4 handmade ceramic mugs. Microwave and dishwasher safe. Perfect for your morning coffee.",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400"]
    },
    {
        name: "Scented Candle Collection",
        price: "49.99",
        category: "home",
        description: "Premium soy wax candles in 5 luxurious scents. 40-hour burn time each. Create the perfect ambiance.",
        stock: 60,
        images: ["https://images.unsplash.com/photo-1602874801006-e0c4c93c9d7f?w=400"]
    },
    {
        name: "Yoga Mat Premium",
        price: "45.99",
        category: "sports",
        description: "Extra thick non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and floor exercises.",
        stock: 35,
        images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"]
    },
    {
        name: "Resistance Bands Set",
        price: "29.99",
        category: "sports",
        description: "Set of 5 resistance bands with different strengths. Great for home workouts and physical therapy.",
        stock: 45,
        images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400"]
    },
    {
        name: "The Art of Programming",
        price: "39.99",
        category: "books",
        description: "Comprehensive guide to modern programming practices. Perfect for beginners and intermediate developers.",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400"]
    },
    {
        name: "Mindfulness Journal",
        price: "24.99",
        category: "books",
        description: "Guided journal for daily mindfulness practice. Includes prompts, quotes, and reflection exercises.",
        stock: 75,
        images: ["https://images.unsplash.com/photo-1517842645767-c639042777db?w=400"]
    },
    {
        name: "STEM Building Blocks Set",
        price: "69.99",
        category: "toys",
        description: "Educational building blocks for kids 6+. Encourages creativity and problem-solving skills.",
        stock: 40,
        images: ["https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400"]
    },
    {
        name: "Remote Control Drone",
        price: "149.99",
        category: "toys",
        description: "HD camera drone with 20-minute flight time. Easy to fly for beginners, exciting for enthusiasts.",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400"]
    },
    {
        name: "Natural Face Serum",
        price: "54.99",
        category: "beauty",
        description: "Organic vitamin C serum for brightening and anti-aging. All natural ingredients, cruelty-free.",
        stock: 55,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400"]
    },
    {
        name: "Luxury Skincare Set",
        price: "89.99",
        category: "beauty",
        description: "Complete skincare routine in one set. Includes cleanser, toner, serum, and moisturizer.",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400"]
    }
];

// Function to load demo products
function loadDemoProducts() {
    const existingProducts = localStorage.getItem('sellerProducts');

    if (!existingProducts || JSON.parse(existingProducts).length === 0) {
        const products = DEMO_PRODUCTS.map((product, index) => ({
            id: `demo-${Date.now()}-${index}`,
            ...product,
            createdAt: new Date().toISOString()
        }));

        localStorage.setItem('sellerProducts', JSON.stringify(products));
        console.log(`✅ Loaded ${products.length} demo products`);
        return products;
    } else {
        console.log('ℹ️ Products already exist, skipping demo data load');
        return JSON.parse(existingProducts);
    }
}

// Function to clear all products
function clearAllProducts() {
    localStorage.removeItem('sellerProducts');
    console.log('🗑️ All products cleared');
}

// Function to reset to demo data
function resetToDemoData() {
    clearAllProducts();
    return loadDemoProducts();
}

// Function to add random demo product
function addRandomDemoProduct() {
    const randomProduct = DEMO_PRODUCTS[Math.floor(Math.random() * DEMO_PRODUCTS.length)];
    const products = JSON.parse(localStorage.getItem('sellerProducts') || '[]');

    const newProduct = {
        id: `demo-${Date.now()}`,
        ...randomProduct,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem('sellerProducts', JSON.stringify(products));
    console.log('✅ Added random product:', newProduct.name);
    return newProduct;
}

// Export functions for use in console
window.demoData = {
    load: loadDemoProducts,
    clear: clearAllProducts,
    reset: resetToDemoData,
    addRandom: addRandomDemoProduct
};

// Auto-load demo products if none exist (optional - comment out if not desired)
// window.addEventListener('DOMContentLoaded', () => {
//     loadDemoProducts();
// });

console.log('📦 Demo Data utilities loaded. Use window.demoData.* to manage demo products');
console.log('Available commands:');
console.log('  - demoData.load()      : Load demo products');
console.log('  - demoData.clear()     : Clear all products');
console.log('  - demoData.reset()     : Reset to demo data');
console.log('  - demoData.addRandom() : Add random product');
