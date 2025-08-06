"use client";

import React, { startTransition } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Spinner } from "@heroui/spinner";
import { LoadingState } from "@react-types/shared";
import { addToast } from "@heroui/toast";

import { getCompetitors } from "@/app/actions/competitors";
import { Competitor } from "@/interfaces/competitor";

export default function CompetitorsTable() {
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const [competitors, setCompetitors] = React.useState<Competitor[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loadingState, setLoadingState] =
    React.useState<LoadingState>("loading");

  React.useEffect(() => {
    setCompetitors([]);
    setLoadingState("loading");

    startTransition(async () => {
      try {
        const data = await getCompetitors(page, limit);

        setTotalPages(data?.total ? Math.ceil(data.total / limit) : 0);
        setCompetitors(data?.results || []);
      } catch (error: any) {
        addToast({
          title: error.message,
          color: "danger",
        });
      } finally {
        setLoadingState("idle");
      }
    });
  }, [page]);

  return (
    <div className="flex flex-col h-full p-5">
      <Table className="flex-grow">
        <TableHeader>
          <TableColumn key="fullname">Nome</TableColumn>
          <TableColumn key="phone">Telefono</TableColumn>
          <TableColumn key="email">Email</TableColumn>
          <TableColumn key="paid">Pagato</TableColumn>
          <TableColumn key="added_into_app">Aggiunto in app</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={"Nessun partecipante trovato"}
          items={competitors}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item: Competitor) => (
            <TableRow key={item?.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 0 ? (
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      ) : null}
    </div>
  );
}
