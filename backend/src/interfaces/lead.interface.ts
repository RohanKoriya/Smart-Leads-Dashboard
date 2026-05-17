export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

export type LeadSource = "Website" | "Instagram" | "Referral";

export interface ILead {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}
