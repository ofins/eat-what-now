/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
  verbose: (message: string, ...args: any[]) => void;
}

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    errors({ stack: true }),
    printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level}: ${message} ${stack ? '\n' + stack : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/server.log',
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
  exitOnError: true,
});

export default logger;
