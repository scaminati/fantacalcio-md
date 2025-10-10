"use client";

import React from "react";
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
import { Key } from "@react-types/shared";
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
import useSWR from "swr";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import CompetitorsHeader from "./competitors-header";
import CompetitorsModal from "./competitors-modal";
import CompetitorConfirmDelete from "./competitors-confirm-delete";

import { Competitor, CompetitorPage } from "@/interfaces/interfaces";
import { fetcherWithError } from "@/lib/swr-utils";

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

const limit = 15;

export default function CompetitorsTable() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [modalCompetitor, setModalCompetitor] = React.useState<Competitor>();
  const [deleteCompetitor, setDeleteCompetitor] = React.useState<Competitor>();
  const [filterValue, setFilterValue] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const fetcher = React.useCallback(fetcherWithError, []);
  const { data, isValidating, mutate } = useSWR<CompetitorPage>(
    `/api/competitors?page=${page}&limit=${limit}&search=${filterValue}`,
    {
      fetcher,
      shouldRetryOnError: false,
      onError: (error) => {
        addToast({
          title: error.message,
          color: "danger",
        });
      },
    },
  );
  const totalPages = React.useMemo(
    () => (data ? Math.ceil(data.total / limit) : 0),
    [data],
  );
  const competitors = React.useMemo(() => {
    return data?.results || [];
  }, [data]);

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
              data-testid="user"
              description={item.email}
              name={cellValue}
            />
          );
        case "paid":
          return (
            <span className="font-semibold" data-testid="paid">
              {cellValue}
            </span>
          );
        case "added_into_app":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={cellValue ? "success" : "danger"}
              data-testid="added-chip"
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
                  <Button
                    isIconOnly
                    data-testid="actions-btn"
                    radius="full"
                    size="sm"
                    variant="light"
                  >
                    <EllipsisVerticalIcon className="text-default-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key="edit"
                    data-testid="edit-btn"
                    onPress={() => setModalCompetitor(item)}
                  >
                    Modifica
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    data-testid="delete-btn"
                    onPress={() => setDeleteCompetitor(item)}
                  >
                    Elimina
                  </DropdownItem>
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

  const onCompetitorModalClosed = () => {
    setModalCompetitor(undefined);
    setDeleteCompetitor(undefined);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto px-4">
          <div className="container mx-auto my-4 max-w-7xl">
            <CompetitorsHeader
              applyFilterChange={(newValue) => {
                if (newValue != filterValue) {
                  setPage(1);
                  setFilterValue(newValue);
                } else {
                  mutate();
                }
              }}
              setModalCompetitor={setModalCompetitor}
            />
            <Table data-testid="competitors-table">
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
                items={isValidating ? [] : competitors}
                loadingContent={<Spinner data-testid="competitor-spinner" />}
                loadingState={isValidating ? "loading" : "idle"}
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
          </div>
        </div>

        {totalPages > 0 ? (
          <div className="flex w-full justify-center py-3 border-t border-divider">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              data-testid="pagination"
              page={page}
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null}
      </div>
      <CompetitorsModal
        competitor={modalCompetitor}
        onCloseEvent={onCompetitorModalClosed}
        onSavedEvent={(savedCompetitor) => {
          if (modalCompetitor!.id) {
            const updatedData: CompetitorPage = {
              ...(data as CompetitorPage),
              results: data!.results.map((c) =>
                c.id === savedCompetitor.id ? savedCompetitor : c,
              ),
            };

            mutate(updatedData, { revalidate: false });
          } else {
            if (page > 1) {
              setPage(1);
            } else {
              mutate();
            }
          }
        }}
      />
      <CompetitorConfirmDelete
        competitor={deleteCompetitor}
        onCloseEvent={onCompetitorModalClosed}
        onDeleteEvent={() => {
          if (competitors.length == 1 && page > 1) {
            setPage(page - 1);
          } else {
            mutate();
          }
        }}
      />
    </>
  );
}
