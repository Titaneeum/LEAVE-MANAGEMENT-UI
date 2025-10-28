"use client";

import React from "react";
import BalanceAdmin from "./BalanceAdmin";
import BalanceStaff from "./BalanceStaff";
import NavbarPage from "@/app/(with-navbar)/dashboard/DashboardShell";

export default function BalancePreviewPage() {
  return (
    <NavbarPage>
      <div style={{ color: "white", padding: "20px" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Preview Mode: Admin & Staff Views
        </h1>

        <section
          style={{
            border: "2px solid #888",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ color: "#90EE90", marginBottom: "10px" }}>
            🧑‍💼 Admin View
          </h2>
          <BalanceAdmin />
        </section>

        <section
          style={{
            border: "2px solid #888",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h2 style={{ color: "#87CEEB", marginBottom: "10px" }}>
            👩‍💻 Staff View
          </h2>
          <BalanceStaff />
        </section>
      </div>
    </NavbarPage>
  );
}
