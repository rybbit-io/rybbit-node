export function getLogger(debugMode: boolean) {
  return {
    log: (...args: any[]): void => {
      if (debugMode) {
        console.log("[Rybbit]", ...args);
      }
    },
    error: (...args: any[]): void => {
      console.error("[Rybbit Error]", ...args);
    },
  };
}

export function getServerHostname(): string {
  try {
    const os = require("os");
    return os.hostname();
  } catch (e) {
    return "unknown_server_host";
  }
}
