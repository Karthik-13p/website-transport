/**
 * ==========================================================================
 * AMMA ROAD CARRIERS - CUSTOM CLIENT CAROUSEL WITH SWIPE SUPPORT
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTestimonialCarousel();
});

function initTestimonialCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track || !slides.length) return;

    let currentIndex = 0;
    let autoSlideInterval = null;
    const intervalDuration = 5500; // 5.5 seconds per slide

    // Touch events state variables for mobile swiping support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    // 1. Build pagination dots dynamically based on slide count
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('data-slide', idx);
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    // 2. Main translation shifting function
    function goToSlide(index) {
        // Clamp bounds
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Apply visual shift translation
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots state
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    // 3. Arrow Control Navigations
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlideTimer();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlideTimer();
    });

    // 4. Dot Pagination triggers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const targetIdx = parseInt(dot.getAttribute('data-slide'));
            goToSlide(targetIdx);
            resetAutoSlideTimer();
        });
    });

    // 5. Auto-cycling loop functions
    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, intervalDuration);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
    }

    function resetAutoSlideTimer() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Hover mouse triggers to pause cycling
    const viewport = document.getElementById('carouselViewport');
    if (viewport) {
        viewport.addEventListener('mouseenter', stopAutoSlide);
        viewport.addEventListener('mouseleave', startAutoSlide);
    }

    // 6. Mobile Touch Gesture Swiping Logic
    track.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        startX = e.touches[0].clientX;
        isDragging = true;
        
        // Remove transitions temporarily for direct touch tracking response
        track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        
        // Calculate dynamic translation value during drag
        const baseOffset = -currentIndex * track.offsetWidth;
        track.style.transform = `translateX(${baseOffset + diffX}px)`;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        // Restore transition effects
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
        
        const diffX = currentX - startX;
        const dragThreshold = 65; // Minimum pixels to qualify as a swipe gesture

        if (diffX < -dragThreshold) {
            // Swiped Left -> next
            nextSlide();
        } else if (diffX > dragThreshold) {
            // Swiped Right -> prev
            prevSlide();
        } else {
            // Snap back to original slide position
            goToSlide(currentIndex);
        }
        
        startAutoSlide();
    });

    // Start auto cycle on load
    startAutoSlide();
}
