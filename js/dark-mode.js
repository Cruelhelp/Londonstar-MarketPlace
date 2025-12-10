/**
 * DARK MODE CONTROLLER
 * London Star Marketplace - Theme switcher with persistence
 */

class DarkMode {
  constructor(options = {}) {
    this.options = {
      storageKey: options.storageKey || 'theme-preference',
      defaultTheme: options.defaultTheme || 'light',
      autoDetect: options.autoDetect !== false, // Detect system preference
      toggleButtonSelector: options.toggleButtonSelector || '.dark-mode-toggle',
      onThemeChange: options.onThemeChange || null,
      ...options
    };

    this.currentTheme = null;
    this.init();
  }

  /**
   * Initialize dark mode
   */
  init() {
    // Get initial theme
    this.currentTheme = this.getTheme();

    // Apply theme immediately (prevent flash)
    this.applyTheme(this.currentTheme);

    // Create toggle button if it doesn't exist
    if (!document.querySelector(this.options.toggleButtonSelector)) {
      this.createToggleButton();
    }

    // Add event listeners
    this.attachEventListeners();

    // Listen for system theme changes
    if (this.options.autoDetect) {
      this.watchSystemTheme();
    }
  }

  /**
   * Get current theme from storage or system preference
   */
  getTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.options.storageKey);
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference if auto-detect enabled
    if (this.options.autoDetect) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    // Fallback to default
    return this.options.defaultTheme;
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    // Set data-theme attribute on root element
    document.documentElement.setAttribute('data-theme', theme);

    // Update body class for backwards compatibility
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${theme}-mode`);

    // Set color-scheme meta tag
    this.setColorSchemeMeta(theme);

    // Save to storage
    localStorage.setItem(this.options.storageKey, theme);

    // Update current theme
    this.currentTheme = theme;

    // Update toggle button icon
    this.updateToggleButton();

    // Trigger callback
    if (this.options.onThemeChange) {
      this.options.onThemeChange(theme);
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme }
    }));
  }

  /**
   * Toggle between light and dark theme
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);

    // Animate toggle button
    const btn = document.querySelector(this.options.toggleButtonSelector);
    if (btn) {
      btn.style.transform = 'rotate(360deg) scale(1.2)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 300);
    }
  }

  /**
   * Set theme explicitly
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme);
    }
  }

  /**
   * Create floating toggle button
   */
  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.setAttribute('type', 'button');
    button.innerHTML = `
      <!-- Moon Icon (shown in light mode) -->
      <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>

      <!-- Sun Icon (shown in dark mode) -->
      <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    `;

    document.body.appendChild(button);
  }

  /**
   * Update toggle button state
   */
  updateToggleButton() {
    const btn = document.querySelector(this.options.toggleButtonSelector);
    if (btn) {
      btn.setAttribute('aria-label',
        this.currentTheme === 'dark'
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      );
    }
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Toggle button click
    document.addEventListener('click', (e) => {
      if (e.target.closest(this.options.toggleButtonSelector)) {
        this.toggle();
      }
    });

    // Keyboard shortcut: Ctrl/Cmd + Shift + D
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Watch for system theme changes
   */
  watchSystemTheme() {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Modern browsers
    if (darkModeQuery.addEventListener) {
      darkModeQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set preference
        if (!localStorage.getItem(this.options.storageKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
    // Legacy browsers
    else if (darkModeQuery.addListener) {
      darkModeQuery.addListener((e) => {
        if (!localStorage.getItem(this.options.storageKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  /**
   * Set color-scheme meta tag for browser chrome
   */
  setColorSchemeMeta(theme) {
    let meta = document.querySelector('meta[name="color-scheme"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'color-scheme';
      document.head.appendChild(meta);
    }

    meta.content = theme === 'dark' ? 'dark light' : 'light dark';
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Check if dark mode is active
   */
  isDark() {
    return this.currentTheme === 'dark';
  }

  /**
   * Static factory method
   */
  static init(options = {}) {
    return new DarkMode(options);
  }

  /**
   * Static method to apply theme before page renders (prevent flash)
   * Call this inline in <head> before stylesheets
   */
  static preventFlash(storageKey = 'theme-preference') {
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }
}

/* ==========================================
   INLINE FLASH PREVENTION SCRIPT
   ========================================== */

/**
 * Paste this script inline in <head> BEFORE stylesheets to prevent flash:
 *
 * <script>
 *   (function() {
 *     const theme = localStorage.getItem('theme-preference') ||
 *                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
 *     document.documentElement.setAttribute('data-theme', theme);
 *   })();
 * </script>
 */

/* ==========================================
   AUTO-INITIALIZE
   ========================================== */

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.darkMode = DarkMode.init();
    });
  } else {
    window.darkMode = DarkMode.init();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DarkMode;
}
