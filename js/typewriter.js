//Typewriter Effect =====
/**
 * Typewriter Effect Controller
 * Creates animated typing effect for text
 */

class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            strings: options.strings || ['Web Developer', 'Designer', 'Storyteller'],
            typeSpeed: options.typeSpeed || 100,
            deleteSpeed: options.deleteSpeed || 50,
            delayBetween: options.delayBetween || 2000,
            loop: options.loop !== false,
            cursor: options.cursor || '|',
            ...options
        };
        
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
        
        this.init();
    }
    
    init() {
        if (this.element) {
            this.element.innerHTML = '';
            this.addCursor();
            this.type();
        }
    }
    
    addCursor() {
        this.cursor = document.createElement('span');
        this.cursor.textContent = this.options.cursor;
        this.cursor.className = 'typewriter-cursor';
        this.cursor.style.cssText = `
            animation: blink 1s infinite;
            color: var(--accent-color, #06b6d4);
        `;
        this.element.appendChild(this.cursor);
    }
    
    type() {
        if (this.isWaiting) return;
        
        const currentString = this.options.strings[this.currentStringIndex];
        const displayText = this.isDeleting 
            ? currentString.substring(0, this.currentCharIndex - 1)
            : currentString.substring(0, this.currentCharIndex + 1);
        
        // Update text (excluding cursor)
        const textNode = this.element.firstChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = displayText;
        } else {
            this.element.insertBefore(document.createTextNode(displayText), this.cursor);
        }
        
        // Determine next action
        if (!this.isDeleting && this.currentCharIndex === currentString.length) {
            // Finished typing current string
            this.isWaiting = true;
            setTimeout(() => {
                this.isWaiting = false;
                this.isDeleting = true;
                this.type();
            }, this.options.delayBetween);
            return;
        }
        
        if (this.isDeleting && this.currentCharIndex === 0) {
            // Finished deleting, move to next string
            this.isDeleting = false;
            this.currentStringIndex = (this.currentStringIndex + 1) % this.options.strings.length;
            
            if (!this.options.loop && this.currentStringIndex === 0) {
                return; // Stop if not looping and we've gone through all strings
            }
        }
        
        // Update character index
        this.currentCharIndex += this.isDeleting ? -1 : 1;
        
        // Schedule next type
        const speed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;
        setTimeout(() => this.type(), speed);
    }
    
    destroy() {
        if (this.element) {
            this.element.innerHTML = this.options.strings[0] || '';
        }
    }
}