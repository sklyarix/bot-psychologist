import { useNavigate } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

type Props = {
	children: ReactNode
	/** Если true — пускает только admin. По умолчанию false (любой auth пользователь). */
	adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (isLoading) return

		if (!isAuthenticated) {
			void navigate({ to: '/login' })
			return
		}

		if (adminOnly && !isAdmin) {
			void navigate({ to: '/' })
		}
	}, [isLoading, isAuthenticated, isAdmin, adminOnly, navigate])

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-sand">
				<span className="text-navy/50 text-sm">Загрузка...</span>
			</div>
		)
	}

	if (!isAuthenticated) return null
	if (adminOnly && !isAdmin) return null

	return <>{children}</>
}
