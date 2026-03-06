import { useMemo, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { botApi } from '../../api/bot'
import InlineButtonEditor from './InlineButtonEditor'

type Props = {
	telegramId?: string // single telegramId or special value 'all_active'
	onSent?: () => void
}

// Поле ввода сообщения со стилем, похожим на Telegram
export default function MessageField({ telegramId = '', onSent }: Props) {
	const [message, setMessage] = useState('')
	const [buttons, setButtons] = useState<Array<{ text: string; url: string }>>(
		[]
	)
	const [loading, setLoading] = useState(false)

	const canSend = useMemo(
		() => message.trim().length > 0 && !loading,
		[message, loading]
	)

	const send = async () => {
		if (!canSend) return
		setLoading(true)
		try {
			// Формируем inline_keyboard в формате массива массивов (один ряд кнопок)
			const inlineKeyboard = buttons.length
				? [
						buttons
							.filter(b => b.text.trim() && b.url.trim())
							.map(b => ({ text: b.text.trim(), url: b.url.trim() }))
					]
				: undefined

			await botApi.sendMessage({
				telegramId,
				message: message.trim(),
				inlineKeyboard
			})
			setMessage('')
			setButtons([])
			onSent?.()
		} catch (e) {
			console.error('send message error', e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="p-3 bg-white rounded-lg shadow-sm">
			<div className="flex gap-3">
				<textarea
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder="Написать сообщение..."
					className="flex-1 resize-none px-3 py-2 rounded border text-sm h-24 focus:outline-none focus:ring"
				/>

				<div className="flex flex-col items-end gap-2">
					<button
						onClick={send}
						disabled={!canSend}
						className={`flex items-center justify-center w-10 h-10 rounded-full ${canSend ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
						title="Отправить">
						<FiSend />
					</button>
				</div>
			</div>

			<InlineButtonEditor
				value={buttons}
				onChange={setButtons}
			/>
		</div>
	)
}
