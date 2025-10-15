"use client";

import React from "react";
import { Pagination } from "@heroui/pagination";

import CompetitorConfirmDelete from "./competitors-confirm-delete";
import CompetitorsModal from "./competitors-modal";
import CompetitorsHeader from "./competitors-header";
import CompetitorCard, { CompetitorCardSkeleton } from "./competitor-card";

import { Competitor } from "@/interfaces/interfaces";
import useCompetitorsFetch from "@/hooks/useCompetitorsFetch";

export default function CompetitorsMobileList({ className, limit }: any) {
  const {
    page,
    setPage,
    filterValue,
    setFilterValue,
    competitors,
    totalCount,
    totalPages,
    isValidating,
    reloadData,
    updateCompetitor,
  } = useCompetitorsFetch();
  const [modalCompetitor, setModalCompetitor] = React.useState<Competitor>();
  const [deleteCompetitor, setDeleteCompetitor] = React.useState<Competitor>();

  const onCompetitorModalClosed = () => {
    setModalCompetitor(undefined);
    setDeleteCompetitor(undefined);
  };

  return (
    <>
      <div className={`${className} flex-col h-full`}>
        <div className="flex-grow overflow-y-auto p-4">
          <CompetitorsHeader
            applyFilterChange={(newValue) => {
              if (newValue != filterValue) {
                setPage(1);
                setFilterValue(newValue);
              } else {
                reloadData();
              }
            }}
            setModalCompetitor={setModalCompetitor}
          />
          {isValidating &&
            Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="mb-3">
                <CompetitorCardSkeleton />
              </div>
            ))}

          {!isValidating && (
            <>
              {!filterValue && (
                <div className="bg-foreground-100 py-2 px-4 rounded-lg flex text-foreground-600 text-tiny mb-5">
                  <div className="flex-grow">Totale partecipanti</div>
                  <div className="flex-grow text-end font-bold">
                    {totalCount}
                  </div>
                </div>
              )}

              {competitors.length == 0 && (
                <div className="rounded-lg p-8 text-center bg-default-100 text-foreground-500">
                  Nessun partecipante trovato
                </div>
              )}

              {competitors.map((competitor, index) => (
                <div key={competitor.id} className="mb-3">
                  <CompetitorCard
                    competitor={competitor}
                    listIndex={index}
                    setDeleteCompetitor={setDeleteCompetitor}
                    setModalCompetitor={setModalCompetitor}
                  />
                </div>
              ))}
            </>
          )}
        </div>
        {totalPages > 0 && (
          <div className="flex w-full p-3 justify-center border-t border-divider items-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              data-testid="pagination"
              page={page}
              size="sm"
              total={totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )}
      </div>
      <CompetitorsModal
        competitor={modalCompetitor}
        onCloseEvent={onCompetitorModalClosed}
        onSavedEvent={(savedCompetitor) => {
          if (modalCompetitor!.id) {
            updateCompetitor(savedCompetitor);
          } else {
            if (page > 1) {
              setPage(1);
            } else {
              reloadData();
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
            reloadData();
          }
        }}
      />
    </>
  );
}
