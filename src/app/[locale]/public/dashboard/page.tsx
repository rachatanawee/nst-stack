import { getPublicRegistrations } from './actions'
import DashboardClientWrapper from './dashboard-client-wrapper'

export default async function PublicDashboardPage() {
  const initialData = await getPublicRegistrations()

  return (
    <div className="bg-gradient-to-b from-[#005bA4] to-white min-h-screen">
      <DashboardClientWrapper initialData={initialData} />
    </div>
  )
}