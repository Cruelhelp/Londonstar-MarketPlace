/**
 * Security Utilities
 * Input sanitization, validation, and XSS prevention
 */

class SecurityUtils {
    /**
     * Sanitize HTML to prevent XSS attacks
     * Strips all HTML tags and dangerous characters
     */
    static sanitizeHTML(str) {
        if (!str) return '';

        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Sanitize text for safe display
     * Use this instead of innerHTML when displaying user input
     */
    static sanitizeText(str) {
        if (!str) return '';

        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Create DOM element safely without innerHTML
     */
    static createElement(tag, options = {}) {
        const element = document.createElement(tag);

        // Set text content safely
        if (options.text) {
            element.textContent = options.text;
        }

        // Set HTML content (sanitized)
        if (options.html) {
            element.innerHTML = this.sanitizeHTML(options.html);
        }

        // Set attributes
        if (options.attrs) {
            Object.entries(options.attrs).forEach(([key, value]) => {
                // Prevent javascript: URLs and event handlers
                if (key === 'href' || key === 'src') {
                    if (this.isSafeURL(value)) {
                        element.setAttribute(key, value);
                    }
                } else if (!key.startsWith('on')) {
                    element.setAttribute(key, value);
                }
            });
        }

        // Set classes
        if (options.className) {
            element.className = options.className;
        }

        // Add children
        if (options.children) {
            options.children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        }

        return element;
    }

    /**
     * Check if URL is safe (no javascript:, data:, etc.)
     */
    static isSafeURL(url) {
        if (!url) return false;

        const urlStr = String(url).toLowerCase().trim();

        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        return !dangerousProtocols.some(proto => urlStr.startsWith(proto));
    }

    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validate price
     */
    static isValidPrice(price) {
        const num = parseFloat(price);
        return !isNaN(num) && num > 0 && num < 999999;
    }

    /**
     * Validate product name
     */
    static isValidProductName(name) {
        return name && name.length >= 3 && name.length <= 200;
    }

    /**
     * Validate SKU
     */
    static isValidSKU(sku) {
        return /^[A-Z0-9-_]+$/i.test(sku) && sku.length <= 50;
    }

    /**
     * Validate description
     */
    static isValidDescription(desc) {
        return desc && desc.length >= 10 && desc.length <= 5000;
    }

    /**
     * Validate phone number (basic)
     */
    static isValidPhone(phone) {
        return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.length >= 10 && phone.length <= 20;
    }

    /**
     * Validate URL format
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return this.isSafeURL(url);
        } catch {
            return false;
        }
    }

    /**
     * Comprehensive input validation
     */
    static validate(type, value) {
        const validators = {
            email: this.isValidEmail,
            price: this.isValidPrice,
            productName: this.isValidProductName,
            sku: this.isValidSKU,
            description: this.isValidDescription,
            phone: this.isValidPhone,
            url: this.isValidURL
        };

        const validator = validators[type];
        if (!validator) {
            console.warn(`No validator found for type: ${type}`);
            return true;
        }

        return validator.call(this, value);
    }

    /**
     * Sanitize and validate form input
     */
    static processInput(value, type) {
        const sanitized = this.sanitizeText(value);
        const isValid = this.validate(type, sanitized);

        return {
            value: sanitized,
            isValid,
            error: isValid ? null : `Invalid ${type} format`
        };
    }
}

// Make available globally
window.SecurityUtils = SecurityUtils;

console.log('✅ Security utilities loaded');
