"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export const Landing = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/time-off/request");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>this page will be redirected in a few seconds</div>;
};
