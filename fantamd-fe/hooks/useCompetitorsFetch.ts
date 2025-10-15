import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React from "react";
import useSWR from "swr";
import { addToast } from "@heroui/toast";

import { fetcherWithError } from "@/lib/swr-utils";
import { Competitor, CompetitorPage } from "@/interfaces/interfaces";

const limit = 15;

export default function useCompetitorsFetch() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
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
  const totalCount = React.useMemo(() => {
    return data?.total || 0;
  }, [data]);

  const reloadData = React.useCallback(() => mutate(), []);

  const updateCompetitor = React.useCallback((competitor: Competitor) => {
    const updatedData: CompetitorPage = {
      total: totalCount,
      results: competitors.map((c) =>
        c.id === competitor.id ? competitor : c,
      ),
    };

    mutate(updatedData, { revalidate: false });
  }, []);

  return {
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
  };
}
