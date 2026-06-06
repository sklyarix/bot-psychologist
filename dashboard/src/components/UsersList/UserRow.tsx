import { LiaUser } from 'react-icons/lia'
import type { User } from '../../api/users'

type Props = { user: User; onSelect?: (u: User) => void }

// Отдельный ряд списка — отображает аватар, имя и статус
export default function UserRow({ user, onSelect }: Props) {
	return (
		<div
			className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
			role="button"
			tabIndex={0}
			onClick={() => onSelect?.(user)}
			onKeyDown={e => {
				if (e.key === 'Enter' || e.key === ' ') onSelect?.(user)
			}}>
			<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
				<LiaUser />
			</div>

			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-gray-900 truncate">
					{user.email}
				</div>
				<div className="text-xs text-gray-500 truncate">Пользователь</div>
			</div>

			<div className="text-right">
				<div className="text-sm font-medium text-gray-900">
					{user.isPremium ? 'Premium' : ''}
				</div>
				<div className="text-xs text-gray-500">
					{new Date(user.updatedAt).toLocaleString()}
				</div>
			</div>
		</div>
	)
}
