/**
 * QUANTITY SPINNER
 * London Star Marketplace - Increment/Decrement number input
 */

class QuantitySpinner {
  /**
   * Create a quantity spinner
   * @param {HTMLElement} container - Container to render into
   * @param {Object} options - Configuration options
   */
  static create(container, options = {}) {
    const {
      value = 1,
      min = 1,
      max = 99,
      step = 1,
      disabled = false,
      size = 'md',
      onChange = null
    } = options;

    if (!container) return null;

    // Clear container
    container.textContent = '';

    // Create spinner wrapper
    const spinner = document.createElement('div');
    spinner.className = `quantity-spinner quantity-spinner-${size}`;
    if (disabled) {
      spinner.classList.add('quantity-spinner-disabled');
    }

    // Decrement button
    const decrementBtn = document.createElement('button');
    decrementBtn.type = 'button';
    decrementBtn.className = 'quantity-btn quantity-decrement';
    decrementBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="4" y1="8" x2="12" y2="8"/>
      </svg>
    `;
    decrementBtn.setAttribute('aria-label', 'Decrease quantity');
    decrementBtn.disabled = disabled || value <= min;

    // Input field
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'quantity-input';
    input.value = value;
    input.min = min;
    input.max = max;
    input.step = step;
    input.disabled = disabled;
    input.setAttribute('aria-label', 'Quantity');

    // Increment button
    const incrementBtn = document.createElement('button');
    incrementBtn.type = 'button';
    incrementBtn.className = 'quantity-btn quantity-increment';
    incrementBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="8" y1="4" x2="8" y2="12"/>
        <line x1="4" y1="8" x2="12" y2="8"/>
      </svg>
    `;
    incrementBtn.setAttribute('aria-label', 'Increase quantity');
    incrementBtn.disabled = disabled || value >= max;

    // Store current value
    let currentValue = value;

    // Update function
    const updateValue = (newValue, animate = false) => {
      // Clamp value
      newValue = Math.max(min, Math.min(max, newValue));

      // Update if changed
      if (newValue !== currentValue) {
        currentValue = newValue;
        input.value = newValue;

        // Update button states
        decrementBtn.disabled = disabled || newValue <= min;
        incrementBtn.disabled = disabled || newValue >= max;

        // Animate value change
        if (animate) {
          input.classList.add('quantity-value-change');
          setTimeout(() => {
            input.classList.remove('quantity-value-change');
          }, 300);
        }

        // Trigger callback
        if (onChange) {
          onChange(newValue);
        }
      }
    };

    // Decrement handler
    decrementBtn.addEventListener('click', () => {
      updateValue(currentValue - step, true);
    });

    // Increment handler
    incrementBtn.addEventListener('click', () => {
      updateValue(currentValue + step, true);
    });

    // Input change handler
    input.addEventListener('change', () => {
      const newValue = parseInt(input.value) || min;
      updateValue(newValue, false);
    });

    // Keyboard support
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateValue(currentValue + step, true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateValue(currentValue - step, true);
      }
    });

    // Long press support for increment/decrement
    let longPressInterval;

    const startLongPress = (direction) => {
      longPressInterval = setInterval(() => {
        updateValue(currentValue + (direction * step), true);
      }, 100);
    };

    const stopLongPress = () => {
      if (longPressInterval) {
        clearInterval(longPressInterval);
        longPressInterval = null;
      }
    };

    decrementBtn.addEventListener('mousedown', () => startLongPress(-1));
    incrementBtn.addEventListener('mousedown', () => startLongPress(1));

    decrementBtn.addEventListener('mouseup', stopLongPress);
    incrementBtn.addEventListener('mouseup', stopLongPress);
    decrementBtn.addEventListener('mouseleave', stopLongPress);
    incrementBtn.addEventListener('mouseleave', stopLongPress);

    // Touch support
    decrementBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startLongPress(-1);
    });
    incrementBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startLongPress(1);
    });

    decrementBtn.addEventListener('touchend', stopLongPress);
    incrementBtn.addEventListener('touchend', stopLongPress);

    // Build spinner
    spinner.appendChild(decrementBtn);
    spinner.appendChild(input);
    spinner.appendChild(incrementBtn);

    container.appendChild(spinner);

    // Return API for programmatic control
    return {
      element: spinner,
      getValue: () => currentValue,
      setValue: (newValue) => updateValue(newValue, false),
      increment: () => updateValue(currentValue + step, true),
      decrement: () => updateValue(currentValue - step, true),
      setMin: (newMin) => {
        input.min = newMin;
        updateValue(Math.max(newMin, currentValue), false);
      },
      setMax: (newMax) => {
        input.max = newMax;
        updateValue(Math.min(newMax, currentValue), false);
      },
      setDisabled: (isDisabled) => {
        input.disabled = isDisabled;
        decrementBtn.disabled = isDisabled || currentValue <= min;
        incrementBtn.disabled = isDisabled || currentValue >= max;

        if (isDisabled) {
          spinner.classList.add('quantity-spinner-disabled');
        } else {
          spinner.classList.remove('quantity-spinner-disabled');
        }
      }
    };
  }

  /**
   * Initialize all quantity spinners on a page
   * @param {string} selector - CSS selector for spinner containers
   */
  static initAll(selector = '[data-quantity-spinner]') {
    const containers = document.querySelectorAll(selector);

    containers.forEach(container => {
      const value = parseInt(container.dataset.value) || 1;
      const min = parseInt(container.dataset.min) || 1;
      const max = parseInt(container.dataset.max) || 99;
      const step = parseInt(container.dataset.step) || 1;
      const size = container.dataset.size || 'md';

      this.create(container, { value, min, max, step, size });
    });
  }
}

