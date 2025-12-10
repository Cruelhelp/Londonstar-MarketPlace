/**
 * IMAGE LIGHTBOX
 * London Star Marketplace - Fullscreen image viewer with zoom and gallery
 */

class Lightbox {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || '[data-lightbox]',
      enableZoom: options.enableZoom !== false,
      enableSwipe: options.enableSwipe !== false,
      enableKeyboard: options.enableKeyboard !== false,
      backgroundColor: options.backgroundColor || 'rgba(0, 0, 0, 0.95)',
      closeOnBackdropClick: options.closeOnBackdropClick !== false,
      showCounter: options.showCounter !== false,
      showControls: options.showControls !== false,
      zoomStep: options.zoomStep || 0.5,
      maxZoom: options.maxZoom || 3,
      animationDuration: options.animationDuration || 300,
      ...options
    };

    this.currentIndex = 0;
    this.images = [];
    this.isOpen = false;
    this.zoomLevel = 1;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.translateY = 0;

    this.lightboxEl = null;
    this.imageEl = null;
  }

  /**
   * Initialize lightbox
   */
  init() {
    // Find all lightbox images
    const imageElements = document.querySelectorAll(this.options.selector);

    this.images = Array.from(imageElements).map((el, index) => ({
      src: el.dataset.lightbox || el.src || el.href,
      alt: el.alt || el.title || '',
      element: el,
      index
    }));

    // Attach click handlers
    this.images.forEach((img, index) => {
      img.element.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });

      // Make clickable elements keyboard accessible
      if (img.element.tagName !== 'A' && img.element.tagName !== 'BUTTON') {
        img.element.setAttribute('role', 'button');
        img.element.setAttribute('tabindex', '0');
        img.element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(index);
          }
        });
      }
    });

    // Create lightbox DOM
    this.createLightbox();
  }

  /**
   * Create lightbox DOM structure
   */
  createLightbox() {
    // Main container
    this.lightboxEl = document.createElement('div');
    this.lightboxEl.className = 'lightbox';
    this.lightboxEl.setAttribute('role', 'dialog');
    this.lightboxEl.setAttribute('aria-modal', 'true');
    this.lightboxEl.setAttribute('aria-label', 'Image lightbox');
    this.lightboxEl.style.backgroundColor = this.options.backgroundColor;

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    if (this.options.closeOnBackdropClick) {
      backdrop.addEventListener('click', () => this.close());
    }
    this.lightboxEl.appendChild(backdrop);

    // Content container
    const content = document.createElement('div');
    content.className = 'lightbox-content';
    this.lightboxEl.appendChild(content);

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'lightbox-image-container';
    content.appendChild(imageContainer);

    // Image element
    this.imageEl = document.createElement('img');
    this.imageEl.className = 'lightbox-image';
    this.imageEl.alt = '';
    imageContainer.appendChild(this.imageEl);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.addEventListener('click', () => this.close());
    content.appendChild(closeBtn);

    if (this.options.showControls && this.images.length > 1) {
      // Previous button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'lightbox-prev';
      prevBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      `;
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.addEventListener('click', () => this.prev());
      content.appendChild(prevBtn);

      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'lightbox-next';
      nextBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      `;
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.addEventListener('click', () => this.next());
      content.appendChild(nextBtn);
    }

    // Counter
    if (this.options.showCounter && this.images.length > 1) {
      const counter = document.createElement('div');
      counter.className = 'lightbox-counter';
      counter.setAttribute('aria-live', 'polite');
      content.appendChild(counter);
    }

    // Zoom controls
    if (this.options.enableZoom) {
      const zoomControls = document.createElement('div');
      zoomControls.className = 'lightbox-zoom-controls';

      const zoomInBtn = document.createElement('button');
      zoomInBtn.className = 'lightbox-zoom-in';
      zoomInBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><line x1="10" y1="7" x2="10" y2="13"/><line x1="7" y1="10" x2="13" y2="10"/></svg>`;
      zoomInBtn.setAttribute('aria-label', 'Zoom in');
      zoomInBtn.addEventListener('click', () => this.zoomIn());

      const zoomOutBtn = document.createElement('button');
      zoomOutBtn.className = 'lightbox-zoom-out';
      zoomOutBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="7"/><line x1="7" y1="10" x2="13" y2="10"/></svg>`;
      zoomOutBtn.setAttribute('aria-label', 'Zoom out');
      zoomOutBtn.addEventListener('click', () => this.zoomOut());

      zoomControls.appendChild(zoomInBtn);
      zoomControls.appendChild(zoomOutBtn);
      content.appendChild(zoomControls);

      // Zoom with mouse wheel
      imageContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.zoomIn();
        } else {
          this.zoomOut();
        }
      }, { passive: false });

      // Pan when zoomed
      imageContainer.addEventListener('mousedown', (e) => this.startDrag(e));
      imageContainer.addEventListener('mousemove', (e) => this.drag(e));
      imageContainer.addEventListener('mouseup', () => this.endDrag());
      imageContainer.addEventListener('mouseleave', () => this.endDrag());

      // Touch support
      imageContainer.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
      imageContainer.addEventListener('touchmove', (e) => {
        if (this.isDragging) {
          e.preventDefault();
          this.drag(e.touches[0]);
        }
      });
      imageContainer.addEventListener('touchend', () => this.endDrag());
    }

    // Keyboard navigation
    if (this.options.enableKeyboard) {
      this.lightboxEl.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;

        switch (e.key) {
          case 'Escape':
            this.close();
            break;
          case 'ArrowLeft':
            this.prev();
            break;
          case 'ArrowRight':
            this.next();
            break;
          case '+':
          case '=':
            this.zoomIn();
            break;
          case '-':
          case '_':
            this.zoomOut();
            break;
        }
      });
    }

    // Swipe support
    if (this.options.enableSwipe) {
      let touchStartX = 0;
      let touchEndX = 0;

      imageContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      imageContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      });
    }

    document.body.appendChild(this.lightboxEl);
  }

  /**
   * Open lightbox
   */
  open(index = 0) {
    this.currentIndex = index;
    this.isOpen = true;
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;

    // Load image
    this.loadImage(this.images[index]);

    // Show lightbox
    this.lightboxEl.classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';

    // Update counter
    this.updateCounter();

    // Set focus to close button for accessibility
    setTimeout(() => {
      this.lightboxEl.querySelector('.lightbox-close').focus();
    }, 100);
  }

  /**
   * Close lightbox
   */
  close() {
    this.isOpen = false;
    this.lightboxEl.classList.remove('lightbox-open');
    document.body.style.overflow = '';

    // Return focus to trigger element
    if (this.images[this.currentIndex]) {
      this.images[this.currentIndex].element.focus();
    }
  }

  /**
   * Load image
   */
  loadImage(img) {
    this.imageEl.style.opacity = '0';
    this.imageEl.src = img.src;
    this.imageEl.alt = img.alt;

    this.imageEl.onload = () => {
      this.imageEl.style.opacity = '1';
      this.resetTransform();
    };
  }

  /**
   * Navigate to previous image
   */
  prev() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.loadImage(this.images[this.currentIndex]);
    this.updateCounter();
  }

  /**
   * Navigate to next image
   */
  next() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.loadImage(this.images[this.currentIndex]);
    this.updateCounter();
  }

  /**
   * Zoom in
   */
  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel + this.options.zoomStep, this.options.maxZoom);
    this.applyTransform();
  }

  /**
   * Zoom out
   */
  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel - this.options.zoomStep, 1);
    if (this.zoomLevel === 1) {
      this.translateX = 0;
      this.translateY = 0;
    }
    this.applyTransform();
  }

  /**
   * Start dragging
   */
  startDrag(e) {
    if (this.zoomLevel <= 1) return;
    this.isDragging = true;
    this.startX = e.clientX - this.translateX;
    this.startY = e.clientY - this.translateY;
    this.imageEl.style.cursor = 'grabbing';
  }

  /**
   * Drag
   */
  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.translateX = e.clientX - this.startX;
    this.translateY = e.clientY - this.startY;
    this.applyTransform();
  }

  /**
   * End dragging
   */
  endDrag() {
    this.isDragging = false;
    this.imageEl.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
  }

  /**
   * Apply transform
   */
  applyTransform() {
    this.imageEl.style.transform = `scale(${this.zoomLevel}) translate(${this.translateX / this.zoomLevel}px, ${this.translateY / this.zoomLevel}px)`;
    this.imageEl.style.cursor = this.zoomLevel > 1 ? 'grab' : 'default';
  }

  /**
   * Reset transform
   */
  resetTransform() {
    this.zoomLevel = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.applyTransform();
  }

  /**
   * Handle swipe gesture
   */
  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  /**
   * Update counter
   */
  updateCounter() {
    const counter = this.lightboxEl.querySelector('.lightbox-counter');
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  }

  /**
   * Destroy lightbox
   */
  destroy() {
    if (this.lightboxEl) {
      this.lightboxEl.remove();
    }
    this.images = [];
    this.isOpen = false;
  }

  /**
   * Static method to initialize
   */
  static init(selector, options = {}) {
    const lightbox = new Lightbox({ ...options, selector });
    lightbox.init();
    return lightbox;
  }
}

