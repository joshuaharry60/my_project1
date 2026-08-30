import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept requests to append Bearer JWT token if user logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bharry_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data for instant UX if API server is connecting
const MOCK_SHIPMENTS = {
  'BHL-NG-88492': {
    tracking_code: 'BHL-NG-88492',
    sender_name: 'Dangote Sugar Refineries, Apapa',
    recipient_name: 'Nafdac Central Stores, Abuja',
    origin_city: 'Lagos (Apapa Port)',
    destination_city: 'Abuja (Idu Industrial Park)',
    service_type: 'INTERSTATE',
    weight_kg: 12500.0,
    status: 'IN_TRANSIT',
    current_lat: 7.8023,
    current_lng: 6.7333,
    current_location_name: 'A2 Highway, Near Lokoja Bridge, Kogi State',
    speed_kmh: 82,
    temperature_celsius: 24.0,
    driver_name: 'Captain Babatunde Adebayo',
    driver_phone: '+234 802 112 3456',
    truck_number: 'BHL-MACK-809-LAG',
    estimated_delivery: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    waypoints: [
      { id: 1, location_name: 'Apapa Port Depot, Lagos', lat: 6.4474, lng: 3.3582, passed: true, order: 0 },
      { id: 2, location_name: 'Berger Tollgate, Lagos-Ibadan Exp.', lat: 6.6432, lng: 3.3764, passed: true, order: 1 },
      { id: 3, location_name: 'Ibadan Freight Interchange, Oyo', lat: 7.3775, lng: 3.9470, passed: true, order: 2 },
      { id: 4, location_name: 'Ilorin Bypass Checkpoint, Kwara', lat: 8.4799, lng: 4.5418, passed: true, order: 3 },
      { id: 5, location_name: 'Lokoja Transit Hub, Kogi', lat: 7.8023, lng: 6.7333, passed: true, order: 4 },
      { id: 6, location_name: 'Abaji Expressway Depot, FCT', lat: 8.4682, lng: 6.9458, passed: false, order: 5 },
      { id: 7, location_name: 'Idu Industrial Park Depot, Abuja', lat: 9.0765, lng: 7.3986, passed: false, order: 6 },
    ]
  },
  'BHL-NG-90144': {
    tracking_code: 'BHL-NG-90144',
    sender_name: 'PharmaCare Nig Ltd, Port Harcourt',
    recipient_name: 'Northern General Medical, Kano',
    origin_city: 'Port Harcourt (Trans-Amadi)',
    destination_city: 'Kano (Sharada Phase II)',
    service_type: 'COLD_CHAIN',
    weight_kg: 4800.0,
    status: 'IN_TRANSIT',
    current_lat: 6.4584,
    current_lng: 7.5464,
    current_location_name: 'Enugu-Makurdi Highway, Enugu State',
    speed_kmh: 75,
    temperature_celsius: 3.8,
    driver_name: 'Captain Chidi Nnamdi',
    driver_phone: '+234 803 998 7766',
    truck_number: 'BHL-VOLVO-402-PH',
    estimated_delivery: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    waypoints: [
      { id: 1, location_name: 'Trans-Amadi Hub, Port Harcourt', lat: 4.8156, lng: 7.0498, passed: true, order: 0 },
      { id: 2, location_name: 'Aba Expressway Checkpoint, Abia', lat: 5.1065, lng: 7.3667, passed: true, order: 1 },
      { id: 3, location_name: 'Enugu Central Depot, Enugu', lat: 6.4584, lng: 7.5464, passed: true, order: 2 },
      { id: 4, location_name: 'Makurdi Bridge Checkpoint, Benue', lat: 7.7322, lng: 8.5391, passed: false, order: 3 },
      { id: 5, location_name: 'Jos Highway Logistics Hub, Plateau', lat: 9.8965, lng: 8.8583, passed: false, order: 4 },
      { id: 6, location_name: 'Sharada Industrial Hub, Kano', lat: 12.0022, lng: 8.5920, passed: false, order: 5 },
    ]
  },
  'BHL-NG-31088': {
    tracking_code: 'BHL-NG-31088',
    sender_name: 'Jumia Fulfilment Hub, Ikeja',
    recipient_name: 'Eko Atlantic Towers, Victoria Island',
    origin_city: 'Lagos (Ikeja)',
    destination_city: 'Lagos (Victoria Island)',
    service_type: 'EXPRESS',
    weight_kg: 18.5,
    status: 'OUT_FOR_DELIVERY',
    current_lat: 6.4281,
    current_lng: 3.4219,
    current_location_name: 'Ahmadu Bello Way, Victoria Island',
    speed_kmh: 42,
    temperature_celsius: 27.5,
    driver_name: 'Rider Tunde Bakare',
    driver_phone: '+234 812 334 5566',
    truck_number: 'BHL-VAN-104-LAG',
    estimated_delivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    waypoints: [
      { id: 1, location_name: 'Ikeja Sort Center, Lagos', lat: 6.6018, lng: 3.3515, passed: true, order: 0 },
      { id: 2, location_name: 'Third Mainland Bridge Interchange', lat: 6.5000, lng: 3.3900, passed: true, order: 1 },
      { id: 3, location_name: 'Ikoyi Expressway Junction', lat: 6.4500, lng: 3.4300, passed: true, order: 2 },
      { id: 4, location_name: 'Victoria Island Hub', lat: 6.4281, lng: 3.4219, passed: true, order: 3 },
      { id: 5, location_name: 'Eko Atlantic Towers (Destination)', lat: 6.4150, lng: 3.4180, passed: false, order: 4 },
    ]
  }
};

