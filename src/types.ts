export interface RybbitConfig {
  analyticsHost: string;
  siteId: string | number;
  origin: string;
  userAgent?: string;
  debug?: boolean;
}

export type EventType = "pageview" | "custom_event";

export interface TrackProperties {
  [key: string]: any;
}

export interface Payload {
  hostname?: string;
  pathname?: string;
  querystring?: string;
  screenWidth?: number;
  screenHeight?: number;
  language?: string;
  page_title?: string;
  referrer?: string;
}

export interface TrackPayload extends Payload {
  site_id: string | number;
  type: EventType;
  event_name?: string; // Only for custom_event
  properties?: string; // JSON stringified for custom_event
}

export interface RybbitAPI {
  pageview: (payload?: Payload) => Promise<void>;
  event: (
    eventName: string,
    payload?: Payload,
    properties?: TrackProperties,
  ) => Promise<void>;
}
