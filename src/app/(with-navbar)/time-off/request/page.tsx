"use client";

import ReqLayout from "../../ReqLayout"; // layout untuk request page
import LeaveTimeOffRequest from "@/components/pages/request-time-off";

export default function RequestPage() {
  return (
    <ReqLayout>
      <LeaveTimeOffRequest />
    </ReqLayout>
  );
}
