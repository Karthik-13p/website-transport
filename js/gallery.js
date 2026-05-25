/**
 * ==========================================================================
 * AMMA ROAD CARRIERS - DYNAMIC GALLERY FILTER & MODAL LIGHTBOX
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilter();
    initGalleryLightbox();
});

/* ==========================================================================
   1. GALLERY GRID CATEGORIES FILTER
   ========================================================================== */
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterButtons.length || !galleryItems.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Deactivate all button active states
            filterButtons.forEach(b => b.classList.remove('active'));
            // Activate current
            btn.classList.add('active');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    item.style.display = 'block';
                    // Trigger fade-in scaling animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.85)';
                    // Shift display to none after fade out ends
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 350);
                }
            });
        });
    });

    // Initialize clean defaults
    galleryItems.forEach(item => {
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
    });
}

/* ==========================================================================
   2. IMMERSIVE MODAL LIGHTBOX SYSTEM
   ========================================================================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightboxModal');
    const lightboxMainImg = document.getElementById('lightboxMainImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!galleryItems.length || !lightbox || !lightboxMainImg || !lightboxCaption) return;

    let activeIndex = 0;
    let visibleItemsList = [];

    // Helper: update item lists based on active filters
    function updateVisibleItems() {
        visibleItemsList = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        updateVisibleItems();
        activeIndex = index;

        const targetItem = visibleItemsList[activeIndex];
        if (!targetItem) return;

        const img = targetItem.querySelector('.gallery-img');
        const captionH = targetItem.querySelector('.gallery-info h4');
        const captionP = targetItem.querySelector('.gallery-info p');

        // Swap lightbox media targets
        lightboxMainImg.src = img.src;
        lightboxMainImg.alt = img.alt;
        lightboxCaption.innerHTML = `${captionH.innerText} <span style="font-weight:400; font-size:0.9rem; color:rgba(255,255,255,0.7); display:block; margin-top:2px;">${captionP.innerText}</span>`;

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        updateVisibleItems();
        if (!visibleItemsList.length) return;

        // Apply scale transition down during image shifts
        lightboxMainImg.style.transform = 'scale(0.9)';
        lightboxMainImg.style.opacity = '0';

        setTimeout(() => {
            if (direction === 'next') {
                activeIndex = (activeIndex + 1) % visibleItemsList.length;
            } else if (direction === 'prev') {
                activeIndex = (activeIndex - 1 + visibleItemsList.length) % visibleItemsList.length;
            }
            
            const targetItem = visibleItemsList[activeIndex];
            const img = targetItem.querySelector('.gallery-img');
            const captionH = targetItem.querySelector('.gallery-info h4');
            const captionP = targetItem.querySelector('.gallery-info p');

            lightboxMainImg.src = img.src;
            lightboxMainImg.alt = img.alt;
            lightboxCaption.innerHTML = `${captionH.innerText} <span style="font-weight:400; font-size:0.9rem; color:rgba(255,255,255,0.7); display:block; margin-top:2px;">${captionP.innerText}</span>`;
            
            // Pop transition up
            lightboxMainImg.style.transform = 'scale(1)';
            lightboxMainImg.style.opacity = '1';
        }, 250);
    }

    // Attach click events on visible items
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const index = visibleItemsList.indexOf(item);
            openLightbox(index);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox('prev'));

    // Backdrop click-out closer
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Keyboard support navigations
    window.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}
