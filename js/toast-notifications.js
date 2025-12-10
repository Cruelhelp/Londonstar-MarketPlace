/**
 * Toast Notification System
 * Replaces browser alert() and confirm() with elegant in-app banners
 * London Star Marketplace - Premium UI Component
 */

class ToastNotifications {
    constructor() {
        this.container = null;
        this.activeToasts = new Map();
        this.init();
    }

    /**
     * Initialize toast container
     */
    init() {
        if (document.getElementById('toast-container')) {
            this.container = document.getElementById('toast-container');
            return;
        }

        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: success, error, warning, info
     * @param {number} duration - Auto-dismiss duration in ms (0 = manual dismiss)
     * @returns {HTMLElement} Toast element
     */
    show(message, type = 'info', duration = 4000) {
        const toast = this.createToast(message, type, duration);
        this.container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismiss(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * Create toast element
     */
    createToast(message, type, duration) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        toast.id = id;
        this.activeToasts.set(id, toast);

        // Icon
        const icon = this.getIcon(type);

        // Content
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <div class="toast-message">${this.escapeHtml(message)}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.dismiss(toast);
        });

        // Progress bar (if auto-dismiss)
        if (duration > 0) {
            const progressBar = document.createElement('div');
            progressBar.className = 'toast-progress';
            progressBar.style.animationDuration = `${duration}ms`;
            toast.appendChild(progressBar);
        }

        return toast;
    }

    /**
     * Dismiss a toast
     */
    dismiss(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.activeToasts.delete(toast.id);
        }, 300);
    }

    /**
     * Show success toast
     */
    success(message, duration = 4000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Show error toast
     */
    error(message, duration = 6000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Show warning toast
     */
    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Show info toast
     */
    info(message, duration = 4000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Show confirmation dialog
     * @param {Object} options - Configuration object
     * @returns {Promise<boolean>} Resolves to true if confirmed, false if cancelled
     */
    confirm(options = {}) {
        return new Promise((resolve) => {
            const {
                message = 'Are you sure?',
                confirmText = 'Confirm',
                cancelText = 'Cancel',
                type = 'warning'
            } = options;

            const overlay = document.createElement('div');
            overlay.className = 'toast-overlay';

            const dialog = document.createElement('div');
            dialog.className = `toast-dialog toast-dialog-${type}`;

            const icon = this.getIcon(type);

            dialog.innerHTML = `
                <div class="toast-dialog-icon">${icon}</div>
                <div class="toast-dialog-content">
                    <div class="toast-dialog-message">${this.escapeHtml(message)}</div>
                    <div class="toast-dialog-actions">
                        <button class="toast-btn toast-btn-cancel">${this.escapeHtml(cancelText)}</button>
                        <button class="toast-btn toast-btn-confirm toast-btn-${type}">${this.escapeHtml(confirmText)}</button>
                    </div>
                </div>
            `;

            overlay.appendChild(dialog);
            document.body.appendChild(overlay);

            // Trigger animation
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });

            // Button handlers
            const confirmBtn = dialog.querySelector('.toast-btn-confirm');
            const cancelBtn = dialog.querySelector('.toast-btn-cancel');

            const cleanup = () => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    if (overlay.parentNode) {
                        overlay.parentNode.removeChild(overlay);
                    }
                }, 300);
            };

            confirmBtn.addEventListener('click', () => {
                cleanup();
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                cleanup();
                resolve(false);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            });

            // ESC key to cancel
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        });
    }

    /**
     * Get icon SVG for toast type
     */
    getIcon(type) {
        const icons = {
            success: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `,
            error: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            warning: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M12 10V14M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `,
            info: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            `
        };

        return icons[type] || icons.info;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Clear all toasts
     */
    clearAll() {
        this.activeToasts.forEach(toast => {
            this.dismiss(toast);
        });
    }
}

// Create global instance
const toast = new ToastNotifications();

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastNotifications;
}
