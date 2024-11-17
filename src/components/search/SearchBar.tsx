import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

interface SearchBarProps {
  onSearch: (query: string, type: 'users' | 'repositories') => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'users' | 'repositories'>('users')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query, searchType)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search GitHub ${searchType}...`}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-vercel-dark-accent dark:border-gray-600 dark:text-vercel-dark-text"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <div className="ml-2 flex">
          <button
            type="button"
            onClick={() => setSearchType('users')}
            className={`px-3 py-1 rounded-l-md ${
              searchType === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-vercel-dark-accent dark:text-vercel-dark-text-secondary'
            }`}
          >
            Users
          </button>
          <button
            type="button"
            onClick={() => setSearchType('repositories')}
            className={`px-3 py-1 rounded-r-md ${
              searchType === 'repositories'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-vercel-dark-accent dark:text-vercel-dark-text-secondary'
            }`}
          >
            Repos
          </button>
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
    </form>
  )
}