import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import type { Page, PageField, PageFieldGroup } from '../api/pages'
import {
	useCreatePageFieldGroup,
	useGetAllPageFieldGroups
} from '../hooks/cms/pageFieldGroups/usePageFieldGroups'
import {
	useCreatePageField,
	useGetAllPageFields
} from '../hooks/cms/pageFields/usePageFields'
import {
	useCreatePage,
	useGetAllPages as useGetAllPagesApi
} from '../hooks/cms/pages/usePages'

function CreatePageModal({
	onClose,
	onCreate
}: {
	onClose: () => void
	onCreate: (payload: { title: string; slug: string }) => void
}) {
	const [title, setTitle] = useState('')
	const [slug, setSlug] = useState('')

	const submit = (e: FormEvent) => {
		e.preventDefault()
		if (!title) return
		onCreate({ title, slug })
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

function CreateFieldForm({
	pageId,
	groups,
	onCreated,
	initialGroupId
}: {
	pageId: string
	groups: PageFieldGroup[]
	onCreated?: () => void
	initialGroupId?: string | null
}) {
	const [name, setName] = useState('')
	const [html, setHtml] = useState('')
	const [groupId, setGroupId] = useState<string | undefined>(
		initialGroupId ?? undefined
	)
	const create = useCreatePageField()

	const submit = async (e: FormEvent) => {
		e.preventDefault()
		if (!name) return
		await create.mutateAsync({
			pageId,
			pageGroupId: groupId ?? null,
			name,
			html,
			displayOrder: 0
		})
		setName('')
		setHtml('')
		setGroupId(undefined)
		onCreated?.()
	}

	return (
		<form
			onSubmit={submit}
			className="mt-3 p-3 border rounded bg-white"
		>
			<div className="mb-2">
				<label className="text-sm text-gray-600">Поле (name)</label>
				<input
					value={name}
					onChange={e => setName(e.target.value)}
					className="w-full mt-1 p-2 border rounded"
				/>
			</div>
			<div className="mb-2">
				<label className="text-sm text-gray-600">HTML</label>
				<textarea
					value={html}
					onChange={e => setHtml(e.target.value)}
					className="w-full mt-1 p-2 border rounded h-28"
				/>
			</div>
			<div className="mb-2">
				<label className="text-sm text-gray-600">Группа (опционально)</label>
				<select
					value={groupId ?? ''}
					onChange={e => setGroupId(e.target.value || undefined)}
					className="w-full mt-1 p-2 border rounded"
				>
					<option value="">Без группы</option>
					{groups.map(g => (
						<option
							key={g.id}
							value={g.id}
						>
							{g.title || g.name}
						</option>
					))}
				</select>
			</div>
			<div>
				<button
					type="submit"
					className="px-3 py-2 bg-green-500 text-white rounded"
				>
					Добавить поле
				</button>
			</div>
		</form>
	)
}

function CreateGroupForm({
	pageId,
	onCreated
}: {
	pageId: string
	onCreated: (id: string) => void
}) {
	const [name, setName] = useState('')
	const [title, setTitle] = useState('')
	const createGroup = useCreatePageFieldGroup()

	const submit = (e: FormEvent) => {
		e.preventDefault()
		if (!name) return
		createGroup.mutate(
			{ pageId, name, title: title || null, displayOrder: 0 },
			{
				onSuccess(res) {
					const id = res?.pageFieldGroup?.id
					if (id) onCreated(id)
				}
			}
		)
	}

	return (
		<form
			onSubmit={submit}
			className="mt-3 flex gap-2"
		>
			<input
				value={name}
				onChange={e => setName(e.target.value)}
				placeholder="name"
				className="p-2 border rounded w-1/2"
			/>
			<input
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="title (optional)"
				className="p-2 border rounded w-1/2"
			/>
			<button
				type="submit"
				className="px-3 py-1 bg-blue-600 text-white rounded"
			>
				Создать
			</button>
		</form>
	)
}

function EditPage() {
	const { data: pagesData } = useGetAllPagesApi()
	const createPage = useCreatePage()
	const { data: groupsData } = useGetAllPageFieldGroups()
	const { data: fieldsData } = useGetAllPageFields()

	const pages: Page[] = pagesData?.pages ?? []
	const groups: PageFieldGroup[] = groupsData?.pageFieldGroups ?? []
	const fields: PageField[] = fieldsData?.pageFields ?? []

	const [selectedPageId, setSelectedPageId] = useState<string | null>(null)

	const effectiveSelectedPageId = selectedPageId ?? pages[0]?.id ?? null

	const [showCreatePageModal, setShowCreatePageModal] = useState(false)
	const [showFieldForm, setShowFieldForm] = useState(false)
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
	const [showCreateGroupForm, setShowCreateGroupForm] = useState(false)
	const createGroup = useCreatePageFieldGroup()

	const pageGroups = groups.filter(g => g.pageId === effectiveSelectedPageId)
	const pageFields = fields.filter(f => f.pageId === effectiveSelectedPageId)

	function handleCreatePage(payload: { title: string; slug: string }) {
		console.log('handleCreatePage', payload)
		createPage.mutate(payload, {
			onSuccess(res) {
				const newId = res?.page?.id
				if (newId) {
					setSelectedPageId(newId)
					// after creating page, create an empty default group
					if (typeof createGroup !== 'undefined') {
						createGroup.mutate(
							{
								pageId: newId,
								name: 'default',
								title: 'Default',
								displayOrder: 0
							},
							{
								onSuccess(gr) {
									const gid = gr?.pageFieldGroup?.id
									if (gid) setSelectedGroupId(gid)
									setShowCreatePageModal(false)
									setShowFieldForm(true)
								}
							}
						)
					} else {
						setShowCreatePageModal(false)
					}
				}
			},
			onError(err) {
				console.error('createPage error', err)
			}
		})
	}

	return (
		<div className="max-w-6xl">
			<h1 className="text-2xl font-bold">Редактор страниц</h1>
			<div className="mt-4 flex gap-4">
				<div className="w-64">
					<div className="flex flex-col gap-2">
						{pages.map(p => (
							<button
								key={p.id}
								onClick={() => setSelectedPageId(p.id)}
								className={`w-full text-left p-2 rounded ${effectiveSelectedPageId === p.id ? 'bg-blue-500 text-white' : 'bg-white border'}`}
							>
								{p.title}
							</button>
						))}
					</div>
				</div>
				<div className="w-1/3">
					<div className="p-2 border rounded bg-white">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Группы</h3>
							<button
								onClick={() => setShowCreateGroupForm(s => !s)}
								className="text-sm text-blue-600"
							>
								+ Создать группу
							</button>
						</div>
						{showCreateGroupForm && (
							<CreateGroupForm
								pageId={effectiveSelectedPageId!}
								onCreated={gid => {
									setSelectedGroupId(gid)
									setShowCreateGroupForm(false)
									setShowFieldForm(true)
								}}
							/>
						)}
						<div className="mt-3 space-y-2">
							{pageGroups.map(g => (
								<div
									key={g.id}
									onClick={() => setSelectedGroupId(g.id)}
									className={`p-2 border rounded cursor-pointer ${selectedGroupId === g.id ? 'bg-gray-100' : 'bg-white'}`}
								>
									<div className="font-medium">{g.title || g.name}</div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="flex-1">
					<div className="p-2">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Поля</h3>
							<button
								onClick={() => setShowFieldForm(s => !s)}
								className="text-sm text-blue-600"
							>
								+ Добавить поле
							</button>
						</div>
						<div className="mt-3 space-y-3">
							{pageFields.map(f => (
								<div
									key={f.id}
									className="p-3 border rounded bg-gray-50"
								>
									<div className="font-medium">{f.name}</div>
									<div
										className="text-sm mt-1"
										dangerouslySetInnerHTML={{ __html: f.html }}
									/>
								</div>
							))}
							{showFieldForm && (
								<CreateFieldForm
									pageId={effectiveSelectedPageId!}
									groups={pageGroups}
									initialGroupId={selectedGroupId ?? undefined}
									onCreated={() => setShowFieldForm(false)}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{showCreatePageModal && (
				<CreatePageModal
					onClose={() => setShowCreatePageModal(false)}
					onCreate={handleCreatePage}
				/>
			)}
		</div>
	)
}

export const Route = createFileRoute('/edit-old')({
	component: EditPage
})
