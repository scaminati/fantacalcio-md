import { Suspense } from "react";

import CompetitorsTable from "./components/competitors-table";
import CompetitorsMobileList from "./components/competitors-mobile-list";

export default function Home() {
  return (
    <Suspense>
      <CompetitorsTable className="hidden md:flex" />
      <CompetitorsMobileList className="md:hidden flex" />
    </Suspense>
  );
}