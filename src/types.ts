export interface RybbitConfig {
  analyticsHost: string;
  siteId: string | number;
  debug?: boolean;
  requestTimeout?: number;
  defaultUserAgent?: string | null;
}

export type EventType = "pageview" | "custom_event";

export interface TrackProperties {
  [key: string]: any;
}

export interface EventContext {
  userAgent?: string; // Used for User-Agent header, not payload body
  hostname?: string;
  pathname?: string;
  querystring?: string;
}

export interface TrackPayload {
  site_id: string | number;
  type: EventType;
  event_name: string;
  properties?: string;
  hostname?: string;
  pathname?: string;
  querystring?: string;
}

export interface RybbitAPI {
  track: (
    eventName: string,
    properties?: TrackProperties,
    context?: EventContext,
    eventType?: EventType
  ) => Promise<void>;
}
