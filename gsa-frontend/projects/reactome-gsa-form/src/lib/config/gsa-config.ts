import {InjectionToken} from "@angular/core";

export interface GsaConfig {
  apiRoot: string,
  apiSecretRoot: string,
  server: "production" | "dev"
}

export const DEFAULT_GSA_CONFIG: GsaConfig = {
  apiRoot: "/GSAServer/0.1",
  apiSecretRoot: "/GSAServer",
  server: "production"
}

export const REACTOME_GSA_CONFIG = new InjectionToken<GsaConfig>('REACTOME_GSA_CONFIG')
