import { useEffect, useState } from 'react'
import { useUpdatePageField } from '../hooks/cms/pageFields/usePageFields'

interface IFieldDetailProps {
	id: string
	title: string
	name: string
	html: string
}

const FieldDetail = (props: IFieldDetailProps) => {
	const { id, name, title, html } = props
	const [value, setValue] = useState(html)
	const [isShowMessage, setIsShowMessage] = useState(false)
	const [, setIsEditing] = useState(false)

	const {
		mutate: updatePageField,
		isSuccess: isUpdateSuccess,
		isPending: isUpdateLoading,
		isError: isUpdateError
	} = useUpdatePageField()

	const saveField = () => {
		updatePageField({
			id: id,
			payload: {
				html: value
			}
		})
		setIsEditing(false)
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value)
		setIsEditing(true)
	}

	// Используем useEffect для сброса режима редактирования после успешного обновления
	useEffect(() => {
		if (isUpdateSuccess) {
			setIsEditing(false) // После успешного сохранения сбрасываем режим редактирования
		}
		setIsShowMessage(true)
		setTimeout(() => {
			setIsShowMessage(false)
		}, 3000)
	}, [isUpdateSuccess]) // Срабатывает только когда isUpdateSuccess изменится

	return (
		<div>
			{isShowMessage && isUpdateSuccess && !isUpdateLoading && (
				<div className="text-green-600 text-sm mt-2">
					Данные успешно сохранены!
				</div>
			)}

			{isShowMessage && isUpdateError && !isUpdateLoading && (
				<div className="text-red-600 text-sm mt-2">
					Ошибка при сохранении данных.
				</div>
			)}

			<div className="flex justify-between items-center mb-3">
				<div className="text-xl">{title}</div>
				{html !== value && (
					<button
						onClick={saveField}
						disabled={isUpdateLoading}
						className="p-2 font-bold text-green-600 hover:text-green-800 hover:underline"
					>
						{isUpdateLoading ? 'Сохранение...' : 'Сохранить'}
					</button>
				)}
			</div>
			<div className="text-sm">dev({name})</div>
			<textarea
				className="p-2 mb-2 text-left rounded border border-navy h-40 w-full"
				name={name}
				value={value}
				onChange={handleChange}
				disabled={isUpdateLoading}
			></textarea>
		</div>
	)
}

export default FieldDetail
