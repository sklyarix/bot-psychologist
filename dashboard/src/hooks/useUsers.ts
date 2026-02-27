import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { User } from '../api/users'
import { usersApi } from '../api/users'

export function useGetAllUsers(): UseQueryResult<
	{ success: boolean; users: User[] },
	unknown
> {
	return useQuery({
		queryKey: ['users', 'all'],
		queryFn: () => usersApi.getAll()
	})
}