/* ==========================================
   QUANTITY SPINNER STYLES
   ========================================== */

// Inject styles if they don't exist
if (typeof document !== 'undefined' && !document.getElementById('quantity-spinner-styles')) {
  const styles = document.createElement('style');
  styles.id = 'quantity-spinner-styles';
  styles.textContent = `
    .quantity-spinner {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      background: var(--bg-primary, #ffffff);
      overflow: hidden;
    }

    .quantity-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--text-primary, #111827);
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      flex-shrink: 0;
    }

    .quantity-btn:hover:not(:disabled) {
      background: var(--gray-100, #f3f4f6);
      color: var(--accent-500, #f97316);
    }

    .quantity-btn:active:not(:disabled) {
      background: var(--gray-200, #e5e7eb);
      transform: scale(0.95);
    }

    .quantity-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .quantity-input {
      width: 50px;
      text-align: center;
      border: none;
      background: transparent;
      font-size: var(--text-base, 1rem);
      font-weight: var(--font-semibold, 600);
      color: var(--text-primary, #111827);
      padding: 0;
      outline: none;
      -moz-appearance: textfield; /* Firefox */
    }

    /* Remove number input spinners */
    .quantity-input::-webkit-outer-spin-button,
    .quantity-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .quantity-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Value change animation */
    .quantity-value-change {
      animation: quantityBounce 0.3s ease;
    }

    @keyframes quantityBounce {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    /* Size variants */
    .quantity-spinner-sm {
      height: 32px;
    }

    .quantity-spinner-sm .quantity-btn {
      width: 32px;
      height: 32px;
    }

    .quantity-spinner-sm .quantity-input {
      width: 40px;
      font-size: var(--text-sm, 0.875rem);
    }

    .quantity-spinner-md {
      height: 40px;
    }

    .quantity-spinner-md .quantity-btn {
      width: 40px;
      height: 40px;
    }

    .quantity-spinner-lg {
      height: 48px;
    }

    .quantity-spinner-lg .quantity-btn {
      width: 48px;
      height: 48px;
    }

    .quantity-spinner-lg .quantity-input {
      width: 60px;
      font-size: var(--text-lg, 1.125rem);
    }

    /* Disabled state */
    .quantity-spinner-disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gray-100, #f3f4f6);
    }

    /* Focus state */
    .quantity-spinner:focus-within {
      outline: 2px solid var(--accent-500, #f97316);
      outline-offset: 2px;
    }

    /* Mobile optimizations */
    @media (max-width: 640px) {
      .quantity-btn {
        -webkit-tap-highlight-color: transparent;
      }

      /* Increase touch targets on mobile */
      .quantity-spinner-sm {
        height: 40px;
      }

      .quantity-spinner-sm .quantity-btn {
        width: 40px;
        height: 40px;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantitySpinner;
}
