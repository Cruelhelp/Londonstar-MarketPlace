/**
 * RIPPLE EFFECT
 * London Star Marketplace - Material Design-style ripple effect
 */

class Ripple {
  /**
   * Initialize ripple effects
   * @param {string} selector - CSS selector for elements to apply ripple to
   * @param {Object} options - Configuration options
   */
  static init(selector = '.btn, .card, [data-ripple]', options = {}) {
    const {
      color = 'rgba(255, 255, 255, 0.5)',
      duration = 600,
      centered = false
    } = options;

    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
      // Skip if already initialized
      if (el.dataset.rippleInitialized) return;

      // Mark as initialized
      el.dataset.rippleInitialized = 'true';

      // Ensure element has position relative
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'static') {
        el.style.position = 'relative';
      }

      // Ensure overflow is hidden
      el.style.overflow = 'hidden';

      // Add click handler
      el.addEventListener('click', (e) => {
        this.createRipple(el, e, { color, duration, centered });
      });

      // Add keyboard support (Enter/Space)
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.createRipple(el, e, { color, duration, centered: true });
        }
      });
    });
  }

  /**
   * Create ripple effect
   */
  static createRipple(element, event, options = {}) {
    const {
      color = 'rgba(255, 255, 255, 0.5)',
      duration = 600,
      centered = false
    } = options;

    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';

    // Calculate ripple size (diameter of circle that covers element)
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const radius = size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;

    // Calculate ripple position
    let x, y;

    if (centered) {
      // Center of element
      x = rect.width / 2 - radius;
      y = rect.height / 2 - radius;
    } else {
      // Click position
      x = (event.clientX || event.touches?.[0]?.clientX || 0) - rect.left - radius;
      y = (event.clientY || event.touches?.[0]?.clientY || 0) - rect.top - radius;
    }

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.backgroundColor = color;
    ripple.style.animationDuration = `${duration}ms`;

    // Add ripple to element
    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, duration);
  }

  /**
   * Apply ripple to a single element
   */
  static applyTo(element, options = {}) {
    this.init(`#${element.id || ''}`, options);
  }

  /**
   * Remove ripple effect from elements
   */
  static destroy(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      delete el.dataset.rippleInitialized;
      // Note: Cannot remove event listeners without reference
      // Consider using removeEventListener in production
    });
  }
}

/* ==========================================
   RIPPLE EFFECT STYLES
   ========================================== */

if (typeof document !== 'undefined' && !document.getElementById('ripple-styles')) {
  const styles = document.createElement('style');
  styles.id = 'ripple-styles';
  styles.textContent = `
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      pointer-events: none;
      animation: ripple-animation var(--duration, 600ms) ease-out;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    /* Ensure ripple container can contain ripples */
    [data-ripple-initialized] {
      position: relative;
      overflow: hidden;
    }

    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      .ripple-effect {
        animation: none !important;
        display: none;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Auto-initialize buttons with ripple
      Ripple.init('.btn-primary, .btn-secondary', {
        color: 'rgba(255, 255, 255, 0.4)',
        duration: 600
      });
    });
  } else {
    Ripple.init('.btn-primary, .btn-secondary', {
      color: 'rgba(255, 255, 255, 0.4)',
      duration: 600
    });
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Ripple;
}
