import { RybbitConfig } from "./types";

export interface ValidatedRybbitConfig extends Required<Omit<RybbitConfig, "defaultUserAgent">> {
  defaultUserAgent: string | null;
}

const DEFAULT_USER_AGENT = "Rybbit Node.js SDK";

export function validateAndProcessConfig(options: RybbitConfig): ValidatedRybbitConfig {
  if (typeof options !== "object" || options === null) {
    throw new Error("Invalid configuration provided to Rybbit Node SDK. Expected an object.");
  }

  if (!options.analyticsHost || options.analyticsHost.trim() === "") {
    throw new Error("`analyticsHost` is required in Rybbit Node SDK config and must be a non-empty string.");
  }
  const finalAnalyticsHost = options.analyticsHost.replace(/\/$/, "");

  if (options.siteId === undefined || options.siteId === null || String(options.siteId).trim() === "") {
    throw new Error("`siteId` is required in Rybbit Node SDK config and must be a non-empty string or number.");
  }
  const finalSiteId = String(options.siteId);

  return {
    analyticsHost: finalAnalyticsHost,
    siteId: finalSiteId,
    defaultOriginHeader: options.defaultOriginHeader,
    debug: options.debug ?? false,
    defaultUserAgent: options.defaultUserAgent === undefined ? DEFAULT_USER_AGENT : options.defaultUserAgent,
  };
}
