import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../../components/ProtectedRoute'
import EditBot from '../../pages/EditBot'

export const Route = createFileRoute('/edit/bot')({
	component: () => (
		<ProtectedRoute adminOnly>
			<EditBot />
		</ProtectedRoute>
	)
})
