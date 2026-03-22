import { createFileRoute } from '@tanstack/react-router'
import EditBot from '../../pages/EditBot.tsx'

export const Route = createFileRoute('/edit/bot')({
	component: EditBot
})
