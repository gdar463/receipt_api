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

export class CurrencyNotFoundError extends Error {
  constructor() {
    super("No Currency was Found");
    this.name = "CurrencyNotFoundError";
  }
}

export class GoogleError extends Error {
  constructor() {
    super("Google Failed");
    this.name = "GoogleError";
  }
}
