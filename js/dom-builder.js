/**
 * Safe DOM Builder
 * Helper utilities for creating DOM elements without innerHTML
 * Prevents XSS vulnerabilities
 */

class DOMBuilder {
    /**
     * Build element from template object
     * @param {string} tag - HTML tag name
     * @param {object} props - Properties (text, className, attrs, children, onClick, etc.)
     */
    static build(tag, props = {}) {
        const element = document.createElement(tag);

        // Set text content (safe - no HTML injection)
        if (props.text !== undefined) {
            element.textContent = props.text;
        }

        // Set class name
        if (props.className) {
            element.className = props.className;
        }

        // Set styles
        if (props.style) {
            Object.assign(element.style, props.style);
        }

        // Set attributes
        if (props.attrs) {
            Object.entries(props.attrs).forEach(([key, value]) => {
                // Security: prevent event handler injection
                if (!key.startsWith('on') && value !== null && value !== undefined) {
                    element.setAttribute(key, value);
                }
            });
        }

        // Set data attributes
        if (props.data) {
            Object.entries(props.data).forEach(([key, value]) => {
                element.dataset[key] = value;
            });
        }

        // Add event listeners (safer than onclick attributes)
        if (props.onClick) {
            element.addEventListener('click', props.onClick);
        }
        if (props.onChange) {
            element.addEventListener('change', props.onChange);
        }
        if (props.onSubmit) {
            element.addEventListener('submit', props.onSubmit);
        }

        // Append children
        if (props.children) {
            if (Array.isArray(props.children)) {
                props.children.forEach(child => {
                    if (child instanceof Node) {
                        element.appendChild(child);
                    } else if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    }
                });
            } else if (props.children instanceof Node) {
                element.appendChild(props.children);
            } else if (typeof props.children === 'string') {
                element.appendChild(document.createTextNode(props.children));
            }
        }

        return element;
    }

    /**
     * Quick element builders
     */
    static div(props) { return this.build('div', props); }
    static span(props) { return this.build('span', props); }
    static p(props) { return this.build('p', props); }
    static h1(props) { return this.build('h1', props); }
    static h2(props) { return this.build('h2', props); }
    static h3(props) { return this.build('h3', props); }
    static button(props) { return this.build('button', props); }
    static input(props) { return this.build('input', props); }
    static img(props) { return this.build('img', props); }
    static a(props) { return this.build('a', props); }
    static tr(props) { return this.build('tr', props); }
    static td(props) { return this.build('td', props); }
    static th(props) { return this.build('th', props); }

    /**
     * Replace innerHTML with safe rendering
     * Example: DOMBuilder.render(container, [element1, element2])
     */
    static render(container, elements) {
        // Clear existing content
        container.textContent = '';

        // Add new elements
        if (Array.isArray(elements)) {
            elements.forEach(el => {
                if (el instanceof Node) {
                    container.appendChild(el);
                }
            });
        } else if (elements instanceof Node) {
            container.appendChild(elements);
        }
    }

    /**
     * Safe product card builder
     */
    static buildProductCard(product, onClick) {
        const images = Array.isArray(product.images) ? product.images : [];
        const firstImage = images[0] || 'images/placeholder.png';

        const card = this.div({
            className: 'product-card scroll-fade',
            onClick: () => onClick(product.id)
        });

        // Image container with loader
        const imageContainer = this.div({
            className: 'image-loading',
            style: { position: 'relative' }
        });

        const loader = this.div({ className: 'image-loader' });
        imageContainer.appendChild(loader);

        const img = this.img({
            attrs: {
                src: firstImage,
                alt: product.name
            },
            className: 'product-image'
        });
        img.onload = () => {
            imageContainer.classList.remove('image-loading');
            loader.remove();
        };
        imageContainer.appendChild(img);

        card.appendChild(imageContainer);

        // Product title
        card.appendChild(this.div({
            className: 'product-title',
            text: product.name
        }));

        // Price
        card.appendChild(this.div({
            className: 'product-price',
            text: `J$${parseFloat(product.price).toFixed(2)}`
        }));

        // Description
        card.appendChild(this.div({
            className: 'product-description',
            text: product.description
        }));

        // Add to cart button
        const addBtn = this.button({
            className: 'btn btn-primary',
            text: 'Add to Cart',
            style: { width: '100%', marginTop: '12px' },
            onClick: (e) => {
                e.stopPropagation();
                if (window.addToCart) {
                    window.addToCart(product.id);
                }
            }
        });
        card.appendChild(addBtn);

        return card;
    }

    /**
     * Safe table row builder
     */
    static buildTableRow(cells, onClick) {
        const row = this.tr({ onClick });

        cells.forEach(cellData => {
            const cell = this.td({
                text: typeof cellData === 'object' ? cellData.text : cellData,
                className: typeof cellData === 'object' ? cellData.className : ''
            });
            row.appendChild(cell);
        });

        return row;
    }

    /**
     * Build empty state message
     */
    static buildEmptyState(message, icon = '📦') {
        return this.div({
            className: 'empty-state',
            style: { textAlign: 'center', padding: '40px' },
            children: [
                this.div({
                    text: icon,
                    style: { fontSize: '48px', marginBottom: '16px' }
                }),
                this.p({
                    text: message,
                    style: { color: '#6b7280', fontSize: '16px' }
                })
            ]
        });
    }

    /**
     * Build loading spinner
     */
    static buildSpinner(size = 'regular') {
        return this.div({
            className: 'spinner-container',
            style: { gridColumn: '1 / -1' },
            children: [
                this.div({ className: `spinner ${size}` })
            ]
        });
    }
}

// Make available globally
window.DOMBuilder = DOMBuilder;

console.log('✅ DOM Builder utilities loaded');
