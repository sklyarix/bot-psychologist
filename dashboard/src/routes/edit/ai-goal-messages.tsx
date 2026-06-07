import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../../components/ProtectedRoute'
import AiGoalMessagesPage from '../../pages/EditAiGoalMessages'

export const Route = createFileRoute('/edit/ai-goal-messages')({
	component: () => (
		<ProtectedRoute adminOnly>
			<AiGoalMessagesPage />
		</ProtectedRoute>
	)
})
