import { RybbitConfig } from "./types";

export interface ValidatedRybbitConfig extends Required<Omit<RybbitConfig, "userAgent">> {
  userAgent: string;
}

const DEFAULT_USER_AGENT = `RybbitNode/${process.env.SDK_VERSION}`;

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

  if (!options.origin || options.origin.trim() === "") {
    throw new Error("`origin` is required in Rybbit config and must be a non-empty string.");
  }

  return {
    analyticsHost: finalAnalyticsHost,
    siteId: finalSiteId,
    origin: options.origin,
    userAgent: options.userAgent || DEFAULT_USER_AGENT,
    debug: options.debug ?? false,
  };
}
