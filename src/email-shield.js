/**
 * Email Shield - Zero-Cost Email Protection System
 * Multi-layered client-side protection against harvesting
 * No external services required
 */

class EmailShield {
    constructor() {
        // Obfuscated email components - never store complete email
        this.fragments = {
            a: String.fromCharCode(101, 100, 100, 105, 101), // eddie
            b: String.fromCharCode(64), // @
            c: String.fromCharCode(99, 101, 114, 118, 101, 108, 108, 111), // cervello
            d: String.fromCharCode(46, 109, 101) // .me
        };
        
        // Decoy emails for bot detection
        this.decoys = [
            'admin@example.com',
            'noreply@domain.com',
            'contact@website.org',
            'info@company.net'
        ];
        
        // Track bot behavior
        this.interactions = [];
        this.botScore = 0;
        this.isBot = false;
        this.assembled = false;
        
        // Timing patterns
        this.lastInteraction = 0;
        this.interactionDelays = [];
        
        // Initialize protection
        this.init();
    }

    init() {
        // Create invisible honeypots
        this.createHoneypots();
        
        // Monitor page behavior
        this.monitorBehavior();
        
        // Setup email link
        this.protectEmailLink();
        
        // Add anti-automation detection
        this.detectAutomation();
    }

    /**
     * Create invisible honeypot elements
     */
    createHoneypots() {
        // Add hidden decoy emails that bots will harvest
        const honeypots = document.createElement('div');
        honeypots.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
        honeypots.setAttribute('aria-hidden', 'true');
        honeypots.setAttribute('inert', ''); // Fix accessibility issue
        
        // Add multiple decoys with different hiding techniques
        this.decoys.forEach((decoy, index) => {
            // Method 1: Display none
            const trap1 = document.createElement('a');
            trap1.href = `mailto:${decoy}`;
            trap1.style.display = 'none';
            trap1.className = 'email-contact';
            trap1.tabIndex = -1; // Ensure not focusable
            honeypots.appendChild(trap1);
            
            // Method 2: Visibility hidden
            const trap2 = document.createElement('span');
            trap2.style.visibility = 'hidden';
            trap2.textContent = decoy;
            trap2.setAttribute('data-email', 'true');
            trap2.tabIndex = -1; // Ensure not focusable
            honeypots.appendChild(trap2);
            
            // Method 3: Zero opacity
            const trap3 = document.createElement('div');
            trap3.style.opacity = '0';
            trap3.innerHTML = `<a href="mailto:${decoy}" tabindex="-1">${decoy}</a>`;
            honeypots.appendChild(trap3);
        });
        
        document.body.appendChild(honeypots);
        
        // Monitor if honeypots are accessed
        honeypots.addEventListener('copy', () => {
            this.isBot = true;
            this.botScore += 100;
        });
    }

    /**
     * Monitor user behavior patterns
     */
    monitorBehavior() {
        let mouseMovements = 0;
        let keyPresses = 0;
        let touchEvents = 0;
        
        // Track mouse movements (bots often don't move mouse naturally)
        document.addEventListener('mousemove', (e) => {
            mouseMovements++;
            const now = Date.now();
            
            if (this.lastInteraction > 0) {
                const delay = now - this.lastInteraction;
                this.interactionDelays.push(delay);
                
                // Check for inhuman speed (movements faster than 20ms consistently)
                if (delay < 20) {
                    this.botScore += 5;
                }
            }
            
            this.lastInteraction = now;
        }, { passive: true });
        
        // Track keyboard activity
        document.addEventListener('keydown', () => {
            keyPresses++;
        }, { passive: true });
        
        // Track touch events
        document.addEventListener('touchstart', () => {
            touchEvents++;
        }, { passive: true });
        
        // Analyze behavior after 2 seconds
        setTimeout(() => {
            // No mouse movement but trying to click = likely bot
            if (mouseMovements < 3 && this.interactions.length > 0) {
                this.botScore += 30;
            }
            
            // Check for automation patterns
            if (this.interactionDelays.length > 5) {
                const avgDelay = this.interactionDelays.reduce((a, b) => a + b, 0) / this.interactionDelays.length;
                
                // Perfectly consistent delays = automation
                const variance = this.interactionDelays.reduce((sum, delay) => {
                    return sum + Math.pow(delay - avgDelay, 2);
                }, 0) / this.interactionDelays.length;
                
                if (variance < 10) {
                    this.botScore += 40;
                }
            }
            
            this.isBot = this.botScore > 50;
        }, 2000);
    }

