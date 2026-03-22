import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
	component: () => (
		<div className="flex min-h-screen bg-sand text-navy">
			<aside className="w-56 p-6 border-r border-gray-200 bg-white">
				<h2 className="mt-0 mb-4 text-lg font-semibold">Меню</h2>
				<nav className="flex flex-col gap-2">
					<Link
						to="/"
						className="px-3 py-2 rounded hover:bg-gray-100">
						Главная
					</Link>
					<Link
						to="/stats"
						className="px-3 py-2 rounded hover:bg-gray-100">
						Статистика
					</Link>
					<Link
						to="/edit"
						className="px-3 py-2 rounded hover:bg-gray-100">
						Редактировать
					</Link>
				</nav>
			</aside>

			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	)
})
