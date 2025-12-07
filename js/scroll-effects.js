/**
 * Scroll Effects Handler
 * Adds subtle animations and transitions on scroll
 */

class ScrollEffects {
    constructor() {
        this.scrollY = 0;
        this.ticking = false;
        this.observers = new Map();
        this.init();
    }

    init() {
        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        // Header scroll effect
        this.initHeaderEffect();

        // Fade-in observer for elements
        this.initFadeInObserver();

        // Scroll event listener
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    initHeaderEffect() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Add initial state
        header.style.transition = 'box-shadow 0.3s ease, background-color 0.3s ease';
    }

    initFadeInObserver() {
        // Elements that should fade in on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px' // Extended top margin to catch already-visible elements
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.remove('scroll-fade-hidden');
                    // Optionally unobserve after animation
                    // fadeInObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with scroll-fade class
        const fadeElements = document.querySelectorAll('.scroll-fade');
        fadeElements.forEach(el => {
            el.classList.add('scroll-fade-hidden');
            fadeInObserver.observe(el);
        });

        this.observers.set('fadeIn', fadeInObserver);

        // Trigger immediate check for elements already in viewport
        // Use requestAnimationFrame to ensure layout is complete
        requestAnimationFrame(() => {
            fadeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInViewport) {
                    el.classList.add('is-visible');
                    el.classList.remove('scroll-fade-hidden');
                }
            });
        });
    }

    handleScroll() {
        this.scrollY = window.scrollY;

        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateHeaderOnScroll();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        if (this.scrollY > 50) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            header.classList.add('scrolled');
        } else {
            header.style.boxShadow = 'none';
            header.classList.remove('scrolled');
        }
    }

    // Add scroll fade to specific elements
    addScrollFade(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('scroll-fade', 'scroll-fade-hidden');
            if (this.observers.has('fadeIn')) {
                this.observers.get('fadeIn').observe(el);
            }
        });

        // Immediately check if elements are already in viewport
        requestAnimationFrame(() => {
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInViewport) {
                    el.classList.add('is-visible');
                    el.classList.remove('scroll-fade-hidden');
                }
            });
        });
    }

    // Destroy all observers
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.scrollEffects = new ScrollEffects();
    });
} else {
    window.scrollEffects = new ScrollEffects();
}
