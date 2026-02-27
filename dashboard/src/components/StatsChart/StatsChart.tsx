import { Chart, registerables } from 'chart.js'
import { useEffect, useRef } from 'react'

// Регистрируем плагины и типы графиков Chart.js один раз в компоненте
Chart.register(...registerables)

type Props = {
	labels: string[]
	visitsArr: number[]
	usersArr: number[]
	tab: 'visits' | 'users'
	isLoading?: boolean
	height?: number
}

// Компактный компонент, отвечающий только за отрисовку canvas и Chart.js
export default function StatsChart({
	labels,
	visitsArr,
	usersArr,
	tab,
	isLoading,
	height = 256
}: Props) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const chartRef = useRef<Chart | null>(null)

	useEffect(() => {
		if (!canvasRef.current) return
		const ctx = canvasRef.current.getContext('2d')
		if (!ctx) return

		// Наборы данных для двух табов (посещения / пользователи)
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

		// Если график уже создан — просто обновляем данные и метки
		if (chartRef.current) {
			chartRef.current.data.labels = labels
			chartRef.current.data.datasets =
				tab === 'visits' ? [datasets[0]] : [datasets[1]]
			chartRef.current.update()
			return
		}

		// Инициализация графика
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

	// Показать индикатор загрузки или само canvas
	if (isLoading) return <div className="text-gray-500">Загрузка...</div>

	return (
		<div
			style={{ height }}
			className="h-full">
			<canvas ref={canvasRef} />
		</div>
	)
}
