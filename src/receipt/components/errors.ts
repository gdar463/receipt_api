export class ComponentNotFoundError extends Error {
  constructor() {
    super("No Component was Found");
    this.name = "ComponentNotFoundError";
  }
}
