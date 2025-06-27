export class ReceiptNotFoundError extends Error {
  constructor() {
    super("No Receipt was Found");
    this.name = "ReceiptNotFoundError";
  }
}

export class NameAlreadyExistsError extends Error {
  constructor() {
    super("Receipt with this name already exists");
    this.name = "NameAlreadyExistsError";
  }
}

export class PatchBodyNotFoundError extends Error {
  constructor() {
    super("No Patch Body was Found");
    this.name = "PatchBodyNotFoundError";
  }
}

export class JWENotFoundError extends Error {
  constructor() {
    super("The JWE was not found in the db");
    this.name = "JWENotFoundError";
  }
}
