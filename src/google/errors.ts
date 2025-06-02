export class JWENotFoundError extends Error {
  constructor() {
    super("The JWE was not found in the db");
    this.name = "JWENotFound";
  }
}
