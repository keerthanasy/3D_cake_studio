// Google Analytics Helper
// To use: Add your GA4 Measurement ID to .env as VITE_GA_ID

export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_ID;
  
  if (!gaId) {
    console.warn('Google Analytics ID not found. Skipping analytics initialization.');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Initialize GA
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', gaId);
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track page views
export const trackPageView = (pagePath) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_ID, {
      page_path: pagePath,
    });
  }
};

// Predefined event trackers for your app
export const analytics = {
  // Track when user customizes cake
  trackCakeCustomization: (property, value) => {
    trackEvent('cake_customization', {
      property,
      value,
    });
  },
  
  // Track when user places order
  trackOrderPlaced: (price, config) => {
    trackEvent('order_placed', {
      value: price,
      currency: 'USD',
      items: [{
        item_name: 'Custom Cake',
        price: price,
      }],
    });
  },
  
  // Track topping selections
  trackToppingAdded: (toppingId) => {
    trackEvent('topping_added', {
      topping_id: toppingId,
    });
  },
};
