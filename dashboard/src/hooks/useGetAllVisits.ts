import { useQuery } from '@tanstack/react-query'
import { statsApi } from '../api/stats.tsx'

export function useGetAllVisits() {
	return useQuery({
		queryKey: ['stats', 'getAll', 'visits'],
		queryFn: () => statsApi.getAllVisits(),
		retry: true
	})
}
