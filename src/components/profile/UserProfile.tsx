import { useState } from 'react'
import { getUserProfile, getUserRepos, getUserEvents } from '../../utils/api'
import { format } from 'date-fns'
import { FaGithub, FaTwitter, FaMapMarkerAlt, FaLink, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import RepoList from './RepoList'
import ProfileAnalysis from './ProfileAnalysis'
import { useCache } from '../../hooks/useCache'

interface UserProfileProps {
  username: string
  onClose: () => void
}

export default function UserProfile({ username, onClose }: UserProfileProps) {
  const [repoPage, setRepoPage] = useState(1)
  const perPage = 10

  const { data: user, isLoading: isLoadingUser, error: userError } = useCache({
    queryKey: ['user', username],
    queryFn: () => getUserProfile(username),
    cacheType: 'profile'
  })

  const { data: repos, isLoading: isLoadingRepos, error: reposError } = useCache({
    queryKey: ['repos', username, repoPage],
    queryFn: () => getUserRepos(username, repoPage, perPage),
    cacheType: 'profile'
  })

  const { data: events, isLoading: isLoadingEvents, error: eventsError } = useCache({
    queryKey: ['events', username],
    queryFn: () => getUserEvents(username),
    cacheType: 'profile'
  })

  if (isLoadingUser || isLoadingRepos || isLoadingEvents) return <div className="text-center">Loading...</div>
  if (userError || reposError || eventsError) return <div className="text-center text-red-500">Error loading profile</div>
  if (!user || !repos || !events) return null

  const totalPages = Math.ceil(user.public_repos / perPage)

  return (
    <div className="bg-vercel-light-accent dark:bg-vercel-dark-accent text-vercel-light-text dark:text-vercel-dark-text rounded-lg shadow-lg p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary hover:text-vercel-light-text dark:hover:text-vercel-dark-text"
      >
        <FaTimes size={24} />
      </button>
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img src={user.avatar_url} alt={user.name} className="w-32 h-32 rounded-full mb-4 md:mr-6" />
        <div>
          <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
          <p className="text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary mb-2">{user.login}</p>
          {user.bio && <p className="mb-2">{user.bio}</p>}
          <div className="flex flex-wrap gap-4 mb-4">
            {user.location && (
              <span className="flex items-center text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary">
                <FaMapMarkerAlt className="mr-1" /> {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:underline"
              >
                <FaLink className="mr-1" /> Website
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:underline"
              >
                <FaTwitter className="mr-1" /> @{user.twitter_username}
              </a>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <span className="font-semibold">{user.followers} followers</span>
            <span className="font-semibold">{user.following} following</span>
            <span className="font-semibold">{user.public_repos} repositories</span>
          </div>
          <p className="text-sm text-vercel-light-text-secondary dark:text-vercel-dark-text-secondary">
            Joined GitHub on {format(new Date(user.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
      <ProfileAnalysis events={events} repos={repos} />
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Repositories</h3>
        <RepoList repos={repos} />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setRepoPage((prev) => Math.max(prev - 1, 1))}
            disabled={repoPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>
          <span>
            Page {repoPage} of {totalPages}
          </span>
          <button
            onClick={() => setRepoPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={repoPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}