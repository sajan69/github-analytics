import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface ProfileAnalysisProps {
  events: any[]
  repos: any[]
}

export default function ProfileAnalysis({ events, repos }: ProfileAnalysisProps) {
  const activityData = useMemo(() => {
    const eventCounts: { [key: string]: number } = {}
    events.forEach((event) => {
      const type = event.type
      eventCounts[type] = (eventCounts[type] || 0) + 1
    })
    return Object.entries(eventCounts).map(([name, value]) => ({ name, value }))
  }, [events])

  const languageData = useMemo(() => {
    const languageCounts: { [key: string]: number } = {}
    repos.forEach((repo) => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    })
    return Object.entries(languageCounts).map(([name, value]) => ({ name, value }))
  }, [repos])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="mt-8 bg-vercel-light p-4 rounded-lg shadow dark:bg-vercel-dark">
      <h3 className="text-xl font-semibold mb-4 text-vercel-light-text dark:text-vercel-dark-text">Profile Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-2 text-vercel-light-text dark:text-vercel-dark-text">Recent Activity</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-vercel-light-text dark:text-vercel-dark-text">Most Used Languages</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
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
        </div>
      </div>
    </div>
  )
}