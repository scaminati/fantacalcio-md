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
import { Key, LoadingState } from "@react-types/shared";
import { addToast } from "@heroui/toast";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";

import CompetitorsHeader from "./competitors-header";
import CompetitorsModal from "./competitors-modal";

import { getCompetitors } from "@/app/actions/competitors";
import { Competitor } from "@/interfaces/competitor";

const columns = [
  { name: "NOME", uid: "fullname" },
  { name: "TELEFONO", uid: "phone" },
  { name: "PAGATO", uid: "paid" },
  { name: "AGGIUNTO IN APP", uid: "added_into_app" },
  { name: "", uid: "actions" },
];
const colors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
] as const;

export default function CompetitorsTable() {
  const limit = 20;
  const [page, setPage] = React.useState(1);
  const [competitors, setCompetitors] = React.useState<Competitor[]>([]);
  const [modalCompetitor, setModalCompetitor] = React.useState<Competitor>();
  const [filterValue, setFilterValue] = React.useState("");
  const [totalPages, setTotalPages] = React.useState(0);
  const [loadingState, setLoadingState] =
    React.useState<LoadingState>("loading");

  React.useEffect(() => {
    setCompetitors([]);
    setLoadingState("loading");

    startTransition(async () => {
      try {
        const data = await getCompetitors(page, limit, filterValue);

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
  }, [page, filterValue]);

  const renderCell = React.useCallback(
    (item: Competitor, columnKey: Key) => {
      const cellValue = getKeyValue(item, columnKey);

      switch (columnKey) {
        case "fullname":
          return (
            <User
              avatarProps={{
                name: cellValue[0].toUpperCase(),
                radius: "full",
                size: "sm",
                color:
                  colors[
                    competitors.findIndex(
                      (competitor) => competitor.id == item.id,
                    ) % colors.length
                  ],
                showFallback: true,
              }}
              classNames={{
                description: "text-default-500",
              }}
              description={item.email}
              name={cellValue}
            />
          );
        case "paid":
          return <span className="font-semibold">{cellValue}</span>;
        case "added_into_app":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={cellValue ? "success" : "danger"}
              size="sm"
              variant="dot"
            >
              {cellValue ? "SI" : "NO"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown className="bg-background border-1 border-default-200">
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <EllipsisVerticalIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="edit"
                    onPress={() => setModalCompetitor(item)}
                  >
                    Modifica
                  </DropdownItem>
                  <DropdownItem key="delete">Elimina</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [competitors],
  );

  return (
    <>
      <div className="flex flex-col h-full p-5">
        <CompetitorsHeader
          applyFilterChange={setFilterValue}
          setModalCompetitor={setModalCompetitor}
        />
        <Table className="flex-grow">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
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
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
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
      <CompetitorsModal
        competitor={modalCompetitor}
        onCloseEvent={() => setModalCompetitor(undefined)}
      />
    </>
  );
}
