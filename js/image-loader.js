/**
 * PROGRESSIVE IMAGE LOADER
 * London Star Marketplace - LQIP (Low Quality Image Placeholder) with blur-up effect
 */

class ProgressiveImageLoader {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || '[data-src]',
      lqipAttribute: options.lqipAttribute || 'data-lqip',
      srcAttribute: options.srcAttribute || 'data-src',
      srcsetAttribute: options.srcsetAttribute || 'data-srcset',
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.01,
      ...options
    };

    this.observer = null;
    this.images = [];
  }

  /**
   * Initialize the image loader
   */
  init() {
    // Find all images with data-src
    this.images = Array.from(document.querySelectorAll(this.options.selector));

    // Create Intersection Observer for lazy loading
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );

    // Observe all images
    this.images.forEach(img => {
      // Load LQIP immediately if available
      this.loadLQIP(img);

      // Observe for lazy loading
      this.observer.observe(img);
    });
  }

  /**
   * Load low quality image placeholder
   */
  loadLQIP(img) {
    const lqip = img.getAttribute(this.options.lqipAttribute);

    if (lqip && !img.src) {
      img.src = lqip;
      img.style.filter = 'blur(20px)';
      img.style.transform = 'scale(1.1)'; // Prevent blur edge artifacts
      img.classList.add('image-loading-lqip');
    }
  }

  /**
   * Handle intersection observer callback
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadFullImage(img);
        this.observer.unobserve(img);
      }
    });
  }

  /**
   * Load full resolution image
   */
  loadFullImage(img) {
    const src = img.getAttribute(this.options.srcAttribute);
    const srcset = img.getAttribute(this.options.srcsetAttribute);

    if (!src && !srcset) return;

    // Create a temporary image to preload
    const tempImg = new Image();

    // Set up load handler
    tempImg.onload = () => {
      // Apply full image
      if (srcset) {
        img.srcset = srcset;
      }
      img.src = src;

      // Animate blur-up transition
      this.animateBlurUp(img);

      // Mark as loaded
      img.classList.add('image-loaded');
      img.classList.remove('image-loading-lqip');

      // Trigger custom event
      img.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { src, srcset }
      }));
    };

    // Set up error handler
    tempImg.onerror = () => {
      img.classList.add('image-error');
      img.classList.remove('image-loading-lqip');

      // Trigger error event
      img.dispatchEvent(new CustomEvent('imageError', {
        detail: { src, srcset }
      }));
    };

    // Start loading
    if (srcset) {
      tempImg.srcset = srcset;
    }
    tempImg.src = src;
  }

  /**
   * Animate blur-up effect
   */
  animateBlurUp(img) {
    // Transition from blurred to sharp
    img.style.transition = 'filter 0.3s ease, transform 0.3s ease';
    img.style.filter = 'blur(0)';
    img.style.transform = 'scale(1)';

    // Clean up styles after animation
    setTimeout(() => {
      img.style.transition = '';
      img.style.filter = '';
      img.style.transform = '';
    }, 300);
  }

  /**
   * Load a single image programmatically
   */
  static loadImage(img, options = {}) {
    const {
      src = img.dataset.src,
      srcset = img.dataset.srcset,
      lqip = img.dataset.lqip,
      blurUp = true
    } = options;

    return new Promise((resolve, reject) => {
      // Load LQIP first if available
      if (lqip && blurUp) {
        img.src = lqip;
        img.style.filter = 'blur(20px)';
        img.style.transform = 'scale(1.1)';
      }

      // Create temporary image
      const tempImg = new Image();

      tempImg.onload = () => {
        if (srcset) {
          img.srcset = srcset;
        }
        img.src = src;

        if (blurUp) {
          img.style.transition = 'filter 0.3s ease, transform 0.3s ease';
          img.style.filter = 'blur(0)';
          img.style.transform = 'scale(1)';

          setTimeout(() => {
            img.style.transition = '';
            img.style.filter = '';
            img.style.transform = '';
          }, 300);
        }

        resolve(img);
      };

      tempImg.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      if (srcset) {
        tempImg.srcset = srcset;
      }
      tempImg.src = src;
    });
  }

  /**
   * Generate LQIP from a high-res image (server-side would be better)
   * This is a client-side fallback
   */
  static generateLQIP(imgSrc, callback) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set LQIP size (20x20 is good)
      const lqipSize = 20;
      canvas.width = lqipSize;
      canvas.height = lqipSize;

      // Draw scaled down image
      ctx.drawImage(img, 0, 0, lqipSize, lqipSize);

      // Get data URL
      const lqipDataURL = canvas.toDataURL('image/jpeg', 0.5);

      if (callback) {
        callback(lqipDataURL);
      }
    };

    img.src = imgSrc;
  }

  /**
   * Preload images (for critical above-fold images)
   */
  static preloadImages(urls) {
    return Promise.all(
      urls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = url;
        });
      })
    );
  }

  /**
   * Destroy the loader and clean up observers
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.images = [];
  }
}

/* ==========================================
   IMAGE LOADER STYLES
   ========================================== */

if (typeof document !== 'undefined' && !document.getElementById('image-loader-styles')) {
  const styles = document.createElement('style');
  styles.id = 'image-loader-styles';
  styles.textContent = `
    /* LQIP loading state */
    .image-loading-lqip {
      background-color: var(--gray-200, #e5e7eb);
    }

    /* Loaded state */
    .image-loaded {
      background-color: transparent;
    }

    /* Error state */
    .image-error {
      background-color: var(--gray-200, #e5e7eb);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 48px 48px;
    }

    /* Lazy loading placeholder */
    img[data-src]:not([src]) {
      background-color: var(--gray-200, #e5e7eb);
      min-height: 200px; /* Prevent layout shift */
    }

    /* Fade in animation for loaded images */
    .image-fade-in {
      animation: imageFadeIn 0.3s ease;
    }

    @keyframes imageFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Aspect ratio containers (prevent layout shift) */
    .image-container-16-9 {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 */
      overflow: hidden;
    }

    .image-container-4-3 {
      position: relative;
      padding-bottom: 75%; /* 4:3 */
      overflow: hidden;
    }

    .image-container-1-1 {
      position: relative;
      padding-bottom: 100%; /* 1:1 square */
      overflow: hidden;
    }

    .image-container-16-9 img,
    .image-container-4-3 img,
    .image-container-1-1 img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .image-loading-lqip,
      .image-loaded {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Auto-initialize if DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.querySelectorAll('[data-src]').length > 0) {
        window.progressiveImageLoader = new ProgressiveImageLoader();
        window.progressiveImageLoader.init();
      }
    });
  } else {
    if (document.querySelectorAll('[data-src]').length > 0) {
      window.progressiveImageLoader = new ProgressiveImageLoader();
      window.progressiveImageLoader.init();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressiveImageLoader;
}
