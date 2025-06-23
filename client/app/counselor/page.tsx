import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { CounselorDashboard } from "@/components/counselor/counselor-dashboard"

export default function CounselorPage() {
  return (
    <DashboardLayout>
      <CounselorDashboard />
    </DashboardLayout>
  )
}
