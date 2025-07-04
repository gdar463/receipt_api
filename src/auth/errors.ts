export class InvalidCredsError extends Error {
  constructor() {
    super("Invalid credentials");
    super.name = "InvalidCredsError";
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super("Invalid token");
    super.name = "InvalidTokenError";
  }
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super("User already exists");
    super.name = "UserAlreadyExistsError";
  }
}

export class UserDoesntExistError extends Error {
  constructor() {
    super("Requested user doesn't exist, somehow");
    super.name = "UserDoesntExistError";
  }
}
