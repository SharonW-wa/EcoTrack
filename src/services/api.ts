const API_URL = `http://${window.location.hostname}:5000/api`;

// Helper function to get auth token
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (fullName: string, email: string, phone: string, password: string) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone, password })
    }),

  getMe: () => fetchAPI('/auth/me'),

  getLeaderboard: () => fetchAPI('/leaderboard')
};

// Recycling Centers APIs
export const centersAPI = {
  getAll: () => fetchAPI('/recycling-centers'),
  
  getNearby: (lat: number, lng: number, radius?: number) =>
    fetchAPI(`/recycling-centers/nearby?lat=${lat}&lng=${lng}${radius ? `&radius=${radius}` : ''}`)
};

// Waste Categories APIs
export const wasteAPI = {
  getAll: () => fetchAPI('/waste-categories')
};

// Eco Quotes APIs
export const quotesAPI = {
  getAll: () => fetchAPI('/eco-quotes'),
  getRandom: () => fetchAPI('/eco-quotes/random')
};

// Feedback APIs
export const feedbackAPI = {
  getAll: () => fetchAPI('/feedback'),
  
  submit: (type: string, message: string, rating: number) =>
    fetchAPI('/feedback', {
      method: 'POST',
      body: JSON.stringify({ type, message, rating })
    })
};

// Rewards APIs
export const rewardsAPI = {
  getAll: () => fetchAPI('/rewards'),
  
  recordRecycling: (wasteType: string, quantity: number, centerId: string) =>
    fetchAPI('/rewards/recycle', {
      method: 'POST',
      body: JSON.stringify({ wasteType, quantity, centerId })
    }),
  
  redeemPoints: (points: number, rewardType: string) =>
    fetchAPI('/rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ points, rewardType })
    })
};

// Stats APIs
export const statsAPI = {
  getAll: () => fetchAPI('/stats')
};

export default {
  auth: authAPI,
  centers: centersAPI,
  waste: wasteAPI,
  quotes: quotesAPI,
  feedback: feedbackAPI,
  rewards: rewardsAPI,
  stats: statsAPI
};
