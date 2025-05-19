import {TrackPayload, TrackProperties, EventType, Payload} from "./types";
import { ValidatedRybbitConfig } from "./config";
import { getLogger } from "./utils";

type Logger = ReturnType<typeof getLogger>;

export async function sendTrackRequest(
  eventType: EventType,
  config: ValidatedRybbitConfig,
  logger: Logger,
  payload?: Payload,
  eventData: {
    eventName?: string;
    properties?: TrackProperties;
  } = {}
): Promise<void> {
  const { eventName, properties = {} } = eventData;

  if (eventType === "custom_event" && !eventName) {
    throw new Error("Event name is required and must be a string for custom events.");
  }

  const trackPayload: TrackPayload = {
    site_id: config.siteId,
    type: eventType,
    ...payload,
    ...(eventType === "custom_event" && { event_name: eventName }),
    ...((eventType === "custom_event") && Object.keys(properties).length > 0 && {
      properties: JSON.stringify(properties),
    }),
  };

  const endpoint = `${config.analyticsHost}/track`;
  const body = JSON.stringify(trackPayload);
  const headers = new Headers({
    "Content-Type": "application/json",
    "Origin": config.originHeader,
    "User-Agent": config.userAgent,
  });

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
