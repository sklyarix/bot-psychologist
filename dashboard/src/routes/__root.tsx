import {
	createRootRoute,
	Link,
	Outlet,
	useNavigate
} from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

function RootLayout() {
	const { isAuthenticated, isAdmin, user, logout } = useAuth()
	const navigate = useNavigate()

	const handleLogout = () => {
		logout()
		void navigate({ to: '/login' })
	}

	// Если не авторизован — рендерим только Outlet (там будет LoginPage)
	if (!isAuthenticated) {
		return <Outlet />
	}

	return (
		<div className="flex min-h-screen bg-sand text-navy">
			{/* Sidebar */}
			<aside className="w-56 p-6 border-r border-gray-200 bg-white flex flex-col">
				<h2 className="mt-0 mb-4 text-lg font-semibold">Меню</h2>

				<nav className="flex flex-col gap-2 flex-1">
					<Link
						to="/"
						className="px-3 py-2 rounded hover:bg-gray-100">
						Главная
					</Link>

					{/* Статистика и редактор — только для admin */}
					{isAdmin && (
						<>
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
						</>
					)}
				</nav>

				{/* Информация о пользователе + выход */}
				<div className="mt-auto pt-4 border-t border-gray-100">
					<div className="mb-3">
						<p className="text-xs text-gray-400 truncate">{user?.email}</p>
						<span
							className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
								isAdmin ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
							}`}>
							{isAdmin ? 'Admin' : 'User'}
						</span>
					</div>
					<button
						onClick={handleLogout}
						className="w-full text-left px-3 py-2 rounded text-sm text-red-500 hover:bg-red-50 transition">
						Выйти
					</button>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	)
}

export const Route = createRootRoute({
	component: RootLayout
})
