"use client";

import Loading from "../components/loading";
import ReportTable from "../components/report-table";
import { useAuth } from "../context/UserAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { userAuth, isAuthLoading } = useAuth();

  // if (!userAuth) router.push("/login");

  // if (isAuthLoading) return <Loading />;

  return <ReportTable />;
}
