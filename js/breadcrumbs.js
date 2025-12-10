/**
 * BREADCRUMB NAVIGATION
 * London Star Marketplace - Auto-generated navigation breadcrumbs
 */

class Breadcrumbs {
  /**
   * Render breadcrumbs
   * @param {Object} options - Configuration
   */
  static render(options = {}) {
    const {
      path = [],
      container = null,
      separator = '>',
      maxItems = 0, // 0 = show all
      showHome = true,
      homeText = 'Home',
      homeUrl = 'index.html',
      currentPageClickable = false
    } = options;

    if (!container) {
      console.error('Breadcrumbs: container is required');
      return;
    }

    // Clear container
    container.textContent = '';

    // Create breadcrumb nav
    const nav = document.createElement('nav');
    nav.className = 'breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');

    // Create ordered list
    const ol = document.createElement('ol');
    ol.className = 'breadcrumbs-list';
    ol.setAttribute('itemscope', '');
    ol.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');

    // Build path array
    let items = [];

    if (showHome) {
      items.push({ text: homeText, url: homeUrl });
    }

    // Add provided path items
    items = items.concat(path.map((item, index) => {
      if (typeof item === 'string') {
        return { text: item, url: null };
      }
      return item;
    }));

    // Truncate if maxItems is set
    if (maxItems > 0 && items.length > maxItems) {
      const keepFirst = Math.floor(maxItems / 2);
      const keepLast = maxItems - keepFirst - 1;

      items = [
        ...items.slice(0, keepFirst),
        { text: '...', url: null, ellipsis: true },
        ...items.slice(-keepLast)
      ];
    }

    // Create breadcrumb items
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';
      li.setAttribute('itemprop', 'itemListElement');
      li.setAttribute('itemscope', '');
      li.setAttribute('itemtype', 'https://schema.org/ListItem');

      const isLast = index === items.length - 1;
      const isEllipsis = item.ellipsis;

      if (isEllipsis) {
        // Ellipsis item
        const span = document.createElement('span');
        span.className = 'breadcrumb-ellipsis';
        span.textContent = item.text;
        li.appendChild(span);
      } else if (isLast && !currentPageClickable) {
        // Current page (not clickable)
        const span = document.createElement('span');
        span.className = 'breadcrumb-current';
        span.setAttribute('itemprop', 'name');
        span.setAttribute('aria-current', 'page');
        span.textContent = item.text;
        li.appendChild(span);
      } else if (item.url) {
        // Clickable link
        const link = document.createElement('a');
        link.href = item.url;
        link.className = 'breadcrumb-link';
        link.setAttribute('itemprop', 'item');

        const span = document.createElement('span');
        span.setAttribute('itemprop', 'name');
        span.textContent = item.text;

        link.appendChild(span);
        li.appendChild(link);
      } else {
        // Non-clickable text
        const span = document.createElement('span');
        span.className = 'breadcrumb-text';
        span.setAttribute('itemprop', 'name');
        span.textContent = item.text;
        li.appendChild(span);
      }

      // Add position for schema.org
      const meta = document.createElement('meta');
      meta.setAttribute('itemprop', 'position');
      meta.content = (index + 1).toString();
      li.appendChild(meta);

      // Add separator (except for last item)
      if (!isLast) {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.setAttribute('aria-hidden', 'true');
        sep.textContent = separator;
        li.appendChild(sep);
      }

      ol.appendChild(li);
    });

    nav.appendChild(ol);
    container.appendChild(nav);

    return nav;
  }

  /**
   * Auto-generate breadcrumbs from URL path
   */
  static fromURL(container, options = {}) {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s && s !== 'index.html');

    // Convert segments to breadcrumb items
    const items = segments.map((segment, index) => {
      // Convert URL segment to readable text
      const text = segment
        .replace(/-/g, ' ')
        .replace(/\.html$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Build URL
      const url = '/' + segments.slice(0, index + 1).join('/');

      return { text, url };
    });

    return this.render({
      ...options,
      container,
      path: items
    });
  }

  /**
   * Generate breadcrumbs from data attributes
   */
  static fromDataAttributes(container) {
    if (!container) return;

    const pathData = container.dataset.breadcrumbs;
    if (!pathData) return;

    try {
      const path = JSON.parse(pathData);
      return this.render({
        container,
        path,
        showHome: container.dataset.showHome !== 'false',
        homeText: container.dataset.homeText || 'Home',
        homeUrl: container.dataset.homeUrl || 'index.html'
      });
    } catch (error) {
      console.error('Breadcrumbs: Invalid JSON in data-breadcrumbs', error);
    }
  }

  /**
   * Initialize all breadcrumbs on page
   */
  static initAll(selector = '[data-breadcrumbs]') {
    const containers = document.querySelectorAll(selector);
    containers.forEach(container => {
      this.fromDataAttributes(container);
    });
  }
}

/* ==========================================
   BREADCRUMB STYLES
   ========================================== */

if (typeof document !== 'undefined' && !document.getElementById('breadcrumbs-styles')) {
  const styles = document.createElement('style');
  styles.id = 'breadcrumbs-styles';
  styles.textContent = `
    .breadcrumbs {
      margin-bottom: var(--space-4, 1rem);
    }

    .breadcrumbs-list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: var(--text-sm, 0.875rem);
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
    }

    .breadcrumb-link {
      color: var(--text-secondary, #6b7280);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--accent-500, #f97316);
      text-decoration: underline;
    }

    .breadcrumb-link:focus-visible {
      outline: 2px solid var(--accent-500, #f97316);
      outline-offset: 2px;
      border-radius: var(--radius-sm, 4px);
    }

    .breadcrumb-text,
    .breadcrumb-current {
      color: var(--text-secondary, #6b7280);
    }

    .breadcrumb-current {
      font-weight: var(--font-semibold, 600);
      color: var(--text-primary, #111827);
    }

    .breadcrumb-separator {
      color: var(--text-tertiary, #9ca3af);
      user-select: none;
      font-size: var(--text-xs, 0.75rem);
    }

    .breadcrumb-ellipsis {
      color: var(--text-tertiary, #9ca3af);
      cursor: default;
      user-select: none;
    }

    /* Mobile optimization */
    @media (max-width: 640px) {
      .breadcrumbs-list {
        font-size: var(--text-xs, 0.75rem);
      }

      /* Hide middle items on mobile, show only first and last */
      .breadcrumb-item:not(:first-child):not(:last-child) {
        display: none;
      }

      /* Show ellipsis if needed */
      .breadcrumb-item:nth-last-child(2) .breadcrumb-separator::before {
        content: '...';
        margin-right: var(--space-2, 0.5rem);
      }
    }

    /* Tablet optimization */
    @media (min-width: 641px) and (max-width: 1024px) {
      /* Show max 4 items on tablet */
      .breadcrumb-item:nth-child(n+3):nth-last-child(n+3) {
        display: none;
      }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
      .breadcrumb-link {
        text-decoration: underline;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Breadcrumbs;
}
