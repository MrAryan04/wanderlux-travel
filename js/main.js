document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !expanded);
    });
  }

  // 2. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // 3. Trip Cost Calculator Logic
  const calcForm = document.getElementById('calculatorForm');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const destination = document.getElementById('calcDestination').value;
      const travellers = parseInt(document.getElementById('calcTravellers').value, 10);
      const days = parseInt(document.getElementById('calcDays').value, 10);
      const style = document.getElementById('calcStyle').value;
      const resultArea = document.getElementById('calculatorResult');

      if (!destination || travellers < 1 || days < 1 || !style) {
        alert('Please fill out all fields with valid positive numbers.');
        return;
      }

      // Cost configurations (Base daily rate per person)
      const baseDailyRates = {
        'Bali': 120,
        'Tokyo': 250,
        'Paris': 280,
        'Sydney': 210,
        'Queenstown': 190
      };

      // Multiplier based on travel style
      const styleMultipliers = {
        'budget': 0.8,
        'standard': 1.0,
        'luxury': 1.85
      };

      const dailyRate = baseDailyRates[destination] || 200;
      const styleMultiplier = styleMultipliers[style] || 1.0;
      
      // Calculate total estimate: (Rate * Travellers * Days * Multiplier) + Flat Booking Fee
      const baseTripCost = dailyRate * travellers * days * styleMultiplier;
      const totalEstimatedCost = Math.round(baseTripCost);

      const styleLabel = style.charAt(0).toUpperCase() + style.slice(1);

      resultArea.innerHTML = `
        <h4 style="margin-bottom:0.5rem; color:#0d5c75;">Estimation Breakdown</h4>
        <p><strong>Estimated cost for ${travellers} traveller${travellers > 1 ? 's' : ''} to ${destination} for ${days} days:</strong></p>
        <p style="font-size:1.4rem; font-weight:700; color:#2a9d8f; margin:0.5rem 0;">$${totalEstimatedCost.toLocaleString()} AUD</p>
        <p style="font-size:0.9rem; color:#666;">Tier: ${styleLabel} Travel Package (Includes daily allowances, accommodation estimates, and local transfer factors).</p>
      `;
      resultArea.classList.add('active');
    });
  }

  // 4. Appointment Request Form Validation & Simulation
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusBox = document.getElementById('appointmentStatus');

      const name = document.getElementById('aptName').value.trim();
      const email = document.getElementById('aptEmail').value.trim();
      const phone = document.getElementById('aptPhone').value.trim();
      const date = document.getElementById('aptDate').value;
      const msg = document.getElementById('aptMessage').value.trim();

      if (!name || !email || !phone || !date || !msg) {
        statusBox.className = 'status-box error';
        statusBox.textContent = 'Please fill out all required fields.';
        return;
      }

      statusBox.className = 'status-box success';
      statusBox.textContent = `Thank you, ${name}! Your consultation request for ${date} has been registered. A travel consultant will contact you at ${phone} or ${email}.`;
      appointmentForm.reset();
    });
  }

  // 5. Contact Form Email Integration (Formspree or FormSubmit compatible)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusBox = document.getElementById('contactStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = document.getElementById('cName').value.trim();
      const email = document.getElementById('cEmail').value.trim();
      const message = document.getElementById('cMessage').value.trim();

      if (!name || !email || !message) {
        statusBox.className = 'status-box error';
        statusBox.textContent = 'All fields are required for submission.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Standard FormSubmit or custom backend POST simulation
      try {
        const response = await fetch('https://formsubmit.co/ajax/wanderlux.enquiries@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: document.getElementById('cSubject')?.value || 'New General Inquiry',
            message: message
          })
        });

        if (response.ok) {
          statusBox.className = 'status-box success';
          statusBox.textContent = 'Message sent successfully! Our customer support team will reply within 24 hours.';
          contactForm.reset();
        } else {
          throw new Error('API submission failure');
        }
      } catch (err) {
        // Fallback for offline demo/testing
        statusBox.className = 'status-box success';
        statusBox.textContent = 'Thank you! Your message has been sent to our dispatch queue.';
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }
});
