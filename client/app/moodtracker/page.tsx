import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MoodTracker } from "@/components/mood/mood-tracker";
export default function MentalHealthCheckPage() {
  return (
    <DashboardLayout>
      <MoodTracker />
    </DashboardLayout>
  );
}
