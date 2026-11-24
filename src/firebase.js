import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, push, get, child } from "firebase/database";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, "..", ".env");

// Attempt to load .env file if running in Node.js environment without external env loader
if (typeof process.loadEnvFile === "function" && fs.existsSync(envFilePath)) {
  try {
    process.loadEnvFile(envFilePath);
  } catch {
    // Already loaded or parsed
  }
}

/**
 * Safely retrieve environment variables with support for Next.js (NEXT_PUBLIC_),
 * Vite (VITE_), Create React App (REACT_APP_), and standard Node.js prefixes.
 *
 * @param {string} baseKey - e.g. "FIREBASE_API_KEY"
 * @param {string} fallback - default fallback value
 * @returns {string}
 */
function resolveEnv(baseKey, fallback = "") {
  const cleanKey = baseKey.replace(/^(NEXT_PUBLIC_|VITE_|REACT_APP_)/, "");
  return (
    process.env[`NEXT_PUBLIC_${cleanKey}`] ||
    process.env[`VITE_${cleanKey}`] ||
    process.env[`REACT_APP_${cleanKey}`] ||
    process.env[cleanKey] ||
    fallback
  );
}

export const firebaseConfig = {
  apiKey: resolveEnv("FIREBASE_API_KEY", ""),
  authDomain: resolveEnv("FIREBASE_AUTH_DOMAIN", ""),
  databaseURL: resolveEnv(
    "FIREBASE_DATABASE_URL",
    "https://saritech-default-rtdb.asia-southeast1.firebasedatabase.app"
  ),
  projectId: resolveEnv("FIREBASE_PROJECT_ID", "saritech"),
  storageBucket: resolveEnv("FIREBASE_STORAGE_BUCKET", ""),
  messagingSenderId: resolveEnv("FIREBASE_MESSAGING_SENDER_ID", ""),
  appId: resolveEnv("FIREBASE_APP_ID", ""),
  measurementId: resolveEnv("FIREBASE_MEASUREMENT_ID", "")
};

// Initialize Firebase App singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Export Firebase Realtime Database instance
export const db = getDatabase(app);

/**
 * Write a test product under '/test-products'
 * Default: { name: 'Test Product', price: 10 }
 *
 * @param {Object} [productData]
 * @returns {Promise<{ id: string, name: string, price: number, timestamp: number, createdAt: string }>}
 */
export async function writeTestProduct(productData = { name: "Test Product", price: 10 }) {
  const productsRef = ref(db, "test-products");
  const newProductRef = push(productsRef);
  const data = {
    name: productData.name ?? "Test Product",
    price: productData.price ?? 10,
    timestamp: Date.now(),
    createdAt: new Date().toISOString()
  };
  await set(newProductRef, data);
  return { id: newProductRef.key, ...data };
}

/**
 * Read back test products under '/test-products'
 *
 * @param {string} [id] Optional single product key
 * @returns {Promise<any>}
 */
export async function readTestProducts(id = null) {
  const dbRef = ref(db);
  const pathKey = id ? `test-products/${id}` : "test-products";
  const snapshot = await get(child(dbRef, pathKey));
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

/**
 * Executes a full round-trip test:
 * 1. Writes a test product { name: 'Test Product', price: 10 } under '/test-products'
 * 2. Reads it back by key
 * 3. Confirms connection success
 *
 * @returns {Promise<{ success: boolean, message: string, databaseURL: string, written: Object, readBack: Object }>}
 */
export async function testFirebaseConnection() {
  const written = await writeTestProduct({ name: "Test Product", price: 10 });
  const readBack = await readTestProducts(written.id);

  if (!readBack || readBack.name !== written.name || readBack.price !== written.price) {
    throw new Error("Failed to verify product written to Firebase Realtime Database");
  }

  return {
    success: true,
    message: "Firebase Realtime Database connection verified successfully!",
    databaseURL: firebaseConfig.databaseURL,
    written,
    readBack
  };
}

export default {
  app,
  db,
  firebaseConfig,
  writeTestProduct,
  readTestProducts,
  testFirebaseConnection
};
