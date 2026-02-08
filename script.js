// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');

// Only run if mobile menu button exists
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        if (nav) {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
            nav.style.position = 'absolute';
            nav.style.top = '60px';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.flexDirection = 'column';
            nav.style.background = 'rgba(29, 25, 23, 0.95)';
            nav.style.padding = '1rem';
            nav.style.gap = '1rem';
            nav.style.zIndex = '40';
        }
    });
}

// ==================== FORM HANDLING WITH NODE.JS BACKEND ====================
const heroForm = document.getElementById('heroForm');
const ctaForm = document.getElementById('ctaForm');

// Your Node.js backend URL - UPDATE THIS WITH YOUR ACTUAL BACKEND URL
const BACKEND_URL = 'http://localhost:3000'; // Change to your actual backend URL when deployed

if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(heroForm);
    });
}

if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(ctaForm);
    });
}

async function handleFormSubmit(form) {
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('.btn');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    // Validation
    if (!name || !email) {
        showMessage(form, 'Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(form, 'Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const originalText = submitButton.innerHTML;
    const originalWidth = submitButton.style.width;
    submitButton.innerHTML = '<span class="envelope">✉</span> SENDING...';
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';
    submitButton.style.opacity = '0.8';

    try {
        // Send request to Node.js backend
        const response = await fetch(`${BACKEND_URL}/send-exercises`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email })
        });

        const data = await response.json();

        if (data.success) {
            showMessage(form, '✓ Email sent! Check your inbox for the program link.', 'success');

            // Reset form
            form.reset();

            // Log for debugging
            console.log('Email sent successfully:', data);

            // You could also redirect to a thank you page or show a modal
            // window.location.href = 'thank-you.html';
        } else {
            throw new Error(data.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Form submission error:', error);

        // User-friendly error messages
        let errorMessage = 'Oops! Something went wrong. Please try again.';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.message.includes('Failed to send email')) {
            errorMessage = 'Email service is temporarily unavailable. Please try again later.';
        }

        showMessage(form, errorMessage, 'error');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';
        submitButton.style.opacity = '1';
        submitButton.style.width = originalWidth;
    }
}

function showMessage(form, text, type) {
    // Remove any existing messages
    const existingMessage = form.parentNode.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const message = document.createElement('p');
    message.className = `form-message ${type}`;
    message.textContent = text;

    // Style the message
    Object.assign(message.style, {
        marginTop: '10px',
        fontSize: '14px',
        textAlign: 'center',
        fontWeight: '500',
        padding: '12px 16px',
        borderRadius: '8px',
        animation: 'fadeIn 0.3s ease',
        maxWidth: '28rem',
        marginLeft: 'auto',
        marginRight: 'auto'
    });

    if (type === 'success') {
        message.style.color = '#059669';
        message.style.backgroundColor = '#d1fae5';
        message.style.border = '1px solid #10b981';
        message.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.1)';
    } else {
        message.style.color = '#dc2626';
        message.style.backgroundColor = '#fee2e2';
        message.style.border = '1px solid #ef4444';
        message.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.1)';
    }

    // Insert after form
    form.parentNode.insertBefore(message, form.nextElementSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS animations for messages
if (!document.querySelector('#message-styles')) {
    const style = document.createElement('style');
    style.id = 'message-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(-10px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @keyframes fadeOut {
            from { 
                opacity: 1; 
                transform: translateY(0); 
            }
            to { 
                opacity: 0; 
                transform: translateY(-10px); 
            }
        }
        
        .form-message {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (nav && nav.style.display === 'flex') {
                nav.style.display = 'none';
            }
        }
    });
});

// ==================== SCROLL INDICATOR ====================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
            scrollIndicator.style.transition = 'opacity 0.3s ease';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ==================== INTERSECTION OBSERVER ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe stat cards and testimonial cards
document.querySelectorAll('.stat-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== EXERCISES PAGE FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the exercises page
    const isExercisesPage = document.querySelector('.exercise-card') !== null;

    if (isExercisesPage) {
        initializeExercisesPage();
    }
});

function initializeExercisesPage() {
    // Mobile video optimization
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        // Add loading="lazy" for better performance
        video.setAttribute('loading', 'lazy');

        // Optimize for mobile data savings
        if ('connection' in navigator) {
            if (navigator.connection.saveData || navigator.connection.effectiveType.includes('2g')) {
                video.setAttribute('preload', 'none');
            }
        }
    });

    // Handle back button if exists
    const backButton = document.querySelector('.nav a[href="index.html"]');
    if (backButton) {
        backButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.history.back();
        });
    }

    // Exercise card touch feedback for mobile
    if ('ontouchstart' in window) {
        const exerciseCards = document.querySelectorAll('.exercise-card');

        exerciseCards.forEach(card => {
            let touchStartY = 0;

            card.addEventListener('touchstart', function (e) {
                touchStartY = e.touches[0].clientY;
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.99)';
            }, { passive: true });

            card.addEventListener('touchend', function () {
                this.style.transform = 'scale(1)';
            }, { passive: true });

            card.addEventListener('touchmove', function (e) {
                const touchY = e.touches[0].clientY;
                const diff = Math.abs(touchY - touchStartY);

                // If user is scrolling, remove the scale effect
                if (diff > 10) {
                    this.style.transform = 'scale(1)';
                }
            }, { passive: true });
        });
    }

    // Lazy load videos when they come into viewport
    const videoObserverOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                // Only load the video source if it hasn't been loaded yet
                if (!video.hasAttribute('data-loaded')) {
                    video.load();
                    video.setAttribute('data-loaded', 'true');
                }
            }
        });
    }, videoObserverOptions);

    // Observe all videos
    videos.forEach(video => {
        videoObserver.observe(video);
    });

    // Initialize navigation for exercises page
    const navLinks = document.querySelectorAll('.nav a');

    navLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 50) {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
            header.style.transition = 'box-shadow 0.3s ease';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// ==================== VIDEO MODAL FUNCTIONALITY ====================
function initializePlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn');

    playButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            playVideo();
        });
    });
}

function playVideo() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="modal-close">×</button>
            <video controls autoplay>
                <source src="about:blank" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .video-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .video-modal-content {
                position: relative;
                width: 90%;
                max-width: 900px;
                aspect-ratio: 16 / 9;
            }
            
            .video-modal video {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .modal-close {
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 40px;
                cursor: pointer;
                transition: color 0.3s;
                z-index: 1001;
            }
            
            .modal-close:hover {
                color: #ff6b35;
            }
            
            @media (max-width: 768px) {
                .video-modal-content {
                    width: 95%;
                }
                
                .modal-close {
                    top: -50px;
                    right: 10px;
                    font-size: 35px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Close modal functionality
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function () {
        modal.remove();
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape' && modal.parentNode) {
            modal.remove();
            document.removeEventListener('keydown', handler);
        }
    });
}

// ==================== MOBILE MENU FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');

            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
});

// ==================== DEBUG/LOG HELPER ====================
function logDebug(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}