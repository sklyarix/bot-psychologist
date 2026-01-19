import { useState } from 'react'
import { useCreatePageFieldGroup } from '../../hooks/cms/pageFieldGroups/usePageFieldGroups'

interface ICreateFieldGroupForm {
	pageId: string
	onClose: () => void
}

const CreateFieldGroupForm = (props: ICreateFieldGroupForm) => {
	const { pageId, onClose } = props

	const { mutate: createPageFieldGroup } = useCreatePageFieldGroup()

	const [name, setName] = useState('')
	const [title, setTitle] = useState('')

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()

		createPageFieldGroup(
			{ name, title, pageId },
			{
				onSuccess: () => {
					onClose()
				}
			}
		)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-md bg-white p-4 rounded">
				<h3 className="text-lg font-semibold">Создать группу полей</h3>
				<form
					onSubmit={submit}
					className="mt-3"
				>
					<div className="mb-2">
						<label className="text-sm text-gray-600">Name</label>
						<p>
							Идентификатор группы (например "hero_section", "about_section")
						</p>
						<input
							value={name}
							onChange={e => setName(e.target.value)}
							className="w-full mt-1 p-2 border rounded"
						/>
					</div>
					<div className="mb-2">
						<label className="text-sm text-gray-600">Title</label>
						<p>Заголовок группы</p>
						<input
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full mt-1 p-2 border rounded"
						/>
					</div>
					<div className="flex gap-2 justify-end">
						<button
							type="button"
							onClick={onClose}
							className="px-3 py-2 rounded border"
						>
							Отмена
						</button>
						<button
							type="submit"
							className="px-3 py-2 bg-blue-600 text-white rounded"
						>
							Создать
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreateFieldGroupForm
