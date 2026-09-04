declare module "csrf-csrf" {
  interface DoubleCsrfOptions {
    getSecret: () => string;
    getSessionIdentifier?: (req: any) => string;
    cookieName?: string;
    cookieOptions?: Record<string, any>;
    size?: number;
    ignoredMethods?: string[];
  }

  export function doubleCsrf(opts: DoubleCsrfOptions): {
    generateCsrfToken: (req: any, res: any) => string;
    doubleCsrfProtection: import("express").RequestHandler;
  };
}
