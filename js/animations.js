//Animation Controller =====
/**
 * Animation Controller
 * Manages various animations and visual effects
 */

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
    }
    
    setupScrollAnimations() {
        // Staggered animations for grids
        this.setupStaggeredAnimations('.skills-grid .skill-card', 100);
        this.setupStaggeredAnimations('.secrets-grid .secret-card', 150);
        this.setupStaggeredAnimations('.projects-grid .project-card', 200);
        this.setupStaggeredAnimations('.interests-grid .interest-card', 120);
    }
    
    setupStaggeredAnimations(selector, delay) {
        const elements = document.querySelectorAll(selector);
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const index = Array.from(elements).indexOf(element);
                    
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, index * delay);
                    
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    }
    
    setupHoverEffects() {
        // Enhanced card hover effects
        const cards = document.querySelectorAll('.card, .project-card, .interest-card, .skill-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e, card);
                this.addGlowEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });
        
        // Button hover effects
        const buttons = document.querySelectorAll('.btn, .action-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.addButtonHoverEffect(button);
            });
            
            button.addEventListener('mouseleave', () => {
                this.removeButtonHoverEffect(button);
            });
        });
    }
    
    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    addGlowEffect(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.boxShadow = '0 20px 40px -12px rgba(6, 182, 212, 0.3)';
    }
    
    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }
    
    addButtonHoverEffect(button) {
        const icon = button.querySelector('.btn-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
        }
    }
    
    removeButtonHoverEffect(button) {
        const icon = button.querySelector('.btn-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }
    
    setupParallaxEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((el, index) => {
            if (el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0) {
                const speed = 0.5 + (index * 0.2);
                const yPos = scrolled * speed;
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
        
        // Section background parallax
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            if (section.getBoundingClientRect().top < window.innerHeight && section.getBoundingClientRect().bottom > 0) {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrolled * speed;
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.round(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // Utility animation methods
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
    
    fadeOut(element, duration = 300) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    
    slideIn(element, direction = 'up', duration = 300) {
        const translations = {
            up: 'translateY(30px)',
            down: 'translateY(-30px)',
            left: 'translateX(30px)',
            right: 'translateX(-30px)'
        };
        
        element.style.transform = translations[direction];
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.transform = 'translate(0)';
            element.style.opacity = '1';
        });
    }
    
    pulse(element, scale = 1.05, duration = 300) {
        element.style.transition = `transform ${duration}ms ease`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration);
    }
}
