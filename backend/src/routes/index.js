import { Router } from 'express'

import {
	createAiGoal,
	getAllAiGoal,
	getIdAiGoal
} from '../controllers/aiGoal.controller.js'
import {
	createAiQA,
	getAllAiQA,
	getIdAiQA
} from '../controllers/aiQA.controller.js'
import {
	createPageFieldGroup,
	deletePageFieldGroup,
	getAllPageFieldGroups,
	getIdPageFieldGroup,
	updatePageFieldGroup
} from '../controllers/cms/pageFieldGroups.controller.js'
import {
	createPageField,
	deletePageField,
	getAllPageFields,
	getIdPageField,
	updatePageField
} from '../controllers/cms/pageFields.controller.js'
import {
	createPage,
	deletePage,
	getAllPages,
	getIdPage,
	updatePage
} from '../controllers/cms/pages.controller.js'
import { login } from '../controllers/login.controller.js'
import { createVisit, getAllVisits } from '../controllers/visit.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const index = Router()

index.route('/login').post(login)

// stats
index.route('/stats/visit').post(auth, createVisit)

// TODO: remove auth for testing purpose
index.route('/stats/visit').get(getAllVisits)

//CMS
// TODO: remove auth for testing purpose

// pages
index.route('/cms/pages').post(createPage)
index.route('/cms/pages').get(getAllPages)
index.route('/cms/pages/:id').get(getIdPage)
index.route('/cms/pages/:id').put(updatePage)
index.route('/cms/pages/:id').delete(deletePage)
// page fields
index.route('/cms/page-fields').post(createPageField)
index.route('/cms/page-fields').get(getAllPageFields)
index.route('/cms/page-fields/:id').get(getIdPageField)
index.route('/cms/page-fields/:id').put(updatePageField)
index.route('/cms/page-fields/:id').delete(deletePageField)
// page field groups
index.route('/cms/page-field-groups').post(createPageFieldGroup)
index.route('/cms/page-field-groups').get(getAllPageFieldGroups)
index.route('/cms/page-field-groups/:id').get(getIdPageFieldGroup)
index.route('/cms/page-field-groups/:id').put(updatePageFieldGroup)
index.route('/cms/page-field-groups/:id').delete(deletePageFieldGroup)

// AI
// goals
index.route('/ai/goals').post(auth, createAiGoal)
index.route('/ai/goals').get(auth, getAllAiGoal)
index.route('/ai/goals/:id').get(auth, getIdAiGoal)
// Q&A
index.route('/ai/qa').post(auth, createAiQA)
index.route('/ai/qa').get(auth, getAllAiQA)
index.route('/ai/qa/:id').get(auth, getIdAiQA)

export default index
