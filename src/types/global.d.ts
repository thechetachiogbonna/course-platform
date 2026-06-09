export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      dbId?: string;
      role?: "user" | "admin";
    };
  }

  interface UserPublicMetadata {
    dbId?: string,
    role?: "user" | "admin";
  }
}
