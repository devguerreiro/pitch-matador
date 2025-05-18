declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_AI_API_KEY: string;
      GOOGLE_CLOUD_CREDENTIALS_JSON: string;
    }
  }
}

export {};
