declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_AI_API_KEY: string;
      GOOGLE_CLOUD_TYPE: string;
      GOOGLE_CLOUD_PROJECT_ID: string;
      GOOGLE_CLOUD_PRIVATE_KEY_ID: string;
      GOOGLE_CLOUD_PRIVATE_KEY: string;
      GOOGLE_CLOUD_CLIENT_EMAIL: string;
      GOOGLE_CLOUD_CLIENT_ID: string;
      GOOGLE_CLOUD_AUTH_URI: string;
      GOOGLE_CLOUD_TOKEN_URI: string;
      GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL: string;
      GOOGLE_CLOUD_CLIENT_X509_CERT_URL: string;
      GOOGLE_CLOUD_UNIVERSE_DOMAIN: string;
    }
  }
}

export {};
