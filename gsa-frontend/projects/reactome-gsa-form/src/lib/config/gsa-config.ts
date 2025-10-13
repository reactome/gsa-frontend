import {InjectionToken, Signal, signal} from "@angular/core";

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

export const REACTOME_GSA_CONFIG = new InjectionToken<ConfigProvider>('REACTOME_GSA_CONFIG', {
  providedIn: 'root',
  factory: () => config
})

export type ConfigProvider = Signal<GsaConfig>
export const config = signal<GsaConfig>(DEFAULT_GSA_CONFIG);
