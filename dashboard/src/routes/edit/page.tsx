import { createFileRoute } from '@tanstack/react-router'
import EditPage from '../../pages/EditPage.tsx'

export const Route = createFileRoute('/edit/page')({
	component: EditPage
})
