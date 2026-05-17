export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export type LeadSource = "Website" | "Instagram" | "Referral";

export interface Lead {
  _id: string;

  name: string;

  email: string;

  status: LeadStatus;

  source: LeadSource;

  createdAt: string;
}

export interface LeadsResponse {
  success: boolean;

  data: Lead[];

  pagination: {
    currentPage: number;

    totalPages: number;

    totalRecords: number;
  };
}
