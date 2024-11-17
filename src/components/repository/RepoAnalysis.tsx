import { useCache } from '../../hooks/useCache'
import { getRepoLanguages, getRepoContributors } from '../../utils/api'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

interface RepoAnalysisProps {
  owner?: string
  repo?: string
  languages?: any
  contributors?: any[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function RepoAnalysis({ owner, repo, languages: initialLanguages, contributors: initialContributors }: RepoAnalysisProps) {
  const { data: fetchedLanguages, isLoading: isLoadingLanguages } = useCache({
    queryKey: ['repoLanguages', owner, repo],
    queryFn: () => getRepoLanguages(owner!, repo!),
    cacheType: 'repository',
    config: {
      enabled: !!owner && !!repo && !initialLanguages,
    }
  })

  const { data: fetchedContributors, isLoading: isLoadingContributors } = useCache({
    queryKey: ['repoContributors', owner, repo],
    queryFn: () => getRepoContributors(owner!, repo!),
    cacheType: 'repository',
    config: {
      enabled: !!owner && !!repo && !initialContributors,
    }
  })

  const languages = initialLanguages || fetchedLanguages
  const contributors = initialContributors || fetchedContributors

  if ((owner && repo) && (isLoadingLanguages || isLoadingContributors)) {
    return <div className="text-center mt-4">Loading analysis...</div>
  }

  if (!languages || !contributors) return null

  const languageData = Object.entries(languages).map(([name, value]) => ({ name, value }))
  const contributorData = contributors.slice(0, 10).map((contributor: any) => ({
    name: contributor.login,
    contributions: contributor.contributions,
  }))

  return (
    <div className="mt-8 bg-vercel-light dark:bg-vercel-dark p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-vercel-light-text dark:text-vercel-dark-text">Repository Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-medium mb-2 text-vercel-light-text dark:text-vercel-dark-text">Language Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2 text-vercel-light-text dark:text-vercel-dark-text">Top Contributors</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributorData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="contributions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}