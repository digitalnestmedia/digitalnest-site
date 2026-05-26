/* ==========================================================================
   DIGITALNEST | PREMIUM IMMERSIVE SPATIAL EXPERIENCE STUDIO
   VANILLA INTERACTION & MOTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initViewfinderCursor();
  initSpatialPanoramaViewer();
  initBeforeAfterSlider();
  initScrollObserver();
  initServicesDirectory();
  initExhibitionTabs();
  initHeaderThemeSwitcher();
  initContactForm();
});

/**
 * 1. Viewfinder Camera Cursor & Spotlight Track Loop
 */
function initViewfinderCursor() {
  const cursor = document.getElementById('viewfinder-cursor');
  const spotlight = document.getElementById('ambient-spotlight');

  if (!cursor) return;

  // Track raw mouse target positions
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Current interpolated values (Lerp variables)
  let currentX = mouseX;
  let currentY = mouseY;

  // Smooth lerp speed constant (0.15 gives a solid, premium weighted camera feel)
  const lerpFactor = 0.14;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct update of the spotlight variables to keep reactive ambient lighting perfectly under the cursor
    if (spotlight) {
      spotlight.style.setProperty('--mouse-x', `${mouseX}px`);
      spotlight.style.setProperty('--mouse-y', `${mouseY}px`);
    }

    // Update revolving backdrop parallax
    const revolvingBackdrop = document.querySelector('.hero-revolving-backdrop');
    if (revolvingBackdrop) {
      const backdropDriftX = (mouseX / window.innerWidth - 0.5) * -40; // Horizontal drift opposite to mouse
      const backdropDriftY = (mouseY / window.innerHeight - 0.5) * -15; // Vertical drift opposite to mouse
      revolvingBackdrop.style.setProperty('--drift-x', `${backdropDriftX}px`);
      revolvingBackdrop.style.setProperty('--drift-y', `${backdropDriftY}px`);
    }

    // Update spatial room drift variables for contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const driftX = (mouseX / window.innerWidth - 0.5) * 60; // Up to 30px translation left/right
      const driftY = (mouseY / window.innerHeight - 0.5) * 30; // Up to 15px translation up/down
      contactSection.style.setProperty('--drift-x', `${driftX}px`);
      contactSection.style.setProperty('--drift-y', `${driftY}px`);
    }
  });

  // Main animation frame loop for lag-interpolated cursor physics
  function updateCursorPhysics() {
    let dx = mouseX - currentX;
    let dy = mouseY - currentY;

    currentX += dx * lerpFactor;
    currentY += dy * lerpFactor;

    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;

    requestAnimationFrame(updateCursorPhysics);
  }
  updateCursorPhysics();

  // Handle active cursor hover transformations on links/buttons
  const interactableSelectors = 'a, button, input, select, textarea, .interactive-trigger';
  const interactables = document.querySelectorAll(interactableSelectors);

  interactables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
    });
  });

  // Track if mouse leaves viewport to fade cursor
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

/**
 * 2. Immersive 360° Panorama Pan Interaction on Portfolio Cards
 */
function initSpatialPanoramaViewer() {
  const viewports = document.querySelectorAll('.panorama-pan-container');

  viewports.forEach((viewport) => {
    const img = viewport.querySelector('.pan-image');
    if (!img) return;

    // Create a wrapping div for the infinite loop scroll
    const wrapper = document.createElement('div');
    wrapper.className = 'pan-image-wrapper';
    
    wrapper.style.display = 'flex';
    wrapper.style.height = '100%';
    wrapper.style.width = '400%';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.pointerEvents = 'none';

    // Clone the image to create the second seamless loop
    const imgClone = img.cloneNode(true);

    // Set both images to have width 50% of the wrapper (each equals 200% of container)
    img.style.width = '50%';
    img.style.position = 'relative';
    imgClone.style.width = '50%';
    imgClone.style.position = 'relative';

    // Insert wrapper and append both images
    viewport.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    wrapper.appendChild(imgClone);

    let isDragging = false;
    let startX = 0;
    let currentPanX = 0; // Start at leftmost edge (0px)

    // Reset/Align to leftmost position
    const initLeftPosition = () => {
      wrapper.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      wrapper.style.transform = 'translateX(0px)';
      currentPanX = 0;
    };

    // Initialize leftmost layout
    setTimeout(initLeftPosition, 100);
    
    window.addEventListener('resize', () => {
      initLeftPosition();
    });

    // Reset panning to leftmost when tabs are switched
    const tabBtns = document.querySelectorAll('.exhibit-node-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', initLeftPosition);
    });

    // Desktop mouse dragging support
    viewport.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      wrapper.style.transition = 'none'; // Instant responsive movement during active drag
      viewport.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = viewport.getBoundingClientRect();
      const deltaX = e.clientX - startX;
      startX = e.clientX;

      currentPanX += deltaX;
      
      const loopWidth = 2 * rect.width;
      
      // Infinite seamless wrap-around
      if (currentPanX > 0) {
        currentPanX -= loopWidth;
      } else if (currentPanX < -loopWidth) {
        currentPanX += loopWidth;
      }

      wrapper.style.transform = `translateX(${currentPanX}px)`;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = 'grab';
        wrapper.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });

    // Mobile touch drag panning support
    viewport.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      wrapper.style.transition = 'none';
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const rect = viewport.getBoundingClientRect();
      const deltaX = e.touches[0].clientX - startX;
      startX = e.touches[0].clientX;

      currentPanX += deltaX;
      
      const loopWidth = 2 * rect.width;
      
      // Infinite seamless wrap-around
      if (currentPanX > 0) {
        currentPanX -= loopWidth;
      } else if (currentPanX < -loopWidth) {
        currentPanX += loopWidth;
      }

      wrapper.style.transform = `translateX(${currentPanX}px)`;
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        wrapper.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    });
  });
}

