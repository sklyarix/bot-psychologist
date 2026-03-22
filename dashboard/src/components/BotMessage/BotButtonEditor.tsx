import { useCallback } from 'react'

type ButtonType = 'callback' | 'webApp' | 'url'

type BotButton = {
	type: ButtonType
	text: string
	data?: string
	url?: string
}

type Props = {
	value: BotButton[][]
	onChange: (v: BotButton[][]) => void
}

export default function BotButtonEditor({ value, onChange }: Props) {
	const addRow = useCallback(() => {
		onChange([...value, []])
	}, [value, onChange])

	const addButton = useCallback(
		(rowIdx: number) => {
			const next = value.map((row, i) =>
				i === rowIdx
					? [...row, { type: 'url' as ButtonType, text: '', url: '' }]
					: row
			)
			onChange(next)
		},
		[value, onChange]
	)

	const updateButton = useCallback(
		(rowIdx: number, btnIdx: number, patch: Partial<BotButton>) => {
			const next = value.map((row, i) =>
				i === rowIdx
					? row.map((btn, j) => (j === btnIdx ? { ...btn, ...patch } : btn))
					: row
			)
			onChange(next)
		},
		[value, onChange]
	)

	const removeButton = useCallback(
		(rowIdx: number, btnIdx: number) => {
			const next = value.map((row, i) =>
				i === rowIdx ? row.filter((_, j) => j !== btnIdx) : row
			)
			onChange(next)
		},
		[value, onChange]
	)

	const removeRow = useCallback(
		(rowIdx: number) => {
			const next = value.filter((_, i) => i !== rowIdx)
			onChange(next)
		},
		[value, onChange]
	)

	return (
		<div className="mt-3">
			<div className="text-xs text-gray-500 mb-2">Кнопки (inline)</div>
			<div className="space-y-4">
				{value.map((row, rowIdx) => (
					<div
						key={rowIdx}
						className="border rounded p-2">
						<div className="flex justify-between items-center mb-2">
							<span className="text-sm font-medium">Ряд {rowIdx + 1}</span>
							<button
								className="text-red-500 text-sm"
								onClick={() => removeRow(rowIdx)}
								type="button">
								Удалить ряд
							</button>
						</div>
						<div className="space-y-2">
							{row.map((btn, btnIdx) => (
								<div
									key={btnIdx}
									className="flex gap-2 items-center">
									<select
										className="px-2 py-1 border rounded text-sm"
										value={btn.type}
										onChange={e =>
											updateButton(rowIdx, btnIdx, {
												type: e.target.value as ButtonType,
												data: undefined,
												url: undefined
											})
										}>
										<option value="callback">Callback</option>
										<option value="webApp">Web App</option>
										<option value="url">URL</option>
									</select>
									<input
										className="flex-1 px-2 py-1 border rounded text-sm"
										placeholder="Текст кнопки"
										value={btn.text}
										onChange={e =>
											updateButton(rowIdx, btnIdx, { text: e.target.value })
										}
									/>
									{btn.type === 'callback' && (
										<input
											className="flex-1 px-2 py-1 border rounded text-sm"
											placeholder="Callback data"
											value={btn.data || ''}
											onChange={e =>
												updateButton(rowIdx, btnIdx, { data: e.target.value })
											}
										/>
									)}
									{(btn.type === 'webApp' || btn.type === 'url') && (
										<input
											className="flex-1 px-2 py-1 border rounded text-sm"
											placeholder="URL"
											value={btn.url || ''}
											onChange={e =>
												updateButton(rowIdx, btnIdx, { url: e.target.value })
											}
										/>
									)}
									<button
										className="px-2 py-1 text-red-500 text-sm"
										onClick={() => removeButton(rowIdx, btnIdx)}
										type="button">
										Убрать
									</button>
								</div>
							))}
							<div>
								<button
									type="button"
									onClick={() => addButton(rowIdx)}
									className="text-sm text-blue-500 px-2 py-1">
									Добавить кнопку
								</button>
							</div>
						</div>
					</div>
				))}
				<div>
					<button
						type="button"
						onClick={addRow}
						className="text-sm text-green-500 px-2 py-1">
						Добавить ряд
					</button>
				</div>
			</div>
		</div>
	)
}
