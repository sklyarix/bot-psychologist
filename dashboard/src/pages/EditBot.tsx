import { useEffect, useState } from 'react'
import { botCommandsApi, type BotCommand } from '../api/bot'
import BotButtonEditor from '../components/BotMessage/BotButtonEditor'

type BotButton = {
	type: 'callback' | 'webApp' | 'url'
	text: string
	data?: string
	url?: string
}

const EditBot = () => {
	const [commands, setCommands] = useState<BotCommand[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState<string | null>(null)
	const [changes, setChanges] = useState<Record<string, boolean>>({})
	const [showAddForm, setShowAddForm] = useState(false)
	const [newCommand, setNewCommand] = useState({
		command: '',
		content: {
			textHTML: '',
			keyboard: [] as BotButton[][]
		}
	})

	useEffect(() => {
		loadCommands()
	}, [])

	const loadCommands = async () => {
		try {
			const data = await botCommandsApi.getAll()
			setCommands(data)
		} catch (error) {
			console.error('Failed to load commands', error)
		} finally {
			setLoading(false)
		}
	}

	const handleContentChange = (id: string, field: string, value: unknown) => {
		setCommands(prev =>
			prev.map(cmd =>
				cmd.id === id
					? { ...cmd, content: { ...cmd.content, [field]: value } }
					: cmd
			)
		)
		setChanges(prev => ({ ...prev, [id]: true }))
	}

	const handleSave = async (id: string) => {
		const command = commands.find(c => c.id === id)
		if (!command) return

		setSaving(id)
		try {
			await botCommandsApi.update(id, { content: command.content })
			setChanges(prev => ({ ...prev, [id]: false }))
		} catch (error) {
			console.error('Failed to save command', error)
		} finally {
			setSaving(null)
		}
	}

	const handleAddCommand = async () => {
		if (!newCommand.command.trim()) return

		setSaving('new')
		try {
			const created = await botCommandsApi.create({
				command: newCommand.command,
				content: newCommand.content
			})
			setCommands(prev => [...prev, created])
			setNewCommand({
				command: '',
				content: {
					textHTML: '',
					keyboard: []
				}
			})
			setShowAddForm(false)
		} catch (error) {
			console.error('Failed to create command', error)
		} finally {
			setSaving(null)
		}
	}

	if (loading) return <div>Загрузка...</div>

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Редактирование команд бота</h1>
				<button
					onClick={() => setShowAddForm(true)}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
					Добавить команду
				</button>
			</div>

			{/* Форма добавления */}
			{showAddForm && (
				<div className="border rounded p-4 mb-6 bg-gray-50">
					<h2 className="text-lg font-semibold mb-4">Новая команда</h2>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">
							Название команды
						</label>
						<input
							type="text"
							value={newCommand.command}
							onChange={e =>
								setNewCommand(prev => ({ ...prev, command: e.target.value }))
							}
							placeholder="Например: help"
							className="w-full px-3 py-2 border rounded"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">
							Текст сообщения (HTML)
						</label>
						<textarea
							value={newCommand.content.textHTML}
							onChange={e =>
								setNewCommand(prev => ({
									...prev,
									content: { ...prev.content, textHTML: e.target.value }
								}))
							}
							placeholder="Введите текст сообщения..."
							className="w-full resize-none px-3 py-2 rounded border text-sm h-32 focus:outline-none focus:ring"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Кнопки</label>
						<BotButtonEditor
							value={newCommand.content.keyboard}
							onChange={value =>
								setNewCommand(prev => ({
									...prev,
									content: { ...prev.content, keyboard: value }
								}))
							}
						/>
					</div>

					<div className="flex gap-2">
						<button
							onClick={handleAddCommand}
							disabled={saving === 'new' || !newCommand.command.trim()}
							className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
							{saving === 'new' ? 'Создание...' : 'Создать'}
						</button>
						<button
							onClick={() => setShowAddForm(false)}
							className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
							Отмена
						</button>
					</div>
				</div>
			)}

			<div className="space-y-6">
				{commands.map(command => (
					<div
						key={command.id}
						className="border rounded p-4">
						<h2 className="text-lg font-semibold mb-2">
							Команда: /{command.command}
						</h2>

						{/* Основной текст */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Текст сообщения (HTML)
							</label>
							<textarea
								value={command.content.textHTML || ''}
								onChange={e =>
									handleContentChange(command.id, 'textHTML', e.target.value)
								}
								placeholder="Введите текст сообщения..."
								className="w-full resize-none px-3 py-2 rounded border text-sm h-32 focus:outline-none focus:ring"
							/>
						</div>

						{/* Кнопки */}
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Кнопки</label>
							<BotButtonEditor
								value={command.content.keyboard || []}
								onChange={value =>
									handleContentChange(command.id, 'keyboard', value)
								}
							/>
						</div>

						{/* Кнопка сохранить */}
						{changes[command.id] && (
							<button
								onClick={() => handleSave(command.id)}
								disabled={saving === command.id}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
								{saving === command.id ? 'Сохранение...' : 'Сохранить'}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default EditBot
