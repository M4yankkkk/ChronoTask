// API Configuration
export const API_CONFIG = {
  // Production backend URL
  BASE_URL: 'https://chronotask-1.onrender.com',
  
  // API endpoints
  AUTH: '/api/auth',
  TODOS: '/api/todos',
  HEALTH: '/api/health'
};

// Full API URLs
export const API_URLS = {
  AUTH: `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH}`,
  TODOS: `${API_CONFIG.BASE_URL}${API_CONFIG.TODOS}`,
  HEALTH: `${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH}`
};

// Axios instance configuration
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};
