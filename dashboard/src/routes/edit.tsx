import { createFileRoute } from '@tanstack/react-router'
import EditPage from '../pages/Edit.tsx'

export const Route = createFileRoute('/edit')({
	component: EditPage
})
