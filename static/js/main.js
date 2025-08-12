// Main JavaScript functionality for Sentiment Analysis Tool

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initializeTooltips();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize form enhancements
    initializeFormEnhancements();
    
    // Initialize loading states
    initializeLoadingStates();
    
    // Initialize enhanced animations
    initializeAnimations();
    
    // Initialize enhanced file upload
    initializeEnhancedFileUpload();
});

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

/**
 * Enhanced form functionality
 */
function initializeFormEnhancements() {
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        autoResize(textarea);
        textarea.addEventListener('input', () => autoResize(textarea));
    });
    
    // Enhanced file input styling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        enhanceFileInput(input);
    });
}

/**
 * Auto-resize textarea based on content
 */
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Enhance file input with drag and drop
 */
function enhanceFileInput(input) {
    const wrapper = input.closest('.upload-area');
    if (!wrapper) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        wrapper.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        wrapper.addEventListener(eventName, () => wrapper.classList.add('drag-over'), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        wrapper.addEventListener(eventName, () => wrapper.classList.remove('drag-over'), false);
    });
    
    // Handle dropped files
    wrapper.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            input.files = files;
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

/**
 * Initialize loading states for forms and buttons
 */
function initializeLoadingStates() {
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            if (submitBtn) {
                setLoadingState(submitBtn, true);
            }
        });
    });
    
    // Handle AJAX buttons
    const ajaxButtons = document.querySelectorAll('[data-ajax]');
    ajaxButtons.forEach(button => {
        button.addEventListener('click', function() {
            setLoadingState(this, true);
        });
    });
}

/**
 * Set loading state for buttons
 */
function setLoadingState(button, loading) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        button.classList.add('loading');
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.classList.remove('loading');
    }
}

/**
 * Update sentiment gauge chart
 */
function updateSentimentGauge(confidence, sentiment) {
    const canvas = document.getElementById('sentimentGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 8;
    ctx.stroke();
    
    // Confidence arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * confidence);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = getSentimentColor(sentiment);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Center text
    ctx.fillStyle = getSentimentColor(sentiment);
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(confidence * 100) + '%', centerX, centerY);
}

/**
 * Get color for sentiment
 */
function getSentimentColor(sentiment) {
    switch (sentiment) {
        case 'positive': return '#10b981';
        case 'negative': return '#ef4444';
        default: return '#6b7280';
    }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast show position-fixed top-0 end-0 m-3 toast-${type}`;
    toast.style.zIndex = '9999';
    
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    
    const colorMap = {
        success: 'text-success',
        error: 'text-danger',
        warning: 'text-warning',
        info: 'text-info'
    };
    
    toast.innerHTML = `
        <div class="toast-header glass-card">
            <i class="fas fa-${iconMap[type]} ${colorMap[type]} me-2"></i>
            <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body glass-card">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Text copied to clipboard!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Text copied to clipboard!', 'success');
        } catch (err) {
            showToast('Failed to copy text', 'error');
        }
        document.body.removeChild(textArea);
    }
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Animate number counting
 */
function animateNumber(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/**
 * Initialize intersection observer for animations
 */
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Local storage utilities
 */
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Local storage not available');
        }
    },
    
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Local storage not available');
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Local storage not available');
        }
    }
};

/**
 * Auto-save functionality for text inputs
 */
function initializeAutoSave() {
    const textInput = document.getElementById('textInput');
    if (!textInput) return;
    
    // Load saved text on page load
    const savedText = storage.get('auto_saved_text');
    if (savedText && !textInput.value) {
        textInput.value = savedText;
        textInput.dispatchEvent(new Event('input'));
    }
    
    // Save text on input with debouncing
    const saveText = debounce(() => {
        storage.set('auto_saved_text', textInput.value);
    }, 1000);
    
    textInput.addEventListener('input', saveText);
    
    // Clear saved text when form is submitted
    const form = textInput.closest('form');
    if (form) {
        form.addEventListener('submit', () => {
            storage.remove('auto_saved_text');
        });
    }
}

// Initialize auto-save when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAutoSave);

/**
 * Initialize enhanced animations and interactions
 */
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.glass-card, .stat-card, .chart-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add hover effects to interactive elements
    initializeHoverEffects();
    
    // Initialize number counting animation
    initializeCounterAnimation();
}

/**
 * Initialize hover effects for interactive elements
 */
function initializeHoverEffects() {
    // Add magnetic effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add tilt effect to interactive cards
    document.querySelectorAll('.glass-card-interactive').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

/**
 * Initialize number counting animation for statistics
 */
function initializeCounterAnimation() {
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.textContent.replace(/,/g, ''));
                entry.target.classList.add('counted');
                animateValue(entry.target, 0, target, 2000);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * Initialize enhanced file upload with drag and drop
 */
function initializeEnhancedFileUpload() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(uploadArea => {
        const fileInput = uploadArea.querySelector('input[type="file"]');
        
        if (!fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!uploadArea.contains(e.relatedTarget)) {
                uploadArea.classList.remove('drag-over');
            }
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                updateFileDisplay(uploadArea, files[0]);
                
                // Trigger change event for form handling
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                updateFileDisplay(uploadArea, e.target.files[0]);
            }
        });
    });
}

/**
 * Update file display in upload area
 */
function updateFileDisplay(uploadArea, file) {
    const uploadContent = uploadArea.querySelector('.upload-content');
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    uploadContent.innerHTML = `
        <div class="d-flex align-items-center justify-content-center">
            <i class="fas fa-file-alt fa-2x text-primary me-3"></i>
            <div>
                <div class="fw-bold">${fileName}</div>
                <small class="text-muted">${fileSize} MB</small>
            </div>
        </div>
    `;
    
    // Add success animation
    uploadArea.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        uploadArea.style.animation = '';
    }, 500);
}

// Export functions for use in other scripts
window.SentimentApp = {
    setLoadingState,
    updateSentimentGauge,
    getSentimentColor,
    formatFileSize,
    showToast,
    copyToClipboard,
    debounce,
    isValidEmail,
    animateNumber,
    storage
};
