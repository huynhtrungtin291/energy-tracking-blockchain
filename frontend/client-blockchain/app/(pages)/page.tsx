"use client";

import { Suspense, } from "react";
import Loading from "../components/loading";
import ReportTable from "../components/report-table";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <ReportTable />
    </Suspense>
  );
}
