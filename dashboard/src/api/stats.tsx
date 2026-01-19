import { instance } from '../helpers/instance.tsx'

export const statsApi = {
	getAllVisits: async () => {
		const { data } = await instance.get('/stats/visit')
		return data
	}
}
