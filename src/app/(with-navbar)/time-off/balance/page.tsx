"use client";

import React, { useEffect, useState } from "react";
import BalanceAdmin from "./BalanceAdmin";
import BalanceStaff from "./BalanceStaff";
import NavbarPage from "@/app/(with-navbar)/dashboard/DashboardShell";

export default function BalancePage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    setRole(storedRole);
  }, []);

  if (!role) {
    return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;
  }

  return (
    <NavbarPage>
      {role === "superduperadmin" ? <BalanceAdmin /> : <BalanceStaff />}
    </NavbarPage>
  );
}
