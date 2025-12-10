/**
 * FORM VALIDATOR
 * London Star Marketplace - Real-time form validation with inline feedback
 */

class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = typeof formSelector === 'string'
      ? document.querySelector(formSelector)
      : formSelector;

    if (!this.form) {
      console.error('FormValidator: Form not found');
      return;
    }

    this.options = {
      validateOnBlur: options.validateOnBlur !== false,
      validateOnInput: options.validateOnInput !== false,
      showSuccessIcons: options.showSuccessIcons !== false,
      rules: options.rules || {},
      messages: options.messages || {},
      onSubmit: options.onSubmit || null,
      ...options
    };

    this.fields = {};
    this.isValid = false;

    this.init();
  }

  /**
   * Initialize validator
   */
  init() {
    // Prevent default form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Get all form fields
    const inputs = this.form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      const name = input.name || input.id;
      if (!name) return;

      this.fields[name] = {
        element: input,
        valid: null,
        errors: []
      };

      // Add validation listeners
      if (this.options.validateOnBlur) {
        input.addEventListener('blur', () => this.validateField(name));
      }

      if (this.options.validateOnInput) {
        input.addEventListener('input', () => {
          // Debounce input validation
          clearTimeout(input.validationTimeout);
          input.validationTimeout = setTimeout(() => {
            this.validateField(name);
          }, 300);
        });
      }
    });
  }

  /**
   * Validate a single field
   */
  validateField(name) {
    const field = this.fields[name];
    if (!field) return true;

    const rules = this.options.rules[name];
    if (!rules) return true;

    const value = field.element.value;
    const errors = [];

    // Required validation
    if (rules.required && !value.trim()) {
      errors.push(this.getMessage(name, 'required') || 'This field is required');
    }

    // Email validation
    if (rules.email && value && !this.isValidEmail(value)) {
      errors.push(this.getMessage(name, 'email') || 'Please enter a valid email address');
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(this.getMessage(name, 'minLength') || `Minimum ${rules.minLength} characters required`);
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(this.getMessage(name, 'maxLength') || `Maximum ${rules.maxLength} characters allowed`);
    }

    // Min value validation
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      errors.push(this.getMessage(name, 'min') || `Minimum value is ${rules.min}`);
    }

    // Max value validation
    if (rules.max !== undefined && parseFloat(value) > rules.max) {
      errors.push(this.getMessage(name, 'max') || `Maximum value is ${rules.max}`);
    }

    // Pattern validation
    if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
      errors.push(this.getMessage(name, 'pattern') || 'Invalid format');
    }

    // Custom validation function
    if (rules.custom && typeof rules.custom === 'function') {
      const customError = rules.custom(value, this.getFormData());
      if (customError) {
        errors.push(customError);
      }
    }

    // Password strength
    if (rules.strength && value) {
      const strength = this.checkPasswordStrength(value);
      if (strength.level < this.getStrengthLevel(rules.strength)) {
        errors.push(this.getMessage(name, 'strength') || `Password is too weak`);
      }
    }

    // Match another field
    if (rules.matches) {
      const matchField = this.fields[rules.matches];
      if (matchField && value !== matchField.element.value) {
        errors.push(this.getMessage(name, 'matches') || 'Fields do not match');
      }
    }

    // Update field status
    field.valid = errors.length === 0;
    field.errors = errors;

    // Update UI
    this.updateFieldUI(name);

    return field.valid;
  }

  /**
   * Validate all fields
   */
  validateAll() {
    let allValid = true;

    Object.keys(this.fields).forEach(name => {
      const isValid = this.validateField(name);
      if (!isValid) allValid = false;
    });

    this.isValid = allValid;
    return allValid;
  }

  /**
   * Update field UI with validation feedback
   */
  updateFieldUI(name) {
    const field = this.fields[name];
    const input = field.element;

    // Remove existing feedback
    this.removeFeedback(input);

    // Add validation classes
    input.classList.remove('input-valid', 'input-invalid');

    if (field.valid === true) {
      input.classList.add('input-valid');

      if (this.options.showSuccessIcons) {
        this.addSuccessIcon(input);
      }
    } else if (field.valid === false) {
      input.classList.add('input-invalid');
      this.addErrorMessage(input, field.errors[0]);
    }
  }

  /**
   * Add success icon
   */
  addSuccessIcon(input) {
    const icon = document.createElement('span');
    icon.className = 'form-feedback-icon form-feedback-success';
    icon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="4 10 8 14 16 6"/>
      </svg>
    `;

    this.insertFeedback(input, icon);
  }

  /**
   * Add error message
   */
  addErrorMessage(input, message) {
    const error = document.createElement('div');
    error.className = 'form-feedback-error';
    error.textContent = message;

    const icon = document.createElement('span');
    icon.className = 'form-feedback-icon form-feedback-error-icon';
    icon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="10" cy="10" r="8"/>
        <line x1="10" y1="6" x2="10" y2="10"/>
        <line x1="10" y1="14" x2="10.01" y2="14"/>
      </svg>
    `;

    this.insertFeedback(input, icon);

    const parent = input.closest('.form-group') || input.parentElement;
    parent.appendChild(error);
  }

  /**
   * Insert feedback icon
   */
  insertFeedback(input, element) {
    const parent = input.closest('.form-group') || input.parentElement;

    // Position icon
    const wrapper = parent.querySelector('.input-wrapper') || parent;

    if (!wrapper.classList.contains('input-wrapper')) {
      wrapper.classList.add('input-wrapper');
      wrapper.style.position = 'relative';
    }

    wrapper.appendChild(element);
  }

  /**
   * Remove feedback
   */
  removeFeedback(input) {
    const parent = input.closest('.form-group') || input.parentElement;

    const icons = parent.querySelectorAll('.form-feedback-icon');
    const errors = parent.querySelectorAll('.form-feedback-error');

    icons.forEach(icon => icon.remove());
    errors.forEach(error => error.remove());
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    // Validate all fields
    const isValid = this.validateAll();

    if (!isValid) {
      // Focus first invalid field
      const firstInvalid = Object.keys(this.fields).find(name => !this.fields[name].valid);
      if (firstInvalid) {
        this.fields[firstInvalid].element.focus();
      }
      return;
    }

    // Call onSubmit callback if provided
    if (this.options.onSubmit) {
      const formData = this.getFormData();
      await this.options.onSubmit(formData, this.form);
    }
  }

  /**
   * Get form data
   */
  getFormData() {
    const data = {};
    Object.keys(this.fields).forEach(name => {
      data[name] = this.fields[name].element.value;
    });
    return data;
  }

  /**
   * Get validation message
   */
  getMessage(fieldName, ruleType) {
    return this.options.messages[fieldName]?.[ruleType] ||
           this.options.messages[fieldName];
  }

  /**
   * Email validation helper
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Password strength checker
   */
  checkPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = ['weak', 'fair', 'good', 'strong'];
    const level = Math.min(Math.floor(score / 2), levels.length - 1);

    return {
      score,
      level,
      text: levels[level]
    };
  }

  /**
   * Get strength level number
   */
  getStrengthLevel(strength) {
    const levels = { weak: 0, fair: 1, good: 2, strong: 3 };
    return levels[strength] || 0;
  }

  /**
   * Reset form
   */
  reset() {
    this.form.reset();
    Object.keys(this.fields).forEach(name => {
      this.fields[name].valid = null;
      this.fields[name].errors = [];
      this.removeFeedback(this.fields[name].element);
      this.fields[name].element.classList.remove('input-valid', 'input-invalid');
    });
  }

  /**
   * Static init method
   */
  static init(formSelector, options = {}) {
    return new FormValidator(formSelector, options);
  }
}

/* ==========================================
   FORM VALIDATOR STYLES
   ========================================== */

if (typeof document !== 'undefined' && !document.getElementById('form-validator-styles')) {
  const styles = document.createElement('style');
  styles.id = 'form-validator-styles';
  styles.textContent = `
    .input-wrapper {
      position: relative;
    }

    .input-valid {
      border-color: var(--success-500, #10b981) !important;
    }

    .input-invalid {
      border-color: var(--error-500, #ef4444) !important;
    }

    .form-feedback-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .form-feedback-success {
      color: var(--success-500, #10b981);
    }

    .form-feedback-error-icon {
      color: var(--error-500, #ef4444);
    }

    .form-feedback-error {
      color: var(--error-600, #dc2626);
      font-size: var(--text-sm, 0.875rem);
      margin-top: var(--space-1, 4px);
      display: flex;
      align-items: flex-start;
      gap: var(--space-1, 4px);
      animation: slideInDown 0.2s ease;
    }

    /* Adjust input padding when icon is present */
    .input-wrapper:has(.form-feedback-icon) input,
    .input-wrapper:has(.form-feedback-icon) textarea {
      padding-right: 40px;
    }

    /* Success/error animations */
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styles);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}