    /**
     * Detect automation tools
     */
    detectAutomation() {
        // Check for headless browser indicators
        if (navigator.webdriver) {
            this.isBot = true;
            this.botScore += 100;
        }
        
        // Check for missing plugins (headless browsers often lack these)
        if (navigator.plugins.length === 0) {
            this.botScore += 20;
        }
        
        // Check for automation tools
        if (window.callPhantom || window._phantom || window.__nightmare) {
            this.isBot = true;
            this.botScore += 100;
        }
        
        // Check screen resolution (headless often use default sizes)
        if (screen.width === 800 && screen.height === 600) {
            this.botScore += 15;
        }
        
        // Check color depth (headless browsers sometimes have unusual values)
        if (screen.colorDepth === 0 || screen.colorDepth === 1) {
            this.botScore += 25;
        }
    }

    /**
     * Protect the email link
     */
    protectEmailLink() {
        const emailLink = document.getElementById('email-link');
        if (!emailLink) return;
        
        // Remove any existing href
        emailLink.removeAttribute('href');
        emailLink.style.cursor = 'pointer';
        
        // Track interactions
        let interactionCount = 0;
        let firstInteractionTime = 0;
        
        // Multi-stage revelation
        const revealStages = ['mouseenter', 'focus', 'mousemove'];
        let currentStage = 0;
        
        const handleInteraction = (e) => {
            const now = Date.now();
            
            // Track interaction timing
            if (firstInteractionTime === 0) {
                firstInteractionTime = now;
            } else {
                const timeSinceFirst = now - firstInteractionTime;
                
                // Too fast interactions = bot
                if (timeSinceFirst < 100 && interactionCount > 1) {
                    this.botScore += 30;
                    this.isBot = true;
                }
            }
            
            interactionCount++;
            this.interactions.push({
                type: e.type,
                time: now
            });
            
            // Only proceed if not detected as bot
            if (!this.isBot && this.botScore < 40) {
                currentStage++;
                
                // Require multiple interaction types before assembly
                if (currentStage >= 2 || e.type === 'click') {
                    this.assembleEmail(emailLink, e);
                }
            } else if (e.type === 'click') {
                e.preventDefault();
                // Redirect bots to contact page
                window.location.href = '/contact.html';
            }
        };
        
        // Add listeners for progressive revelation
        ['mouseenter', 'focus', 'mousemove', 'touchstart', 'click'].forEach(event => {
            emailLink.addEventListener(event, handleInteraction, {
                once: event !== 'mousemove',
                passive: event !== 'click'
            });
        });
        
        // Additional protection: scramble on copy attempt
        emailLink.addEventListener('copy', (e) => {
            if (!this.assembled) {
                e.clipboardData.setData('text/plain', 'contact via website');
                e.preventDefault();
            }
        });
    }

    /**
     * Assemble email only for verified humans
     */
    assembleEmail(element, event) {
        if (this.assembled || this.isBot) return;
        
        // Final bot check
        if (this.botScore > 30) {
            this.isBot = true;
            return;
        }
        
        // Assemble email from fragments
        const email = this.fragments.a + this.fragments.b + 
                     this.fragments.c + this.fragments.d;
        
        // Add random delay to prevent timing attacks
        const delay = Math.random() * 200 + 50;
        
        setTimeout(() => {
            // Create mailto link
            const mailto = `mailto:${email}?subject=${encodeURIComponent('Hello from cervello.me')}`;
            
            if (event.type === 'click') {
                event.preventDefault();
                // For clicks, navigate immediately
                window.location.href = mailto;
            } else {
                // For other events, prepare the link
                element.href = mailto;
                element.rel = 'nofollow noopener';
                
                // Self-destruct after 30 seconds
                setTimeout(() => {
                    element.removeAttribute('href');
                    this.assembled = false;
                }, 30000);
            }
            
            this.assembled = true;
        }, delay);
    }
    
    /**
     * Add CSS protection layer
     */
    static addProtectionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Prevent text selection of email */
            #email-link {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                position: relative;
            }
            
            /* Hide from print */
            @media print {
                #email-link {
                    display: none !important;
                }
            }
            
            /* Disable right-click context menu */
            #email-link {
                -webkit-touch-callout: none;
            }
            
            /* Add fake content for scrapers */
            #email-link::before {
                content: attr(data-not-email);
                position: absolute;
                left: -9999px;
                speak: none;
            }
            
            /* Accessibility preserved */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0,0,0,0);
                white-space: nowrap;
                border: 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize protection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        EmailShield.addProtectionStyles();
        new EmailShield();
    });
} else {
    EmailShield.addProtectionStyles();
    new EmailShield();
}

// Anti-debugging protection
(function() {
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                // Clear any assembled emails when devtools open
                const link = document.getElementById('email-link');
                if (link) link.removeAttribute('href');
            }
        } else {
            devtools.open = false;
        }
    }, 500);
})();