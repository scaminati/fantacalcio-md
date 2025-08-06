export interface Competitor {
  id: number;
  fullname: string;
  phone: string;
  email: string;
  paid: string;
  added_into_app: string;
  created_at: Date;
}

export interface CompetitorPage {
  total: number;
  results: [Competitor];
}
