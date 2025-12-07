/**
 * Global Data Preloader
 * Loads all common data once at app start and caches it
 * This eliminates slow sequential loading on every page
 */

class GlobalPreloader {
    constructor() {
        this.isPreloaded = false;
        this.isPreloading = false;
        this.preloadPromise = null;
        this.productsCache = [];
        this.featuredCache = [];
        this.categoriesCache = [];
        this.indexHeroCache = null;
        this.marketplaceHeroCache = null;
    }

    /**
     * Preload all common data in parallel
     */
    async preloadAll() {
        // Prevent multiple simultaneous preloads
        if (this.isPreloading) {
            return this.preloadPromise;
        }

        // Return immediately if already preloaded
        if (this.isPreloaded) {
            return Promise.resolve({ success: true, cached: true });
        }

        this.isPreloading = true;

        // Create preload promise
        this.preloadPromise = (async () => {
            console.log('🚀 Global Preloader: Starting...');
            const startTime = performance.now();

            try {
                // Load everything in parallel for maximum speed
                const results = await Promise.allSettled([
                    this.preloadProducts(),
                    this.preloadCategories(),
                    this.preloadHeroBackgrounds(),
                    this.preloadMarketplaceHero(),
                    this.preloadUserSession()
                ]);

                const endTime = performance.now();
                const loadTime = Math.round(endTime - startTime);

                // Check results
                const successful = results.filter(r => r.status === 'fulfilled').length;
                const failed = results.filter(r => r.status === 'rejected').length;

                console.log(`✅ Global Preloader: Complete in ${loadTime}ms (${successful} succeeded, ${failed} failed)`);

                this.isPreloaded = true;
                this.isPreloading = false;

                return {
                    success: true,
                    loadTime,
                    results: {
                        products: results[0],
                        categories: results[1],
                        heroBackgrounds: results[2],
                        userSession: results[3]
                    }
                };
            } catch (error) {
                console.error('❌ Global Preloader Error:', error);
                this.isPreloading = false;
                throw error;
            }
        })();

        return this.preloadPromise;
    }

    /**
     * Preload all active products
     */
    async preloadProducts() {
        try {
            // Check in-memory cache first
            if (this.productsCache && this.productsCache.length > 0) {
                console.log('✅ Products: Loaded from memory cache');
                return { source: 'memory', count: this.productsCache.length };
            }

            // Fetch from database
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Store in memory cache (avoid localStorage quota issues with large Base64 images)
            this.productsCache = data || [];
            this.featuredCache = (data || []).filter(p => p.featured);

            console.log(`✅ Products: Loaded ${data?.length || 0} products from database`);

            // Skip image preloading for Base64 images (they're too large)
            // Images will load on-demand

            return { source: 'database', count: data?.length || 0 };
        } catch (error) {
            console.error('Error preloading products:', error);
            return { source: 'error', error: error.message };
        }
    }

    /**
     * Preload product categories
     */
    async preloadCategories() {
        try {
            // Extract unique categories from in-memory products
            if (this.productsCache && this.productsCache.length > 0) {
                const categories = [...new Set(this.productsCache.map(p => p.category).filter(Boolean))];
                this.categoriesCache = categories;
                console.log(`✅ Categories: Extracted ${categories.length} categories`);
                return { source: 'extracted', count: categories.length };
            }

            return { source: 'skipped', reason: 'No products loaded yet' };
        } catch (error) {
            console.error('Error preloading categories:', error);
            return { source: 'error', error: error.message };
        }
    }

    /**
     * Preload homepage hero background
     */
    async preloadHeroBackgrounds() {
        try {
            // Check memory cache first
            if (this.indexHeroCache) {
                console.log('✅ Homepage Hero: Loaded from memory');
                return { source: 'memory' };
            }

            // Load from localStorage (don't cache back - quota issues)
            const indexSettings = localStorage.getItem('heroBackgroundSettings');
            if (indexSettings) {
                const settings = JSON.parse(indexSettings);
                this.indexHeroCache = settings;
                console.log('✅ Homepage Hero: Preloaded from localStorage');
                return { source: 'localStorage' };
            }

            // Fallback to database
            const { data, error } = await supabase
                .from('platform_settings')
                .select('setting_value')
                .eq('setting_key', 'hero_background')
                .single();

            if (!error && data && data.setting_value) {
                const settings = data.setting_value;
                this.indexHeroCache = settings;
                // Try to save to localStorage, ignore quota errors
                try {
                    localStorage.setItem('heroBackgroundSettings', JSON.stringify(settings));
                } catch (e) {
                    console.warn('Could not cache hero background (quota)');
                }
                console.log('✅ Homepage Hero: Preloaded from database');
                return { source: 'database' };
            }

            return { source: 'none' };
        } catch (error) {
            console.warn('Error preloading homepage hero:', error);
            return { source: 'error', error: error.message };
        }
    }

