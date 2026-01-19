import type { UseQueryResult } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Chart, registerables } from 'chart.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetAllVisits } from '../hooks/useGetAllVisits'

Chart.register(...registerables)

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

function StatsPage() {
	const query = useGetAllVisits() as unknown as UseQueryResult<
		VisitsResponse,
		unknown
	>
	const { data, isLoading } = query
	const [tab, setTab] = useState<'visits' | 'users'>('visits')
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const chartRef = useRef<Chart | null>(null)

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

	useEffect(() => {
		if (!canvasRef.current) return
		const ctx = canvasRef.current.getContext('2d')
		if (!ctx) return

		const datasets = [
			{
				label: 'Посещения',
				data: visitsArr,
				borderColor: '#60a5fa',
				backgroundColor: 'rgba(96,165,250,0.18)',
				fill: true,
				tension: 0.2
			},
			{
				label: 'Пользователи',
				data: usersArr,
				borderColor: '#34d399',
				backgroundColor: 'rgba(52,211,153,0.14)',
				fill: true,
				tension: 0.2
			}
		]

		if (chartRef.current) {
			chartRef.current.data.labels = labels
			chartRef.current.data.datasets =
				tab === 'visits' ? [datasets[0]] : [datasets[1]]
			chartRef.current.update()
			return
		}

		chartRef.current = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: tab === 'visits' ? [datasets[0]] : [datasets[1]]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { ticks: { color: '#6b7280' } },
					y: { beginAtZero: true, ticks: { color: '#6b7280' } }
				},
				plugins: {
					legend: { display: false },
					tooltip: { mode: 'index', intersect: false }
				}
			}
		})

		return () => {
			chartRef.current?.destroy()
			chartRef.current = null
		}
	}, [labels, visitsArr, usersArr, tab])

	return (
		<div className="max-w-4xl">
			<h1 className="text-2xl font-bold">Статистика за месяц</h1>
			<p className="mt-2 text-gray-600">
				Графики: общее количество посещений и количество пользователей
			</p>

			<div className="mt-6 grid grid-cols-1 gap-6">
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
								onClick={() => setTab('visits')}
							>
								Посещения
							</button>
							<button
								className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
								onClick={() => setTab('users')}
							>
								Пользователи
							</button>
						</div>
					</div>

					<div className="mt-4 h-64">
						{isLoading ? (
							<div className="text-gray-500">Загрузка...</div>
						) : (
							<canvas ref={canvasRef} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export const Route = createFileRoute('/stats')({
	component: StatsPage
})
