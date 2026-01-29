import { prisma } from '../../lib/prisma.js'

//TODO: access должен быть Private
// @desc Создает группу для страниц в админке
// @route POST /api/cms/page-field-groups
// @access Public
export const createPageFieldGroup = async (req, res) => {
	try {
		const { pageId, name, title, displayOrder } = req.body

		const pageFieldGroup = await prisma.pageFieldGroup.create({
			data: {
				pageId,
				name,
				title,
				displayOrder
			}
		})

		return res.status(201).json({ success: true, pageFieldGroup })
	} catch (e) {
		console.error('createPageFieldGroup error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

//TODO: access должен быть Private
// @desc Получает все группы для страниц страницы
// @route GET /api/cms/page-field-groups
// @access Public
export const getAllPageFieldGroups = async (req, res) => {
	try {
		const pageFieldGroups = await prisma.pageFieldGroup.findMany()

		return res.status(200).json({ success: true, pageFieldGroups })
	} catch (e) {
		console.error('getAllPageFieldGroups error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

//TODO: access должен быть Private
// @desc Получает группу для страниц по id
// @route GET /api/cms/page-field-groups/:id
// @access Public
export const getIdPageFieldGroup = async (req, res) => {
	try {
		const { id } = req.params

		const pageFieldGroup = await prisma.pageFieldGroup.findUnique({
			where: { id }
		})
		if (!pageFieldGroup) {
			return res.status(404).json({ success: false, error: 'not_found' })
		}

		return res.status(200).json({ success: true, pageFieldGroup })
	} catch (e) {
		console.error('getIdPageFieldGroup error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

//TODO: access должен быть Private
// @desc Изменяет группу для страниц по id
// @route PUT /api/cms/page-field-groups/:id
// @access Public
export const updatePageFieldGroup = async (req, res) => {
	try {
		const { id } = req.params
		const { pageId, name, displayOrder } = req.body

		const pageFieldGroup = await prisma.pageFieldGroup.update({
			where: { id },
			data: {
				pageId,
				name,
				displayOrder
			}
		})

		return res.status(200).json({ success: true, pageFieldGroup })
	} catch (e) {
		console.error('updatePageFieldGroup error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}

//TODO: access должен быть Private
//TODO: при удалении удаляются и записи связанные
// @desc Удаляет группу для страниц по id
// @route DELETE /api/cms/page-field-groups/:id
// @access Public
export const deletePageFieldGroup = async (req, res) => {
	try {
		const { id } = req.params

		await prisma.pageFieldGroup.delete({
			where: { id }
		})

		return res.status(200).json({ success: true })
	} catch (e) {
		console.error('deletePageFieldGroup error', e)
		return res.status(500).json({ success: false, error: 'internal_error' })
	}
}
