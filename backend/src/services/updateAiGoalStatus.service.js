import { prisma } from '../lib/prisma.js'

export const updateAiGoalStatus = async (id, description, status) => {
	return await prisma.$transaction(async tx => {
		return await tx.aiGoal.update({
			where: { id },
			data: {
				description,
				status
			}
		})
	})
}
