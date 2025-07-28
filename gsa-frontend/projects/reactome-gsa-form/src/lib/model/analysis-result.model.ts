
export interface Result {
  name: string;
  pathways: string;
  fold_changes: string;
}

export interface ReactomeLink {
  url: string;
  name: string;
  token: string;
  description: string;
}

export interface Mapping {
  identifier: string;
  mapped_to: string[];
}

export interface AnalysisResult {
  release: string;
  method_name: string;
  results: Result[];
  reactome_links: ReactomeLink[];
  mappings: Mapping[];
}

