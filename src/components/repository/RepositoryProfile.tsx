import { useState } from 'react'
import { FaTimes, FaStar, FaCodeBranch, FaEye } from 'react-icons/fa'
import { getRepoLanguages, getRepoContributors,getRepoDetails } from '../../utils/api'
import { useCache } from '../../hooks/useCache'
import RepoAnalysis from './RepoAnalysis'

interface RepositoryProfileProps {
  owner: string
  repo: string
  onClose: () => void
}

export default function RepositoryProfile({ owner, repo, onClose }: RepositoryProfileProps) {
  const { data: repoData, isLoading: isLoadingRepo, error: repoError } = useCache({
    queryKey: ['repo', owner, repo],
    queryFn: async () => {
      try {
        const data = await getRepoDetails(owner, repo)
        return data
      } catch (error) {
        console.error('Repository fetch error:', error)
        throw error
      }
    },
    cacheType: 'repository',
    config: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  })

  const { data: languages, isLoading: isLoadingLanguages, error: languagesError } = useCache({
    queryKey: ['languages', owner, repo],
    queryFn: async () => {
      try {
        const data = await getRepoLanguages(owner, repo)
        return data
      } catch (error) {
        console.error('Languages fetch error:', error)
        throw error
      }
    },
    cacheType: 'repository'
  })

  const { data: contributors, isLoading: isLoadingContributors, error: contributorsError } = useCache({
    queryKey: ['contributors', owner, repo],
    queryFn: async () => {
      try {
        const data = await getRepoContributors(owner, repo)
        return data
      } catch (error) {
        console.error('Contributors fetch error:', error)
        throw error
      }
    },
    cacheType: 'repository'
  })

  if (isLoadingRepo || isLoadingLanguages || isLoadingContributors) {
    return <div className="text-center text-vercel-light dark:text-vercel-dark">Loading...</div>
  }

  if (repoError || languagesError || contributorsError) {
    return (
      <div className="text-center text-red-500">
        Error loading repository data: 
        {(repoError as Error)?.message || (languagesError as Error)?.message || (contributorsError as Error)?.message}
      </div>
    )
  }

  if (!repoData) return null

  return (
    <div className="bg-vercel-light dark:bg-vercel-dark rounded-lg shadow-lg p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-vercel-light dark:text-vercel-dark hover:text-vercel-light-text dark:hover:text-vercel-dark-text"
      >
        <FaTimes size={24} />
      </button>
      <img src={repoData.owner.avatar_url} alt={repoData.owner.login} className="w-32 h-32 rounded-full mb-4" />
      <a href={repoData.html_url} target="_blank" rel="noopener noreferrer">
      <h2 className="text-2xl font-bold mb-4 text-vercel-light-text dark:text-vercel-dark-text">
        {repoData.full_name}
      </h2>
      </a>
      <p className="mb-4 text-vercel-light-text dark:text-vercel-dark-text">
        {repoData.description}
      </p>
      <div className="flex gap-4 mb-4 text-vercel-light-text dark:text-vercel-dark-text">
        <span className="flex items-center">
          <FaStar className="mr-1" /> {repoData.stargazers_count} stars
        </span>
        <span className="flex items-center">
          <FaCodeBranch className="mr-1" /> {repoData.forks_count} forks
        </span>
        <span className="flex items-center">
          <FaEye className="mr-1" /> {repoData.watchers_count} watchers
        </span>
      </div>
      <RepoAnalysis languages={languages} contributors={contributors} />
    </div>
  )
}