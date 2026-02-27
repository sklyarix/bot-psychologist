import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import StatsChart from '../components/StatsChart/StatsChart'
import UsersList from '../components/UsersList/UsersList'
import { useGetAllVisits } from '../hooks/useGetAllVisits'

function formatDay(d: Date) {
	return `${d.getDate()}.${d.getMonth() + 1}`
}

function buildLastDays(days = 30) {
	const now = new Date()
	const arr: Date[] = []
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(now)
		d.setDate(now.getDate() - i)
		arr.push(d)
	}
	return arr
}

type VisitsResponse = {
	success: boolean
	visits: Array<{ visitedAt: string; userId?: string | number | null }>
}

const StatsPage = () => {
	// Запрос всех посещений
	const query = useGetAllVisits() as unknown as UseQueryResult<
		VisitsResponse,
		unknown
	>
	const { data, isLoading } = query
	const [tab, setTab] = useState<'visits' | 'users'>('visits')

	// Список последних N дней и вычисления метрик на них
	const days = useMemo(() => buildLastDays(30), [])

	const { labels, visitsArr, usersArr, totalVisits, totalUsers } =
		useMemo(() => {
			const labels = days.map(d => formatDay(d))
			const keys = days.map(d => d.toISOString().slice(0, 10))

			const visitsMap: Record<string, number> = {}
			const usersMap: Record<string, Set<string>> = {}

			if (data && data.success && Array.isArray(data.visits)) {
				for (const v of data.visits) {
					const d = new Date(v.visitedAt)
					if (isNaN(d.getTime())) continue
					const key = d.toISOString().slice(0, 10)
					visitsMap[key] = (visitsMap[key] || 0) + 1
					if (v.userId != null) {
						usersMap[key] = usersMap[key] || new Set()
						usersMap[key].add(String(v.userId))
					}
				}
			}

			const visitsArr = keys.map(k => visitsMap[k] || 0)
			const usersArr = keys.map(k => (usersMap[k] ? usersMap[k].size : 0))
			const totalVisits = visitsArr.reduce((s, n) => s + n, 0)
			const totalUsers = usersArr.reduce((s, n) => s + n, 0)

			return { labels, visitsArr, usersArr, totalVisits, totalUsers }
		}, [data, days])

	return (
		<div className="max-w-4xl">
			<h1 className="text-2xl font-bold">Статистика за месяц</h1>
			<p className="mt-2 text-gray-600">
				Графики: общее количество посещений и количество пользователей
			</p>

			<div className="mt-6 grid grid-cols-2 gap-6">
				<div className="p-4 bg-white rounded-lg shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div>
								<div className="text-sm text-gray-500">
									Посещений (всего за месяц)
								</div>
								<div className="text-2xl font-semibold">
									{totalVisits.toLocaleString()}
								</div>
							</div>
							<div>
								<div className="text-sm text-gray-500">
									Уникальных пользователей
								</div>
								<div className="text-2xl font-semibold">
									{totalUsers.toLocaleString()}
								</div>
							</div>
						</div>

						<div className="flex items-center space-x-2">
							<button
								className={`px-3 py-1 rounded ${tab === 'visits' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
								onClick={() => setTab('visits')}>
								Посещения
							</button>
							<button
								className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
								onClick={() => setTab('users')}>
								Пользователи
							</button>
						</div>
					</div>

					<div className="mt-4 h-64">
						{/* Компонент, отвечающий за canvas и Chart.js */}
						<StatsChart
							labels={labels}
							visitsArr={visitsArr}
							usersArr={usersArr}
							tab={tab}
							isLoading={isLoading}
							height={256}
						/>
					</div>
				</div>
				{/* Список пользователей в стиле чата Telegram */}
				<div className="mt-4">
					<UsersList />
				</div>
			</div>
		</div>
	)
}

export default StatsPage
