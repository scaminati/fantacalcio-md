import { Suspense } from "react";

import CompetitorsTable from "@/app/components/competitors-table";

export default function Home() {
  return (
    <Suspense>
      <CompetitorsTable />
    </Suspense>
  );
}
