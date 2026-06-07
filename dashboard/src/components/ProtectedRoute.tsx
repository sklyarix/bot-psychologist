import { Navigate } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

type Props = {
	children: ReactNode
	adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
	const { isAuthenticated, isAdmin, isLoading } = useAuth()

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-sand">
				<span className="text-navy/50 text-sm">Загрузка...</span>
			</div>
		)
	}

	if (!isAuthenticated) return <Navigate to="/login" />
	if (adminOnly && !isAdmin) return <Navigate to="/" />

	return <>{children}</>
}
