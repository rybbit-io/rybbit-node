export interface RybbitConfig {
  analyticsHost: string;
  siteId: string;
  apiKey: string;
  debug?: boolean;
}

export type EventType = "pageview" | "custom_event";

export type PropertyValue = string | number | boolean;

export interface TrackProperties {
  [key: string]: PropertyValue | PropertyValue[];
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
  site_id: string;
  type: EventType;
  api_key: string;
  event_name?: string; // Only for custom_event
  properties?: string; // JSON stringified for custom_event
}

export interface RybbitAPI {
  pageview: (payload?: Payload) => Promise<void>;
  event: (eventName: string, payload?: Payload, properties?: TrackProperties) => Promise<void>;
}
