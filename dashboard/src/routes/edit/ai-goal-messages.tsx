import { createFileRoute } from '@tanstack/react-router'
import AiGoalMessagesPage from '../../pages/EditAiGoalMessages.tsx'

export const Route = createFileRoute('/edit/ai-goal-messages')({
	component: AiGoalMessagesPage
})
