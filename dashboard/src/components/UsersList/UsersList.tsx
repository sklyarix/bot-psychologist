import { useState } from 'react'
import { useGetAllUsersSub } from '../../hooks/useUsers'
import MessageField from '../BotMessage/MessageField'
import UserRow from './UserRow'
import UserStats from './UserStats'

// Список пользователей в стиле чата Telegram
export default function UsersList() {
	const { data, isLoading, error } = useGetAllUsersSub()
	const [selected, setSelected] = useState<string | null>(null)
	const [broadcastOpen, setBroadcastOpen] = useState(false)

	if (isLoading)
		return <div className="text-gray-500">Загрузка пользователей...</div>
	if (error)
		return <div className="text-red-500">Ошибка загрузки пользователей</div>

	const users = data?.users || []

	return (
		<div className="mt-4 bg-white rounded-lg shadow-sm overflow-hidden">
			<div className="px-4 py-2 border-b">
				<div className="flex items-center justify-between">
					<div className="text-sm font-semibold">Пользователи</div>
					<button
						className="text-sm text-blue-600 hover:underline"
						onClick={() => setBroadcastOpen(true)}
						type="button">
						Написать всем
					</button>
				</div>
			</div>

			{broadcastOpen && (
				<div className="p-3 border-b bg-gray-50">
					<div className="flex justify-end mb-2">
						<button
							className="text-sm text-gray-500"
							onClick={() => setBroadcastOpen(false)}
							type="button">
							Закрыть
						</button>
					</div>
					<MessageField
						telegramId={'all_active'}
						onSent={() => setBroadcastOpen(false)}
					/>
				</div>
			)}

			<div className="divide-y">
				{users.length === 0 ? (
					<div className="p-3 text-gray-500">Нет пользователей</div>
				) : (
					users.map(u => (
						<div key={u.id}>
							<UserRow
								user={u}
								onSelect={() =>
									setSelected(prev => (prev === u.id ? null : u.id))
								}
							/>

							{/* Если текущий пользователь выбран — показываем поле сообщения прямо под ним */}
							{selected === u.id && (
								<div className="p-3 border-b bg-gray-50">
									<div className="flex justify-end mb-2">
										<button
											className="text-sm text-gray-500"
											onClick={() => setSelected(null)}
											type="button">
											Закрыть
										</button>
									</div>
									<UserStats userId={u.id} />
									<MessageField
										telegramId={u.telegramId || ''}
										onSent={() => setSelected(null)}
									/>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	)
}
