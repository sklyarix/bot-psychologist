import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode
} from 'react'
import { authApi, type AuthUser } from '../api/auth.ts'

type AuthState = {
	user: AuthUser | null
	token: string | null
	isLoading: boolean
	isAuthenticated: boolean
	isAdmin: boolean
	login: (email: string, password: string) => Promise<void>
	logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null)
	const [token, setToken] = useState<string | null>(
		localStorage.getItem('token')
	)
	const [isLoading, setIsLoading] = useState(true)

	// При инициализации — проверяем текущий токен
	useEffect(() => {
		const savedToken = localStorage.getItem('token')
		if (!savedToken) {
			setIsLoading(false)
			return
		}

		authApi
			.me()
			.then(u => {
				setUser(u)
				setToken(savedToken)
			})
			.catch(() => {
				// Невалидный / просроченный токен
				localStorage.removeItem('token')
				setToken(null)
				setUser(null)
			})
			.finally(() => setIsLoading(false))
	}, [])

	const login = useCallback(async (email: string, password: string) => {
		const res = await authApi.login(email, password)

		if (res.user.role !== 'admin') {
			throw new Error('access_denied')
		}

		localStorage.setItem('token', res.token)
		setToken(res.token)
		setUser(res.user)
	}, [])

	const logout = useCallback(() => {
		localStorage.removeItem('token')
		setToken(null)
		setUser(null)
	}, [])

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				isLoading,
				isAuthenticated: !!user,
				isAdmin: user?.role === 'admin',
				login,
				logout
			}}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthState {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
