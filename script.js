document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const mobileLinks = document.querySelectorAll('#mobile-menu a');
  const contactForm = document.querySelector('#contact-form');
  const formMessage = document.querySelector('#form-message');
  const addCartButtons = document.querySelectorAll('.add-cart');
  const cartCount = document.querySelector('#cart-count');
  const cartStatus = document.querySelector('#cart-status');
  const sellerPhone = '+917667346057';

  let cartTotal = 0;

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      menuToggle.classList.toggle('open');
    });
  }

  if (mobileLinks) {
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        subject: formData.get('subject') || 'New contact form message',
        message: formData.get('message') || ''
      };

      if (formMessage) {
        formMessage.textContent = 'Sending your message...';
        formMessage.style.color = '#fff';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/ranjeet12112003@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('Unable to send message');
        }

        contactForm.reset();

        if (formMessage) {
          formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
          formMessage.style.color = '#fff';
        }
      } catch (error) {
        if (formMessage) {
          formMessage.textContent = 'Sorry, your message could not be sent. Please try again later.';
          formMessage.style.color = '#ff6b6b';
        }
      }
    });
  }

  const cartButton = document.querySelector('#cart-info');
  const cartDropdown = document.querySelector('#cart-dropdown');
  const cartItemsList = document.querySelector('#cart-items-list');
  const cartEmpty = document.querySelector('#cart-empty');

  const cartItems = [];

  const renderCart = () => {
    if (!cartItemsList || !cartEmpty) return;
    cartItemsList.innerHTML = '';

    if (cartItems.length === 0) {
      cartEmpty.style.display = 'block';
      cartItemsList.style.display = 'none';
    } else {
      cartEmpty.style.display = 'none';
      cartItemsList.style.display = 'block';

      cartItems.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Rs.${item.price}`;
        cartItemsList.appendChild(li);
      });
    }
  };

  if (cartButton && cartDropdown) {
    cartButton.addEventListener('click', () => {
      cartDropdown.classList.toggle('visible');
    });

    document.addEventListener('click', (event) => {
      if (!cartDropdown.contains(event.target) && !cartButton.contains(event.target)) {
        cartDropdown.classList.remove('visible');
      }
    });
  }

  if (addCartButtons.length > 0 && cartCount) {
    addCartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const itemName = button.dataset.item || 'Menu item';
        const itemPrice = button.dataset.price || '0';
        cartItems.push({ name: itemName, price: itemPrice });
        cartTotal += 1;
        cartCount.textContent = cartTotal;

        if (cartStatus) {
          cartStatus.textContent = `${itemName} added to cart!`;
        }

        renderCart();

        const smsBody = encodeURIComponent(
          `New order request: ${itemName} at Rs.${itemPrice}. Please contact the customer to confirm.`
        );
        const smsUrl = `sms:${sellerPhone}?body=${smsBody}`;

        if (navigator.userAgent.match(/Mobi|Android|iPhone|iPad|iPod/i)) {
          window.location.href = smsUrl;
        } else {
          if (cartStatus) {
            cartStatus.textContent += ' (Open your phone to send SMS notification.)';
          }
        }
      });
    });
  }
});