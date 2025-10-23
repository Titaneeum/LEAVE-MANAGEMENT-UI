import NavbarLayout from "@/app/(with-navbar)/NavbarLayout";
import AdminTeamReq from "@/app/(with-navbar)/ADMIN/AdminTeamReq";

export default function DashboardPage() {
  return (
    <NavbarLayout>
      <AdminTeamReq />
    </NavbarLayout>
  );
}