/**
 * 3. Before & After Sliding Mechanism with Drag Coordinates mapping
 */
function initBeforeAfterSlider() {
  const container = document.querySelector('.slider-container');
  const beforeLayer = document.querySelector('.comparison-layer.before');
  const bar = document.querySelector('.slider-bar');
  const handle = document.querySelector('.slider-handle');

  if (!container || !beforeLayer || !bar || !handle) return;

  let isDragging = false;

  const moveSlider = (clientX) => {
    const rect = container.getBoundingClientRect();
    // Clamp coordinates inside the boundary box
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;

    // Apply widths and offsets dynamically
    beforeLayer.style.width = `${percentage}%`;
    bar.style.left = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  // Event handlers
  container.addEventListener('mousedown', () => {
    isDragging = true;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging) {
      // Allow tracking comparison without active click as well for smooth spatial control
      moveSlider(e.clientX);
    } else {
      moveSlider(e.clientX);
    }
  });

  // Touch handlers
  container.addEventListener('touchstart', () => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      moveSlider(e.touches[0].clientX);
    }
  }, { passive: true });
}

/**
 * 4. Cinematic Scroll Revel Observer (staggered editorial fade reveals)
 */
function initScrollObserver() {
  const revealElements = document.querySelectorAll('.reveal-block');

  const options = {
    root: null, // Viewport-relative
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px' // Trigger slightly before scrolling inside viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, options);

  revealElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * 5. Interactive Services Directory Switcher (viewfinder preview mapping)
 */
function initServicesDirectory() {
  const rows = document.querySelectorAll('.service-row');

  rows.forEach((row) => {
    const handleSwitch = () => {
      if (row.classList.contains('active')) return;

      const serviceNum = row.getAttribute('data-service');

      // Deactivate currently active row and image pane
      document.querySelectorAll('.service-row.active').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.service-pane-img.active').forEach(el => el.classList.remove('active'));

      // Activate selected elements
      row.classList.add('active');
      const activeImg = document.querySelector(`.service-pane-img[data-service="${serviceNum}"]`);
      if (activeImg) {
        activeImg.classList.add('active');
      }
    };

    row.addEventListener('mouseenter', handleSwitch);
    row.addEventListener('click', handleSwitch);
  });
}

/**
 * 6. Interactive Cinematic Portfolio Exhibition Selector Navigation
 */
function initExhibitionTabs() {
  const buttons = document.querySelectorAll('.exhibit-node-btn');

  buttons.forEach((btn) => {
    const handleSwitch = () => {
      if (btn.classList.contains('active')) return;

      const projectNum = btn.getAttribute('data-project');

      // Deactivate all active nav nodes, exhibit info sheets, and viewports
      document.querySelectorAll('.exhibit-node-btn.active').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.exhibit-info.active').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.viewport-item.active').forEach(el => el.classList.remove('active'));

      // Activate targeted navigation node
      btn.classList.add('active');

      // Activate targeted exhibit description
      const details = document.getElementById(`details-project-${projectNum}`);
      if (details) details.classList.add('active');

      // Activate targeted panoramic viewport and re-center
      const viewport = document.getElementById(`viewport-project-${projectNum}`);
      if (viewport) {
        viewport.classList.add('active');

        // Align to the leftmost of the 360 panorama viewport wrapper
        const wrapper = viewport.querySelector('.pan-image-wrapper');
        if (wrapper) {
          wrapper.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
          wrapper.style.transform = 'translateX(0px)';
        }
      }
    };

    btn.addEventListener('click', handleSwitch);
    btn.addEventListener('mouseenter', handleSwitch);
  });
}

/**
 * 7. Dynamic Header Theme Switcher (toggles dark-theme based on active section)
 */
function initHeaderThemeSwitcher() {
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  if (!header) return;

  const observerOptions = {
    root: null,
    // Trigger when a section occupies the top 80px of the viewport
    rootMargin: '-80px 0px -80% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const isDark = entry.target.id === 'portfolio' || entry.target.id === 'mid-cta';
        if (isDark) {
          header.classList.add('in-dark-section');
        } else {
          header.classList.remove('in-dark-section');
        }
      }
    });
  }, observerOptions);

  sections.forEach((sec) => {
    sectionObserver.observe(sec);
  });
}

/**
 * 8. Contact Form Handler — attempt EmailJS then fallback to mailto
 */
