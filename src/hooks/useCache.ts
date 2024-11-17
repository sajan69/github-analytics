import { useQuery, QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { getCache, setCache } from '../utils/cache'

export function useCache<TData>(
  options: {
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    cacheType: 'search' | 'profile' | 'trending',
    config?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
  }
) {
  const { queryKey, queryFn, cacheType, config } = options

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const cachedData = getCache(JSON.stringify(queryKey), cacheType)
      if (cachedData) {
        return cachedData as TData
      }
      const data = await queryFn()
      setCache(JSON.stringify(queryKey), data, cacheType)
      return data
    },
    ...config
  })
}