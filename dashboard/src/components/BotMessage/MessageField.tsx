import { useMemo, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { botApi } from '../../api/bot'

type Props = {
	userId?: string
	onSent?: () => void
}

export default function MessageField({ userId = '', onSent }: Props) {
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)

	const canSend = useMemo(
		() => message.trim().length > 0 && !loading,
		[message, loading]
	)

	const send = async () => {
		if (!canSend) return
		setLoading(true)
		try {
			await botApi.sendMessage({
				userId,
				message: message.trim()
			})
			setMessage('')
			setSent(true)
			setTimeout(() => setSent(false), 3000)
			onSent?.()
		} catch (e) {
			console.error('send message error', e)
		} finally {
			setLoading(false)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			send()
		}
	}

	return (
		<div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
			<div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
				<span>✉️ Отправка на e-mail</span>
				{userId === 'all_active' && (
					<span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
						Всем пользователям
					</span>
				)}
			</div>

			<div className="flex gap-3">
				<textarea
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Написать сообщение... (Ctrl+Enter для отправки)"
					className="flex-1 resize-none px-3 py-2 rounded border text-sm h-24 focus:outline-none focus:ring focus:ring-blue-200"
				/>

				<div className="flex flex-col items-end gap-2">
					<button
						onClick={send}
						disabled={!canSend}
						className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
							canSend
								? 'bg-blue-500 text-white hover:bg-blue-600'
								: 'bg-gray-100 text-gray-400'
						}`}
						title="Отправить письмо">
						{loading ? (
							<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							<FiSend />
						)}
					</button>

					{sent && (
						<span className="text-xs text-green-500 font-medium">
							Отправлено!
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
