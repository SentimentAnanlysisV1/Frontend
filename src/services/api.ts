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

export const analyzeConversation = (text: string) =>
  apiClient.post('/conversation/analyze', {
    text,
    filename: 'conversation.txt',
  });

export const getHistory = () => apiClient.get('/conversation/history');