/* ==========================================
   LIGHTBOX STYLES
   ========================================== */

if (typeof document !== 'undefined' && !document.getElementById('lightbox-styles')) {
  const styles = document.createElement('style');
  styles.id = 'lightbox-styles';
  styles.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: var(--z-modal, 1050);
      display: none;
      align-items: center;
      justify-content: center;
    }

    .lightbox-open {
      display: flex;
      animation: lightboxFadeIn 0.3s ease;
    }

    @keyframes lightboxFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .lightbox-backdrop {
      position: absolute;
      inset: 0;
      cursor: zoom-out;
    }

    .lightbox-content {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-image-container {
      max-width: 90%;
      max-height: 90%;
      overflow: hidden;
      user-select: none;
    }

    .lightbox-image {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      transition: opacity 0.3s ease, transform 0.1s ease-out;
    }

    .lightbox-close,
    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .lightbox-close:hover,
    .lightbox-prev:hover,
    .lightbox-next:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    .lightbox-close {
      top: 20px;
      right: 20px;
    }

    .lightbox-prev {
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    .lightbox-next {
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    .lightbox-counter {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .lightbox-zoom-controls {
      position: absolute;
      bottom: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
    }

    .lightbox-zoom-in,
    .lightbox-zoom-out {
      background: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .lightbox-zoom-in:hover,
    .lightbox-zoom-out:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    @media (max-width: 768px) {
      .lightbox-close,
      .lightbox-prev,
      .lightbox-next {
        width: 40px;
        height: 40px;
      }

      .lightbox-close {
        top: 10px;
        right: 10px;
      }

      .lightbox-prev {
        left: 10px;
      }

      .lightbox-next {
        right: 10px;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Lightbox;
}
