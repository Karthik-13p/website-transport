/**
 * ==========================================================================
 * AMMA ROAD CARRIERS - MAIN CORE JAVASCRIPT
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initMobileDrawer();
    initHeroTextSlider();
    initScrollReveal();
    initAboutTabs();
    initAnimatedCounters();
    initFAQAccordion();
    initModalsManager();
    initContactFormValidation();
    initFreightCalculator();
    initBackToTop();
});

/* ==========================================================================
   1. STICKY HEADER SYSTEM
   ========================================================================== */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    const scrollThreshold = 120;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 180)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2. MOBILE DRAWER SYSTEM
   ========================================================================== */
function initMobileDrawer() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const menuOverlay = document.getElementById('menuOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const drawerQuoteBtn = document.getElementById('drawerQuoteBtn');

    function toggleDrawer(isOpen) {
        if (isOpen) {
            mobileDrawer.classList.add('open');
            menuOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Stop page scroll
        } else {
            mobileDrawer.classList.remove('open');
            menuOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Resume scroll
        }
    }

    mobileMenuBtn.addEventListener('click', () => toggleDrawer(true));
    closeDrawerBtn.addEventListener('click', () => toggleDrawer(false));
    menuOverlay.addEventListener('click', () => toggleDrawer(false));

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
    });

    if (drawerQuoteBtn) {
        drawerQuoteBtn.addEventListener('click', () => {
            toggleDrawer(false);
            const quoteModal = document.getElementById('quoteModal');
            if (quoteModal) quoteModal.classList.add('open');
        });
    }
}

/* ==========================================================================
   3. HERO TEXT SLIDER
   ========================================================================== */
function initHeroTextSlider() {
    const slides = document.querySelectorAll('#textSlider .slide-text');
    if (!slides.length) return;

    let currentIndex = 0;
    const slideDuration = 4000; // 4 seconds per word

    function showNextSlide() {
        // Mark current as previous (slide it up out of frame)
        const currentSlide = slides[currentIndex];
        currentSlide.classList.remove('active');
        currentSlide.classList.add('prev');

        // Increment slide index
        currentIndex = (currentIndex + 1) % slides.length;

        // Animate next slide in from bottom
        const nextSlide = slides[currentIndex];
        nextSlide.classList.remove('prev');
        nextSlide.classList.add('active');

        // Cleanup the slide class after sliding transitions
        setTimeout(() => {
            slides.forEach((slide, idx) => {
                if (idx !== currentIndex) {
                    slide.classList.remove('prev');
                }
            });
        }, 600);
    }

    setInterval(showNextSlide, slideDuration);
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));
}

/* ==========================================================================
   5. ABOUT US TAB HANDLER
   ========================================================================== */
function initAboutTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate current
            btn.classList.add('active');
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });
}

/* ==========================================================================
   6. STATS COUNTER INCREMENTOR
   ========================================================================== */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-target]');
    if (!counters.length) return;

    const countSpeed = 2000; // All counters finish in 2 seconds

    function startCounting(counter) {
        const target = parseFloat(counter.getAttribute('data-target'));
        const isFloat = counter.getAttribute('data-target').includes('.');
        const increment = target / (countSpeed / 30); // 30ms ticking rate
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = isFloat ? target.toFixed(1) : Math.floor(target);
                clearInterval(timer);
            } else {
                counter.innerText = isFloat ? current.toFixed(1) : Math.floor(current);
            }
        }, 30);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounting(entry.target);
                observer.unobserve(entry.target); // Count once
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================================================
   7. COLLAPSIBLE ACCORDION FAQs
   ========================================================================== */
function initFAQAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isAlreadyOpen = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });

            // Toggle selected item
            if (!isAlreadyOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ==========================================================================
   8. MODALS MANAGER
   ========================================================================== */
const serviceModalData = {
    'ftl': {
        title: '<i class="fa-solid fa-truck-moving text-accent"></i> Full Truck Load (FTL)',
        image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a44?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Dedicated Fleet for Point-to-Point Enterprise Transport',
        desc: 'Our Full Truck Load (FTL) services are designed for businesses requiring exclusive use of closed containers and flatbed trailers. We ensure direct routing from your factories to retail terminals nationwide without transit delays or container consolidation detours.',
        features: [
            'Exclusive container utilization (weather & dustproof)',
            '24/7 continuous GPS tracking with dashboard keys',
            'SLA-backed on-time delivery assurance metrics',
            'Transit insurance tiers matching standard value bills'
        ]
    },
    'part-load': {
        title: '<i class="fa-solid fa-boxes-packing text-accent"></i> Part Load Transport',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Economical Consolidated Space-Sharing Logistics',
        desc: 'Do not pay for space you do not use. Our Part Load consolidation services pool multiple commercial consignments heading to matching destinations. Perfect for small scale workshops, agricultural setups, and expanding startup hubs.',
        features: [
            'Pay only for weight metrics or cubic volume consumed',
            'High-frequency scheduled departures across states',
            'Careful cargo segregation to prevent load damage',
            'Central distribution hub sorting protocols'
        ]
    },
    'warehousing': {
        title: '<i class="fa-solid fa-warehouse text-accent"></i> Commercial Warehousing',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Secure Climate-Monitored Cargo Storage Hubs',
        desc: 'Store materials, overflow components, or finished goods in our high-end warehouses strategically aligned near state highway loops. Backed by 24/7 security guards, dynamic CCTV cameras, and forklift handlers.',
        features: [
            'Complete safety systems (Fire control / water-proof roofs)',
            'Forklift loading arrays and hydraulic loading bays',
            'Pallet inventory systems with real-time barcodes',
            'Cross-docking logistics support'
        ]
    },
    'express': {
        title: '<i class="fa-solid fa-bolt text-accent"></i> Express Logistics',
        image: 'https://images.unsplash.com/photo-1501700490588-433790205a88?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Critical Time-Definite Freight Fast-Tracking',
        desc: 'For urgent medical supplies, critical engine machinery, or retail launches, choose our Express transit lines. We assign two-driver squads working on rolling shifts to push driving times down by 50%.',
        features: [
            'Double-driver rotation loops to avoid cargo rest halts',
            'Continuous route support and state priority passes',
            'Immediate loading priority upon arrival',
            'Direct ETA SMS notifications to receiver contacts'
        ]
    },
    'industrial': {
        title: '<i class="fa-solid fa-gears text-accent"></i> Industrial Heavy Goods',
        image: 'https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Over-Dimensional Cargo and Structural Transport',
        desc: 'Moving heavy machinery, large structural coils, boilers, or turbine frames requires custom specialized trailers. Amma Road Carriers maintains heavy multi-axle trailers, pullers, and low-beds configured to handle high weights.',
        features: [
            'Over-Dimensional Cargo (ODC) expert configurations',
            'Ropes, chains, and hydraulic fastening systems',
            'Pre-route mapping assessments to check underpass clearances',
            'Regulatory permits and state escort alignment'
        ]
    },
    'interstate': {
        title: '<i class="fa-solid fa-map-location-dot text-accent"></i> Interstate Transport',
        image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Seamless Cross-State Border Documentation',
        desc: 'Prevent state-border transit lag with our streamlined tax clearing, permit filing, and state regulatory operations. Our trucks proceed through toll bridges and weight centers smoothly.',
        features: [
            'All-India Permits and legal document clearances',
            'Fastag enabled toll operations to trim transit stops',
            'E-Way Bill generation guidance and regulatory compliance',
            'Instant backup trucks stationed near state borders'
        ]
    },
    'parcel': {
        title: '<i class="fa-solid fa-box text-accent"></i> Parcel & LTL Services',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Flexible Commercial Box & Parcel Dispatches',
        desc: 'A dedicated solution for lightweight boxes, commercial samples, and retail e-commerce drops. Benefit from direct dispatch options, home pickups, and simple terminal drop-offs.',
        features: [
            'Secure pallet sealing blocks to protect small items',
            'Digital receipt dockets and scan milestones',
            'Doorstep pickups and hub delivery options',
            'Highly economical starting rate brackets'
        ]
    },
    'support': {
        title: '<i class="fa-solid fa-headset text-accent"></i> 24/7 Customer Care',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        subtitle: 'Continuous Dispatch Monitoring and Direct Help',
        desc: 'Customer satisfaction is our highest metric. Enjoy single-point-of-contact accounts where a dedicated ARC officer remains available around the clock to answer load updates, transit halts, or bills.',
        features: [
            'Direct telephone hotlines backed by real humans',
            'WhatsApp route update logs and docket verification',
            'Fast handling of weather detour adjustments',
            'Invoicing and pricing dispute fast-track systems'
        ]
    }
};

function initModalsManager() {
    // 1. Get Quote Modal triggers
    const quoteModal = document.getElementById('quoteModal');
    const openQuoteBtn = document.getElementById('openQuoteBtn');
    const heroQuoteBtn = document.getElementById('heroQuoteBtn');
    const closeQuoteModal = document.getElementById('closeQuoteModal');
    const modalQuoteForm = document.getElementById('modalQuoteForm');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (openQuoteBtn) openQuoteBtn.addEventListener('click', () => openModal(quoteModal));
    if (heroQuoteBtn) heroQuoteBtn.addEventListener('click', () => openModal(quoteModal));
    if (closeQuoteModal) closeQuoteModal.addEventListener('click', () => closeModal(quoteModal));

    // Handle Pricing Plan selection triggers
    const selectPlanBtns = document.querySelectorAll('.select-plan-btn');
    const modalVehicleSelect = document.getElementById('modalVehicle');
    selectPlanBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = btn.getAttribute('data-plan');
            if (modalVehicleSelect) {
                if (plan === 'Local Transport') modalVehicleSelect.value = 'mini';
                if (plan === 'Statewide Delivery') modalVehicleSelect.value = 'container';
                if (plan === 'National Logistics') modalVehicleSelect.value = 'heavy';
            }
            openModal(quoteModal);
        });
    });

    if (modalQuoteForm) {
        modalQuoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeModal(quoteModal);
            showToast('success', 'Quotation request submitted! Our dispatch specialist will call in 15 mins.');
            modalQuoteForm.reset();
        });
    }

    // 2. Service Details Modal triggers
    const serviceModal = document.getElementById('serviceDetailsModal');
    const serviceDetailTriggers = document.querySelectorAll('.open-service-modal');
    const closeServiceModal = document.getElementById('closeServiceModal');
    const closeServiceModalBtn = document.getElementById('closeServiceModalBtn');
    const modalBookServiceBtn = document.getElementById('modalBookServiceBtn');

    serviceDetailTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const serviceKey = trigger.getAttribute('data-target');
            const data = serviceModalData[serviceKey];
            if (!data) return;

            // Populate modal components
            document.getElementById('serviceModalTitle').innerHTML = data.title;
            
            const featureListHTML = data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');
            
            document.getElementById('serviceModalBody').innerHTML = `
                <div class="svc-modal-info">
                    <img src="${data.image}" alt="${data.subtitle}" class="svc-modal-img">
                    <div class="svc-modal-text">
                        <h4>${data.subtitle}</h4>
                        <p>${data.desc}</p>
                        <ul class="svc-feature-bullets">
                            ${featureListHTML}
                        </ul>
                    </div>
                </div>
            `;

            if (modalBookServiceBtn) {
                modalBookServiceBtn.setAttribute('href', `#contact`);
                modalBookServiceBtn.onclick = () => {
                    closeModal(serviceModal);
                    // Autofill contact category
                    const contactSvcSelect = document.getElementById('contactService');
                    if (contactSvcSelect) {
                        contactSvcSelect.value = serviceKey === 'support' ? 'ftl' : serviceKey === 'heavy' ? 'heavy' : serviceKey;
                    }
                };
            }

            openModal(serviceModal);
        });
    });

    if (closeServiceModal) closeServiceModal.addEventListener('click', () => closeModal(serviceModal));
    if (closeServiceModalBtn) closeServiceModalBtn.addEventListener('click', () => closeModal(serviceModal));

    // Global click-out modal closer
    window.addEventListener('click', (e) => {
        if (e.target === quoteModal) closeModal(quoteModal);
        if (e.target === serviceModal) closeModal(serviceModal);
    });
}

