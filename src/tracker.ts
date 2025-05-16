import { TrackPayload, TrackProperties, EventContext, EventType } from "./types";
import { ValidatedRybbitConfig } from "./config";
import { getLogger, getServerHostname } from "./utils";

type Logger = ReturnType<typeof getLogger>;

export async function sendTrackRequest(
  payload: TrackPayload,
  config: ValidatedRybbitConfig,
  logger: Logger,
  context?: EventContext,
): Promise<void> {
  const endpoint = `${config.analyticsHost}/track`;
  const body = JSON.stringify(payload);
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (config.defaultUserAgent) {
    if (!context?.userAgent && config.defaultUserAgent) {
      headers.set("User-Agent", config.defaultUserAgent);
    } else if (context?.userAgent) {
      headers.set("User-Agent", context.userAgent);
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
  config: ValidatedRybbitConfig,
  properties?: TrackProperties,
  context?: EventContext,
  eventType: EventType = "pageview"
): TrackPayload {
  const payload: TrackPayload = {
    site_id: config.siteId,
    type: eventType,
    event_name: eventName,
    hostname: context?.hostname || getServerHostname(),
    pathname: context?.pathname,
    querystring: context?.querystring,
  };

  if (properties && Object.keys(properties).length > 0) {
    payload.properties = JSON.stringify(properties);
  }

  return payload;
}
