import { createLogger, transports, format, Logger } from "winston";

export class LoggerService {
  private static logger: Logger;

  private constructor() { }

  private static getLogger() {
    if (!LoggerService.logger) {
      LoggerService.logger = createLogger({
        transports: [new transports.Console()],
        format: format.combine(
          format.errors({ stack: true }),
          format.colorize(),
          format.timestamp(),
          format.printf(({ timestamp, level, message, stack }) => {
            if (stack) {
              return `[${timestamp}] ${level}: ${message} - ${stack}`;  
            }
            return `[${timestamp}] ${level}: ${message}`;
          })
        ),
      });
    }
    return LoggerService.logger;
  }

  public static log(message: string): void {
    LoggerService.getLogger().info({ message });
  }

  public static error(error: any): void {
    LoggerService.getLogger().error(error);
  }
}