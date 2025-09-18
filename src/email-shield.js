/**
 * Email Shield - Optimized Version
 * Performance-focused email protection with accessibility fixes
 */

class EmailShield {
    constructor() {
        // Obfuscated email components
        this.fragments = {
            a: String.fromCharCode(101, 100, 100, 105, 101),
            b: String.fromCharCode(64),
            c: String.fromCharCode(99, 101, 114, 118, 101, 108, 108, 111),
            d: String.fromCharCode(46, 109, 101)
        };
        
        // Bot detection
        this.botScore = 0;
        this.isBot = false;
        this.assembled = false;
        
        // Initialize only essential features
        this.init();
    }

    init() {
        // Use requestIdleCallback for non-critical initialization
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.createHoneypots();
                this.detectAutomation();
            }, { timeout: 2000 });
        } else {
            setTimeout(() => {
                this.createHoneypots();
                this.detectAutomation();
            }, 100);
        }
        
        // Critical path: protect email link immediately
        this.protectEmailLink();
    }

    createHoneypots() {
        // Create honeypot container with proper accessibility
        const honeypots = document.createElement('div');
        honeypots.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
        honeypots.setAttribute('aria-hidden', 'true');
        
        // Add inert attribute to prevent focus (fixes accessibility issue)
        honeypots.setAttribute('inert', '');
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Single decoy email (reduced from 4 to minimize DOM operations)
        const trap = document.createElement('span');
        trap.style.display = 'none';
        trap.textContent = 'noreply@example.com';
        trap.tabIndex = -1; // Ensure not focusable
        fragment.appendChild(trap);
        
        honeypots.appendChild(fragment);
        document.body.appendChild(honeypots);
        
        // Simple copy event detection
        honeypots.addEventListener('copy', () => {
            this.isBot = true;
        }, { passive: true });
    }

    detectAutomation() {
        // Quick automation checks
        if (navigator.webdriver || window.callPhantom || window._phantom) {
            this.isBot = true;
            return;
        }
        
        // Check for headless indicators
        if (navigator.plugins.length === 0 || screen.colorDepth === 0) {
            this.botScore += 50;
        }
    }

    protectEmailLink() {
        const emailLink = document.getElementById('email-link');
        if (!emailLink) return;
        
        emailLink.removeAttribute('href');
        emailLink.style.cursor = 'pointer';
        
        let clicks = 0;
        let firstInteraction = 0;
        
        const handleClick = (e) => {
            e.preventDefault();
            const now = Date.now();
            
            // Basic bot detection
            if (firstInteraction === 0) {
                firstInteraction = now;
            } else if (now - firstInteraction < 100) {
                this.isBot = true;
            }
            
            clicks++;
            
            if (!this.isBot && clicks === 1) {
                this.assembleEmail(emailLink);
            } else if (this.isBot) {
                window.location.href = '/contact.html';
            }
        };
        
        // Single click handler for simplicity
        emailLink.addEventListener('click', handleClick, { passive: false });
        
        // Prevent copy for unassembled email
        emailLink.addEventListener('copy', (e) => {
            if (!this.assembled) {
                e.clipboardData.setData('text/plain', 'contact via website');
                e.preventDefault();
            }
        });
    }

    assembleEmail(element) {
        if (this.assembled || this.isBot) return;
        
        // Quick assembly
        const email = this.fragments.a + this.fragments.b + 
                     this.fragments.c + this.fragments.d;
        
        const mailto = `mailto:${email}?subject=${encodeURIComponent('Hello from cervello.me')}`;
        
        // Navigate immediately on click
        window.location.href = mailto;
        this.assembled = true;
        
        // Prepare link for future clicks
        element.href = mailto;
        element.rel = 'nofollow noopener';
        
        // Self-cleanup after 30 seconds
        setTimeout(() => {
            element.removeAttribute('href');
            this.assembled = false;
        }, 30000);
    }
    
    static addProtectionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #email-link {
                -webkit-user-select: none;
                user-select: none;
                -webkit-touch-callout: none;
            }
            @media print {
                #email-link { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize with minimal blocking
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EmailShield.addProtectionStyles();
        new EmailShield();
    });
} else {
    EmailShield.addProtectionStyles();
    new EmailShield();
}