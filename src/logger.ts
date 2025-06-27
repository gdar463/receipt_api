import { AxiomJSTransport, ConsoleTransport, Logger } from "@axiomhq/logging";
import { Axiom } from "@axiomhq/js";

const axiom = new Axiom({
  token: process.env.AXIOM_TOKEN!,
});

const axiomLogger = process.env.AXIOM_LOG_CONSOLE
  ? new Logger({
      transports: [
        new AxiomJSTransport({
          axiom,
          dataset: process.env.AXIOM_DATASET!,
        }),
        new ConsoleTransport({ prettyPrint: true }),
      ],
    })
  : new Logger({
      transports: [
        new AxiomJSTransport({
          axiom,
          dataset: process.env.AXIOM_DATASET!,
        }),
      ],
    });

export const logger = {
  info: (message: string, meta?: object) => {
    axiomLogger.info(message, meta);
  },
  warn: (message: string, meta?: object) => {
    axiomLogger.warn(message, meta);
  },
  error: (message: string, meta?: object) => {
    axiomLogger.error(message, meta);
  },
  debug: (message: string, meta?: object) => {
    axiomLogger.debug(message, meta);
  },
  flush: () => axiomLogger.flush?.(),
};
