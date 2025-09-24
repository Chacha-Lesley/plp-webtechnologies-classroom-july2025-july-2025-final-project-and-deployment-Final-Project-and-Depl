/**
 * Main JavaScript Controller
 * Handles page initialization and core functionality
 */

class PortfolioApp {
    constructor() {
        this.isLoading = true;
        this.currentSection = 'home';
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    setupApp() {
        console.log('🚀 Chacha Lesley Portfolio - Initializing...');
        
        // Initialize all components
        this.setupLoadingScreen();
        this.setupScrollObserver();
        this.setupBackToTop();
        this.setupNavbarScroll();
        this.setupEasterEggs();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        
        // Mark app as ready
        setTimeout(() => {
            this.hideLoadingScreen();
            this.triggerInitialAnimations();
            console.log('✅ Portfolio loaded successfully!');
        }, 1500);
    }
    
    // Loading Screen Management
    setupLoadingScreen() {
        this.loadingScreen = document.getElementById('loadingScreen');
        
        // Ensure minimum loading time for better UX
        this.minLoadTime = 1000;
        this.loadStartTime = Date.now();
    }
    
    hideLoadingScreen() {
        const loadTime = Date.now() - this.loadStartTime;
        const remainingTime = Math.max(0, this.minLoadTime - loadTime);
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
                
                // Remove from DOM after transition
                setTimeout(() => {
                    if (this.loadingScreen.parentNode) {
                        this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                    }
                }, 500);
            }
            this.isLoading = false;
        }, remainingTime);
    }
    
    // Intersection Observer for animations
    setupScrollObserver() {
        this.intersectionObserver = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );
        
        // Observe all animatable elements
        this.observeElements();
        
        // Setup section tracking
        this.setupSectionTracking();
    }
    
    observeElements() {
        const elementsToObserve = [
            '.animate-on-scroll',
            '.skill-card',
            '.timeline-item',
            '.secret-card',
            '.project-card',
            '.interest-card',
            '.education-card'
        ];
        
        elementsToObserve.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => this.intersectionObserver.observe(el));
        });
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animated class
                element.classList.add('animated');
                
                // Handle specific element types
                if (element.classList.contains('skill-card')) {
                    this.animateSkillBar(element);
                } else if (element.classList.contains('timeline-item')) {
                    this.animateTimelineItem(element);
                }
                
                // Stop observing once animated
                this.intersectionObserver.unobserve(element);
            }
        });
    }
    
    animateSkillBar(skillCard) {
        const progressBar = skillCard.querySelector('.skill-progress');
        if (progressBar) {
            const targetWidth = progressBar.getAttribute('data-width');
            setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
            }, 300);
        }
    }
    
    animateTimelineItem(item) {
        // Add staggered animation delay
        const allItems = document.querySelectorAll('.timeline-item');
        const index = Array.from(allItems).indexOf(item);
        item.style.animationDelay = `${index * 0.2}s`;
    }
    
    // Section tracking for navigation
    setupSectionTracking() {
        const sections = document.querySelectorAll('section[id]');
        
        this.sectionObserver = new IntersectionObserver(
            this.handleSectionIntersection.bind(this),
            { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' }
        );
        
        sections.forEach(section => this.sectionObserver.observe(section));
    }
    
    handleSectionIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                this.updateActiveNavigation(sectionId);
                this.currentSection = sectionId;
            }
        });
    }
    
    updateActiveNavigation(sectionId) {
        // Update desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
        
        // Update mobile navigation
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Back to Top functionality
    setupBackToTop() {
        this.backToTopBtn = document.getElementById('backToTop');
        
        if (this.backToTopBtn) {
            // Show/hide based on scroll position
            window.addEventListener('scroll', this.handleBackToTopVisibility.bind(this));
            
            // Handle click
            this.backToTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }
    }
    
    handleBackToTopVisibility() {
        if (window.pageYOffset > 300) {
            this.backToTopBtn?.classList.add('show');
        } else {
            this.backToTopBtn?.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Navbar scroll effects
    setupNavbarScroll() {
        this.navbar = document.getElementById('navbar');
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleNavbarScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleNavbarScroll() {
        if (window.pageYOffset > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
    
    // Initial animations trigger
    triggerInitialAnimations() {
        // Animate hero section elements
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Animate floating elements
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.animation = `float ${6 + index}s ease-in-out infinite`;
                el.style.animationDelay = `${index * 2}s`;
            }, 1000 + index * 500);
        });
    }
    
    // Easter Eggs and Fun Interactions
    setupEasterEggs() {
        this.setupKonamiCode();
        this.setupSecretInteractions();
        this.setupFunAnimations();
    }
    
    setupKonamiCode() {
        let konamiSequence = [];
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', (e) => {
            konamiSequence.push(e.keyCode);
            konamiSequence = konamiSequence.slice(-10);
            
            if (konamiSequence.toString() === konamiCode.toString()) {
                this.triggerKonamiEffect();
            }
        });
    }
    
    triggerKonamiEffect() {
        // Fun rotation effect
        document.body.style.transition = 'transform 2s ease';
        document.body.style.transform = 'rotate(360deg) scale(1.1)';
        
        // Show secret message
        this.showMessage('🎉 Konami Code activated! You found the secret! 🎮', 'success');
        
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg) scale(1)';
        }, 2000);
        
        // Add rainbow colors temporarily
        this.activateRainbowMode();
    }
    
    activateRainbowMode() {
        const style = document.createElement('style');
        style.id = 'rainbow-mode';
        style.textContent = `
            .hero-title, .section-title {
                background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff0080) !important;
                background-size: 400% 400% !important;
                animation: rainbow 2s ease infinite !important;
                -webkit-background-clip: text !important;
                -webkit-text-fill-color: transparent !important;
            }
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            const rainbowStyle = document.getElementById('rainbow-mode');
            if (rainbowStyle) {
                rainbowStyle.remove();
            }
        }, 10000);
    }
    
    setupSecretInteractions() {
        // Secret click counter on profile picture
        const profilePic = document.querySelector('.profile-pic');
        if (profilePic) {
            let clickCount = 0;
            profilePic.addEventListener('click', () => {
                clickCount++;
                
                if (clickCount === 5) {
                    this.showMessage('🤔 Why do you keep clicking me?', 'info');
                } else if (clickCount === 10) {
                    this.showMessage('😅 Okay, I get it. You like my picture!', 'info');
                } else if (clickCount === 15) {
                    this.showMessage('🎭 Fine! Here\'s a secret: I love chai more than code!', 'success');
                    this.addChaiAnimation();
                }
            });
        }
        
        // Easter egg in the emoji mascot
        const emojiMascot = document.querySelector('.emoji-mascot');
        if (emojiMascot) {
            let hoverCount = 0;
            emojiMascot.addEventListener('mouseenter', () => {
                hoverCount++;
                if (hoverCount === 3) {
                    emojiMascot.textContent = '🤔';
                    setTimeout(() => {
                        emojiMascot.textContent = '👋';
                    }, 2000);
                } else if (hoverCount === 5) {
                    this.showMessage('👋 Hello there! Thanks for the waves!', 'info');
                }
            });
        }
    }
    
    addChaiAnimation() {
        const chai = document.createElement('div');
        chai.textContent = '☕';
        chai.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 3rem;
            z-index: 10000;
            pointer-events: none;
            animation: chaiFloat 3s ease-out forwards;
        `;
        
        const chaiStyle = document.createElement('style');
        chaiStyle.textContent = `
            @keyframes chaiFloat {
                0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.5) rotate(180deg); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1) rotate(360deg) translateY(-100px); opacity: 0; }
            }
        `;
        
        document.head.appendChild(chaiStyle);
        document.body.appendChild(chai);
        
        setTimeout(() => {
            chai.remove();
            chaiStyle.remove();
        }, 3000);
    }
    
    setupFunAnimations() {
        // Parallax effect for floating elements
        window.addEventListener('scroll', this.handleParallax.bind(this));
        
        // Random gentle animations for cards
        this.setupRandomCardAnimations();
    }
    
    handleParallax() {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-card');
        
        floatingElements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    setupRandomCardAnimations() {
        const cards = document.querySelectorAll('.card, .project-card, .interest-card');
        
        cards.forEach(card => {
            // Random gentle hover effects
            card.addEventListener('mouseenter', () => {
                const randomRotation = (Math.random() - 0.5) * 4; // -2 to 2 degrees
                card.style.transform = `translateY(-5px) rotate(${randomRotation}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotate(0deg)';
            });
        });
    }
    
    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images when they come into view
        this.setupLazyLoading();
        
        // Debounce scroll events
        this.setupScrollDebouncing();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    setupScrollDebouncing() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(() => {
                // Scroll-dependent operations are already optimized with RAF
            });
        });
    }
    
    preloadCriticalResources() {
        // Preload hero image and important assets
        const criticalImages = [
            './images/profile.jpeg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    // Accessibility Enhancements
    setupAccessibility() {
        // Focus management
        this.setupFocusManagement();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
        
        // Reduced motion support
        this.respectReducedMotion();
    }
    
    setupFocusManagement() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            z-index: 10000;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for interactive elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add keyboard navigation styles
        const keyboardStyles = document.createElement('style');
        keyboardStyles.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--accent-color) !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(keyboardStyles);
    }
    
    setupScreenReaderAnnouncements() {
        // Create live region for announcements
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        this.liveRegion.style.cssText = `
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        `;
        document.body.appendChild(this.liveRegion);
    }
    
    announce(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    respectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0ms');
                document.documentElement.style.setProperty('--transition-normal', '0ms');
                document.documentElement.style.setProperty('--transition-slow', '0ms');
            } else {
                document.documentElement.style.setProperty('--transition-fast', '0.15s ease');
                document.documentElement.style.setProperty('--transition-normal', '0.3s ease');
                document.documentElement.style.setProperty('--transition-slow', '0.5s ease');
            }
        });
    }
    
    // Utility Methods
    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `toast-message toast-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-secondary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            message.style.background = 'var(--gradient-cool)';
        } else if (type === 'error') {
            message.style.background = 'var(--gradient-warm)';
        }
        
        document.body.appendChild(message);
        
        // Animate in
        requestAnimationFrame(() => {
            message.style.transform = 'translateX(0)';
        });
        
        // Announce to screen readers
        this.announce(text);
        
        // Auto remove
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 4000);
        
        // Click to dismiss
        message.addEventListener('click', () => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        });
    }
    
    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners and observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        // Remove any dynamically created elements
        const dynamicElements = document.querySelectorAll('.toast-message, #rainbow-mode');
        dynamicElements.forEach(el => el.remove());
        
        console.log('🧹 Portfolio app cleaned up');
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Portfolio Error:', event.error);
    
    // Don't break the user experience
    const portfolioApp = window.portfolioApp;
    if (portfolioApp && typeof portfolioApp.showMessage === 'function') {
        portfolioApp.showMessage('Something went wrong, but we\'re still here! 🤗', 'info');
    }
});

// Initialize the app
let portfolioApp;

// Wait for DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolioApp = new PortfolioApp();
        window.portfolioApp = portfolioApp; // Make it globally accessible
    });
} else {
    portfolioApp = new PortfolioApp();
    window.portfolioApp = portfolioApp;
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👋 See you later!');
    } else {
        console.log('👋 Welcome back!');
        if (portfolioApp && typeof portfolioApp.showMessage === 'function') {
            portfolioApp.showMessage('Welcome back! 😊', 'info');
        }
    }
});

// Console easter egg
setTimeout(() => {
    console.log(`
    🎭 Hey there, curious developer! 
    
    Thanks for checking out the code! 
    This portfolio is built with:
    ✨ Vanilla JavaScript (no frameworks!)
    🎨 Modern CSS with custom properties
    📱 Responsive design
    ♿ Accessibility features
    🚀 Performance optimizations
    
    Want to see something cool? Try the Konami code:
    ↑ ↑ ↓ ↓ ← → ← → B A
    
    - Chacha Lesley
    `);
}, 2000);

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}