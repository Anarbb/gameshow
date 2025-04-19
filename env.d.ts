export {}
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_DISCORD_CLIENT_ID: string;
      DISCORD_CLIENT_SECRET: string;
      NODE_OPTIONS: string;
      DISCORD_CLIENT_ID: string;
      PORT: string;
    }
  }
}