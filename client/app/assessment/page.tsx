import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SelfAssessment } from "@/components/assessment/self-assessment"

export default function AssessmentPage() {
  return (
    <DashboardLayout>
      <SelfAssessment />
    </DashboardLayout>
  )
}
