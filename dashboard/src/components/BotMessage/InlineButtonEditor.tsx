import { useCallback } from 'react'

type Btn = { text: string; url: string }

type Props = {
	value: Btn[]
	onChange: (v: Btn[]) => void
}

// Редактор списка inline-кнопок (простой список пар текст+url)
export default function InlineButtonEditor({ value, onChange }: Props) {
	const add = useCallback(() => {
		onChange([...value, { text: '', url: '' }])
	}, [value, onChange])

	const update = useCallback(
		(idx: number, patch: Partial<Btn>) => {
			const next = value.map((b, i) => (i === idx ? { ...b, ...patch } : b))
			onChange(next)
		},
		[value, onChange]
	)

	const remove = useCallback(
		(idx: number) => {
			const next = value.filter((_, i) => i !== idx)
			onChange(next)
		},
		[value, onChange]
	)

	return (
		<div className="mt-3">
			<div className="text-xs text-gray-500 mb-2">Кнопки (inline)</div>
			<div className="space-y-2">
				{value.map((b, i) => (
					<div
						key={i}
						className="flex gap-2 items-center">
						<input
							className="flex-1 px-2 py-1 border rounded text-sm"
							placeholder="Текст кнопки"
							value={b.text}
							onChange={e => update(i, { text: e.target.value })}
						/>
						<input
							className="flex-1 px-2 py-1 border rounded text-sm"
							placeholder="Ссылка (url)"
							value={b.url}
							onChange={e => update(i, { url: e.target.value })}
						/>
						<button
							className="px-2 py-1 text-red-500 text-sm"
							onClick={() => remove(i)}
							type="button">
							Убрать
						</button>
					</div>
				))}

				<div>
					<button
						type="button"
						onClick={add}
						className="text-sm text-blue-500 px-2 py-1">
						Добавить кнопку
					</button>
				</div>
			</div>
		</div>
	)
}
