const fs = require("fs");
const path = require("path");

const dotEnvPath = path.join(__dirname, "../.env");
const envVars = {};

if (fs.existsSync(dotEnvPath)) {
  const content = fs.readFileSync(dotEnvPath, "utf-8");
  content.split("\n").forEach(line => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join("=").trim();
    }
  });
}

const getEnv = key => envVars[key] || "";

const envConfigFile = `export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '${getEnv("FIREBASE_API_KEY")}',
    authDomain: '${getEnv("FIREBASE_AUTH_DOMAIN")}',
    databaseURL: '${getEnv("FIREBASE_DATABASE_URL")}',
    projectId: '${getEnv("FIREBASE_PROJECT_ID")}',
    storageBucket: '${getEnv("FIREBASE_STORAGE_BUCKET")}',
    messagingSenderId: '${getEnv("FIREBASE_MESSAGING_SENDER_ID")}',
    appId: '${getEnv("FIREBASE_APP_ID")}'
  },
  hmr: false
};
`;

const envHmrConfigFile = `export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '${getEnv("FIREBASE_API_KEY")}',
    authDomain: '${getEnv("FIREBASE_AUTH_DOMAIN")}',
    databaseURL: '${getEnv("FIREBASE_DATABASE_URL")}',
    projectId: '${getEnv("FIREBASE_PROJECT_ID")}',
    storageBucket: '${getEnv("FIREBASE_STORAGE_BUCKET")}',
    messagingSenderId: '${getEnv("FIREBASE_MESSAGING_SENDER_ID")}',
    appId: '${getEnv("FIREBASE_APP_ID")}'
  },
  hmr: true
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${getEnv("FIREBASE_API_KEY")}',
    authDomain: '${getEnv("FIREBASE_AUTH_DOMAIN")}',
    databaseURL: '${getEnv("FIREBASE_DATABASE_URL")}',
    projectId: '${getEnv("FIREBASE_PROJECT_ID")}',
    storageBucket: '${getEnv("FIREBASE_STORAGE_BUCKET")}',
    messagingSenderId: '${getEnv("FIREBASE_MESSAGING_SENDER_ID")}',
    appId: '${getEnv("FIREBASE_APP_ID")}'
  },
  hmr: false
};
`;

const dir = "./src/environments";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(
  path.join(__dirname, "./src/environments/environment.ts"),
  envConfigFile
);
fs.writeFileSync(
  path.join(__dirname, "./src/environments/environment.hmr.ts"),
  envHmrConfigFile
);
fs.writeFileSync(
  path.join(__dirname, "./src/environments/environment.prod.ts"),
  envProdConfigFile
);

console.log("Environment files generated successfully from root .env");