    /**
     * Preload marketplace hero background
     */
    async preloadMarketplaceHero() {
        try {
            // Check memory cache first
            if (this.marketplaceHeroCache) {
                console.log('✅ Marketplace Hero: Loaded from memory');
                return { source: 'memory' };
            }

            // Load from localStorage (don't cache back - quota issues)
            const marketplaceSettings = localStorage.getItem('marketplaceHeroBackground');
            if (marketplaceSettings) {
                const settings = JSON.parse(marketplaceSettings);
                this.marketplaceHeroCache = settings;
                console.log('✅ Marketplace Hero: Preloaded from localStorage');
                return { source: 'localStorage' };
            }

            // Fallback to database
            const { data, error } = await supabase
                .from('platform_settings')
                .select('setting_value')
                .eq('setting_key', 'marketplace_hero_background')
                .single();

            if (!error && data && data.setting_value) {
                const settings = data.setting_value;
                this.marketplaceHeroCache = settings;
                // Try to save to localStorage, ignore quota errors
                try {
                    localStorage.setItem('marketplaceHeroBackground', JSON.stringify(settings));
                } catch (e) {
                    console.warn('Could not cache marketplace hero (quota)');
                }
                console.log('✅ Marketplace Hero: Preloaded from database');
                return { source: 'database' };
            }

            return { source: 'none' };
        } catch (error) {
            console.warn('Error preloading marketplace hero:', error);
            return { source: 'error', error: error.message };
        }
    }

    /**
     * Preload user session data
     */
    async preloadUserSession() {
        try {
            const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

            if (!userId) {
                return { source: 'skipped', reason: 'No user logged in' };
            }

            // Check cache
            const cached = cacheManager.getCachedUser(userId);
            if (cached) {
                console.log('✅ User Session: Loaded from cache');
                return { source: 'cache' };
            }

            // Load user profile from database
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            // Cache user data
            if (data) {
                cacheManager.cacheUser(userId, data);
                console.log('✅ User Session: Loaded from database');
            }

            return { source: 'database' };
        } catch (error) {
            console.warn('User session preload error:', error);
            return { source: 'error', error: error.message };
        }
    }

    /**
     * Get preloaded products
     */
    getProducts() {
        return this.productsCache || [];
    }

    /**
     * Get featured products
     */
    getFeaturedProducts() {
        return this.featuredCache || [];
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category) {
        const all = this.getProducts();
        return all.filter(p => p.category === category);
    }

    /**
     * Get homepage hero background
     */
    getIndexHero() {
        return this.indexHeroCache;
    }

    /**
     * Get marketplace hero background
     */
    getMarketplaceHero() {
        return this.marketplaceHeroCache;
    }

    /**
     * Invalidate cache and force reload
     */
    async refresh() {
        console.log('🔄 Refreshing global data...');
        this.isPreloaded = false;
        this.productsCache = [];
        this.featuredCache = [];
        this.categoriesCache = [];
        this.indexHeroCache = null;
        this.marketplaceHeroCache = null;
        return this.preloadAll();
    }
}

// Create global instance
const globalPreloader = new GlobalPreloader();
window.globalPreloader = globalPreloader;

// Auto-preload on DOMContentLoaded (faster than window.load)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        globalPreloader.preloadAll().catch(err => {
            console.error('Preload failed:', err);
        });
    });
} else {
    // DOM already loaded, preload immediately
    globalPreloader.preloadAll().catch(err => {
        console.error('Preload failed:', err);
    });
}

console.log('📦 Global Preloader initialized');
