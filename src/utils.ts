export function getLogger(debugMode: boolean) {
  return {
    log: (...args: any[]): void => {
      if (debugMode) {
        console.log("[Rybbit]", ...args);
      }
    },
    error: (...args: any[]): void => {
      if (debugMode) {
        console.error("[Rybbit Error]", ...args);
      }
    },
  };
}
