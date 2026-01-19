import axios from 'axios'

const API_URL = `${import.meta.env.VITE_BACKEND_URL_SERVER}/api`

export const instance = axios.create({
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' }
})
