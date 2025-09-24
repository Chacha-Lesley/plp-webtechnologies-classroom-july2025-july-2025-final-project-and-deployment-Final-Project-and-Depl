/**
 * Navigation Controller
 * Handles all navigation-related functionality
 */

class NavigationController {
    constructor() {
        this.isMobileMenuOpen = false;
        this.activeSection = 'home';
        this.scrollThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupSmoothScrolling();
        this.setupActiveStates();
        this.setupMobileMenu();
    }
    
    bindEvents() {
        // Desktop navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Mobile navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', this.handleMobileNavClick.bind(this));
        });
        
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
        ctaButtons.forEach(button => {
            button.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // Action buttons
        const actionButtons = document.querySelectorAll('.action-btn[href^="#"]');
        actionButtons.forEach(button => {
            button.addEventListener('click', this.handleNavClick.bind(this));
        });
    }
    
    handleNavClick(e) {
        e.preventDefault();
        
        const href = e.currentTarget.getAttribute('href');
        const targetId = href.substring(1);
        
        this.navigateToSection(targetId);
        this.updateActiveStates(targetId);
        
        // Announce navigation to screen readers
        if (window.portfolioApp && typeof window.portfolioApp.announce === 'function') {
            window.portfolioApp.announce(`Navigated to ${targetId} section`);
        }
    }
    
    handleMobileNavClick(e) {
        this.handleNavClick(e);
        this.closeMobileMenu();
    }
    
    navigateToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            const headerHeight = 80;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Smooth scroll to section
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active section
            this.activeSection = sectionId;
            
            // Update browser history
            if (history.pushState) {
                history.pushState(null, null, `#${sectionId}`);
            }
        }
    }
    
    updateActiveStates(sectionId) {
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
    
    // Mobile Menu Management
    setupMobileMenu() {
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNavOverlay = document.getElementById('mobileNavOverlay');
        
        if (this.mobileMenuToggle && this.mobileNavOverlay) {
            // Toggle button click
            this.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
            
            // Overlay click to close
            this.mobileNavOverlay.addEventListener('click', (e) => {
                if (e.target === this.mobileNavOverlay) {
                    this.closeMobileMenu();
                }
            });
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
            
            // Close on resize to desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        
        // Update toggle button
        this.mobileMenuToggle.classList.add('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Show overlay
        this.mobileNavOverlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstLink = this.mobileNavOverlay.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
        
        // Announce to screen readers
        if (window.portfolioApp && typeof window.portfolioApp.announce === 'function') {
            window.portfolioApp.announce('Mobile menu opened');
        }
    }
    
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        
        // Update toggle button
        this.mobileMenuToggle.classList.remove('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Hide overlay
        this.mobileNavOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        this.mobileMenuToggle.focus();
        
        // Announce to screen readers
        if (window.portfolioApp && typeof window.portfolioApp.announce === 'function') {
            window.portfolioApp.announce('Mobile menu closed');
        }
    }
    
    // Smooth Scrolling Setup
    setupSmoothScrolling() {
        // Handle hash links on page load
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            setTimeout(() => {
                this.navigateToSection(targetId);
            }, 100);
        }
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const hash = window.location.hash;
            if (hash) {
                const targetId = hash.substring(1);
                this.navigateToSection(targetId);
                this.updateActiveStates(targetId);
            } else {
                this.navigateToSection('home');
                this.updateActiveStates('home');
            }
        });
    }
    
    setupActiveStates() {
        // Set initial active state based on URL hash or default to home
        const initialSection = window.location.hash ? window.location.hash.substring(1) : 'home';
        this.updateActiveStates(initialSection);
        this.activeSection = initialSection;
    }
    
    // Utility Methods
    getCurrentSection() {
        return this.activeSection;
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        this.updateActiveStates('home');
    }
    
    // Keyboard Navigation Enhancements
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && !e.ctrlKey && !e.metaKey) {
                const sections = ['home', 'about', 'journey', 'projects', 'contact'];
                const keyNum = parseInt(e.key);
                
                if (keyNum >= 1 && keyNum <= sections.length) {
                    e.preventDefault();
                    this.navigateToSection(sections[keyNum - 1]);
                    this.updateActiveStates(sections[keyNum - 1]);
                }
            }
            
            // Arrow keys for section navigation (when not in form elements)
            if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                const sections = ['home', 'about', 'journey', 'projects', 'contact'];
                const currentIndex = sections.indexOf(this.activeSection);
                
                if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                    e.preventDefault();
                    const nextSection = sections[currentIndex + 1];
                    this.navigateToSection(nextSection);
                    this.updateActiveStates(nextSection);
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    const prevSection = sections[currentIndex - 1];
                    this.navigateToSection(prevSection);
                    this.updateActiveStates(prevSection);
                }
            }
        });
    }
    
    // Enhanced Mobile Navigation
    setupSwipeNavigation() {
        let startY = 0;
        let currentY = 0;
        let isScrolling = false;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!isScrolling) {
                const deltaY = startY - currentY;
                const minSwipeDistance = 50;
                
                if (Math.abs(deltaY) > minSwipeDistance) {
                    const sections = ['home', 'about', 'journey', 'projects', 'contact'];
                    const currentIndex = sections.indexOf(this.activeSection);
                    
                    if (deltaY > 0 && currentIndex < sections.length - 1) {
                        // Swipe up - go to next section
                        const nextSection = sections[currentIndex + 1];
                        this.navigateToSection(nextSection);
                        this.updateActiveStates(nextSection);
                    } else if (deltaY < 0 && currentIndex > 0) {
                        // Swipe down - go to previous section
                        const prevSection = sections[currentIndex - 1];
                        this.navigateToSection(prevSection);
                        this.updateActiveStates(prevSection);
                    }
                }
            }
            isScrolling = false;
        }, { passive: true });
    }
    
    // Progressive Enhancement
    enhanceNavigation() {
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Add swipe navigation for mobile
        if ('ontouchstart' in window) {
            this.setupSwipeNavigation();
        }
        
        // Add visual feedback for interactions
        this.addInteractionFeedback();
        
        // Add navigation breadcrumbs for accessibility
        this.addNavigationBreadcrumbs();
    }
    
    addInteractionFeedback() {
        const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        allNavLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
            
            // Add ripple effect on click
            link.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = link.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    top: ${y}px;
                    left: ${x}px;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rippleStyle = document.createElement('style');
                rippleStyle.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                
                if (!document.querySelector('style[data-ripple]')) {
                    rippleStyle.setAttribute('data-ripple', 'true');
                    document.head.appendChild(rippleStyle);
                }
                
                link.style.position = 'relative';
                link.style.overflow = 'hidden';
                link.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    addNavigationBreadcrumbs() {
        // Create breadcrumb navigation for screen readers
        const breadcrumb = document.createElement('nav');
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        breadcrumb.className = 'sr-only';
        breadcrumb.innerHTML = `
            <ol>
                <li><a href="#home">Home</a></li>
                <li id="current-breadcrumb" aria-current="page">Home</li>
            </ol>
        `;
        
        document.body.appendChild(breadcrumb);
        
        // Update breadcrumb on navigation
        this.updateBreadcrumb = (sectionId) => {
            const currentBreadcrumb = document.getElementById('current-breadcrumb');
            if (currentBreadcrumb) {
                currentBreadcrumb.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            }
        };
    }
    
    // Public API
    getActiveSection() {
        return this.activeSection;
    }
    
    isMobileMenuActive() {
        return this.isMobileMenuOpen;
    }
    
    // Cleanup
    destroy() {
        // Remove event listeners
        window.removeEventListener('popstate', this.handlePopState);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeydown);
        
        // Close mobile menu if open
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('🧭 Navigation controller destroyed');
    }
}

// Initialize navigation controller
let navigationController;

// Wait for DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        navigationController = new NavigationController();
        navigationController.enhanceNavigation();
        window.navigationController = navigationController;
    });
} else {
    navigationController = new NavigationController();
    navigationController.enhanceNavigation();
    window.navigationController = navigationController;
}

// Export for modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationController;
}