/* ==========================================================================
   9. CONTACT FORM FRON-END VALIDATION
   ========================================================================== */
function initContactFormValidation() {
    const form = document.getElementById('contactInquiryForm');
    if (!form) return;

    const fields = {
        name: {
            input: document.getElementById('contactName'),
            error: document.getElementById('nameError'),
            validate: value => value.trim().length >= 3
        },
        phone: {
            input: document.getElementById('contactPhone'),
            error: document.getElementById('phoneError'),
            validate: value => /^[6-9]\d{9}$/.test(value.trim()) // Indian 10-digit formats
        },
        email: {
            input: document.getElementById('contactEmail'),
            error: document.getElementById('emailError'),
            validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        },
        message: {
            input: document.getElementById('contactMessage'),
            error: document.getElementById('messageError'),
            validate: value => value.trim().length >= 10
        }
    };

    // Attach real-time validation listeners
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        field.input.addEventListener('input', () => {
            if (field.validate(field.input.value)) {
                field.input.parentElement.classList.remove('invalid');
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        // Verify all fields
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            const isValid = field.validate(field.input.value);
            if (!isValid) {
                field.input.parentElement.classList.add('invalid');
                isFormValid = false;
            } else {
                field.input.parentElement.classList.remove('invalid');
            }
        });

        if (isFormValid) {
            // Block button to simulate loader
            const submitBtn = document.getElementById('formSubmitBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Line...';

            const name = fields.name.input.value;
            const phone = fields.phone.input.value;
            const email = fields.email.input.value;
            const serviceSelect = document.getElementById('contactService');
            const serviceName = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
            const messageText = fields.message.input.value;

            // Submit via FormSubmit AJAX to karthikpadam123@gmail.com in background
            fetch("https://formsubmit.co/ajax/karthikpadam123@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "Name": name,
                    "Phone": phone,
                    "Email": email,
                    "Service Category": serviceName,
                    "Message Details": messageText,
                    "_subject": `Amma Road Carriers - Inquiry from ${name}`
                })
            })
            .then(response => {
                if (response.ok) {
                    showToast('success', `Inquiry sent automatically to karthikpadam123@gmail.com!`);
                } else {
                    showToast('success', `Inquiry sent! Please check karthikpadam123@gmail.com inbox to activate.`);
                }
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            })
            .catch(error => {
                // Graceful fallback for local offline testing
                showToast('success', `Inquiry processed automatically in the background!`);
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            });
        } else {
            showToast('error', 'Please correct the highlighted errors in the form.');
        }
    });
}

