import { useState } from 'react'
import { searchGitHub } from '../../utils/api'
import { FaChevronLeft, FaChevronRight, FaUser, FaBook, FaStar, FaCodeBranch } from 'react-icons/fa'
import { useCache } from '../../hooks/useCache'

interface SearchResultsProps {
  query: string
  type: 'users' | 'repositories'
  onUserSelect: (username: string) => void
  onRepoSelect: (owner: string, repo: string) => void
}

export default function SearchResults({ query, type, onUserSelect, onRepoSelect }: SearchResultsProps) {
  const [page, setPage] = useState(1)
  const perPage = 30

  const { data, isLoading, error } = useCache({
    queryKey: ['search', query, type, page],
    queryFn: () => searchGitHub(query, type, page, perPage),
    cacheType: 'search',
    config: {
      enabled: !!query,
    }
  })

  if (isLoading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error: {(error as Error).message}</div>
  if (!data || data.items.length === 0) return <div className="text-center">No results found</div>

  const totalPages = Math.ceil(data.total_count / perPage)

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {data.items.map((item: any) => (
          <div
            key={item.id}
            className="bg-vercel-light dark:bg-vercel-dark-accent p-4 rounded-md shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => type === 'users' ? onUserSelect(item.login) : onRepoSelect(item.owner.login, item.name)}
          >
            {type === 'users' ? (
              <div className="flex items-center mb-2">
                <img src={item.avatar_url} alt={item.login} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{item.login}</h3>
                  <p className="text-sm text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary flex items-center">
                    <FaUser className="mr-1" /> User
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">{item.full_name}</h3>
                <p className="text-sm text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary mb-2">{item.description}</p>
                <div className="flex items-center gap-4 text-sm text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary">
                  <span className="flex items-center">
                    <FaStar className="mr-1" /> {item.stargazers_count}
                  </span>
                  <span className="flex items-center">
                    <FaCodeBranch className="mr-1" /> {item.forks_count}
                  </span>
                  {item.language && <span>{item.language}</span>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}