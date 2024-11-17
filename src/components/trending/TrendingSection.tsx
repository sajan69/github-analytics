import { getTrendingRepos } from '../../utils/api'
import { FaStar, FaCodeBranch, FaEye } from 'react-icons/fa'
import { useCache } from '../../hooks/useCache'

export default function TrendingSection() {
  const { data: trendingRepos, isLoading, error } = useCache({
    queryKey: ['trendingRepos'],
    queryFn: getTrendingRepos,
    cacheType: 'trending',
    config: {
      staleTime: 6 * 60 * 60 * 1000, // 6 hours
    }
  })

  if (isLoading) return <div className="text-center text-vercel-light-text dark:text-vercel-dark-text-secondary">Loading trending repositories...</div>
  if (error) return <div className="text-center text-red-500">Error fetching trending repositories</div>
  if (!trendingRepos) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl vercel-text-light font-bold mb-4 dark:vercel-text-dark">Trending Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingRepos.map((repo: any) => (
          <div key={repo.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-vercel-light dark:bg-vercel-dark-accent">
          <h3 className="text-lg font-semibold mb-2">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {repo.full_name}
            </a>
          </h3>
          <p className="text-sm text-vercel-light-text dark:text-vercel-dark-text-secondary mb-2">{repo.description}</p>
          <div className="flex items-center gap-4 text-sm text-vercel-light-text dark:text-vercel-dark-text-secondary">
            {repo.language && <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{repo.language}</span>}
            <span className="flex items-center">
              <FaStar className="mr-1" /> {repo.stargazers_count}
            </span>
            <span className="flex items-center">
              <FaCodeBranch className="mr-1" /> {repo.forks_count}
            </span>
            <span className="flex items-center">
              <FaEye className="mr-1" /> {repo.watchers_count}
            </span>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}