import Pino from "pino";

const logger = Pino({
  level: process.env.LOG_LEVEL || "warn",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export { logger };
