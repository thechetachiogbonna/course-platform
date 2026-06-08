export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      dbId?: string;
      role?: "user" | "admin";
    };
  }
}
