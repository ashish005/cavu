// Professional Company Theme - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    const header = document.getElementById('mainHeader');
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu enhancements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            const isClickInside = navbarToggler.contains(e.target) || navbarCollapse.contains(e.target);
            
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
        
        // Add animation to mobile menu
        navbarCollapse.addEventListener('show.bs.collapse', function() {
            this.style.maxHeight = '0px';
            setTimeout(() => {
                this.style.transition = 'max-height 0.3s ease-in-out';
                this.style.maxHeight = this.scrollHeight + 'px';
            }, 10);
        });
        
        navbarCollapse.addEventListener('hide.bs.collapse', function() {
            this.style.maxHeight = this.scrollHeight + 'px';
            setTimeout(() => {
                this.style.maxHeight = '0px';
            }, 10);
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', function() {
            this.style.maxHeight = '';
            this.style.transition = '';
        });
    }
    
    // Dropdown menu enhancements
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            // Add hover effect for desktop
            if (window.innerWidth > 992) {
                dropdown.addEventListener('mouseenter', function() {
                    menu.classList.add('show');
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    menu.classList.remove('show');
                });
            }
            
            // Mobile dropdown enhancement
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    menu.classList.toggle('show');
                }
            });
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger animation to cards
                if (entry.target.classList.contains('card')) {
                    const cards = entry.target.parentElement.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .service-card, .feature-card, .solution-card, .industry-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card:not(.animate-in) {
            opacity: 0;
        }
        
        /* Enhanced mobile menu animation */
        @media (max-width: 768px) {
            .navbar-collapse {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-in-out;
            }
            
            .navbar-collapse.show {
                max-height: 500px;
            }
        }
        
        /* Loading animation for buttons */
        .btn-loading {
            position: relative;
            pointer-events: none;
            color: transparent !important;
        }
        
        .btn-loading::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            top: 50%;
            left: 50%;
            margin-left: -8px;
            margin-top: -8px;
            border: 2px solid transparent;
            border-radius: 50%;
            border-top-color: currentColor;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Form enhancement (if forms exist)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const submitBtn = form.querySelector('[type="submit"], .btn[type="submit"]');
        
        if (submitBtn) {
            form.addEventListener('submit', function(e) {
                submitBtn.classList.add('btn-loading');
                submitBtn.disabled = true;
                
                // Reset button state after 3 seconds (for demo)
                setTimeout(() => {
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.disabled = false;
                }, 3000);
            });
        }
    });
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero-section, .hero-section-vision');
    
    if (heroSections.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            heroSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                    const speed = 0.5;
                    const yPos = -(scrolled * speed);
                    section.style.transform = `translateY(${yPos}px)`;
                }
            });
        });
    }
    
    // Counter animation for statistics
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                
                let current = 0;
                counter.classList.add('counted');
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Tooltips initialization (if Bootstrap tooltips are available)
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Enhanced focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusable = document.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    });
    
    console.log('Company theme initialized successfully');
});
