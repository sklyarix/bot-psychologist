import { useState } from 'react'
import { useCreatePage } from '../../hooks/cms/pages/usePages'

interface ICreatePageForm {
	onClose: () => void
}

const CreatePageForm = (props: ICreatePageForm) => {
	const { onClose } = props
	const { mutate: createPage } = useCreatePage()

	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()

		createPage(
			{ title, slug },
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
				<h3 className="text-lg font-semibold">Создать страницу</h3>
				<form
					onSubmit={submit}
					className="mt-3"
				>
					<div className="mb-2">
						<label className="text-sm text-gray-600">Title</label>
						<input
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full mt-1 p-2 border rounded"
						/>
					</div>
					<div className="mb-2">
						<label className="text-sm text-gray-600">Slug</label>
						<input
							value={slug}
							onChange={e => setSlug(e.target.value)}
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

export default CreatePageForm
