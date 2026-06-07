import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../../components/ProtectedRoute'
import EditPage from '../../pages/EditPage'

export const Route = createFileRoute('/edit/page')({
	component: () => (
		<ProtectedRoute adminOnly>
			<EditPage />
		</ProtectedRoute>
	)
})
