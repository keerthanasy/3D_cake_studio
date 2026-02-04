// Environment configuration
const ENV = {
  development: {
    API_URL: 'http://localhost:5000',
  },
  production: {
    API_URL: import.meta.env.VITE_API_URL || 'https://your-backend-url.com', // Update this!
  }
};

const currentEnv = import.meta.env.MODE || 'development';

export const config = ENV[currentEnv];

// Helper function to get API endpoint
export const getApiUrl = (endpoint) => {
  return `${config.API_URL}${endpoint}`;
};
