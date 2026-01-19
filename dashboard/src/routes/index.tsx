import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: () => (
		<div className="max-w-3xl">
			<h1 className="text-2xl font-bold">Главная</h1>
			<p className="mt-4 text-gray-600">Добро пожаловать в дашборд.</p>
		</div>
	)
})
