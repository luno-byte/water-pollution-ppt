class WaterPollutionPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateUI();
        
        // Add event listeners with proper binding
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.prevSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextSlide();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support for mobile
        this.initTouchSupport();
        
        // Set total slides
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Initial progress bar update
        this.updateProgressBar();
        
        // Ensure first slide is active
        this.goToSlide(1);
    }
    
    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Spacebar
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
        }
    }
    
    initTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const slidesContainer = document.querySelector('.slides-container');
        
        slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
        
        this.handleSwipe = () => {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
            
            // Only handle horizontal swipes if they're more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
    }
    
    nextSlide() {
        console.log('Next slide clicked, current:', this.currentSlide);
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    prevSlide() {
        console.log('Previous slide clicked, current:', this.currentSlide);
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        console.log('Going to slide:', slideNumber);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Add active class to new slide
        const newSlideElement = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideElement) {
            newSlideElement.classList.add('active');
            console.log('Activated slide:', slideNumber);
        } else {
            console.error('Could not find slide:', slideNumber);
        }
        
        // Update UI
        this.updateUI();
        
        // Animate any elements in the new slide
        this.animateSlideContent(newSlideElement);
    }
    
    updateUI() {
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update progress bar
        this.updateProgressBar();
        
        // Update button text for last slide
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.textContent = 'Finish';
        } else {
            this.nextBtn.textContent = 'Next ❯';
        }
        
        console.log('UI updated - Current slide:', this.currentSlide);
    }
    
    updateProgressBar() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    animateSlideContent(slideElement) {
        if (!slideElement) return;
        
        // Add subtle animations to slide content
        const animatableElements = slideElement.querySelectorAll(
            '.stat-card, .type-card, .effect-item, .action-item, .case-study, .initiative-card, .tech-item'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // Reset styles after animation
        setTimeout(() => {
            animatableElements.forEach(element => {
                element.style.transition = '';
            });
        }, 1000);
    }
    
    // Additional utility methods
    getCurrentSlideData() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            progress: (this.currentSlide / this.totalSlides) * 100
        };
    }
    
    // Method to handle presentation controls
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Print-friendly view
    showPrintView() {
        const printStyles = `
            <style media="print">
                .navigation, .progress-container { display: none !important; }
                .slide { 
                    position: static !important;
                    opacity: 1 !important;
                    transform: none !important;
                    page-break-after: always;
                    min-height: 100vh;
                    padding: 20px !important;
                }
                .slide:last-child { page-break-after: avoid; }
                body { background: white !important; }
                * { color: black !important; }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', printStyles);
        
        // Show all slides for printing
        this.slides.forEach(slide => {
            slide.classList.add('active');
        });
        
        // Trigger print dialog
        setTimeout(() => {
            window.print();
            
            // Reset after printing
            setTimeout(() => {
                location.reload();
            }, 1000);
        }, 500);
    }
}

// Additional helper functions for enhanced interactivity
class PresentationEnhancer {
    constructor(presentation) {
        this.presentation = presentation;
        this.initEnhancements();
    }
    
    initEnhancements() {
        // Add keyboard shortcuts help
        this.addKeyboardShortcuts();
        
        // Add slide overview functionality
        this.addSlideOverview();
        
        // Add smooth scroll to top when changing slides
        this.addScrollToTop();
        
        // Add focus management for accessibility
        this.addFocusManagement();
    }
    
    addKeyboardShortcuts() {
        // Add help overlay for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'h' || e.key === 'H') {
                this.showKeyboardHelp();
            }
            if (e.key === 'o' || e.key === 'O') {
                this.showSlideOverview();
            }
            if (e.key === 'p' || e.key === 'P') {
                this.presentation.showPrintView();
            }
            if (e.key === 'f' || e.key === 'F') {
                this.presentation.toggleFullscreen();
            }
        });
    }
    
    showKeyboardHelp() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-content">
                <h3>Keyboard Shortcuts</h3>
                <div class="help-shortcuts">
                    <div><kbd>←</kbd> <kbd>↑</kbd> Previous slide</div>
                    <div><kbd>→</kbd> <kbd>↓</kbd> <kbd>Space</kbd> Next slide</div>
                    <div><kbd>Home</kbd> First slide</div>
                    <div><kbd>End</kbd> Last slide</div>
                    <div><kbd>H</kbd> Show this help</div>
                    <div><kbd>O</kbd> Slide overview</div>
                    <div><kbd>P</kbd> Print view</div>
                    <div><kbd>F</kbd> Toggle fullscreen</div>
                    <div><kbd>Esc</kbd> Close modal</div>
                </div>
                <button class="close-help">Close</button>
            </div>
        `;
        
        // Add styles
        const helpStyles = `
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .help-content {
                background: var(--color-surface);
                padding: var(--space-32);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
            }
            .help-shortcuts {
                display: grid;
                gap: var(--space-8);
                margin: var(--space-16) 0;
            }
            .help-shortcuts div {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            kbd {
                background: var(--color-secondary);
                padding: var(--space-4) var(--space-8);
                border-radius: var(--radius-sm);
                font-family: var(--font-family-mono);
                font-size: var(--font-size-sm);
                border: 1px solid var(--color-border);
            }
            .close-help {
                background: var(--color-primary);
                color: var(--color-btn-primary-text);
                border: none;
                padding: var(--space-8) var(--space-16);
                border-radius: var(--radius-base);
                cursor: pointer;
                margin-top: var(--space-16);
            }
        `;
        
        if (!document.getElementById('help-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'help-styles';
            styleSheet.textContent = helpStyles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(helpModal);
        
        // Close functionality
        const closeHelp = () => {
            document.body.removeChild(helpModal);
        };
        
        helpModal.querySelector('.close-help').addEventListener('click', closeHelp);
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) closeHelp();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(helpModal)) {
                closeHelp();
            }
        });
    }
    
    addSlideOverview() {
        // Implementation for slide overview/thumbnail view would go here
        // This is a simplified version due to complexity
        this.showSlideOverview = () => {
            console.log('Slide overview feature - showing all slides in grid view');
            // In a full implementation, this would show thumbnail views of all slides
        };
    }
    
    addScrollToTop() {
        // Ensure slides start at the top when navigating
        const originalGoToSlide = this.presentation.goToSlide.bind(this.presentation);
        this.presentation.goToSlide = (slideNumber) => {
            originalGoToSlide(slideNumber);
            document.querySelector('.slides-container').scrollTop = 0;
        };
    }
    
    addFocusManagement() {
        // Manage focus for accessibility
        const originalGoToSlide = this.presentation.goToSlide.bind(this.presentation);
        this.presentation.goToSlide = (slideNumber) => {
            originalGoToSlide(slideNumber);
            
            // Focus the slide content for screen readers
            setTimeout(() => {
                const currentSlide = document.querySelector('.slide.active');
                if (currentSlide) {
                    const heading = currentSlide.querySelector('h1, h2, h3');
                    if (heading && !heading.hasAttribute('tabindex')) {
                        heading.setAttribute('tabindex', '-1');
                        heading.focus();
                    }
                }
            }, 300);
        };
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation...');
    
    // Wait a bit to ensure all elements are ready
    setTimeout(() => {
        const presentation = new WaterPollutionPresentation();
        const enhancer = new PresentationEnhancer(presentation);
        
        // Global reference for debugging/testing
        window.presentation = presentation;
        
        // Add loading indicator removal
        const loadingIndicator = document.querySelector('.loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Announce to screen readers that presentation is ready
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = 'Water pollution presentation loaded. Use arrow keys or click navigation buttons.';
        document.body.appendChild(announcement);
        
        // Remove announcement after screen readers have processed it
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 3000);
        
        console.log('Water Pollution Presentation initialized successfully!');
        console.log('Use keyboard shortcuts: H for help, F for fullscreen, P for print view');
    }, 100);
});