/* ==========================================================================
   10. BACK TO TOP FLOATING BUTTON
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   11. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(type, message) {
    const toastSystem = document.getElementById('toastSystem');
    if (!toastSystem) return;

    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;

    let iconHTML = '';
    if (type === 'success') iconHTML = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'warning') iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    if (type === 'error') iconHTML = '<i class="fa-solid fa-circle-exclamation"></i>';

    toast.innerHTML = `
        ${iconHTML}
        <span>${message}</span>
    `;

    toastSystem.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-30px)';
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 4500);
}

/* ==========================================================================
   12. INTERACTIVE FREIGHT CALCULATOR ENGINE
   ========================================================================== */
function initFreightCalculator() {
    const form = document.getElementById('freightCalcForm');
    const resultCard = document.getElementById('calcResultCard');

    if (!form || !resultCard) return;

    // Elements
    const originStateSelect = document.getElementById('calcOrigin');
    const destStateSelect = document.getElementById('calcDest');
    const originLocSelect = document.getElementById('calcOriginLoc');
    const destLocSelect = document.getElementById('calcDestLoc');

    // Complete State and UT Mapping (28 States + major UTs)
    const stateNames = {
        'AP': 'Andhra Pradesh',
        'AR': 'Arunachal Pradesh',
        'AS': 'Assam',
        'BR': 'Bihar',
        'CG': 'Chhattisgarh',
        'GA': 'Goa',
        'GJ': 'Gujarat',
        'HR': 'Haryana',
        'HP': 'Himachal Pradesh',
        'JH': 'Jharkhand',
        'KA': 'Karnataka',
        'KL': 'Kerala',
        'MP': 'Madhya Pradesh',
        'MH': 'Maharashtra',
        'MN': 'Manipur',
        'ML': 'Meghalaya',
        'MZ': 'Mizoram',
        'NL': 'Nagaland',
        'OD': 'Odisha',
        'PB': 'Punjab',
        'RJ': 'Rajasthan',
        'SK': 'Sikkim',
        'TN': 'Tamil Nadu',
        'TS': 'Telangana',
        'TR': 'Tripura',
        'UP': 'Uttar Pradesh',
        'UK': 'Uttarakhand',
        'WB': 'West Bengal',
        'DL': 'Delhi-NCR',
        'JK': 'Jammu & Kashmir',
        'LA': 'Ladakh',
        'PY': 'Puducherry',
        'CH': 'Chandigarh'
    };

    // 33 Telangana Districts
    const telanganaDistricts = [
        'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 
        'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 
        'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad', 
        'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 
        'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 
        'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 
        'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ];

    // 26 Andhra Pradesh Districts
    const apDistricts = [
        'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 
        'Bapatla', 'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 
        'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'NTR', 'Nandyal', 
        'Palnadu', 'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 
        'Sri Sathya Sai', 'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 
        'West Godavari', 'YSR (Kadapa)'
    ];

    // Default major industrial cities/transport hubs for other states
    const defaultCities = {
        'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur'],
        'KA': ['Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Davangere', 'Bellary'],
        'TN': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'],
        'DL': ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Dwarka'],
        'GJ': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar'],
        'WB': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Kharagpur', 'Haldia'],
        'AR': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
        'AS': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Nagaon', 'Tinsukia'],
        'BR': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Ara'],
        'CG': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Jagdalpur'],
        'GA': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
        'HR': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar'],
        'HP': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Baddi', 'Una'],
        'JH': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro Steel City', 'Deoghar', 'Hazaribagh'],
        'KL': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha', 'Palakkad'],
        'MP': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas'],
        'MN': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
        'ML': ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
        'MZ': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
        'NL': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
        'OD': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore', 'Paradip'],
        'PB': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot'],
        'RJ': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Bhilwara', 'Alwar'],
        'SK': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan'],
        'TR': ['Agartala', 'Dharmanagar', 'Udaipur', 'Ambassa'],
        'UP': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Noida', 'Prayagraj'],
        'UK': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh'],
        'JK': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua'],
        'LA': ['Leh', 'Kargil'],
        'PY': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
        'CH': ['Chandigarh'],
        'DN': ['Silvassa', 'Daman', 'Diu'],
        'LD': ['Kavaratti', 'Agatti', 'Amini'],
        'AN': ['Port Blair']
    };

    // Geographic Zones for India to calculate dynamic distances
    const stateZones = {
        'AP': 'South', 'KA': 'South', 'KL': 'South', 'TN': 'South', 'TS': 'South', 'PY': 'South', 'LD': 'South',
        'MH': 'West', 'GJ': 'West', 'GA': 'West', 'DN': 'West',
        'DL': 'North', 'HR': 'North', 'HP': 'North', 'PB': 'North', 'RJ': 'North', 'UP': 'North', 'UK': 'North', 'JK': 'North', 'LA': 'North', 'CH': 'North',
        'MP': 'Central', 'CG': 'Central',
        'BR': 'East', 'JH': 'East', 'OD': 'East', 'WB': 'East', 'AN': 'East',
        'AR': 'Northeast', 'AS': 'Northeast', 'MN': 'Northeast', 'ML': 'Northeast', 'MZ': 'Northeast', 'NL': 'Northeast', 'SK': 'Northeast', 'TR': 'Northeast'
    };

    // Zone-to-Zone Distance Factors
    const zoneDistances = {
        'South-South': 800,
        'South-West': 1500,
        'South-North': 2800,
        'South-Central': 1400,
        'South-East': 2000,
        'South-Northeast': 3600,
        
        'West-West': 600,
        'West-North': 2200,
        'West-Central': 1000,
        'West-East': 1900,
        'West-Northeast': 3400,
        
        'North-North': 700,
        'North-Central': 1200,
        'North-East': 1600,
        'North-Northeast': 2600,
        
        'Central-Central': 500,
        'Central-East': 1100,
        'Central-Northeast': 2800,
        
        'East-East': 600,
        'East-Northeast': 1800,
        
        'Northeast-Northeast': 500
    };

    // Dedicated high-frequency business corridors
    const customCorridors = {
        'MH-KA': 2500, 'KA-MH': 2500,
        'MH-DL': 4500, 'DL-MH': 4500,
        'MH-TN': 3200, 'TN-MH': 3200,
        'MH-GJ': 1800, 'GJ-MH': 1800,
        'MH-TS': 2400, 'TS-MH': 2400,
        'MH-WB': 5200, 'WB-MH': 5200,
        'KA-TN': 1400, 'TN-KA': 1400,
        'KA-TS': 1900, 'TS-KA': 1900,
        'KA-DL': 5500, 'DL-KA': 5500,
        'TN-DL': 5900, 'DL-TN': 5900,
        'GJ-DL': 2400, 'DL-GJ': 2400,
        'TS-AP': 1200, 'AP-TS': 1200
    };

    // Dynamic Distance Helper
    function getZoneDistance(stateA, stateB) {
        const zoneA = stateZones[stateA] || 'Central';
        const zoneB = stateZones[stateB] || 'Central';
        
        if (zoneA === zoneB) {
            return zoneDistances[`${zoneA}-${zoneA}`] || 800;
        }
        
        const key1 = `${zoneA}-${zoneB}`;
        const key2 = `${zoneB}-${zoneA}`;
        
        return zoneDistances[key1] || zoneDistances[key2] || 2500;
    }

    // Populate States Dropdowns
    function populateStates(selectElement) {
        const firstOption = selectElement.options[0];
        selectElement.innerHTML = '';
        selectElement.appendChild(firstOption);
        
        // Alphabetical sort of state names
        const sortedCodes = Object.keys(stateNames).sort((a, b) => stateNames[a].localeCompare(stateNames[b]));
        
        sortedCodes.forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = stateNames[code];
            selectElement.appendChild(option);
        });
    }

    populateStates(originStateSelect);
    populateStates(destStateSelect);

    // Setup State-Change Dependent Dropdown population
    function handleStateChange(stateSelect, locSelect) {
        stateSelect.addEventListener('change', () => {
            const state = stateSelect.value;
            if (!state) {
                locSelect.disabled = true;
                locSelect.innerHTML = '<option value="">Select State First</option>';
                return;
            }

            locSelect.disabled = false;
            locSelect.innerHTML = '<option value="">Select City / District</option>';

            let list = [];
            if (state === 'TS') {
                list = telanganaDistricts;
            } else if (state === 'AP') {
                list = apDistricts;
            } else if (defaultCities[state]) {
                list = defaultCities[state];
            }

            // Populate cities sorted alphabetically
            const sortedList = [...list].sort();
            sortedList.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                locSelect.appendChild(option);
            });
        });
    }

    handleStateChange(originStateSelect, originLocSelect);
    handleStateChange(destStateSelect, destLocSelect);

    // Handle Form Submit Calculation
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const origin = originStateSelect.value;
        const dest = destStateSelect.value;
        const originLoc = originLocSelect.value;
        const destLoc = destLocSelect.value;
        const weight = parseFloat(document.getElementById('calcWeight').value);
        const service = document.getElementById('calcService').value;

        if (!origin || !dest || !originLoc || !destLoc) {
            showToast('error', 'Please fill in both state and city/district coordinates.');
            return;
        }

        // Base route calculation matrix
        let distanceFactor = 3800; // standard fallback
        
        if (origin === dest) {
            if (originLoc === destLoc) {
                distanceFactor = 350; // Local delivery within same district
            } else {
                distanceFactor = 900; // Intrastate delivery between different districts
            }
        } else {
            // Check specific corridor matrices
            const routeKey = `${origin}-${dest}`;
            if (customCorridors[routeKey]) {
                distanceFactor = customCorridors[routeKey];
            } else {
                distanceFactor = getZoneDistance(origin, dest);
            }

            // Apply minor deterministic hash based on location names to make rates unique per city pair
            const hash = (originLoc.length + destLoc.length) * 12;
            distanceFactor += hash;
        }

        // Service category multiplier
        let serviceMultiplier = 1.0;
        let serviceName = '';
        let baseFlatCharge = 0;

        if (service === 'ftl') {
            serviceMultiplier = 1.0;
            serviceName = 'Full Truck Load (FTL)';
            baseFlatCharge = 12000;
        } else if (service === 'part-load') {
            serviceMultiplier = 0.8;
            serviceName = 'Part Load Transport';
            baseFlatCharge = 2500;
        } else if (service === 'express') {
            serviceMultiplier = 1.35;
            serviceName = 'Express Priority Delivery';
            baseFlatCharge = 6000;
        } else if (service === 'heavy') {
            serviceMultiplier = 1.6;
            serviceName = 'Industrial Heavy Cargo / Open Body';
            baseFlatCharge = 15000;
        }

        // Calculation equations
        const baseFreight = Math.floor((weight * distanceFactor * serviceMultiplier) + baseFlatCharge);
        const tollAndRto = Math.floor(distanceFactor * 0.28 + (weight * 120));
        const gstRate = 0.18; // 18% GST in India
        const gstAmount = Math.floor((baseFreight + tollAndRto) * gstRate);
        const grandTotal = baseFreight + tollAndRto + gstAmount;

        // Transit duration rules based on calculated distance factor
        let eta = '24 - 48 Hours';
        if (distanceFactor > 1200 && distanceFactor <= 2500) {
            eta = '48 - 72 Hours';
        } else if (distanceFactor > 2500 && distanceFactor <= 4000) {
            eta = '3 - 5 Business Days';
        } else if (distanceFactor > 4000) {
            eta = '5 - 7 Business Days';
        } else if (distanceFactor <= 400) {
            eta = 'Same Day Delivery';
        } else if (distanceFactor <= 950) {
            eta = 'Next Day Delivery';
        }

        // Visual rendering of breakdown details
        resultCard.innerHTML = `
            <div class="calc-results-panel">
                <h3>Estimated Billing Matrix</h3>
                <div class="calc-route-summary">
                    <span>Route: <strong>${originLoc}, ${origin} &rarr; ${destLoc}, ${dest}</strong></span>
                    <span>ETA: <strong class="text-accent">${eta}</strong></span>
                </div>
                
                <div class="calc-breakdown-list">
                    <div class="calc-breakdown-item">
                        <span>Base Freight Rate (${serviceName}):</span>
                        <strong>₹${baseFreight.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="calc-breakdown-item">
                        <span>State Tolls & RTO Clearances:</span>
                        <strong>₹${tollAndRto.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="calc-breakdown-item">
                        <span>GST / Service Tax (18%):</span>
                        <strong>₹${gstAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div class="calc-breakdown-item total-row">
                        <span>Total Estimated Cost:</span>
                        <strong>₹${grandTotal.toLocaleString('en-IN')}</strong>
                    </div>
                </div>

                <div class="calc-meta-notes">
                    <i class="fa-solid fa-circle-info"></i>
                    <p>Quotes are tentative estimations based on active state corridor rates. Toll rates and fuel multipliers may fluctuate slightly upon docket lock. GST is standard under SAC code 9965.</p>
                </div>

                <button class="btn btn-primary btn-block" id="calcBookBtn">
                    <i class="fa-solid fa-file-signature"></i> Book This Shipment Now
                </button>
            </div>
        `;

        // Attach listener for booking action to direct scroll and autofill
        const bookBtn = document.getElementById('calcBookBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Autofill contact form elements
                    const contactName = document.getElementById('contactName');
                    const contactService = document.getElementById('contactService');
                    const contactMessage = document.getElementById('contactMessage');

                    if (contactService) {
                        contactService.value = service;
                    }
                    if (contactMessage) {
                        contactMessage.value = `Hi ARC team, I would like to book a shipment from ${originLoc}, ${stateNames[origin]} to ${destLoc}, ${stateNames[dest]}. Estimated Load: ${weight} Tons of cargo under service category ${serviceName}. Please verify details and issue docket booking details.`;
                    }
                    showToast('success', 'Route coordinates copied to Inquiry form below! Add details to dispatch.');
                }
            });
        }
    });
}
