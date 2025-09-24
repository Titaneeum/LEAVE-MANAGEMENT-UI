import LeaveTimeOffRequest from "@/components/pages/request-time-off";
import RequestLayout from "./(with-navbar)/layout";

export default function LandingPage() {
  return (
    <RequestLayout>
      <LeaveTimeOffRequest />
    </RequestLayout>
  );
}
