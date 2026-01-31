import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const loginUser = (credentials) => api.post('/login', credentials);
export const signupUser = (userData) => api.post('/signup', userData);
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile/edit', data);
export const deleteAccount = () => api.delete('/user/delete');
export const createGroup = (groupData) => api.post('/group/create', groupData);
export const joinGroup = (groupId) => api.post('/group/join', { groupId });
export const searchGroups = (filters) => api.post('/group/search', filters);
export const inviteMember = (inviteData) => api.post('/group/invite', inviteData);
export const sendGroupMessage = (messageData) => api.post('/chat/send', messageData);
export const getGroupMessages = (groupId) => api.get(`/chat/messages?groupId=${groupId}`);
export const sendAIChat = (promptData) => api.post('/ai/chat', promptData);

export default api;
