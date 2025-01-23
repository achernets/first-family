const PORT = process.env.PORT || 3001;
const MONGODB_URL =
  "mongodb+srv://chernetsoleksandr:njuBvCBoxe9HecVW@firstfamily.ede6s.mongodb.net/?retryWrites=true&w=majority&appName=FirstFamily";
const API_PATH = "/.netlify/functions/api";
const IMGBB_KEY = "60882d87f23b2e316786909bdc2b6787";
const JSON_LIMIT = "50mb";
const TOKEN_EXPIRED = "8760h";
const SECRET_KEY_JWT = "FIRST_FAMILY";
const GOOGLE_USER = "chernetsoleksandr.dev@gmail.com";
const GOOGLE_APP_PASS = "jemq lqlf ielu mciy";

export {
  PORT,
  MONGODB_URL,
  API_PATH,
  IMGBB_KEY,
  JSON_LIMIT,
  TOKEN_EXPIRED,
  SECRET_KEY_JWT,
  GOOGLE_USER,
  GOOGLE_APP_PASS,
};