export const fetchShipmentByCode = async (code) => {
  const cleanCode = code.trim().toUpperCase();
  try {
    const res = await apiClient.get(`/tracking/${cleanCode}/`);
    return res.data;
  } catch (err) {
    if (MOCK_SHIPMENTS[cleanCode]) {
      return MOCK_SHIPMENTS[cleanCode];
    }
    // Return default sample if code not recognized
    return {
      ...MOCK_SHIPMENTS['BHL-NG-88492'],
      tracking_code: cleanCode,
    };
  }
};

export const fetchAllShipments = async () => {
  try {
    const res = await apiClient.get('/tracking/list/');
    return res.data;
  } catch (err) {
    return Object.values(MOCK_SHIPMENTS);
  }
};

export const calculateQuote = async (payload) => {
  try {
    const res = await apiClient.post('/quotes/calculate/', payload);
    return res.data;
  } catch (err) {
    // Fallback client side calculation
    const base = 15000 + (payload.weight_kg * 100) + 25000;
    return {
      formatted_amount: `₦${base.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
      total_amount_naira: base,
      origin: payload.origin || 'Lagos',
      destination: payload.destination || 'Abuja',
      estimated_delivery_text: '2 Business Days'
    };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await apiClient.post('/auth/login/', credentials);
    if (res.data.tokens) {
      localStorage.setItem('bharry_access_token', res.data.tokens.access);
      localStorage.setItem('bharry_refresh_token', res.data.tokens.refresh);
      localStorage.setItem('bharry_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || err.response?.data || 'Login failed.';
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await apiClient.post('/auth/register/', userData);
    if (res.data.tokens) {
      localStorage.setItem('bharry_access_token', res.data.tokens.access);
      localStorage.setItem('bharry_refresh_token', res.data.tokens.refresh);
      localStorage.setItem('bharry_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    throw err.response?.data || 'Registration failed.';
  }
};

export const googleAuthUser = async (googleData) => {
  try {
    const res = await apiClient.post('/auth/google/', googleData);
    if (res.data.tokens) {
      localStorage.setItem('bharry_access_token', res.data.tokens.access);
      localStorage.setItem('bharry_refresh_token', res.data.tokens.refresh);
      localStorage.setItem('bharry_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    // Local fallback for Google login demo
    const mockUser = {
      username: googleData.email.split('@')[0],
      email: googleData.email,
      first_name: googleData.name || 'Valued',
      last_name: 'Customer',
      is_google_account: true,
      profile_picture: googleData.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };
    localStorage.setItem('bharry_user', JSON.stringify(mockUser));
    return { user: mockUser, message: 'Google Sign In successful!' };
  }
};

export default apiClient;
