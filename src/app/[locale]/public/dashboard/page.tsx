import { getPublicRegistrations, getCommitteeCount } from './actions'
import DashboardClientWrapper from './dashboard-client-wrapper'

export default async function PublicDashboardPage() {
  const [initialData, committeeCount] = await Promise.all([
    getPublicRegistrations(),
    getCommitteeCount(),
  ])

  return (
    <div className="container mx-auto p-4">
      <DashboardClientWrapper
        initialData={initialData}
        initialCommitteeCount={committeeCount}
      />
    </div>
  )
}