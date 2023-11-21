declare global {
  interface Window {
    custom_env: {
      BRAND_NAME: string;
    };
  }
}

export const BRAND_NAME = window.custom_env.BRAND_NAME;
