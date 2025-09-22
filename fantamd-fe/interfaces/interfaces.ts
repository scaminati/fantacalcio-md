export interface ActionResponse<T> {
  data?: T;
  error?: string;
}

export interface Competitor {
  id: number | undefined;
  fullname: string;
  phone: string;
  email: string;
  paid: string;
  added_into_app: boolean;
  created_at: Date | undefined;
}

export interface CompetitorPage {
  total: number;
  results: Competitor[] | undefined;
}

export interface Auth {
  token: string;
}
