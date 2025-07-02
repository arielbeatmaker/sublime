// Lazy loading implementation for better performance
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
    }
}

// Performance optimization for low-end devices
function optimizeForLowEndDevices() {
    // Reduce animation frequency on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    
    if (isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        // Disable background animation on very low-end devices
        if (navigator.deviceMemory <= 1) {
            document.body.style.animation = 'none';
            document.body.style.background = '#fce7f3';
        }
    }
}

// Initialize optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    optimizeForLowEndDevices();
});

// Product order function
function orderProduct(productName) {
    const message = encodeURIComponent(`Olá! Gostaria de fazer um pedido personalizado com a Sublime. Produto: ${productName}`);
    const whatsappURL = `https://wa.me/5575981526678?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Wholesale pricing data (easily customizable)
const wholesalePricing = {
    'Produto 1': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 25,90', total: 'R$ 259,00 - R$ 1.269,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 22,90', total: 'R$ 1.145,00 - R$ 2.267,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 19,90', total: 'R$ 1.990,00+' }
    ],
    'Produto 2': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 34,90', total: 'R$ 349,00 - R$ 1.710,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 31,90', total: 'R$ 1.595,00 - R$ 3.158,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 28,90', total: 'R$ 2.890,00+' }
    ],
    'Produto 3': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 44,90', total: 'R$ 449,00 - R$ 2.200,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 41,90', total: 'R$ 2.095,00 - R$ 4.148,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 38,90', total: 'R$ 3.890,00+' }
    ],
    'Produto 4': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 16,90', total: 'R$ 169,00 - R$ 828,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 14,90', total: 'R$ 745,00 - R$ 1.475,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 12,90', total: 'R$ 1.290,00+' }
    ],
    'Produto 5': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 54,90', total: 'R$ 549,00 - R$ 2.690,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 51,90', total: 'R$ 2.595,00 - R$ 5.138,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 48,90', total: 'R$ 4.890,00+' }
    ],
    'Produto 6': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 64,90', total: 'R$ 649,00 - R$ 3.180,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 61,90', total: 'R$ 3.095,00 - R$ 6.128,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 58,90', total: 'R$ 5.890,00+' }
    ],
    'Produto 7': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 34,90', total: 'R$ 349,00 - R$ 1.710,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 31,90', total: 'R$ 1.595,00 - R$ 3.158,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 28,90', total: 'R$ 2.890,00+' }
    ],
    'Produto 8': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 49,90', total: 'R$ 499,00 - R$ 2.445,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 44,90', total: 'R$ 2.245,00 - R$ 4.445,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 39,90', total: 'R$ 3.990,00+' }
    ],
    'Produto 9': [
        { quantity: '10-49 unidades', unitPrice: 'R$ 74,90', total: 'R$ 749,00 - R$ 3.670,10' },
        { quantity: '50-99 unidades', unitPrice: 'R$ 69,90', total: 'R$ 3.495,00 - R$ 6.920,10' },
        { quantity: '100+ unidades', unitPrice: 'R$ 64,90', total: 'R$ 6.490,00+' }
    ]
};

// Enhanced mobile touch handling
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        document.body.style.transform = `translateY(${diff > 0 ? -2 : 2}px)`;
        setTimeout(() => {
            document.body.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Open wholesale popup
function openWholesalePopup(productName) {
    const popup = document.getElementById('wholesale-popup');
    const tableBody = document.getElementById('wholesale-table-body');
    tableBody.innerHTML = '';
    const pricing = wholesalePricing[productName] || [];
    pricing.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.quantity}</td>
            <td><strong>${item.unitPrice}</strong></td>
            <td>${item.total}</td>
        `;
        tableBody.appendChild(row);
    });
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    const closeButton = popup.querySelector('.popup-close');
    closeButton.focus();
}

// Close wholesale popup
function closeWholesalePopup() {
    const popup = document.getElementById('wholesale-popup');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto';
    const activeButton = document.activeElement;
    if (activeButton && activeButton.blur) {
        activeButton.blur();
    }
}

// Contact wholesale function
function contactWholesale() {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre preços e condições para atacado na Sublime.');
    const whatsappURL = `https://wa.me/5575981526678?text=${message}`;
    window.open(whatsappURL, '_blank');
    closeWholesalePopup();
}

// Close popup when clicking outside
document.getElementById('wholesale-popup').addEventListener('click', function(e) {
    if (e.target === this) {
        closeWholesalePopup();
    }
});

// Smooth scrolling for internal links
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

// Enhanced intersection observer
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Haptic feedback function
function triggerHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// DOMContentLoaded listener for animations and slideshow
document.addEventListener('DOMContentLoaded', () => {
    // Product card animations
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
        observer.observe(card);
    });

    // Button haptic feedback
    document.querySelectorAll('.btn, .social-link').forEach(btn => {
        btn.addEventListener('click', triggerHapticFeedback);
    });

    // Hero Image Slideshow
    const slides = document.querySelectorAll('.hero-image .slide');
    let currentSlide = 0;
    if (slides.length > 0) {
        slides[currentSlide].classList.add('active'); // Start with the first slide visible
        setInterval(() => {
            // Only run when tab is active for performance
            if (document.visibilityState === 'visible') {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }
        }, 8000); // 8 seconds
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const popup = document.getElementById('wholesale-popup');
    if (popup.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeWholesalePopup();
        }
        if (e.key === 'Tab') {
            const focusableElements = popup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Optimize performance for mobile devices
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile-view', isMobile);
    }, 250);
}, { passive: true });

// Add loading states for better UX
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    
    setTimeout(() => {
        button.disabled = false;
        button.style.opacity = '1';
        button.innerHTML = originalText;
    }, 800);
}

// Store original button text for loading states
document.querySelectorAll('.btn').forEach(btn => {
    btn.dataset.originalText = btn.innerHTML;
});