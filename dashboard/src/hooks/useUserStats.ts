import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { usersStatsApi, type UserStats } from '../api/usersStats'

export function useUserStats(
	id: string | null
): UseQueryResult<UserStats | null, unknown> {
	return useQuery({
		queryKey: ['users', id, 'stats'],
		queryFn: () =>
			id
				? usersStatsApi.getById(id)
				: Promise.resolve(null as UserStats | null),
		enabled: !!id
	})
}
