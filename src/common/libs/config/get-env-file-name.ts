export const getEnvFileName = (): string => {
  switch (process.env.NODE_ENV) {
    case "development":
      return "./.env.development";
    case "production":
      return "./.env.production";
    case "test":
      return "./.env.test";
    default:
      return "./.env";
  }
};
