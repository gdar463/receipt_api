import { google } from "googleapis";

const authClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const scopes = ["openid", "https://www.googleapis.com/auth/drive.appdata"];

console.log(
  authClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  }),
);
const code = prompt("Code: ");
const { tokens } = await authClient.getToken(code!);
console.log(tokens);
