// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupIntersectionObservers();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupStaggeredAnimations();
    }

    // Intersection Observer for scroll-based animations
    setupIntersectionObservers() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        this.observers.set('animation', animationObserver);

        // Observe elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => {
            animationObserver.observe(el);
        });
    }

    // Setup scroll-based animations
    setupScrollAnimations() {
        const scrollElements = document.querySelectorAll('.scroll-animate, .fade-up-on-scroll, .fade-left-on-scroll, .fade-right-on-scroll, .scale-on-scroll');
        
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible', 'animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        scrollElements.forEach(el => scrollObserver.observe(el));
    }

    // Setup hover animations
    setupHoverAnimations() {
        const hoverElements = document.querySelectorAll('.hover-lift, .hover-scale, .hover-rotate, .hover-glow');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.classList.add('will-change-transform');
            });
            
            el.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    el.classList.remove('will-change-transform');
                }, 300);
            });
        });
    }

    // Setup staggered animations
    setupStaggeredAnimations() {
        const staggerGroups = document.querySelectorAll('[data-stagger]');
        
        staggerGroups.forEach(group => {
            const children = group.children;
            const delay = parseInt(group.dataset.stagger) || 100;
            
            Array.from(children).forEach((child, index) => {
                child.style.animationDelay = `${index * delay}ms`;
            });
        });
    }

    // Trigger animation for specific element
    triggerAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = element.dataset.delay || 0;
        const duration = element.dataset.duration || 600;

        setTimeout(() => {
            switch (animationType) {
                case 'fadeIn':
                    this.fadeIn(element, duration);
                    break;
                case 'slideUp':
                    this.slideUp(element, duration);
                    break;
                case 'slideLeft':
                    this.slideLeft(element, duration);
                    break;
                case 'slideRight':
                    this.slideRight(element, duration);
                    break;
                case 'scale':
                    this.scaleIn(element, duration);
                    break;
                case 'rotate':
                    this.rotateIn(element, duration);
                    break;
                default:
                    this.fadeIn(element, duration);
            }
        }, parseInt(delay));
    }

    // Animation methods
    fadeIn(element, duration = 600) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }

    slideUp(element, duration = 600) {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'translateY(50px)';
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        });
    }

    slideLeft(element, duration = 600) {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'translateX(-50px)';
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    slideRight(element, duration = 600) {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'translateX(50px)';
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        });
    }

    scaleIn(element, duration = 600) {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        });
    }

    rotateIn(element, duration = 600) {
        element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        element.style.transform = 'rotate(-10deg) scale(0.8)';
        element.style.opacity = '0';
        
        requestAnimationFrame(() => {
            element.style.transform = 'rotate(0deg) scale(1)';
            element.style.opacity = '1';
        });
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// Parallax Controller
class ParallaxController {
    constructor() {
        this.elements = [];
        this.ticking = false;
        this.init();
    }

    init() {
        this.collectParallaxElements();
        this.setupEventListeners();
    }

    collectParallaxElements() {
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const direction = el.dataset.parallaxDirection || 'up';
            
            this.elements.push({
                element: el,
                speed: speed,
                direction: direction,
                offset: el.getBoundingClientRect().top + window.pageYOffset
            });
        });
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(({ element, speed, direction, offset }) => {
            const yPos = (scrollTop - offset) * speed;
            
            let transform;
            switch (direction) {
                case 'up':
                    transform = `translateY(${-yPos}px)`;
                    break;
                case 'down':
                    transform = `translateY(${yPos}px)`;
                    break;
                case 'left':
                    transform = `translateX(${-yPos}px)`;
                    break;
                case 'right':
                    transform = `translateX(${yPos}px)`;
                    break;
                default:
                    transform = `translateY(${-yPos}px)`;
            }
            
            element.style.transform = transform;
        });
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrailLength = 20;
        this.mousePos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.createTrailElements();
        this.setupEventListeners();
        this.animate();
    }

    createTrailElements() {
        for (let i = 0; i < this.maxTrailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'mouse-trail-dot';
            dot.style.cssText = `
                position: fixed;
                width: ${10 - i * 0.3}px;
                height: ${10 - i * 0.3}px;
                background: rgba(59, 130, 246, ${0.8 - i * 0.04});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            
            this.trail.push({
                element: dot,
                x: 0,
                y: 0
            });
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        document.addEventListener('mouseenter', () => {
            this.trail.forEach(dot => {
                dot.element.style.opacity = '1';
            });
        });

        document.addEventListener('mouseleave', () => {
            this.trail.forEach(dot => {
                dot.element.style.opacity = '0';
            });
        });
    }

    animate() {
        let { x, y } = this.mousePos;
        
        this.trail.forEach((dot, index) => {
            const nextDot = this.trail[index + 1] || { x, y };
            
            dot.x += (nextDot.x - dot.x) * 0.3;
            dot.y += (nextDot.y - dot.y) * 0.3;
            
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Text Animation Effects
class TextAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.setupTypewriterEffect();
        this.setupTextRevealEffect();
        this.setupCounterAnimation();
    }

    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(el => {
            const text = el.dataset.typewriter || el.textContent;
            const speed = parseInt(el.dataset.speed) || 50;
            
            el.textContent = '';
            this.typeWriter(el, text, speed);
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    setupTextRevealEffect() {
        const revealElements = document.querySelectorAll('[data-text-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealText(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        revealElements.forEach(el => observer.observe(el));
    }

    revealText(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map((word, index) => 
            `<span class="word" style="opacity: 0; transform: translateY(20px); display: inline-block; transition: all 0.3s ease ${index * 0.1}s;">${word}</span>`
        ).join(' ');

        setTimeout(() => {
            element.querySelectorAll('.word').forEach(word => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            });
        }, 100);
    }

    setupCounterAnimation() {
        const counterElements = document.querySelectorAll('[data-counter]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counterElements.forEach(el => observer.observe(el));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.duration) || 2000;
        const suffix = element.dataset.suffix || '';
        
        let current = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };

        updateCounter();
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.frameCount = 0;
        this.init();
    }

    init() {
        this.monitor();
        this.setupDeviceSpecificOptimizations();
    }

    monitor() {
        const now = performance.now();
        this.frameCount++;
        
        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
            this.lastTime = now;
            this.frameCount = 0;
            
            // Adjust animations based on performance
            if (this.fps < 30) {
                this.reduceAnimations();
            } else if (this.fps > 50) {
                this.enableAllAnimations();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }

    setupDeviceSpecificOptimizations() {
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency < 4;
        
        if (isMobile || isLowEnd) {
            this.reduceAnimations();
        }
    }

    reduceAnimations() {
        document.body.classList.add('reduced-animations');
        
        // Disable heavy animations
        document.querySelectorAll('.floating-card').forEach(card => {
            card.style.animation = 'none';
        });
    }

    enableAllAnimations() {
        document.body.classList.remove('reduced-animations');
    }
}

// Initialize advanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new AnimationController();
        new ParallaxController();
        new MouseTrail();
        new TextAnimator();
        new PerformanceMonitor();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationController,
        ParallaxController,
        MouseTrail,
        TextAnimator,
        PerformanceMonitor
    };
}