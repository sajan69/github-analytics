import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { FaGithub, FaTwitter, FaLink,FaLinkedin } from 'react-icons/fa'; // Import Font Awesome icons
import SearchBar from './components/search/SearchBar'
import SearchResults from './components/search/SearchResults'
import RateLimitIndicator from './components/search/RateLimitIndicator'
import UserProfile from './components/profile/UserProfile'
import RepositoryProfile from './components/repository/RepositoryProfile'
import TrendingSection from './components/trending/TrendingSection'
import ErrorBoundary from './components/ErrorBoundary'
import { useDarkMode } from './hooks/useDarkMode'

const queryClient = new QueryClient()

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'users' | 'repositories'>('users')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<{ owner: string; repo: string } | null>(null)
  
  // Set dark mode to true by default
  const [isDarkMode] = useDarkMode(true); // Pass true to set dark mode by default

  const handleSearch = (query: string, type: 'users' | 'repositories') => {
    setSearchQuery(query)
    setSearchType(type)
    setSelectedUser(null)
    setSelectedRepo(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode
          ? 'dark bg-vercel-dark text-vercel-dark-text'
          : 'bg-vercel-light text-vercel-light-text'
      }`}>
        <header className={`shadow ${isDarkMode ? 'bg-vercel-dark-accent' : 'bg-vercel-light-accent'}`}>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <a href="/" className="text-3xl font-bold text-white-500 ">GitHub Analytics</a>
            <div className="flex items-center">
              <span className="text-lg font-semibold mr-4">Sajan Adhikari</span>
              
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <ErrorBoundary fallback={<div className="text-red-500">Error in search component</div>}>
              <SearchBar onSearch={handleSearch} />
              <RateLimitIndicator />
              {selectedUser ? (
                <ErrorBoundary fallback={<div className="text-red-500">Error loading user profile</div>}>
                  <UserProfile username={selectedUser} onClose={() => setSelectedUser(null)} />
                </ErrorBoundary>
              ) : selectedRepo ? (
                <ErrorBoundary fallback={<div className="text-red-500">Error loading repository</div>}>
                  <RepositoryProfile
                    owner={selectedRepo.owner}
                    repo={selectedRepo.repo}
                    onClose={() => setSelectedRepo(null)}
                  />
                </ErrorBoundary>
              ) : searchQuery ? (
                <ErrorBoundary fallback={<div className="text-red-500">Error in search results</div>}>
                  <SearchResults
                    query={searchQuery}
                    type={searchType}
                    onUserSelect={setSelectedUser}
                    onRepoSelect={(owner, repo) => setSelectedRepo({ owner, repo })}
                  />
                </ErrorBoundary>
              ) : (
                <ErrorBoundary fallback={<div className="text-red-500">Error loading trending section</div>}>
                  <TrendingSection />
                </ErrorBoundary>
              )}
            </ErrorBoundary>
          </div>
        </main>
        <footer className={`py-4 ${isDarkMode ? 'bg-vercel-dark-accent' : 'bg-vercel-light-accent'}`}>
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-vercel-light-text dark:text-vercel-dark-text">© 2024 Sajan Adhikari. All rights reserved.</p>
            <div className="flex justify-center space-x-4">
              <a href="https://sajanadhikari.com.np" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <FaLink className="inline mr-1" /> {/* Link icon */}
              </a>
              <a href="https://twitter.com/sajanadhikari_" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <FaTwitter className="inline mr-1" /> {/* Twitter icon */}
              </a>
              <a href="https://www.linkedin.com/in/sajanadhikari/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <FaLinkedin className="inline mr-1" /> {/* LinkedIn icon */}
              </a>
              <a href="https://github.com/sajan69" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                <FaGithub className="inline mr-1" /> {/* GitHub icon */}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}