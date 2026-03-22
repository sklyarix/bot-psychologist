import { useEffect, useState } from 'react'
import { aiGoalMessagesApi, type AiGoalMessage } from '../api/aiGoalMessages'

const AiGoalMessagesPage = () => {
	const [messages, setMessages] = useState<AiGoalMessage[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState<string | null>(null)
	const [changes, setChanges] = useState<Record<string, boolean>>({})
	const [showAddForm, setShowAddForm] = useState(false)
	const [newMessage, setNewMessage] = useState({
		day: 1,
		message: ''
	})

	useEffect(() => {
		loadMessages()
	}, [])

	const loadMessages = async () => {
		try {
			const data = await aiGoalMessagesApi.getAll()
			setMessages(data)
		} catch (error) {
			console.error('Failed to load messages', error)
		} finally {
			setLoading(false)
		}
	}

	const handleMessageChange = (id: string, field: string, value: unknown) => {
		setMessages(prev =>
			prev.map(msg => (msg.id === id ? { ...msg, [field]: value } : msg))
		)
		setChanges(prev => ({ ...prev, [id]: true }))
	}

	const handleSave = async (id: string) => {
		const message = messages.find(m => m.id === id)
		if (!message) return

		setSaving(id)
		try {
			await aiGoalMessagesApi.update(id, { message: message.message })
			setChanges(prev => ({ ...prev, [id]: false }))
		} catch (error) {
			console.error('Failed to save message', error)
		} finally {
			setSaving(null)
		}
	}

	const handleAddMessage = async () => {
		if (!newMessage.message.trim()) return

		setSaving('new')
		try {
			const created = await aiGoalMessagesApi.create({
				day: newMessage.day,
				message: newMessage.message
			})
			setMessages(prev => [...prev, created])
			setNewMessage({ day: 1, message: '' })
			setShowAddForm(false)
		} catch (error) {
			console.error('Failed to create message', error)
		} finally {
			setSaving(null)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Вы уверены, что хотите удалить это сообщение?')) return

		try {
			await aiGoalMessagesApi.delete(id)
			setMessages(prev => prev.filter(m => m.id !== id))
		} catch (error) {
			console.error('Failed to delete message', error)
		}
	}

	if (loading) return <div>Загрузка...</div>

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">Сообщения AI Goal</h1>
				<button
					onClick={() => setShowAddForm(true)}
					className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
					Добавить сообщение
				</button>
			</div>

			{/* Форма добавления */}
			{showAddForm && (
				<div className="border rounded p-4 mb-6 bg-gray-50">
					<h2 className="text-lg font-semibold mb-4">Новое сообщение</h2>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">День</label>
						<input
							type="number"
							value={newMessage.day}
							onChange={e =>
								setNewMessage(prev => ({
									...prev,
									day: parseInt(e.target.value) || 1
								}))
							}
							className="w-full px-3 py-2 border rounded"
							min="1"
						/>
					</div>

					<div className="mb-4">
						<label className="block text-sm font-medium mb-1">Сообщение</label>
						<textarea
							value={newMessage.message}
							onChange={e =>
								setNewMessage(prev => ({ ...prev, message: e.target.value }))
							}
							placeholder="Введите текст сообщения..."
							className="w-full resize-none px-3 py-2 rounded border text-sm h-32 focus:outline-none focus:ring"
						/>
					</div>

					<div className="flex gap-2">
						<button
							onClick={handleAddMessage}
							disabled={saving === 'new' || !newMessage.message.trim()}
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
				{messages.map(message => (
					<div
						key={message.id}
						className="border rounded p-4">
						<div className="flex justify-between items-center mb-2">
							<h2 className="text-lg font-semibold">День {message.day}</h2>
							<button
								onClick={() => handleDelete(message.id)}
								className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
								Удалить
							</button>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Сообщение
							</label>
							<textarea
								value={message.message}
								onChange={e =>
									handleMessageChange(message.id, 'message', e.target.value)
								}
								placeholder="Введите текст сообщения..."
								className="w-full resize-none px-3 py-2 rounded border text-sm h-32 focus:outline-none focus:ring"
							/>
						</div>

						{/* Кнопка сохранить */}
						{changes[message.id] && (
							<button
								onClick={() => handleSave(message.id)}
								disabled={saving === message.id}
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
								{saving === message.id ? 'Сохранение...' : 'Сохранить'}
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export default AiGoalMessagesPage
