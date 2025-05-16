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
  ipAddress?: string;
  userAgent?: string;
  userId?: string | number;
  hostname?: string;
  pathname?: string;
  querystring?: string;
}

export interface TrackPayload {
  site_id: string | number;
  type: EventType;
  event_name: string;
  timestamp: string;
  properties?: string;
  ip_address?: string;
  user_agent?: string;
  user_id?: string | number;
  hostname?: string;
  pathname?: string;
  querystring?: string;
}

export interface RybbitAPI {
  track: (
    eventName: string,
    properties?: TrackProperties,
    context?: EventContext
  ) => Promise<void>;
}
