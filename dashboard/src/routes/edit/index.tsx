import { createFileRoute, Link } from '@tanstack/react-router'
import ProtectedRoute from '../../components/ProtectedRoute'

const EditIndexPage = () => {
	return (
		<ProtectedRoute adminOnly>
			<div className="max-w-6xl">
				<h1 className="text-2xl font-bold mb-4">Редактор</h1>
				<p className="mb-6">Выберите, что редактировать:</p>
				<div className="flex gap-4 flex-wrap">
					<Link
						to="/edit/page"
						className="text-navy rounded-[15px] text-md font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-100">
						Редактировать страницы
					</Link>
					<Link
						to="/edit/bot"
						className="text-navy rounded-[15px] text-md font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-100">
						Команды бота
					</Link>
					<Link
						to="/edit/ai-goal-messages"
						className="text-navy rounded-[15px] text-md font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)] hover:bg-gray-100">
						AI Goal сообщения
					</Link>
				</div>
			</div>
		</ProtectedRoute>
	)
}

export const Route = createFileRoute('/edit/')({
	component: EditIndexPage
})
