import { Router } from 'express'

import {
	createAiGoal,
	getAllAiGoal,
	getIdAiGoal
} from '../controllers/aiGoal.controller.js'
import {
	createAiGoalMessage,
	deleteAiGoalMessage,
	getAiGoalMessageById,
	getAllAiGoalMessages,
	updateAiGoalMessage
} from '../controllers/aiGoalMessages.controller.js'
import {
	createAiQA,
	getAllAiQA,
	getIdAiQA
} from '../controllers/aiQA.controller.js'
import {
	enqueueBotMessage,
	enqueueBotMessageVideo
} from '../controllers/bot/messages.controller.js'
import {
	createBotCommand,
	deleteBotCommand,
	getAllBotCommands,
	getBotCommandById,
	updateBotCommand
} from '../controllers/botCommands.controller.js'
import { userCheck } from '../controllers/checkMail.controller.js'
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
import { register } from '../controllers/register.controller.js'
import {
	createVisit,
	getAllVisits
} from '../controllers/stats/visit.controller.js'
import { getAllUsers } from '../controllers/users.controller.js'
import { getUserStats } from '../controllers/users.stats.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { requireAdmin } from '../middlewares/requireAdmin.middleware.js'

const index = Router()

// ─── Public auth ────────────────────────────────────────────────────────────
index.route('/auth/login').post(login)
index.route('/auth/register').post(register)
index.route('/auth/check-email').post(userCheck)

// ─── Current user info (любой авторизованный) ───────────────────────────────
index.get('/auth/me', auth, (req, res) => {
	const { id, email, role } = req.user
	res.json({ id, email, role })
})

// ─── Users (admin only) ──────────────────────────────────────────────────────
index.route('/users').get(auth, requireAdmin, getAllUsers)

// ─── Stats ───────────────────────────────────────────────────────────────────
index.route('/stats/visit').post(auth, createVisit)
index.route('/stats/visit').get(auth, requireAdmin, getAllVisits)
index.route('/users/:id/stats').get(auth, requireAdmin, getUserStats)

// ─── Bot messages (admin only) ───────────────────────────────────────────────
index.route('/bot/message').post(auth, requireAdmin, enqueueBotMessage)
index
	.route('/bot/message/video')
	.post(auth, requireAdmin, enqueueBotMessageVideo)

// ─── CMS: pages (admin only) ─────────────────────────────────────────────────
index.route('/cms/pages').post(auth, requireAdmin, createPage)
index.route('/cms/pages').get(auth, requireAdmin, getAllPages)
index.route('/cms/pages/:id').get(auth, getIdPage)
index.route('/cms/pages/:id').put(auth, requireAdmin, updatePage)
index.route('/cms/pages/:id').delete(auth, requireAdmin, deletePage)

// ─── CMS: page fields (admin only) ───────────────────────────────────────────
index.route('/cms/page-fields').post(auth, requireAdmin, createPageField)
index.route('/cms/page-fields').get(auth, requireAdmin, getAllPageFields)
index.route('/cms/page-fields/:id').get(auth, getIdPageField)
index.route('/cms/page-fields/:id').put(auth, requireAdmin, updatePageField)
index.route('/cms/page-fields/:id').delete(auth, requireAdmin, deletePageField)

// ─── CMS: page field groups (admin only) ─────────────────────────────────────
index
	.route('/cms/page-field-groups')
	.post(auth, requireAdmin, createPageFieldGroup)
index
	.route('/cms/page-field-groups')
	.get(auth, requireAdmin, getAllPageFieldGroups)
index
	.route('/cms/page-field-groups/:id')
	.get(auth, requireAdmin, getIdPageFieldGroup)
index
	.route('/cms/page-field-groups/:id')
	.put(auth, requireAdmin, updatePageFieldGroup)
index
	.route('/cms/page-field-groups/:id')
	.delete(auth, requireAdmin, deletePageFieldGroup)

// ─── AI: goals (private) ─────────────────────────────────────────────────────
index.route('/ai/goals').post(auth, createAiGoal)
index.route('/ai/goals').get(auth, getAllAiGoal)
index.route('/ai/goals/:id').get(auth, getIdAiGoal)

// ─── AI: Q&A (private) ───────────────────────────────────────────────────────
index.route('/ai/qa').post(auth, createAiQA)
index.route('/ai/qa').get(auth, getAllAiQA)
index.route('/ai/qa/:id').get(auth, getIdAiQA)

// ─── Bot Commands (admin only) ───────────────────────────────────────────────
index.route('/bot-commands').post(auth, requireAdmin, createBotCommand)
index.route('/bot-commands').get(auth, requireAdmin, getAllBotCommands)
index.route('/bot-commands/:id').get(auth, requireAdmin, getBotCommandById)
index.route('/bot-commands/:id').put(auth, requireAdmin, updateBotCommand)
index.route('/bot-commands/:id').delete(auth, requireAdmin, deleteBotCommand)

// ─── AI Goal Messages (admin only) ───────────────────────────────────────────
index.route('/ai-goal-messages').post(auth, requireAdmin, createAiGoalMessage)
index.route('/ai-goal-messages').get(auth, requireAdmin, getAllAiGoalMessages)
index
	.route('/ai-goal-messages/:id')
	.get(auth, requireAdmin, getAiGoalMessageById)
index
	.route('/ai-goal-messages/:id')
	.put(auth, requireAdmin, updateAiGoalMessage)
index
	.route('/ai-goal-messages/:id')
	.delete(auth, requireAdmin, deleteAiGoalMessage)

export default index
