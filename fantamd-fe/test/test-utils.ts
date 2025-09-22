import {
  ActionResponse,
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

export const competitorsResult: ActionResponse<CompetitorPage> = {
  data: {
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
  },
};

export const emptyCompetitorsResult: ActionResponse<CompetitorPage> = {
  data: {
    total: 0,
    results: [],
  },
};

export const networkErrorResult: ActionResponse<any> = {
  error: "Network error",
};

export const generateCompetitorsPage = (
  page: number,
  total: number,
  limit: number,
): ActionResponse<CompetitorPage> => ({
  data: {
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
  },
});
