export class ComponentNotFoundError extends Error {
  constructor() {
    super("No Component was Found");
    this.name = "ComponentNotFoundError";
  }
}

export class CountryNotFoundError extends Error {
  constructor() {
    super("No Country was Found");
    this.name = "CountryNotFoundError";
  }
}
