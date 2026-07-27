import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const normalizedApiUrl = configuredApiUrl.replace(/\/$/, '');
const baseURL = normalizedApiUrl.endsWith('/api')
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

const apiClient = axios.create({
  baseURL,
  timeout: 30000,
});

const TOKEN_KEY = 'sentiment_access_token';

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const hasAccessToken = () => Boolean(localStorage.getItem(TOKEN_KEY));
export const signOut = () => localStorage.removeItem(TOKEN_KEY);

type Credentials = { email: string; password: string };

const authenticate = async (path: '/auth/login' | '/auth/register', credentials: Credentials) => {
  const response = await apiClient.post<{ access_token: string }>(path, credentials);
  localStorage.setItem(TOKEN_KEY, response.data.access_token);
};

export const signIn = (credentials: Credentials) => authenticate('/auth/login', credentials);
export const createAccount = (credentials: Credentials) => authenticate('/auth/register', credentials);

export const analyzeConversation = (text: string) =>
  apiClient.post('/conversation/analyze', {
    text,
    filename: 'conversation.txt',
  });

export const getHistory = () => apiClient.get('/conversation/history');
