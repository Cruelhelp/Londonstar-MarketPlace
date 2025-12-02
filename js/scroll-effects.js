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
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
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
