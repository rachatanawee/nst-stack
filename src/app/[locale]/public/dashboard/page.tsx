import { getPublicRegistrations } from './actions'
import DashboardClientWrapper from './dashboard-client-wrapper'

export default async function PublicDashboardPage() {
  const initialData = await getPublicRegistrations()

  return (
    <div className="container mx-auto p-4">
      <DashboardClientWrapper initialData={initialData} />
    </div>
  )
}