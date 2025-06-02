export class ReceiptNotFoundError extends Error {
  constructor() {
    super("No Receipt was Found");
    this.name = "ReceiptNotFoundError";
  }
}
