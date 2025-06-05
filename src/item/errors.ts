export class ReceiptNotFoundError extends Error {
  constructor() {
    super("No Receipt was Found");
    this.name = "ReceiptNotFoundError";
  }
}

export class ReceiptAlreadyExistsError extends Error {
  constructor() {
    super("Receipt with this name already exists");
    this.name = "ReceiptAlreadyExistsError";
  }
}
