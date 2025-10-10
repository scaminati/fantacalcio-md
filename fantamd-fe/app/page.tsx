import { connection } from "next/server";

import CompetitorsTable from "@/app/components/competitors-table";

export default async function Home() {
  await connection();

  return <CompetitorsTable />;
}
