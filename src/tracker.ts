import { ServerTrackPayload, TrackProperties, ServerEventContext, ServerEventType } from "./types";
import { ValidatedRybbitNodeConfig } from "./config";
import { getLogger, getServerHostname } from "./utils";

type Logger = ReturnType<typeof getLogger>;

export async function sendTrackRequest(
  payload: ServerTrackPayload,
  config: ValidatedRybbitNodeConfig,
  logger: Logger
): Promise<void> {
  const endpoint = `${config.analyticsHost}/track`;
  const body = JSON.stringify(payload);
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (config.defaultUserAgent) {
    if (!payload.user_agent && config.defaultUserAgent) {
      headers.set("User-Agent", config.defaultUserAgent);
    } else if (payload.user_agent) {
      headers.set("User-Agent", payload.user_agent);
    }
  }

  logger.log("Sending track event to:", endpoint);
  logger.log("Payload:", payload);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: body,
    });
    
    if (!response.ok) {
      logger.error(`Error sending event: ${response.status} ${response.statusText}`, await response.text().catch(() => ""));
    } else {
      logger.log("Event sent successfully.");
    }
  } catch (error) {
    logger.error("Failed to send event:", error);
  }
}

export function preparePayload(
  eventName: string,
  config: ValidatedRybbitNodeConfig,
  properties?: TrackProperties,
  context?: ServerEventContext,
  eventType: ServerEventType = "server_event"
): ServerTrackPayload {
  const now = new Date();

  const payload: ServerTrackPayload = {
    site_id: config.siteId,
    type: eventType,
    event_name: eventName,
    timestamp: now.toISOString(),
    hostname: context?.hostname || getServerHostname(),
    ip_address: context?.ipAddress,
    user_agent: context?.userAgent,
    user_id: context?.userId,
    pathname: context?.pathname,
    querystring: context?.querystring,
  };

  if (properties && Object.keys(properties).length > 0) {
    payload.properties = JSON.stringify(properties);
  }

  if (context?.userAgent) {
    payload.user_agent = context.userAgent;
  }

  return payload;
}