function initContactForm() {
  const form = document.getElementById('contact-form') || document.querySelector('.studio-form');
  if (!form) return;

  const statusEl = document.getElementById('contact-status');
  const submitBtn = form.querySelector('.btn-form-submit');

    // Configure these with values from your EmailJS dashboard (public key/user id, service id, template id)
    const EMAILJS_USER_ID = 'F7wq-DYlKYGmIWp0Y';
    const EMAILJS_SERVICE_ID = 'service_cqhbkds';
    // Two templates: owner notification and sender confirmation
    const EMAILJS_TEMPLATE_OWNER = 'template_b4ao3qr';
    const EMAILJS_TEMPLATE_SENDER = 'template_0okwyyq';

    // Diagnostics: inform developer in UI/console about EmailJS configuration
    if (statusEl) {
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || EMAILJS_TEMPLATE_OWNER === 'YOUR_TEMPLATE_ID') {
        statusEl.textContent = 'EmailJS not configured — replace IDs in script.js to enable direct send.';
        console.info('EmailJS placeholders present. Set EMAILJS_USER_ID, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OWNER, EMAILJS_TEMPLATE_SENDER in script.js');
      } else {
        statusEl.textContent = '';
        console.info('EmailJS IDs provided. Will use REST API to send emails.');
      }
    }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending…';

    const templateParams = {
      from_name: form.querySelector('[name="from_name"]')?.value || '',
      from_email: form.querySelector('[name="from_email"]')?.value || '',
      message: form.querySelector('[name="message"]')?.value || '',
      page: location.href,
    };

      const configured = EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_OWNER !== 'YOUR_TEMPLATE_ID';

      if (configured) {
        // Send owner notification first, then a confirmation to the sender
        const ownerPayload = {
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_OWNER,
          user_id: EMAILJS_USER_ID === 'YOUR_EMAILJS_USER_ID' ? undefined : EMAILJS_USER_ID,
          template_params: templateParams
        };

        console.log('Sending owner notification via EmailJS REST API...', ownerPayload);

        fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ownerPayload)
        })
          .then((res) => {
            if (!res.ok) return res.text().then(text => Promise.reject(new Error(text || res.statusText)));
            return res.json().catch(() => ({}));
          })
          .then(() => {
            console.log('Owner notification sent');
            // After owner notification succeeds, send confirmation to the submitter
            const senderParams = Object.assign({}, templateParams, { to_email: templateParams.from_email });
            const senderPayload = {
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_SENDER,
              user_id: EMAILJS_USER_ID === 'YOUR_EMAILJS_USER_ID' ? undefined : EMAILJS_USER_ID,
              template_params: senderParams
            };

            console.log('Sending sender confirmation via EmailJS REST API...', senderPayload);
            return fetch('https://api.emailjs.com/api/v1.0/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(senderPayload)
            });
          })
          .then((res) => {
            if (!res || !res.ok) {
              // If the previous then returned a fetch response, check it
              if (res && !res.ok) return res.text().then(text => Promise.reject(new Error(text || res.statusText)));
            }
            console.log('Sender confirmation sent (if configured)');
            if (statusEl) statusEl.textContent = 'Inquiry sent — thank you.';
            form.reset();
          })
          .catch((err) => {
            console.error('EmailJS REST error', err);
            if (statusEl) statusEl.textContent = 'Send failed. Opening email client as fallback.';
            setTimeout(() => fallbackMailto(templateParams), 700);
          })
          .finally(() => { if (submitBtn) submitBtn.disabled = false; });
      } else {
        console.log('EmailJS not configured — using mailto fallback', templateParams);
        if (statusEl) statusEl.textContent = 'Opening mail client...';
        fallbackMailto(templateParams);
        if (submitBtn) submitBtn.disabled = false;
      }
  });

  function fallbackMailto(params) {
    const subject = `Website Inquiry from ${params.from_name || 'Anonymous'}`;
    const body = `Name: ${params.from_name}\nEmail: ${params.from_email || ''}\n\nMessage:\n${params.message}\n\nPage: ${location.href}`;
    window.location.href = `mailto:digital@nest360.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

/**
 * 9. Premium Mobile Slide-Over Navigation Overlay Interaction
 */
function initMobileMenu() {
  const trigger = document.querySelector('.mobile-menu-trigger');
  const overlay = document.querySelector('.mobile-menu-overlay');
  const links = document.querySelectorAll('.mobile-nav-link');
  const inquireBtn = document.querySelector('.mobile-inquire-btn');

  if (!trigger || !overlay) return;

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains('active');
    if (isOpen) {
      overlay.classList.remove('active');
      trigger.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('active');
      trigger.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
  };

  trigger.addEventListener('click', toggleMenu);

  const closeBtn = document.querySelector('.mobile-menu-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleMenu);
  }

  // Close overlay on nav link selection
  links.forEach((link) => {
    link.addEventListener('click', () => {
      overlay.classList.remove('active');
      trigger.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close overlay on Inquire CTA selection
  if (inquireBtn) {
    inquireBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      trigger.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }
}
