document.addEventListener('DOMContentLoaded', () => {
  /* ----------------------------------------------------
     1. Sticky Header
  ---------------------------------------------------- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ----------------------------------------------------
     2. Mobile Menu Toggle
  ---------------------------------------------------- */
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isExpanded ? '' : 'hidden'; 
    });
  }

  /* ----------------------------------------------------
     3. Mobile Accordions
  ---------------------------------------------------- */
  const accordionToggles = document.querySelectorAll('.accordion-toggle');
  accordionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if(targetContent) {
        const isOpen = targetContent.classList.contains('open');
        document.querySelectorAll('.mobile-accordion').forEach(acc => acc.classList.remove('open'));
        if(!isOpen) {
          targetContent.classList.add('open');
        }
      }
    });
  });

  /* ----------------------------------------------------
     4. Tab Navigation Logic for Module Tour
  ---------------------------------------------------- */
  const tabs = document.querySelectorAll('.tour-tab');
  const panels = document.querySelectorAll('.tour-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states from all tabs and panels
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      // Set active state to clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Show corresponding panel
      const targetPanelId = `panel-${tab.dataset.tab}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ----------------------------------------------------
     5. Scroll Fade-in Animations (IntersectionObserver)
  ---------------------------------------------------- */
  const fadeElements = document.querySelectorAll('.problem-card, .arch-card, .comparison-row, .tour-panels, .section-header');

  // Add initial fade-in class
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const fadeObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });

  /* ----------------------------------------------------
     6. Smooth Scroll for Anchor Links
  ---------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if(this.getAttribute('href') !== '#') {
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileToggle.click();
          }

          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ----------------------------------------------------
     7. Demo Modal & Form Logic
  ---------------------------------------------------- */
  const modal = document.getElementById('demo-modal');
  const demoTriggers = document.querySelectorAll('.demo-trigger');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
  const demoForm = document.getElementById('demo-form');
  const formSuccess = document.getElementById('form-success');

  if (modal) {
    demoTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    modalCloseBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      let isValid = true;
      const inputs = demoForm.querySelectorAll('input[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (isValid) {
        demoForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
        
        // Reset form after a delay for next open
        setTimeout(() => {
          demoForm.reset();
          demoForm.style.display = 'block';
          if (formSuccess) formSuccess.style.display = 'none';
        }, 5000);
      }
    });

    // Remove error class on input
    demoForm.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }
});
