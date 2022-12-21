export interface Report {
  name: string;
  url: string;
  mimetype: string;
}

export interface ReportStatus {
  id: string;
  status: string;
  description: string;
  completed: number;
  reports: Report[];
}

