import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
});

export const analyzeConversation = (text: string) =>
  apiClient.post('/conversation/analyze', {
    text,
    filename: 'conversation.txt',
  });

export const getHistory = () => apiClient.get('/conversation/history');
