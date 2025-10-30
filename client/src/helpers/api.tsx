import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = `${import.meta.env.VITE_BACKEND_URL_SERVER}/api`;
const COOKIE_TOKEN = import.meta.env.VITE_COOKIE_TOKEN;

export const instance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Динамически подставляем токен перед КАЖДЫМ запросом
instance.interceptors.request.use((config) => {
  const token = Cookies.get(COOKIE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete (config.headers as any).Authorization;
  }
  return config;
});
