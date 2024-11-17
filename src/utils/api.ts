import axios from 'axios'

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
})

export const searchGitHub = async (query: string, type: 'users' | 'repositories', page: number = 1, perPage: number = 30) => {
  const response = await githubApi.get(`/search/${type}`, {
    params: { q: query, page, per_page: perPage },
  })
  return response.data
}

export const getUserProfile = async (username: string) => {
  const response = await githubApi.get(`/users/${username}`)
  return response.data
}

export const getUserRepos = async (username: string, page: number = 1, perPage: number = 30) => {
  const response = await githubApi.get(`/users/${username}/repos`, {
    params: { sort: 'updated', direction: 'desc', page, per_page: perPage },
  })
  return response.data
}

export const getRateLimit = async () => {
  const response = await githubApi.get('/rate_limit')
  return response.data
}

export const getTrendingRepos = async () => {
  const date = new Date()
  date.setDate(date.getDate() - 7) // Get repos created in the last 7 days
  const formattedDate = date.toISOString().split('T')[0]

  const response = await githubApi.get('/search/repositories', {
    params: {
      q: `created:>${formattedDate}`,
      sort: 'stars',
      order: 'desc',
      per_page: 10
    }
  })
  return response.data.items
}

export const getRepoLanguages = async (owner: string, repo: string) => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/languages`)
  return response.data
}

export const getRepoContributors = async (owner: string, repo: string) => {
  const response = await githubApi.get(`/repos/${owner}/${repo}/contributors`, {
    params: { per_page: 10 },
  })
  return response.data
}

export const getUserEvents = async (username: string) => {
  const response = await githubApi.get(`/users/${username}/events/public`)
  return response.data
}

// Make sure this function is properly implemented
export const getRepoDetails = async (owner: string, repo: string) => {
  try {
    const response = await githubApi.get(`/repos/${owner}/${repo}`)
    if (!response.data) {
      throw new Error('No data received from GitHub API')
    }
    return response.data
  } catch (error: any) {
    console.error('GitHub API Error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.message || 'Failed to fetch repository details')
  }
}