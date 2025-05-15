export interface RybbitNodeConfig {
  analyticsHost: string;
  siteId: string | number;
  debug?: boolean;
  requestTimeout?: number;
  defaultUserAgent?: string | null;
}

export type ServerEventType = "server_event" | "custom_event" | string;

export interface TrackProperties {
  [key: string]: any;
}

export interface ServerEventContext {
  ipAddress?: string;
  userAgent?: string;
  userId?: string | number;
  hostname?: string;
  pathname?: string;
  querystring?: string;
}

export interface ServerTrackPayload {
  site_id: string | number;
  type: ServerEventType;
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

export interface RybbitNodeAPI {
  track: (
    eventName: string,
    properties?: TrackProperties,
    context?: ServerEventContext
  ) => Promise<void>;
}
