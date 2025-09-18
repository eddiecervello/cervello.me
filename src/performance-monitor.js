/**
 * Performance Monitoring and Optimization
 * Tracks Core Web Vitals and reports issues
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            FCP: null,  // First Contentful Paint
            LCP: null,  // Largest Contentful Paint
            FID: null,  // First Input Delay
            CLS: null,  // Cumulative Layout Shift
            TTFB: null  // Time to First Byte
        };
        
        this.init();
    }
    
    init() {
        // Only run in production
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            return;
        }
        
        this.observePaintMetrics();
        this.observeLayoutShifts();
        this.observeFirstInput();
        this.measureTTFB();
        this.registerServiceWorker();
    }
    
    observePaintMetrics() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            // Observe FCP and LCP
            const paintObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.FCP = Math.round(entry.startTime);
                    }
                }
            });
            
            paintObserver.observe({ 
                entryTypes: ['paint'] 
            });
            
            // Observe LCP
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.LCP = Math.round(lastEntry.startTime);
            });
            
            lcpObserver.observe({ 
                entryTypes: ['largest-contentful-paint'] 
            });
        } catch (e) {
            console.error('Paint metrics observation failed:', e);
        }
    }
    
    observeLayoutShifts() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            let clsValue = 0;
            let clsEntries = [];
            
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                }
                this.metrics.CLS = Math.round(clsValue * 1000) / 1000;
            });
            
            clsObserver.observe({ 
                entryTypes: ['layout-shift'] 
            });
        } catch (e) {
            console.error('Layout shift observation failed:', e);
        }
    }
    
    observeFirstInput() {
        if (!('PerformanceObserver' in window)) return;
        
        try {
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.FID = Math.round(entry.processingStart - entry.startTime);
                }
            });
            
            fidObserver.observe({ 
                entryTypes: ['first-input'] 
            });
        } catch (e) {
            console.error('First input observation failed:', e);
        }
    }
    
    measureTTFB() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    this.metrics.TTFB = Math.round(
                        navTiming.responseStart - navTiming.fetchStart
                    );
                }
                
                // Report metrics after page load
                this.reportMetrics();
            }, 0);
        });
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('SW registration failed:', error);
                    });
            });
        }
    }
    
    reportMetrics() {
        // Only report if we have meaningful metrics
        if (!this.metrics.LCP && !this.metrics.FCP) return;
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.table(this.metrics);
        }
        
        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            // Report Core Web Vitals to Google Analytics
            if (this.metrics.LCP) {
                gtag('event', 'LCP', {
                    value: this.metrics.LCP,
                    metric_value: this.metrics.LCP,
                    metric_delta: this.metrics.LCP
                });
            }
            
            if (this.metrics.FID) {
                gtag('event', 'FID', {
                    value: this.metrics.FID,
                    metric_value: this.metrics.FID,
                    metric_delta: this.metrics.FID
                });
            }
            
            if (this.metrics.CLS) {
                gtag('event', 'CLS', {
                    value: this.metrics.CLS * 1000,
                    metric_value: this.metrics.CLS,
                    metric_delta: this.metrics.CLS
                });
            }
        }
    }
}

// Initialize performance monitoring
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceMonitor();
    });
} else {
    new PerformanceMonitor();
}