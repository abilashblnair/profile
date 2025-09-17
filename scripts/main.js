// Main JavaScript functionality
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupMobileMenu();
        this.setupTypingEffect();
        this.setupSkillsAnimation();
    }

    // Navigation Setup
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Setup
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Active Navigation
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${activeId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add scroll animation classes and observe
        const animateElements = [
            '.about-content',
            '.timeline-item',
            '.project-card',
            '.contact-item',
            '.skill-category'
        ];

        animateElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('fade-up-on-scroll');
                el.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(el);
            });
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // Show loading state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showAlert('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showAlert('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // Show Alert Messages
    showAlert(message, type = 'info') {
        const alertContainer = this.createAlertContainer();
        const alert = document.createElement('div');
        
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2em; cursor: pointer; opacity: 0.7;">&times;</button>
            </div>
        `;

        alertContainer.appendChild(alert);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    createAlertContainer() {
        let container = document.querySelector('.alert-container');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'alert-container';
            container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        
        return container;
    }

    // Typing Effect for Hero Section
    setupTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };

        // Start typing effect after hero title animation
        setTimeout(typeWriter, 1000);
    }

    // Skills Animation
    setupSkillsAnimation() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        });

        skillTags.forEach(tag => observer.observe(tag));
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Enhanced Scroll Performance
class ScrollManager {
    constructor() {
        this.ticking = false;
        this.setupOptimizedScrolling();
    }

    setupOptimizedScrolling() {
        const handleScroll = () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollElements();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateScrollElements() {
        const scrollY = window.pageYOffset;
        
        // Parallax effect for floating cards
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
        });

        // Update navbar scroll state
        const navbar = document.getElementById('navbar');
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// Statistics Counter Animation
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.setupCounters();
    }

    setupCounters() {
        const observerOptions = {
            threshold: 0.7,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            }
        };

        updateCounter();
    }
}

// Preloader
class Preloader {
    constructor() {
        this.setupPreloader();
    }

    setupPreloader() {
        window.addEventListener('load', () => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 300);
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    new ScrollManager();
    new StatsCounter();
    new Preloader();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}