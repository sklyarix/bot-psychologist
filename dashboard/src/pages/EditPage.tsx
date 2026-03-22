import { useState } from 'react'
import FieldDetail from '../components/FieldDetail'
import CreateFieldForm from '../components/modals/CreateFieldForm'
import CreateFieldGroupForm from '../components/modals/CreateFieldGroupForm'
import CreatePageForm from '../components/modals/CreatePageForm'
import { useGetAllPages, useGetPageById } from '../hooks/cms/pages/usePages'

type stringOrNull = string | null

const EditPage = () => {
	// Состояния
	const [selectedPageId, setSelectedPageId] = useState<stringOrNull>(null)
	const [selectedGroupId, setSelectedGroupId] = useState<stringOrNull>(null)
	//const [selectedFieldId, setSelectedFieldId] = useState<stringOrNull>(null)

	// Модальные окна
	const [isShowModalCreatePage, setIsShowModalCreatePage] = useState(false)
	const [isShowModalCreateGroup, setIsShowModalCreateGroup] = useState(false)
	const [isShowModalCreateField, setIsShowModalCreateField] = useState(false)

	const { data: pages, isLoading } = useGetAllPages()

	const { data: pageDetail } = useGetPageById(selectedPageId)

	return isLoading ? (
		<p>Загрузка...</p>
	) : (
		<div className="max-w-6xl">
			<h1 className="text-2xl font-bold mb-4">Редактор страниц</h1>

			<div className="flex">
				{/* Pages */}
				<div className="w-1/4">
					<button
						className="mb-6 text-navy rounded-[15px] text-md  font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]"
						onClick={() => setIsShowModalCreatePage(true)}
					>
						Страницы +
					</button>
					{pages?.length === 0 && <p>Нет страниц</p>}

					<ul>
						{pages?.map(page => (
							<li key={page.id}>
								<button
									onClick={() => setSelectedPageId(page.id)}
									className={`p-2 mb-2 text-left rounded ${
										selectedPageId === page.id
											? 'bg-navy text-white'
											: 'hover:bg-gray-200'
									}`}
								>
									{page.title}
								</button>
							</li>
						))}
					</ul>
				</div>

				{/* Groups */}
				<div className="w-1/4">
					<button
						className="mb-6 text-navy rounded-[15px] text-md  font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]"
						onClick={() => setIsShowModalCreateGroup(true)}
					>
						Группы +
					</button>
					{pageDetail?.pageFieldGroups?.length === 0 && <p>Нет групп</p>}
					<ul>
						{pageDetail?.pageFieldGroups?.map(group => (
							<li key={group.id}>
								<button
									onClick={() => setSelectedGroupId(group.id)}
									className={`p-2 mb-2 text-left rounded ${
										selectedGroupId === group.id
											? 'bg-navy text-white'
											: 'hover:bg-gray-200'
									}`}
								>
									<span>{group.title}</span>
									<span className="font-circe">dev({group.name})</span>
								</button>
							</li>
						))}
					</ul>
				</div>

				{/* Fields */}
				<div className="w-1/2">
					<button
						className="mb-6 text-navy rounded-[15px] text-md  font-semibold px-5 py-2 shadow-[1px_4px_4px_0_rgba(0,0,0,0.25)]"
						onClick={() => setIsShowModalCreateField(true)}
					>
						Поля +
					</button>
					{pageDetail?.fields?.length === 0 && <p>Нет полей</p>}
					<ul>
						{pageDetail?.fields?.map(
							field =>
								selectedGroupId === field?.pageGroupId && (
									<li key={field.id}>
										<FieldDetail
											id={field.id}
											name={field.name}
											title={field.title}
											html={field.html}
										/>
									</li>
								)
						)}
					</ul>
				</div>
			</div>

			{isShowModalCreatePage && (
				<CreatePageForm onClose={() => setIsShowModalCreatePage(false)} />
			)}
			{isShowModalCreateGroup && (
				<CreateFieldGroupForm
					onClose={() => setIsShowModalCreateGroup(false)}
					pageId={selectedPageId || ''}
				/>
			)}
			{isShowModalCreateField && (
				<CreateFieldForm
					onClose={() => setIsShowModalCreateField(false)}
					pageId={selectedPageId || ''}
					pageGroupId={selectedGroupId || ''}
				/>
			)}
		</div>
	)
}

export default EditPage
