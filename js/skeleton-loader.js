/**
 * SKELETON LOADER
 * London Star Marketplace - Content-shaped loading placeholders
 */

class SkeletonLoader {
  /**
   * Create a product card skeleton
   */
  static createProductCardSkeleton() {
    return `
      <div class="product-card skeleton-product-card">
        <div class="skeleton-image"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-price"></div>
        <div class="skeleton skeleton-description"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    `;
  }

  /**
   * Create a cart item skeleton
   */
  static createCartItemSkeleton() {
    return `
      <div class="skeleton-cart-item">
        <div class="skeleton-cart-item-image"></div>
        <div class="skeleton-cart-item-details">
          <div class="skeleton skeleton-line" style="width: 70%;"></div>
          <div class="skeleton skeleton-line" style="width: 50%;"></div>
          <div class="skeleton skeleton-line" style="width: 30%;"></div>
        </div>
      </div>
    `;
  }

  /**
   * Create a table row skeleton
   */
  static createTableRowSkeleton(columns = 5) {
    const cells = Array(columns).fill(null).map(() =>
      '<div class="skeleton skeleton-table-cell"></div>'
    ).join('');

    return `
      <div class="skeleton-table-row">
        ${cells}
      </div>
    `;
  }

  /**
   * Create a list item skeleton
   */
  static createListItemSkeleton() {
    return `
      <div class="skeleton-list-item">
        <div class="skeleton-list-item-icon"></div>
        <div class="skeleton-list-item-content">
          <div class="skeleton skeleton-line" style="width: 80%;"></div>
          <div class="skeleton skeleton-line" style="width: 60%;"></div>
        </div>
      </div>
    `;
  }

  /**
   * Create a card skeleton
   */
  static createCardSkeleton() {
    return `
      <div class="skeleton-card">
        <div class="skeleton-card-header">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex: 1;">
            <div class="skeleton skeleton-line" style="width: 60%; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-line" style="width: 40%;"></div>
          </div>
        </div>
        <div class="skeleton-card-body">
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line" style="width: 80%;"></div>
        </div>
      </div>
    `;
  }

  /**
   * Show skeletons in a container
   * @param {HTMLElement} container - Container element
   * @param {number} count - Number of skeletons to show
   * @param {string} type - Type of skeleton ('product', 'cart', 'table', 'list', 'card')
   */
  static showSkeletons(container, count = 8, type = 'product') {
    if (!container) return;

    const skeletonFunctions = {
      'product': this.createProductCardSkeleton,
      'cart': this.createCartItemSkeleton,
      'table': this.createTableRowSkeleton,
      'list': this.createListItemSkeleton,
      'card': this.createCardSkeleton
    };

    const createSkeleton = skeletonFunctions[type] || this.createProductCardSkeleton;

    // Clear container
    container.textContent = '';

    // Add ARIA live region for screen readers
    container.setAttribute('aria-busy', 'true');
    container.setAttribute('aria-live', 'polite');

    // Create skeletons
    const skeletonsHTML = Array(count).fill(null)
      .map(() => createSkeleton.call(this))
      .join('');

    container.innerHTML = skeletonsHTML +
      '<span class="skeleton-loading-text">Loading content...</span>';
  }

  /**
   * Hide skeletons and show real content
   * @param {HTMLElement} container - Container element
   * @param {boolean} fadeOut - Whether to fade out before removing
   * @param {Function} callback - Callback after skeletons are removed
   */
  static hideSkeletons(container, fadeOut = true, callback) {
    if (!container) return;

    // Remove ARIA attributes
    container.removeAttribute('aria-busy');

    const skeletons = container.querySelectorAll('[class*="skeleton"]');

    if (fadeOut && skeletons.length > 0) {
      // Add fade out class
      skeletons.forEach(skeleton => {
        skeleton.classList.add('fade-out');
      });

      // Wait for animation to complete, then remove
      setTimeout(() => {
        skeletons.forEach(skeleton => skeleton.remove());
        if (callback) callback();
      }, 300); // Match fade-out duration
    } else {
      // Remove immediately
      skeletons.forEach(skeleton => skeleton.remove());
      if (callback) callback();
    }
  }

  /**
   * Replace skeletons with real content
   * @param {HTMLElement} container - Container element
   * @param {HTMLElement[]} realContent - Array of real content elements
   * @param {boolean} stagger - Whether to stagger the appearance
   */
  static replaceWithContent(container, realContent, stagger = true) {
    this.hideSkeletons(container, true, () => {
      // Clear container
      container.textContent = '';

      if (stagger && realContent.length > 0) {
        // Stagger the appearance of real content
        container.classList.add('stagger-children');

        realContent.forEach((element, index) => {
          element.style.opacity = '0';
          element.style.animation = `fadeInUp ${300}ms ease-out ${index * 50}ms forwards`;
          container.appendChild(element);
        });

        // Remove stagger class after all animations complete
        setTimeout(() => {
          container.classList.remove('stagger-children');
          realContent.forEach(el => {
            el.style.opacity = '';
            el.style.animation = '';
          });
        }, (realContent.length * 50) + 300);
      } else {
        // Append all content at once
        realContent.forEach(element => {
          container.appendChild(element);
        });
      }
    });
  }

  /**
   * Utility: Detect appropriate skeleton count based on viewport
   */
  static getOptimalSkeletonCount() {
    const width = window.innerWidth;

    if (width < 640) return 4;      // Mobile: 4 skeletons
    if (width < 1024) return 6;     // Tablet: 6 skeletons
    return 8;                       // Desktop: 8 skeletons
  }

  /**
   * Initialize skeleton loading for an async operation
   * @param {HTMLElement} container - Container element
   * @param {Function} asyncOperation - Async function that returns content
   * @param {Object} options - Options { type, count, stagger }
   */
  static async load(container, asyncOperation, options = {}) {
    const {
      type = 'product',
      count = this.getOptimalSkeletonCount(),
      stagger = true
    } = options;

    // Show skeletons
    this.showSkeletons(container, count, type);

    try {
      // Execute async operation
      const content = await asyncOperation();

      // Replace skeletons with real content
      if (Array.isArray(content)) {
        this.replaceWithContent(container, content, stagger);
      } else {
        this.hideSkeletons(container, true, () => {
          container.appendChild(content);
        });
      }

      return content;
    } catch (error) {
      // Hide skeletons on error
      this.hideSkeletons(container, false);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkeletonLoader;
}
