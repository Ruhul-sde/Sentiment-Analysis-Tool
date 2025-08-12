// Theme management for Sentiment Analysis Tool

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener to theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Add keyboard shortcut (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }
    
    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Unable to store theme preference');
        }
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeIcon(theme);
        this.setStoredTheme(theme);
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme }
        }));
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add visual feedback
        this.addToggleAnimation();
    }
    
    updateThemeIcon(theme) {
        if (!this.themeIcon) return;
        
        this.themeIcon.className = theme === 'light' 
            ? 'fas fa-moon' 
            : 'fas fa-sun';
    }
    
    updateMetaThemeColor(theme) {
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', 
                theme === 'light' ? '#6366f1' : '#1e293b'
            );
        } else {
            // Create meta tag if it doesn't exist
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'light' ? '#6366f1' : '#1e293b';
            document.head.appendChild(meta);
        }
    }
    
    addToggleAnimation() {
        if (!this.themeToggle) return;
        
        // Add rotation animation
        this.themeToggle.style.transform = 'rotate(360deg)';
        this.themeToggle.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'rotate(0deg)';
            setTimeout(() => {
                this.themeToggle.style.transition = '';
            }, 300);
        }, 50);
        
        // Add ripple effect
        this.createRippleEffect();
    }
    
    createRippleEffect() {
        if (!this.themeToggle) return;
        
        const ripple = document.createElement('span');
        ripple.className = 'theme-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 40px;
            height: 40px;
            margin-left: -20px;
            margin-top: -20px;
        `;
        
        // Add ripple animation keyframes if not exists
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.themeToggle.style.position = 'relative';
        this.themeToggle.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    // Check if current theme is dark
    isDark() {
        return this.currentTheme === 'dark';
    }
    
    // Check if current theme is light
    isLight() {
        return this.currentTheme === 'light';
    }
    
    // Apply theme-specific styles to charts
    updateChartsTheme() {
        const theme = this.currentTheme;
        
        if (typeof Chart !== 'undefined') {
            // Update Chart.js default colors based on theme
            Chart.defaults.color = theme === 'dark' ? '#e5e7eb' : '#374151';
            Chart.defaults.borderColor = theme === 'dark' 
                ? 'rgba(75, 85, 99, 0.3)' 
                : 'rgba(229, 231, 235, 0.5)';
            
            // Update existing charts
            Chart.instances.forEach(chart => {
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels.color = 
                        theme === 'dark' ? '#e5e7eb' : '#374151';
                }
                chart.update('none');
            });
        }
    }
    
    // Apply theme to dynamic content
    applyThemeToElement(element, darkClass = 'dark-theme', lightClass = 'light-theme') {
        if (!element) return;
        
        element.classList.remove(darkClass, lightClass);
        element.classList.add(this.isDark() ? darkClass : lightClass);
    }
    
    // Smooth theme transition
    enableSmoothTransition() {
        const css = `
            *, *::before, *::after {
                transition: 
                    background-color 0.3s ease,
                    border-color 0.3s ease,
                    color 0.3s ease,
                    fill 0.3s ease,
                    stroke 0.3s ease,
                    opacity 0.3s ease,
                    box-shadow 0.3s ease,
                    transform 0.3s ease !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
        // Remove transitions after theme change is complete
        setTimeout(() => {
            style.remove();
        }, 300);
    }
}

// Theme utilities
const ThemeUtils = {
    // Get CSS custom property value
    getCSSVariable(name) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(name).trim();
    },
    
    // Set CSS custom property value
    setCSSVariable(name, value) {
        document.documentElement.style.setProperty(name, value);
    },
    
    // Get theme-aware color
    getThemeColor(lightColor, darkColor) {
        const theme = window.themeManager?.getCurrentTheme() || 'light';
        return theme === 'dark' ? darkColor : lightColor;
    },
    
    // Create theme-aware gradient
    getThemeGradient(lightGradient, darkGradient) {
        const theme = window.themeManager?.getCurrentTheme() || 'light';
        return theme === 'dark' ? darkGradient : lightGradient;
    },
    
    // Apply theme to canvas context
    applyThemeToCanvas(ctx) {
        const theme = window.themeManager?.getCurrentTheme() || 'light';
        
        if (theme === 'dark') {
            ctx.fillStyle = '#e5e7eb';
            ctx.strokeStyle = '#e5e7eb';
        } else {
            ctx.fillStyle = '#374151';
            ctx.strokeStyle = '#374151';
        }
    }
};

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.themeManager = new ThemeManager();
    
    // Listen for theme changes to update charts
    window.addEventListener('themechange', function(e) {
        setTimeout(() => {
            if (window.themeManager) {
                window.themeManager.updateChartsTheme();
            }
        }, 100);
    });
});

// Add system theme change detection
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial check
    const handleSystemThemeChange = (e) => {
        if (window.themeManager && !window.themeManager.getStoredTheme()) {
            window.themeManager.setTheme(e.matches ? 'dark' : 'light');
        }
    };
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);
}

// Export for global use
window.ThemeManager = ThemeManager;
window.ThemeUtils = ThemeUtils;

// Add theme toggle accessibility
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Add ARIA attributes
        themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        
        // Add keyboard support
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Update aria-label based on current theme
        window.addEventListener('themechange', function(e) {
            const newLabel = e.detail.theme === 'light' 
                ? 'Switch to dark mode' 
                : 'Switch to light mode';
            themeToggle.setAttribute('aria-label', newLabel);
        });
    }
});

// Preload theme to prevent flash
(function() {
    const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();
