import axios from 'axios'

const API_URL = `${import.meta.env.VITE_BACKEND_URL_SERVER}/api`

export const instance = axios.create({
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' }
})

// Add request interceptor to include auth token
instance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)
