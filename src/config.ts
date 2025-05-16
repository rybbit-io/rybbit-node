import { RybbitConfig } from "./types";

export interface ValidatedRybbitConfig extends Required<Omit<RybbitConfig, "userAgent">> {
  userAgent: string;
}

const DEFAULT_USER_AGENT = "Rybbit Node.js SDK";

export function validateAndProcessConfig(options: RybbitConfig): ValidatedRybbitConfig {
  if (typeof options !== "object" || options === null) {
    throw new Error("Invalid configuration. Expected an object.");
  }

  if (!options.analyticsHost || options.analyticsHost.trim() === "") {
    throw new Error("`analyticsHost` is required in Rybbit config and must be a non-empty string.");
  }
  const finalAnalyticsHost = options.analyticsHost.replace(/\/$/, "");

  if (!options.siteId || String(options.siteId).trim() === "") {
    throw new Error("`siteId` is required in Rybbit config and must be a non-empty string or number.");
  }
  const finalSiteId = String(options.siteId);

  if (!options.originHeader || options.originHeader.trim() === "") {
    throw new Error("`originHeader` is required in Rybbit config and must be a non-empty string.");
  }

  return {
    analyticsHost: finalAnalyticsHost,
    siteId: finalSiteId,
    originHeader: options.originHeader,
    userAgent: options.userAgent || DEFAULT_USER_AGENT,
    debug: options.debug ?? false,
  };
}
