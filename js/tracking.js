/**
 * ==========================================================================
 * AMMA ROAD CARRIERS - LIVE SHIPMENT SIMULATOR
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTrackingSimulator();
});

function initTrackingSimulator() {
    const trackingForm = document.getElementById('trackingForm');
    const trackingIdInput = document.getElementById('trackingIdInput');
    const resultPlaceholder = document.getElementById('trackingResultPlaceholder');
    const trackButton = document.getElementById('trackButton');

    if (!trackingForm || !trackingIdInput || !resultPlaceholder) return;

    // Direct Predefined shipment datas mapping
    const predefinedShipments = {
        'AMMA-786': {
            status: 'In Transit',
            percentage: 50,
            activeStep: 2, // 0-indexed, meaning step 3 is active (Reached Hub)
            origin: 'Mumbai, MH',
            destination: 'Delhi, NCR',
            eta: 'May 27, 2026',
            timeline: [
                {
                    title: 'Reached Hub (Vapi Terminal)',
                    location: 'Vapi, Gujarat Hub',
                    date: 'May 25, 2026',
                    time: '10:30 AM',
                    desc: 'Vehicle reached the Vapi state-border consolidation center. Cargo undergoing brief route reassignment check.',
                    highlighted: true
                },
                {
                    title: 'In Transit (State Highway Link)',
                    location: 'Enroute (Vashi to Vapi)',
                    date: 'May 24, 2026',
                    time: '02:15 PM',
                    desc: 'Docket dispatched in Closed Container Truck #MH-43-Y-7822. Driver squad assigned (K. Singh & M. Pal).',
                    highlighted: false
                },
                {
                    title: 'Order Confirmed & Sealed',
                    location: 'Vashi Terminal, Navi Mumbai',
                    date: 'May 24, 2026',
                    time: '09:00 AM',
                    desc: 'Commercial cargo weighed, verified, and sealed securely inside our 14-feet container.',
                    highlighted: false
                }
            ]
        },
        'AMMA-FAST': {
            status: 'Out for Delivery',
            percentage: 75,
            activeStep: 3, // step 4 is active (Out for Delivery)
            origin: 'Chennai, TN',
            destination: 'Bangalore, KA',
            eta: 'TODAY (Within 2 Hours)',
            timeline: [
                {
                    title: 'Out for Delivery (Express Transit)',
                    location: 'Whitefield Hub, Bangalore',
                    date: 'May 25, 2026',
                    time: '12:45 PM',
                    desc: 'Cargo loaded onto last-mile delivery vehicle. Assigned to Driver Amit Kumar (+91 99887 76655) for direct handover.',
                    highlighted: true
                },
                {
                    title: 'Reached Regional Hub',
                    location: 'Hosur Road Terminal, Bangalore',
                    date: 'May 25, 2026',
                    time: '08:30 AM',
                    desc: 'Interstate vehicle successfully cleared checkposts and docked at Bangalore main unloading terminal.',
                    highlighted: false
                },
                {
                    title: 'In Transit (Double-Driver Express)',
                    location: 'National Highway 44',
                    date: 'May 24, 2026',
                    time: '05:00 AM',
                    desc: 'Express overnight double-driver truck in transit. Average speed maintained: 65 km/h.',
                    highlighted: false
                },
                {
                    title: 'Order Confirmed (Priority Express)',
                    location: 'Vashi Main Hub, Mumbai',
                    date: 'May 23, 2026',
                    time: '04:00 PM',
                    desc: 'Consignment marked priority express cargo and processed for immediate loading queues.',
                    highlighted: false
                }
            ]
        },
        'AMMA-2026': {
            status: 'Delivered',
            percentage: 100,
            activeStep: 4, // All steps completed
            origin: 'Nagpur, MH',
            destination: 'Hyderabad, TS',
            eta: 'Delivered Successfully',
            timeline: [
                {
                    title: 'Cargo Delivered & Signed',
                    location: 'Hitech City Corporate Office, Hyderabad',
                    date: 'May 25, 2026',
                    time: '09:15 AM',
                    desc: 'Consignment successfully delivered to endpoint office. Handover signature captured by Receiver (K. R. Rao).',
                    highlighted: true
                },
                {
                    title: 'Out for Delivery',
                    location: 'Secunderabad Terminal, Hyderabad',
                    date: 'May 25, 2026',
                    time: '07:30 AM',
                    desc: 'Assigned to Driver Sandeep Yadav for local commercial office area drops.',
                    highlighted: false
                },
                {
                    title: 'Reached Hub (Unloading)',
                    location: 'Secunderabad Terminal, Hyderabad',
                    date: 'May 24, 2026',
                    time: '11:30 AM',
                    desc: 'Main highway vehicle docked and unloaded at the Secunderabad cargo sorting bay.',
                    highlighted: false
                },
                {
                    title: 'In Transit (National Highway Route)',
                    location: 'National Highway 74',
                    date: 'May 23, 2026',
                    time: '09:00 PM',
                    desc: 'State highway dispatch enroute to Telangana state gateways.',
                    highlighted: false
                },
                {
                    title: 'Order Confirmed & Processed',
                    location: 'Nagpur Terminal Hub',
                    date: 'May 23, 2026',
                    time: '11:00 AM',
                    desc: 'Industrial cargo packaged securely on pallets and verified against docket codes.',
                    highlighted: false
                }
            ]
        }
    };

    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let docketId = trackingIdInput.value.trim().toUpperCase();
        if (!docketId) return;

        // Visual feedback button loader
        const originalText = trackButton.innerHTML;
        trackButton.disabled = true;
        trackButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';

        setTimeout(() => {
            renderTrackingResult(docketId);
            trackButton.disabled = false;
            trackButton.innerHTML = originalText;
            
            // Trigger auto-scroll smoothly to result if visible
            const resultBox = document.getElementById('activeTrackingResult');
            if (resultBox) {
                resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 1200); // 1.2 second fake lookup delay
    });

    function renderTrackingResult(docketId) {
        let shipmentData = predefinedShipments[docketId];

        // If not predefined, generate a procedural random shipment to prove frontend robustness
        if (!shipmentData) {
            shipmentData = generateProceduralShipment(docketId);
        }

        const steps = ['Confirmed', 'In Transit', 'Reached Hub', 'Out for Delivery', 'Delivered'];
        
        // Progress step nodes generator
        const nodesHTML = steps.map((step, idx) => {
            let stateClass = '';
            let iconHTML = `<i class="fa-solid fa-check"></i>`;
            
            if (idx < shipmentData.activeStep) {
                stateClass = 'completed';
            } else if (idx === shipmentData.activeStep) {
                stateClass = 'active';
                if (shipmentData.status === 'Delivered') {
                    stateClass = 'completed';
                } else {
                    iconHTML = `<i class="fa-solid fa-truck-fast fa-fade"></i>`;
                }
            }

            return `
                <div class="step-node ${stateClass}">
                    <div class="step-circle">${iconHTML}</div>
                    <span class="step-label">${step}</span>
                </div>
            `;
        }).join('');

        // Logs generator
        const logsHTML = shipmentData.timeline.map(log => `
            <div class="timeline-log-card ${log.highlighted ? 'highlighted' : ''}">
                <div class="log-time">
                    <span class="date">${log.date}</span>
                    <span class="time">${log.time}</span>
                </div>
                <div class="log-marker">
                    <i class="fa-solid ${log.highlighted ? 'fa-location-dot' : 'fa-circle-dot'}"></i>
                </div>
                <div class="log-details">
                    <h4>${log.title}</h4>
                    <p class="location"><i class="fa-solid fa-location-arrow"></i> <strong>Location:</strong> ${log.location}</p>
                    <p>${log.desc}</p>
                </div>
            </div>
        `).join('');

        // Full component composition
        resultPlaceholder.innerHTML = `
            <div class="tracking-result-active" id="activeTrackingResult">
                <div class="tracking-meta-summary">
                    <span>Docket: <strong>${docketId}</strong></span>
                    <span>Status: <strong class="text-accent">${shipmentData.status}</strong></span>
                    <span>ETA: <strong>${shipmentData.eta}</strong></span>
                </div>

                <!-- Stepper Progress -->
                <div class="progress-stepper">
                    <div class="progress-line-fill" id="trackingProgressFill"></div>
                    ${nodesHTML}
                </div>

                <!-- Timeline Logs -->
                <div class="timeline-logs">
                    ${logsHTML}
                </div>
            </div>
        `;

        // Animate progress bar fill width asynchronously after insertion
        setTimeout(() => {
            const fill = document.getElementById('trackingProgressFill');
            if (fill) {
                fill.style.width = `${shipmentData.percentage}%`;
            }
        }, 100);
    }

    // Procedurally generated realistic mock data for unknown/random inputs
    function generateProceduralShipment(docketId) {
        // Derive variables procedurally from the length of docketId to keep it consistent upon re-queries
        const seed = docketId.length;
        const locations = ['Nagpur Main Bay', 'Indore Hub', 'Ahmedabad Yard', 'Jaipur Crossing', 'Kolkata Sector 5'];
        const mockLocation = locations[seed % locations.length];
        
        return {
            status: 'Order Confirmed',
            percentage: 5,
            activeStep: 0,
            origin: 'Vashi Hub, Mumbai',
            destination: 'Direct Endpoint Gateways',
            eta: 'May 30, 2026',
            timeline: [
                {
                    title: 'Docket Issued & Cargo Confirmed',
                    location: 'ARC Hub, Navi Mumbai',
                    date: 'May 25, 2026',
                    time: '11:00 AM',
                    desc: `Docket docket verified under invoice ARC-${seed}991. Consignment undergoing visual packaging and weight check before dispatcher sealing.`,
                    highlighted: true
                }
            ]
        };
    }
}
