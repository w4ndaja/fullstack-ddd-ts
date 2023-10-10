export interface Logger {
  error(...obj: unknown[]): void;
  warn(...obj: unknown[]): void;
  info(...obj: unknown[]): void;
  http(...obj: unknown[]): void;
  verbose(...obj: unknown[]): void;
  debug(...obj: unknown[]): void;
  silly(...obj: unknown[]): void;
}
