import type { UserStats as UserStatsType } from '../../api/usersStats'
import { useUserStats } from '../../hooks/useUserStats'

type Props = { userId: string | null }

// Компонент подробной статистики по пользователю
export default function UserStats({ userId }: Props) {
	const { data, isLoading, error } = useUserStats(userId)
	// Быстрая агрегация общего количества визитов из ответа (не хук)
	const totalVisitsLast30: number =
		(data as UserStatsType | null)?.totalVisitsLast30 ?? 0

	if (!userId) return null
	if (isLoading)
		return <div className="p-3 text-gray-500">Загрузка статистики...</div>
	if (error)
		return <div className="p-3 text-red-500">Ошибка загрузки статистики</div>

	const {
		aiGoals = [],
		aiQAs = [],
		visitsPerDay = [],
		visitsDates = []
	} = (data as UserStatsType | null) || {}

	const goalsCount = aiGoals.length
	const qaCount = aiQAs.length

	return (
		<div className="p-3 bg-white rounded shadow-sm">
			<div className="grid grid-cols-3 gap-4 mb-3">
				<div>
					<div className="text-xs text-gray-500">AI Goals</div>
					<div className="text-lg font-semibold">{goalsCount}</div>
				</div>
				<div>
					<div className="text-xs text-gray-500">AI Q&A</div>
					<div className="text-lg font-semibold">{qaCount}</div>
				</div>
				<div>
					<div className="text-xs text-gray-500">Визитов (30 дней)</div>
					<div className="text-lg font-semibold">{totalVisitsLast30}</div>
				</div>
			</div>

			<div className="mb-3">
				<div className="text-sm font-medium mb-2">Последние AI Goals</div>
				<div className="text-xs text-gray-600">
					{aiGoals.length === 0 ? 'Нет записей' : ''}
				</div>
				<div className="mt-2 space-y-2">
					{aiGoals.slice(0, 5).map(g => (
						<div
							key={g.id}
							className="text-sm text-gray-800">
							<div className="font-medium">{g.title}</div>
							<div className="text-xs text-gray-500">
								{g.status} — {new Date(g.createdAt).toLocaleString()}
							</div>
						</div>
					))}
				</div>
			</div>

			<div>
				<div className="text-sm font-medium mb-2">AI Q&A (последние)</div>
				<div className="space-y-2 text-sm text-gray-800">
					{aiQAs.slice(0, 5).map(q => (
						<div key={q.id}>
							<div className="font-medium">{q.question}</div>
							<div className="text-xs text-gray-500">
								{q.status} — {new Date(q.createdAt).toLocaleString()}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-3">
				<div className="text-sm font-medium mb-2">Визиты за 30 дней</div>
				<div className="text-xs text-gray-600">(по дате — количество)</div>
				<div className="mt-2 max-h-40 overflow-auto text-sm">
					{visitsPerDay.map((count: number, idx: number) => (
						<div
							key={visitsDates[idx] ?? idx}
							className="flex justify-between text-gray-700">
							<div>{visitsDates[idx] ?? '-'}</div>
							<div>{count}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
