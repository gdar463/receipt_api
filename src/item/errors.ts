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

export class PatchBodyInvalidError extends Error {
  constructor() {
    super("An invalid patch body was give for requested comp");
    this.name = "PatchBodyInvalidError";
  }
}

export class ComponentNotFoundError extends Error {
  constructor() {
    super("No Component was Found");
    this.name = "ComponentNotFoundError";
  }
}
