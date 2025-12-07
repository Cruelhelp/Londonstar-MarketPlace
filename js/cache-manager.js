/**
 * Cache Manager - Handles caching for images, products, and other data
 * Reduces database queries and improves performance
 */

class CacheManager {
    constructor() {
        this.prefix = 'lsm_cache_'; // London Star Marketplace cache prefix
        this.version = '1.0.0';

        // Cache durations (in milliseconds)
        this.TTL = {
            IMAGES: 24 * 60 * 60 * 1000,        // 24 hours
            PRODUCTS: 30 * 60 * 1000,            // 30 minutes (increased from 5)
            USER_DATA: 30 * 60 * 1000,           // 30 minutes (increased from 15)
            SETTINGS: 60 * 60 * 1000,            // 1 hour (increased from 30 min)
            HERO_BACKGROUND: 2 * 60 * 60 * 1000, // 2 hours (increased from 1)
            CATEGORIES: 2 * 60 * 60 * 1000,      // 2 hours (increased from 1)
            SHORT: 5 * 60 * 1000,                // 5 minutes (increased from 2)
            MEDIUM: 15 * 60 * 1000,              // 15 minutes (increased from 10)
            LONG: 2 * 60 * 60 * 1000             // 2 hours (increased from 1)
        };

        // Initialize cache version check
        this.checkCacheVersion();
    }

    /**
     * Check cache version and clear if outdated
     */
    checkCacheVersion() {
        const storedVersion = localStorage.getItem(`${this.prefix}version`);
        if (storedVersion !== this.version) {
            console.log('🔄 Cache version mismatch. Clearing old cache...');
            this.clearAll();
            localStorage.setItem(`${this.prefix}version`, this.version);
        }
    }

    /**
     * Generate cache key
     */
    getCacheKey(type, identifier) {
        return `${this.prefix}${type}_${identifier}`;
    }

    /**
     * Set cache with expiration
     */
    set(type, identifier, data, ttl = null) {
        try {
            const cacheKey = this.getCacheKey(type, identifier);
            const expiresAt = Date.now() + (ttl || this.TTL.MEDIUM);

            const cacheData = {
                data: data,
                expiresAt: expiresAt,
                cachedAt: Date.now(),
                version: this.version
            };

            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            return true;
        } catch (error) {
            console.warn('Cache set error:', error);
            // If quota exceeded, clear old cache
            if (error.name === 'QuotaExceededError') {
                this.clearExpired();
            }
            return false;
        }
    }

    /**
     * Get cached data if valid
     */
    get(type, identifier) {
        try {
            const cacheKey = this.getCacheKey(type, identifier);
            const cached = localStorage.getItem(cacheKey);

            if (!cached) return null;

            const cacheData = JSON.parse(cached);

            // Check if expired
            if (Date.now() > cacheData.expiresAt) {
                localStorage.removeItem(cacheKey);
                return null;
            }

            // Check version
            if (cacheData.version !== this.version) {
                localStorage.removeItem(cacheKey);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn('Cache get error:', error);
            return null;
        }
    }

    /**
     * Check if cache exists and is valid
     */
    has(type, identifier) {
        return this.get(type, identifier) !== null;
    }

    /**
     * Remove specific cache entry
     */
    remove(type, identifier) {
        const cacheKey = this.getCacheKey(type, identifier);
        localStorage.removeItem(cacheKey);
    }

    /**
     * Clear all cache entries
     */
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
        console.log('✅ Cache cleared');
    }

    /**
     * Clear expired cache entries
     */
    clearExpired() {
        const keys = Object.keys(localStorage);
        let cleared = 0;

        keys.forEach(key => {
            if (key.startsWith(this.prefix) && key !== `${this.prefix}version`) {
                try {
                    const cached = JSON.parse(localStorage.getItem(key));
                    if (Date.now() > cached.expiresAt) {
                        localStorage.removeItem(key);
                        cleared++;
                    }
                } catch (error) {
                    // Invalid cache entry, remove it
                    localStorage.removeItem(key);
                    cleared++;
                }
            }
        });

        if (cleared > 0) {
            console.log(`🧹 Cleared ${cleared} expired cache entries`);
        }
    }

