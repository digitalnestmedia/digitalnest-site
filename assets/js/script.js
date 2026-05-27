/* ==========================================================================
   DIGITALNEST | PREMIUM IMMERSIVE SPATIAL EXPERIENCE STUDIO
   VANILLA INTERACTION & MOTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initViewfinderCursor();
  initScrollObserver();
  initServicesDirectory();
  initExhibitionTabs();
  initHeaderThemeSwitcher();
  initContactForm();
  initExternalLinks();
  initIframeShields();
});

function initViewfinderCursor() {
  const cursor = document.getElementById('viewfinder-cursor');
  const spotlight = document.getElementById('ambient-spotlight');

  if (!cursor) return;

  // Cache elements outside event listener to prevent high-frequency DOM querying
  const revolvingBackdrop = document.querySelector('.hero-revolving-backdrop');
  const contactSection = document.getElementById('contact');

  // Initialize cursor position at the center
  const initialX = window.innerWidth / 2;
  const initialY = window.innerHeight / 2;
  const padding = 22; // Half of cursor width/height (44px / 2)
  cursor.style.transform = `translate3d(${Math.max(padding, Math.min(initialX, window.innerWidth - padding))}px, ${Math.max(padding, Math.min(initialY, window.innerHeight - padding))}px, 0)`;

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Direct, zero-delay positioning of custom cursor on the GPU
    const clampedX = Math.max(padding, Math.min(mouseX, window.innerWidth - padding));
    const clampedY = Math.max(padding, Math.min(mouseY, window.innerHeight - padding));
    cursor.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;

    // Direct update of the spotlight variables to keep reactive ambient lighting perfectly under the cursor
    if (spotlight) {
      spotlight.style.setProperty('--mouse-x', `${mouseX}px`);
      spotlight.style.setProperty('--mouse-y', `${mouseY}px`);
    }

    // Update revolving backdrop parallax
    if (revolvingBackdrop) {
      const backdropDriftX = (mouseX / window.innerWidth - 0.5) * -40; // Horizontal drift opposite to mouse
      const backdropDriftY = (mouseY / window.innerHeight - 0.5) * -15; // Vertical drift opposite to mouse
      revolvingBackdrop.style.setProperty('--drift-x', `${backdropDriftX}px`);
      revolvingBackdrop.style.setProperty('--drift-y', `${backdropDriftY}px`);
    }

    // Update spatial room drift variables for contact section
    if (contactSection) {
      const driftX = (mouseX / window.innerWidth - 0.5) * 60; // Up to 30px translation left/right
      const driftY = (mouseY / window.innerHeight - 0.5) * 30; // Up to 15px translation up/down
      contactSection.style.setProperty('--drift-x', `${driftX}px`);
      contactSection.style.setProperty('--drift-y', `${driftY}px`);
    }
  });

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
    cursor.style.opacity = '0.35'; // Dim instead of hiding completely to prevent edge confusion
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
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

/**
 * 10. Premium Dynamic Link Target Controller
 * Ensures all external & action hyperlinks open in a new browser tab with strict security attributes
 */
function initExternalLinks() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    // Open all non-anchor, non-javascript action URLs in a new tab
    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && href !== '') {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/**
 * 11. Premium Google Maps streetview iframe activation shield
 * Solves viewport hijacks and enables perfect cursor/scroll tracking
 */
function initIframeShields() {
  const containers = document.querySelectorAll('.iframe-embed-container');
  const modal = document.getElementById('spatial-tour-modal');
  const modalIframe = modal ? modal.querySelector('.modal-iframe') : null;
  const modalLabel = modal ? modal.querySelector('.modal-label') : null;
  const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;

  containers.forEach(container => {
    const shield = container.querySelector('.iframe-interaction-shield');
    const embedUrl = container.getAttribute('data-src');
    const label = container.closest('.viewport-item').querySelector('.chrome-label')?.textContent;

    if (!shield || !embedUrl) return;

    // Launch widescreen modal and inject URL dynamically on-demand
    shield.addEventListener('click', () => {
      if (modal && modalIframe) {
        modalIframe.setAttribute('src', embedUrl);
        if (modalLabel && label) {
          modalLabel.textContent = `Spatial Exhibition / ${label}`;
        }
        modal.classList.add('active-modal');
        modal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  // Handle close
  if (modal && closeBtn) {
    const closeModal = () => {
      modal.classList.remove('active-modal');
      modal.setAttribute('aria-hidden', 'true');
      if (modalIframe) {
        modalIframe.setAttribute('src', '');
      }
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}
