import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '../components/ProtectedRoute'

export const Route = createFileRoute('/')({
	component: () => (
		<ProtectedRoute adminOnly>
			<div className="max-w-3xl">
				<h1 className="text-2xl font-bold">Главная</h1>
				<p className="mt-4 text-gray-600">Добро пожаловать в дашборд.</p>
			</div>
		</ProtectedRoute>
	)
})
