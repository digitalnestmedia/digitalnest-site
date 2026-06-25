/* ==========================================================================
   DIGITALNEST | PORTFOLIO ARCHIVE CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPortfolioFilters();
  initPortfolioModal();
});

/**
 * 1. Category Filtering with Smooth Animations
 */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length === 0 || portfolioItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          // Temporarily keep block, start fade-in
          item.classList.remove('filtered-out');
          
          // Re-trigger reveal block animations
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Fade-out and scale-down
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          // Hide from DOM layout after transition completes (500ms)
          setTimeout(() => {
            if (btn.getAttribute('data-filter') === filterValue) {
              item.classList.add('filtered-out');
            }
          }, 450);
        }
      });
    });
  });
}

/**
 * 2. Dedicated Modal Loader for Customized Virtual Tours
 */
function initPortfolioModal() {
  const modal = document.getElementById('spatial-tour-modal');
  const modalIframe = modal ? modal.querySelector('.modal-iframe') : null;
  const modalLabel = modal ? modal.querySelector('.modal-label') : null;
  const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;

  if (!modal || !modalIframe) return;

  // Select all interactive launchers
  const launchers = document.querySelectorAll('.btn-open-tour, .card-viewport-shield');

  launchers.forEach(launcher => {
    launcher.addEventListener('click', (e) => {
      e.preventDefault();

      let embedUrl = launcher.getAttribute('data-src');
      let title = launcher.getAttribute('data-title');
      
      const card = launcher.closest('.portfolio-item');
      if (!card) return;

      const categoryLabel = card.querySelector('.card-category')?.textContent || 'Spatial';

      // Fallback if launcher doesn't hold data attributes directly
      if (!embedUrl) {
        const primaryBtn = card.querySelector('.btn-card-primary');
        if (primaryBtn) {
          embedUrl = primaryBtn.getAttribute('data-src');
          title = primaryBtn.getAttribute('data-title');
        }
      }

      if (!embedUrl) return;

      // Inject details, show modal
      modalIframe.setAttribute('src', embedUrl);
      if (modalLabel && title) {
        modalLabel.textContent = `${categoryLabel} Exhibition / ${title}`;
      }

      const fullscreenBtn = modal.querySelector('.modal-fullscreen-btn');
      if (fullscreenBtn) {
        fullscreenBtn.setAttribute('href', getDirectMapsUrl(embedUrl));
      }

      modal.classList.add('active-modal');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  // Handle Close Action
  if (closeBtn) {
    const closeModal = () => {
      modal.classList.remove('active-modal');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
      if (modalIframe) {
        modalIframe.setAttribute('src', '');
      }
      const fullscreenBtn = modal.querySelector('.modal-fullscreen-btn');
      if (fullscreenBtn) {
        fullscreenBtn.setAttribute('href', '#');
      }
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active-modal')) {
        closeModal();
      }
    });
  }
}

/**
 * Parses a Google Maps embed URL and returns the direct Google Maps page URL.
 */
function getDirectMapsUrl(embedUrl) {
  if (!embedUrl || !embedUrl.includes('google.com/maps')) {
    return embedUrl;
  }
  
  // 1. Street View / Pano embed (contains !6m8!1m7!1s)
  if (embedUrl.includes('!6m8') && embedUrl.includes('!1s')) {
    try {
      const panoMatch = embedUrl.match(/!1s([^!]+)/);
      const latMatch = embedUrl.match(/!1d([^!]+)/);
      const lngMatch = embedUrl.match(/!2d([^!]+)/);
      const headingMatch = embedUrl.match(/!3f([^!]+)/);
      const pitchMatch = embedUrl.match(/!4f([^!]+)/);
      
      if (panoMatch && latMatch && lngMatch) {
        const pano = panoMatch[1];
        const lat = latMatch[1];
        const lng = lngMatch[1];
        let directUrl = `https://www.google.com/maps/@?api=1&map_action=pano&pano=${pano}&viewpoint=${lat},${lng}`;
        if (headingMatch) {
          directUrl += `&heading=${headingMatch[1]}`;
        }
        if (pitchMatch) {
          directUrl += `&pitch=${pitchMatch[1]}`;
        }
        return directUrl;
      }
    } catch (e) {
      console.error('Error parsing Street View embed URL:', e);
    }
  }
  
  // 2. Search / Place embed (contains !2s followed by place name/query)
  if (embedUrl.includes('!2s')) {
    try {
      const queryMatch = embedUrl.match(/!2s([^!]+)/);
      if (queryMatch) {
        const queryName = decodeURIComponent(queryMatch[1].replace(/\+/g, ' '));
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`;
      }
    } catch (e) {
      console.error('Error parsing Place embed URL:', e);
    }
  }

  return embedUrl;
}
