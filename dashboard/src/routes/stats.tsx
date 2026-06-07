import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../components/ProtectedRoute'
import StatsPage from '../pages/Stats'

export const Route = createFileRoute('/stats')({
	component: () => (
		<ProtectedRoute adminOnly>
			<StatsPage />
		</ProtectedRoute>
	)
})
