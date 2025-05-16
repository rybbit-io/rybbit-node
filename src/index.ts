import { RybbitConfig, TrackProperties, RybbitAPI, EventContext, EventType } from "./types";
import { ValidatedRybbitConfig, validateAndProcessConfig } from "./config";
import { sendTrackRequest, preparePayload } from "./tracker";
import { getLogger } from "./utils";

/**
 * The main class for interacting with the Rybbit Node.js SDK.
 * Create an instance of this class to send server-side events.
 */
export class Rybbit implements RybbitAPI {
  private readonly config: ValidatedRybbitConfig;
  private readonly logger: ReturnType<typeof getLogger>;

  /**
   * Initializes a new instance of the Rybbit Node.js SDK.
   * @param config - Configuration options.
   * @throws Error if the configuration is invalid.
   */
  constructor(config: RybbitConfig) {
    this.config = validateAndProcessConfig(config);
    this.logger = getLogger(this.config.debug);
    this.logger.log("Rybbit Node.js SDK Initialized.");
    this.logger.log("Config:", this.config);
  }

  /**
   * Tracks a server-side event.
   *
   * @param eventName - The name of the event (e.g., "user_signup", "item_purchased").
   * @param properties - Optional. An object containing additional data about the event.
   * These properties will be JSON stringified.
   * @param context - Optional. Contextual information for the event, such as IP address,
   * User-Agent, or a specific user ID.
   * @param eventType - Optional. The type of event, defaults to "pageview".
   * @returns A promise that resolves when the event has been processed and sent
   * (or an attempt has been made to send it). It does not guarantee delivery.
   */
  public async track(
    eventName: string,
    properties?: TrackProperties,
    context?: EventContext,
    eventType: EventType = "pageview"
  ): Promise<void> {
    if (!eventName || eventName.trim() === "") {
      this.logger.error("Event name is required and must be a non-empty string.");
      return;
    }

    const payload = preparePayload(eventName, this.config, properties, context, eventType);

    try {
      await sendTrackRequest(payload, this.config, this.logger);
    } catch (error) {
      this.logger.error("Tracking request failed at the track method level.", error);
    }
  }

  /**
   * A convenience method to track a custom event, explicitly setting the type to "custom_event".
   *
   * @param eventName - The name of the custom event.
   * @param properties - Optional. An object containing additional data about the event.
   * @param context - Optional. Contextual information for the event.
   * @returns A promise that resolves when the event has been processed and sent.
   */
  public async event(
    eventName: string,
    properties?: TrackProperties,
    context?: EventContext
  ): Promise<void> {
    return this.track(eventName, properties, context, "custom_event");
  }
}

/**
 * Initializes a RybbitNode instance. This is a factory function.
 *
 * @param configOptions - Configuration options for the SDK.
 * @returns A new RybbitNode instance.
 * @throws Error if the configuration is invalid.
 *
 * @example
 * import { initRybbitNode } from "@rybbit/node";
 * const rybbit = initRybbitNode({
 * analyticsHost: "https://your-rybbit-instance.com",
 * siteId: "your-site-id",
 * debug: true,
 * });
 *
 * rybbit.track("user_login", { loginMethod: "email" }, { userId: "user123" });
 */
export function initRybbitNode(configOptions: RybbitConfig): RybbitAPI {
  return new Rybbit(configOptions);
}
