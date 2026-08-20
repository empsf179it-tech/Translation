document.addEventListener('DOMContentLoaded', () => {

  // Custom Cursor
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    const interactables = document.querySelectorAll('a, button, input, select, textarea, .industry-nav-item');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // Sticky Navbar & Active States
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Navbar Shrink
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Parallax Effects (Optional minimal implementation for background grid)
    const bgGrid = document.querySelector('.bg-grid');
    if (bgGrid) {
      const scrollVal = window.scrollY * 0.2;
      bgGrid.style.transform = `perspective(500px) rotateX(60deg) translateY(${scrollVal}px) translateZ(-200px)`;
    }
  });

  // Mobile Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isExpanded 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }

  // Scroll Animations via Intersection Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion, just show them immediately
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Interactive Industry Selector (Home & Industries page)
  const industryTabs = document.querySelectorAll('.industry-nav-item');
  const industryPanels = document.querySelectorAll('.industry-panel');

  if (industryTabs.length > 0 && industryPanels.length > 0) {
    industryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        
        // Remove active class from all tabs and panels
        industryTabs.forEach(t => t.classList.remove('active'));
        industryPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding panel
        tab.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // Form Validation (Contact & Home Quote Form)
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = quoteForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
          field.classList.add('is-invalid');
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        // Show success message
        const successMsg = document.getElementById('formSuccessMessage');
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        
        if (successMsg) successMsg.style.display = 'block';
        if (submitBtn) {
          submitBtn.innerHTML = 'Request Sent!';
          submitBtn.style.background = 'var(--accent-turquoise)';
          submitBtn.disabled = true;
        }
        
        quoteForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (successMsg) successMsg.style.display = 'none';
          if (submitBtn) {
            submitBtn.innerHTML = 'Request a Free Quote';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }
        }, 5000);
      }
    });

    // Remove validation error on input
    const inputs = quoteForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });
  }

});

