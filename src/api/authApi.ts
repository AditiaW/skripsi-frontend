import axiosInstance from './axiosInstance';
import useAuthStore from '../store/authStore';

interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post('/login', credentials);
    const { token } = response.data;
    useAuthStore.getState().login(token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};