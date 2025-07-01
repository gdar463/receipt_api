import { t } from "elysia";

export type SignupBody = {
  username: string;
  password: string;
  email: string;
  displayName: string;
};

export const signupBodyValidation = t.Object({
  username: t.String({ description: "Username for the user." }),
  password: t.String({ description: "Password for the user." }),
  email: t.String({
    format: "email",
    description: "Email for the user. (used in the future for password reset)",
  }),
  displayName: t.String({ description: "Display Name for the user." }),
});
