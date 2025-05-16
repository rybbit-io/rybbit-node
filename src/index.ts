import { RybbitConfig, TrackProperties, RybbitAPI, Payload } from "./types";
import { ValidatedRybbitConfig, validateAndProcessConfig } from "./config";
import { sendTrackRequest } from "./tracker";
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
   *
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
   * Tracks a pageview event.
   *
   * @param payload - Optional. An object containing data about the pageview.
   * @returns A promise that resolves when the event has been processed and sent
   * (or an attempt has been made to send it). It does not guarantee delivery.
   */
  public async pageview(payload?: Payload): Promise<void> {
    try {
      await sendTrackRequest("pageview", this.config, this.logger, payload);
    } catch (error) {
      this.logger.error("Tracking request failed at the pageview method level.", error);
    }
  }

  /**
   * Tracks a custom event.
   *
   * @param eventName - The name of the event.
   * @param payload - Optional. An object containing additional data about the event.
   * @param properties - Optional. An object containing additional data about the event.
   * @returns A promise that resolves when the event has been processed and sent.
   */
  public async event(
    eventName: string,
    payload?: Payload,
    properties?: TrackProperties,
  ): Promise<void> {
    try {
      await sendTrackRequest("custom_event", this.config, this.logger, payload, { eventName, properties });
    } catch (error) {
      this.logger.error("Tracking request failed at the event method level.", error);
    }
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
