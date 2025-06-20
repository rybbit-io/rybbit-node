export interface RybbitConfig {
  analyticsHost: string;
  siteId: string | number;
  apiKey: string;
  userAgent?: string;
  ipAddress?: string;
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
  user_id?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface TrackPayload extends Payload {
  site_id: string | number;
  type: EventType;
  api_key: string;
  event_name?: string; // Only for custom_event
  properties?: string; // JSON stringified for custom_event
}

export interface RybbitAPI {
  pageview: (payload?: Payload) => Promise<void>;
  event: (eventName: string, payload?: Payload, properties?: TrackProperties) => Promise<void>;
}
