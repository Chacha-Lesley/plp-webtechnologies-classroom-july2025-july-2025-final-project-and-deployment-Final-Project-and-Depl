//- Form Handling =====
/**
 * Form Controller
 * Handles contact form validation and submission
 */

class FormController {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;
        
        this.validationRules = {
            name: { required: true, minLength: 2 },
            email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            subject: { required: true, minLength: 3 },
            message: { required: true, minLength: 10 }
        };
        
        this.init();
    }
    
    init() {
        if (this.form) {
            this.bindEvents();
            this.setupRealTimeValidation();
        }
    }
    
    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation on blur and input
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        if (this.validateForm()) {
            this.submitForm();
        }
    }
    
    validateForm() {
        const formData = new FormData(this.form);
        let isValid = true;
        
        // Validate each field
        for (const [fieldName, rules] of Object.entries(this.validationRules)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            const value = formData.get(fieldName);
            
            if (!this.validateFieldValue(field, value, rules)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value;
        const rules = this.validationRules[fieldName];
        
        return this.validateFieldValue(field, value, rules);
    }
    
    validateFieldValue(field, value, rules) {
        const errorElement = document.getElementById(`${field.name}Error`);
        let errorMessage = '';
        
        // Required validation
        if (rules.required && (!value || value.trim().length === 0)) {
            errorMessage = `${this.getFieldLabel(field.name)} is required`;
        }
        // Minimum length validation
        else if (rules.minLength && value.trim().length < rules.minLength) {
            errorMessage = `${this.getFieldLabel(field.name)} must be at least ${rules.minLength} characters`;
        }
        // Pattern validation (email)
        else if (rules.pattern && !rules.pattern.test(value)) {
            if (field.type === 'email') {
                errorMessage = 'Please enter a valid email address';
            } else {
                errorMessage = `${this.getFieldLabel(field.name)} format is invalid`;
            }
        }
        
        if (errorMessage) {
            this.showFieldError(field, errorMessage);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }
    
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.name}Error`);
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
    }
    
    getFieldLabel(fieldName) {
        const labelMap = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labelMap[fieldName] || fieldName;
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.setSubmitButtonState(true);
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateFormSubmission();
            
            this.showSuccess();
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Failed to send message. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
        }
    }
    
    simulateFormSubmission() {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }
    
    setSubmitButtonState(isLoading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            this.submitBtn.disabled = true;
            this.submitBtn.setAttribute('aria-busy', 'true');
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            this.submitBtn.disabled = false;
            this.submitBtn.setAttribute('aria-busy', 'false');
        }
    }
    
    showSuccess() {
        // Hide form and show success message
        this.form.style.display = 'none';
        this.successMessage.style.display = 'block';
        
        // Focus success message for screen readers
        this.successMessage.focus();
        
        // Announce success
        if (window.portfolioApp && typeof window.portfolioApp.announce === 'function') {
            window.portfolioApp.announce('Message sent successfully!');
        }
        
        // Auto-hide success message and show form again after 5 seconds
        setTimeout(() => {
            this.successMessage.style.display = 'none';
            this.form.style.display = 'block';
        }, 5000);
    }
    
    showError(message) {
        if (window.portfolioApp && typeof window.portfolioApp.showMessage === 'function') {
            window.portfolioApp.showMessage(message, 'error');
        } else {
            alert(message); // Fallback
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear any remaining errors
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => this.clearFieldError(input));
    }
    
    setupRealTimeValidation() {
        // Add visual feedback styles
        const style = document.createElement('style');
        style.textContent = `
            .form-group input.error,
            .form-group textarea.error {
                border-color: var(--error-color);
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
            }
            
            .form-error.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}