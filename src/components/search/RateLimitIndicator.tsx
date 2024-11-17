import { useCache } from '../../hooks/useCache'
import { getRateLimit } from '../../utils/api'

export default function RateLimitIndicator() {
  const { data, isLoading, error } = useCache({
    queryKey: ['rateLimit'],
    queryFn: getRateLimit,
    cacheType: 'search',
    config: {
      refetchInterval: 60000, // Refetch every minute
    }
  })

  if (isLoading) return <div className="text-sm text-vercel-dark-text">Loading rate limit...</div>
  if (error) return <div className="text-sm text-red-500">Error fetching rate limit</div>
  if (!data) return null

  const { remaining, limit, reset } = data.rate
  const percentage = (remaining / limit) * 100
  const resetDate = new Date(reset * 1000)

  return (
    <div className="mb-4 bg-vercel-light dark:bg-vercel-dark p-4 rounded-md shadow dark:shadow-dark">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-vercel-light-text dark:text-vercel-dark-text-secondary">API Rate Limit</span>
          <span className="text-sm font-medium text-vercel-light-text dark:text-vercel-dark-text-secondary">
            {remaining} / {limit}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary mt-1">
          Resets at: {resetDate.toLocaleTimeString()}
        </p>
      </div>
  )
}