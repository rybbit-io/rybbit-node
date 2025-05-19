import { RybbitConfig, TrackProperties, RybbitAPI, Payload } from "./types";
import { validateAndProcessConfig } from "./config";
import { sendTrackRequest } from "./tracker";
import { getLogger } from "./utils";

export class Rybbit implements RybbitAPI {
  private readonly config: RybbitConfig;
  private readonly logger: ReturnType<typeof getLogger>;

  /**
   * @param config - Configuration options.
   * @throws Error if the configuration is invalid.
   */
  constructor(config: RybbitConfig) {
    this.config = validateAndProcessConfig(config);
    this.logger = getLogger(this.config.debug ?? false);
    this.logger.log("Rybbit Node.js SDK Initialized.");
    this.logger.log("Config:", this.config);
  }

  /**
   * Tracks a pageview event.
   *
   * @param payload - Optional. An object containing data about the pageview.
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
   * @param payload - Optional. An object containing data about the event.
   * @param properties - Optional. An object containing additional data about the event.
   */
  public async event(eventName: string, payload?: Payload, properties?: TrackProperties): Promise<void> {
    try {
      await sendTrackRequest("custom_event", this.config, this.logger, payload, { eventName, properties });
    } catch (error) {
      this.logger.error("Tracking request failed at the event method level.", error);
    }
  }
}
