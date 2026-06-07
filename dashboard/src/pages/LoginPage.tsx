import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
	const { login, isAuthenticated } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	// Если уже авторизован — редиректим
	if (isAuthenticated) {
		void navigate({ to: '/' })
		return null
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			await login(email.trim(), password)
			void navigate({ to: '/' })
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Ошибка авторизации'

			// Попробуем вытащить текст из axios-ответа
			const axiosError = err as {
				response?: { data?: { error?: string } }
			}
			const serverMsg = axiosError.response?.data?.error
			if (serverMsg === 'invalid_credentials') {
				setError('Неверный email или пароль')
			} else {
				setError(serverMsg ?? msg)
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-sand">
			<div className="w-full max-w-sm">
				{/* Логотип / заголовок */}
				<div className="mb-10 text-center">
					<h1
						className="text-3xl font-bold text-navy tracking-tight"
						style={{ fontFamily: 'ArsenicaTrial, serif' }}>
						Dashboard
					</h1>
					<p className="mt-2 text-sm text-navy/60">Войдите, чтобы продолжить</p>
				</div>

				{/* Карточка */}
				<div className="bg-white rounded-[20px] shadow-[2px_6px_24px_0_rgba(34,67,79,0.10)] px-8 py-10">
					<form
						onSubmit={handleSubmit}
						className="space-y-5">
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-navy mb-1">
								Email
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								required
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder="admin@example.com"
								className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 transition"
							/>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-navy mb-1">
								Пароль
							</label>
							<input
								id="password"
								type="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder="••••••••"
								className="w-full px-4 py-2.5 rounded-[10px] border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 transition"
							/>
						</div>

						{/* Error */}
						{error && (
							<p className="text-sm text-red-500 text-center">{error}</p>
						)}

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="btn mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
							{loading ? 'Вход...' : 'Войти'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
export default LoginPage
