import {
  ApiHandlerError,
  Competitor,
  CompetitorPage,
} from "@/interfaces/interfaces";

export const competitorMock: Competitor = {
  id: 1,
  fullname: "Mario",
  phone: "33333333",
  email: "mario@email.it",
  paid: "yes",
  added_into_app: false,
  created_at: new Date(),
};

export const competitorsResult: CompetitorPage = {
  total: 2,
  results: [
    {
      id: 1,
      fullname: "Simone",
      phone: "33333333",
      email: "simone@email.it",
      paid: "yes",
      added_into_app: true,
      created_at: new Date(),
    },
    {
      id: 2,
      fullname: "Mario",
      phone: "33333333",
      email: "mario@email.it",
      paid: "yes",
      added_into_app: false,
      created_at: new Date(),
    },
  ],
};

export const emptyCompetitorsResult: CompetitorPage = {
  total: 0,
  results: [],
};

export const networkErrorResult: ApiHandlerError = {
  error: "Network error",
};

export const generateCompetitorsPage = (
  page: number,
  total: number,
  limit: number,
): CompetitorPage => ({
  total: total,
  results: Array.from(
    { length: page == 1 ? limit : total % limit },
    (_, i) => ({
      id: i + limit * (page - 1) + 1,
      fullname: `Simone`,
      phone: "33333333",
      email: "simone@email.it",
      paid: "yes",
      added_into_app: true,
      created_at: new Date(),
    }),
  ),
});
