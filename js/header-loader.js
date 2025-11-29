// Global Header Loader
// Dynamically loads and configures the header for each page

const HeaderLoader = {
    // Navigation configurations for different page types
    navConfigs: {
        home: [
            { text: 'Browse Products', href: 'marketplace.html', icon: 'shop' },
            { text: 'Sell on London', href: 'seller.html', icon: 'home' },
            { text: 'Sign In', href: 'index.html', icon: 'user' }
        ],
        marketplace: [
            { text: 'Home', href: 'home.html', icon: 'home' },
            { text: 'Sell on London', href: 'seller.html', icon: 'home' },
            { text: 'Cart', action: 'toggleCart', icon: 'cart', badge: true },
            { text: 'Sign Out', href: 'index.html', icon: 'signout' }
        ],
        seller: [
            { text: 'Seller Dashboard', active: true },
            { text: 'Profile Settings', href: 'seller-profile.html' },
            { text: 'View Marketplace', href: 'marketplace.html' },
            { text: 'Sign Out', href: 'index.html', action: 'handleLogout' }
        ],
        auth: [
            { text: 'Back to Home', href: 'home.html', icon: 'home' },
            { text: 'Browse Products', href: 'marketplace.html' },
            { text: 'Sell on Marketplace', href: 'seller.html', icon: 'home' }
        ]
    },

    // SVG icons
    icons: {
        home: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        shop: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
        cart: '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        signout: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        user: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align: middle; margin-right: 6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
    },

    // Load header into page
    async init(pageType) {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Fetch header HTML
            const response = await fetch('components/header.html');
            if (!response.ok) throw new Error('Failed to load header');

            const headerHTML = await response.text();

            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = headerHTML;

            // Insert header at the beginning of body
            const header = temp.firstElementChild;
            const firstElement = document.body.firstChild;

            if (firstElement) {
                document.body.insertBefore(header, firstElement);
            } else {
                document.body.appendChild(header);
            }

            // Configure navigation for this page type
            this.configureNav(pageType);

            // Set up event listeners
            this.setupEventListeners();

        } catch (error) {
            console.error('Header loading error:', error);
            console.error('Error details:', error.message);
            // Fallback: page will use its original header if present
        }
    },

    // Configure navigation links based on page type
    configureNav(pageType) {
        const navContainer = document.getElementById('headerNav');
        if (!navContainer) return;

        const config = this.navConfigs[pageType] || this.navConfigs.home;

        navContainer.innerHTML = config.map(item => {
            const icon = item.icon ? this.icons[item.icon] : '';
            const badge = item.badge ? '<span class="cart-badge" id="cartBadge">0</span>' : '';
            const activeClass = item.active ? ' active' : '';
            const style = item.badge ? 'position: relative; cursor: pointer;' : '';

            if (item.href) {
                return `<a href="${item.href}" class="nav-link${activeClass}" ${item.action ? `onclick="${item.action}(); return false;"` : ''}>${icon}${item.text}</a>`;
            } else if (item.action) {
                return `<div class="nav-link${activeClass}" style="${style}" onclick="${item.action}()">${icon}${badge}</div>`;
            } else {
                return `<span class="nav-link${activeClass}">${item.text}</span>`;
            }
        }).join('');
    },

    // Set up global event listeners
    setupEventListeners() {
        // Handle Enter key in search bar
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
    },

    // Global search handler
    handleSearch() {
        const searchInput = document.getElementById('globalSearchInput');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `marketplace.html?search=${encodeURIComponent(query)}`;
        }
    }
};

// Global search function (called from header button)
function handleGlobalSearch() {
    HeaderLoader.handleSearch();
}

// Export for use in pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderLoader;
}
