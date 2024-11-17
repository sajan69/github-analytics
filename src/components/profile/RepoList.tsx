import { useState } from 'react'
import { format } from 'date-fns'
import { FaStar, FaCodeBranch, FaEye } from 'react-icons/fa'
import RepoAnalysis from '../repository/RepoAnalysis'

interface Repo {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string
  updated_at: string
  html_url: string
  owner: {
    login: string
  }
}

interface RepoListProps {
  repos: Repo[]
}

export default function RepoList({ repos }: RepoListProps) {
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <div key={repo.id} className="border dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
          <h4 className="text-lg font-semibold mb-2">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {repo.name}
            </a>
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{repo.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
            <span>Updated {format(new Date(repo.updated_at), 'MMM d, yyyy')}</span>
          </div>
          <button
            onClick={() => setSelectedRepo(selectedRepo?.id === repo.id ? null : repo)}
            className="mt-2 text-sm text-blue-500 hover:underline focus:outline-none"
          >
            {selectedRepo?.id === repo.id ? 'Hide Analysis' : 'Show Analysis'}
          </button>
          {selectedRepo?.id === repo.id && (
            <RepoAnalysis owner={repo.owner.login} repo={repo.name} />
          )}
        </div>
      ))}
    </div>
  )
}