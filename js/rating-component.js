/**
 * RATING COMPONENT
 * London Star Marketplace - Interactive star rating system
 */

class RatingComponent {
  /**
   * Render a star rating
   * @param {HTMLElement} container - Container to render into
   * @param {Object} options - Configuration options
   */
  static render(container, options = {}) {
    const {
      rating = 0,
      maxStars = 5,
      readonly = true,
      size = 'md',
      showCount = false,
      reviewCount = 0,
      onChange = null
    } = options;

    if (!container) return;

    // Clear container
    container.textContent = '';

    // Create rating container
    const ratingEl = document.createElement('div');
    ratingEl.className = `rating-component rating-${size}`;
    if (!readonly) {
      ratingEl.className += ' rating-interactive';
    }

    // Create stars container
    const starsEl = document.createElement('div');
    starsEl.className = 'rating-stars';

    // Calculate full, half, and empty stars
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    let currentHoverRating = 0;

    // Helper to create star SVG
    const createStar = (type, index) => {
      const star = document.createElement('span');
      star.className = `rating-star rating-star-${type}`;
      star.dataset.rating = index + 1;
      star.innerHTML = this.getStarSVG(type);

      if (!readonly) {
        // Add interaction handlers
        star.addEventListener('mouseenter', () => {
          currentHoverRating = index + 1;
          this.updateStarDisplay(starsEl, currentHoverRating, maxStars);
        });

        star.addEventListener('click', () => {
          if (onChange) {
            onChange(index + 1);
            this.updateStarDisplay(starsEl, index + 1, maxStars);
          }
        });
      }

      return star;
    };

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starsEl.appendChild(createStar('full', i));
    }

    // Add half star
    if (hasHalfStar) {
      starsEl.appendChild(createStar('half', fullStars));
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starsEl.appendChild(createStar('empty', fullStars + (hasHalfStar ? 1 : 0) + i));
    }

    // Reset hover on mouse leave
    if (!readonly) {
      starsEl.addEventListener('mouseleave', () => {
        currentHoverRating = 0;
        this.updateStarDisplay(starsEl, rating, maxStars);
      });
    }

    ratingEl.appendChild(starsEl);

    // Add rating value display
    if (showCount || reviewCount > 0) {
      const countEl = document.createElement('span');
      countEl.className = 'rating-count';

      if (showCount && reviewCount > 0) {
        countEl.textContent = `${rating.toFixed(1)} (${reviewCount.toLocaleString()})`;
      } else if (showCount) {
        countEl.textContent = rating.toFixed(1);
      } else if (reviewCount > 0) {
        countEl.textContent = `(${reviewCount.toLocaleString()})`;
      }

      ratingEl.appendChild(countEl);
    }

    // Add ARIA attributes for accessibility
    ratingEl.setAttribute('role', readonly ? 'img' : 'slider');
    ratingEl.setAttribute('aria-label', `Rating: ${rating} out of ${maxStars} stars`);
    if (!readonly) {
      ratingEl.setAttribute('aria-valuemin', '0');
      ratingEl.setAttribute('aria-valuemax', maxStars.toString());
      ratingEl.setAttribute('aria-valuenow', rating.toString());
    }

    container.appendChild(ratingEl);

    return ratingEl;
  }

  /**
   * Update star display (for hover/click on interactive ratings)
   */
  static updateStarDisplay(starsContainer, rating, maxStars) {
    const stars = starsContainer.querySelectorAll('.rating-star');
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    stars.forEach((star, index) => {
      star.className = 'rating-star';

      if (index < fullStars) {
        star.className += ' rating-star-full';
        star.innerHTML = this.getStarSVG('full');
      } else if (index === fullStars && hasHalfStar) {
        star.className += ' rating-star-half';
        star.innerHTML = this.getStarSVG('half');
      } else {
        star.className += ' rating-star-empty';
        star.innerHTML = this.getStarSVG('empty');
      }
    });
  }

  /**
   * Get star SVG based on type
   */
  static getStarSVG(type) {
    const svgBase = `
      <svg class="star-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    `;

    if (type === 'full') {
      return svgBase + `
        <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    } else if (type === 'half') {
      return svgBase + `
        <defs>
          <linearGradient id="half-star-gradient">
            <stop offset="50%" stop-color="currentColor"/>
            <stop offset="50%" stop-color="transparent"/>
          </linearGradient>
        </defs>
        <path fill="url(#half-star-gradient)" stroke="currentColor" stroke-width="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    } else {
      return svgBase + `
        <path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>`;
    }
  }

  /**
   * Initialize all rating components on a page
   * @param {string} selector - CSS selector for rating containers
   */
  static initAll(selector = '[data-rating]') {
    const containers = document.querySelectorAll(selector);

    containers.forEach(container => {
      const rating = parseFloat(container.dataset.rating) || 0;
      const maxStars = parseInt(container.dataset.maxStars) || 5;
      const readonly = container.dataset.readonly !== 'false';
      const size = container.dataset.size || 'md';
      const showCount = container.dataset.showCount === 'true';
      const reviewCount = parseInt(container.dataset.reviewCount) || 0;

      this.render(container, {
        rating,
        maxStars,
        readonly,
        size,
        showCount,
        reviewCount
      });
    });
  }
}

/* ==========================================
   RATING COMPONENT STYLES
   ========================================== */

// Inject styles if they don't exist
if (typeof document !== 'undefined' && !document.getElementById('rating-component-styles')) {
  const styles = document.createElement('style');
  styles.id = 'rating-component-styles';
  styles.textContent = `
    .rating-component {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2, 8px);
    }

    .rating-stars {
      display: inline-flex;
      gap: var(--space-1, 4px);
    }

    .rating-star {
      display: inline-flex;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .rating-star-full {
      color: var(--warning-500, #f59e0b);
    }

    .rating-star-half {
      color: var(--warning-500, #f59e0b);
    }

    .rating-star-empty {
      color: var(--gray-300, #d1d5db);
    }

    .rating-interactive .rating-star {
      cursor: pointer;
    }

    .rating-interactive .rating-star:hover {
      transform: scale(1.2);
    }

    /* Size variants */
    .rating-sm .star-icon {
      width: 16px;
      height: 16px;
    }

    .rating-md .star-icon {
      width: 20px;
      height: 20px;
    }

    .rating-lg .star-icon {
      width: 24px;
      height: 24px;
    }

    .rating-xl .star-icon {
      width: 32px;
      height: 32px;
    }

    .rating-count {
      font-size: var(--text-sm, 0.875rem);
      color: var(--text-secondary, #6b7280);
      font-weight: var(--font-medium, 500);
    }

    /* Animation for interactive ratings */
    .rating-interactive .rating-star-full .star-icon {
      animation: starPulse 0.3s ease;
    }

    @keyframes starPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.15);
      }
    }
  `;
  document.head.appendChild(styles);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RatingComponent;
}