    /**
     * Clear cache by type
     */
    clearByType(type) {
        const keys = Object.keys(localStorage);
        const typePrefix = `${this.prefix}${type}_`;

        keys.forEach(key => {
            if (key.startsWith(typePrefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const keys = Object.keys(localStorage);
        const cacheKeys = keys.filter(key => key.startsWith(this.prefix));

        let totalSize = 0;
        let validCount = 0;
        let expiredCount = 0;

        cacheKeys.forEach(key => {
            const value = localStorage.getItem(key);
            totalSize += value.length;

            try {
                const cached = JSON.parse(value);
                if (Date.now() > cached.expiresAt) {
                    expiredCount++;
                } else {
                    validCount++;
                }
            } catch (error) {
                expiredCount++;
            }
        });

        return {
            totalEntries: cacheKeys.length,
            validEntries: validCount,
            expiredEntries: expiredCount,
            estimatedSize: (totalSize / 1024).toFixed(2) + ' KB'
        };
    }

    /**
     * Preload and cache image
     */
    async preloadImage(url, type = 'IMAGE', identifier = null) {
        return new Promise((resolve, reject) => {
            // Check if already cached
            const cacheId = identifier || url;
            const cached = this.get(type, cacheId);
            if (cached) {
                resolve(cached);
                return;
            }

            // Preload image
            const img = new Image();
            img.onload = () => {
                // Cache the URL as loaded
                this.set(type, cacheId, url, this.TTL.IMAGES);
                resolve(url);
            };
            img.onerror = (error) => {
                console.warn('Image preload failed:', url);
                reject(error);
            };
            img.src = url;
        });
    }

    /**
     * Preload multiple images
     */
    async preloadImages(urls, type = 'IMAGE') {
        const promises = urls.map((url, index) =>
            this.preloadImage(url, type, `${type}_${index}`)
        );
        return Promise.allSettled(promises);
    }

    /**
     * Cache product data
     */
    cacheProducts(products, identifier = 'all') {
        return this.set('PRODUCTS', identifier, products, this.TTL.PRODUCTS);
    }

    /**
     * Get cached products
     */
    getCachedProducts(identifier = 'all') {
        return this.get('PRODUCTS', identifier);
    }

    /**
     * Cache user data
     */
    cacheUser(userId, userData) {
        return this.set('USER', userId, userData, this.TTL.USER_DATA);
    }

    /**
     * Get cached user
     */
    getCachedUser(userId) {
        return this.get('USER', userId);
    }

    /**
     * Cache settings
     */
    cacheSettings(settingKey, settingValue) {
        return this.set('SETTINGS', settingKey, settingValue, this.TTL.SETTINGS);
    }

    /**
     * Get cached settings
     */
    getCachedSettings(settingKey) {
        return this.get('SETTINGS', settingKey);
    }

    /**
     * Cache hero background
     */
    cacheHeroBackground(pageType, imageData) {
        return this.set('HERO_BG', pageType, imageData, this.TTL.HERO_BACKGROUND);
    }

    /**
     * Get cached hero background
     */
    getCachedHeroBackground(pageType) {
        return this.get('HERO_BG', pageType);
    }

    /**
     * Invalidate product cache (when products change)
     */
    invalidateProducts() {
        this.clearByType('PRODUCTS');
        console.log('🔄 Product cache invalidated');
    }

    /**
     * Invalidate user cache
     */
    invalidateUser(userId) {
        this.remove('USER', userId);
    }

    /**
     * Smart fetch with cache
     */
    async fetchWithCache(type, identifier, fetchFunction, ttl = null) {
        // Try to get from cache first
        const cached = this.get(type, identifier);
        if (cached !== null) {
            console.log(`✅ Cache HIT: ${type}/${identifier}`);
            return cached;
        }

        console.log(`⚠️ Cache MISS: ${type}/${identifier} - Fetching...`);

        // Fetch fresh data
        try {
            const data = await fetchFunction();

            // Cache the result
            this.set(type, identifier, data, ttl);

            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}

// Create global instance
const cacheManager = new CacheManager();

// Auto-clear expired cache on page load
window.addEventListener('load', () => {
    cacheManager.clearExpired();
});

// Log cache stats in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('📦 Cache Manager loaded. Stats:', cacheManager.getStats());
}
