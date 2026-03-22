import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import { seedInventoryItems, seedSales } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "store.db");
export const db = new DatabaseSync(dbPath);

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function getTodayDate() {
  return new Date();
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function startOfDay(value = getTodayDate()) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function shiftDate(date, amount) {
  const next = startOfDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function withTransaction(callback) {
  return (...args) => {
    db.exec("BEGIN");
    try {
      const result = callback(...args);
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  };
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, originalHash] = stored.split(":");
  const computedHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(computedHash, "hex"));
}

export function computeStatus(stockQuantity, reorderLevel) {
  if (stockQuantity <= 0) return "Out of Stock";
  if (stockQuantity <= reorderLevel) return "Low Stock";
  return "In Stock";
}

function createSchema() {
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Admin',
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      unit_price REAL NOT NULL DEFAULT 0,
      selling_price REAL NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 10,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_code TEXT NOT NULL UNIQUE,
      sale_date TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_amount REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      inventory_item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT
    );
    CREATE TABLE IF NOT EXISTS store_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      store_name TEXT NOT NULL,
      store_address TEXT NOT NULL,
      contact_number TEXT NOT NULL,
      tax_id TEXT,
      operating_hours TEXT NOT NULL,
      low_stock_alert INTEGER NOT NULL DEFAULT 1,
      out_of_stock_alert INTEGER NOT NULL DEFAULT 1,
      daily_sales_alert INTEGER NOT NULL DEFAULT 1,
      weekly_sales_alert INTEGER NOT NULL DEFAULT 0,
      theme TEXT NOT NULL DEFAULT 'Light Mode',
      color_scheme TEXT NOT NULL DEFAULT 'Emerald'
    );
  `);
}

export function createSale({ saleDate, paymentMethod, items, skipStockValidation = false }) {
  const insertSale = db.prepare(`INSERT INTO sales (transaction_code, sale_date, payment_method, total_amount) VALUES (?, ?, ?, ?)`);
  const insertSaleItem = db.prepare(`INSERT INTO sale_items (sale_id, inventory_item_id, item_name, quantity, price, total) VALUES (?, ?, ?, ?, ?, ?)`);
  const updateStock = db.prepare(`UPDATE inventory_items SET stock_quantity = stock_quantity - ? WHERE id = ?`);

  const createTx = withTransaction((payload) => {
    const totalAmount = payload.items.reduce((sum, item) => sum + item.total, 0);
    const saleCount = db.prepare("SELECT COUNT(*) AS count FROM sales").get().count + 1;
    const transactionCode = `S${String(saleCount).padStart(4, "0")}`;
    const saleResult = insertSale.run(transactionCode, payload.saleDate, payload.paymentMethod, totalAmount);
    const saleId = saleResult.lastInsertRowid;

    for (const item of payload.items) {
      const currentInventory = db.prepare("SELECT id, name, stock_quantity FROM inventory_items WHERE id = ?").get(item.inventoryItemId);
      if (!currentInventory) throw new Error("One of the sale items does not exist.");
      if (!skipStockValidation && currentInventory.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for ${currentInventory.name}.`);
      }
      insertSaleItem.run(saleId, item.inventoryItemId, currentInventory.name, item.quantity, item.price, item.total);
      updateStock.run(item.quantity, item.inventoryItemId);
    }
  });

  createTx({ saleDate, paymentMethod, items });
}

function seedDefaults() {
  if (!db.prepare("SELECT COUNT(*) AS count FROM users").get().count) {
    db.prepare(`INSERT INTO users (username, full_name, role, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)`)
      .run("admin", "Store Owner", "Admin", "owner@sarisaristore.com", "+63 912 345 6789", hashPassword("admin123"));
  }

  if (!db.prepare("SELECT COUNT(*) AS count FROM store_settings").get().count) {
    db.prepare(`
      INSERT INTO store_settings
      (id, store_name, store_address, contact_number, tax_id, operating_hours, low_stock_alert, out_of_stock_alert, daily_sales_alert, weekly_sales_alert, theme, color_scheme)
      VALUES (1, ?, ?, ?, ?, ?, 1, 1, 1, 0, 'Light Mode', 'Emerald')
    `).run("Sari-Sari Store", "123 Barangay Street, City, Province", "+63 912 345 6789", "", "Monday - Sunday, 6:00 AM - 10:00 PM");
  }

  if (!db.prepare("SELECT COUNT(*) AS count FROM inventory_items").get().count) {
    const insertItem = db.prepare(`INSERT INTO inventory_items (name, category, stock_quantity, unit_price, selling_price, reorder_level) VALUES (?, ?, ?, ?, ?, ?)`);
    const insertMany = withTransaction((items) => {
      for (const item of items) {
        insertItem.run(item.name, item.category, item.stockQuantity, item.unitPrice, item.sellingPrice, item.reorderLevel);
      }
    });
    insertMany(seedInventoryItems);
  }

  if (!db.prepare("SELECT COUNT(*) AS count FROM sales").get().count) {
    for (const sale of seedSales) {
      const items = sale.items.map((entry) => {
        const inventoryItem = db.prepare("SELECT id, name FROM inventory_items WHERE name = ?").get(entry.itemName);
        return { inventoryItemId: inventoryItem.id, itemName: inventoryItem.name, quantity: entry.quantity, price: entry.price, total: entry.quantity * entry.price };
      });
      createSale({ saleDate: sale.date, paymentMethod: sale.paymentMethod, items, skipStockValidation: true });
    }
  }
}

export function initializeDatabase() {
  createSchema();
  seedDefaults();
}

export function getUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function getStoreSettings() {
  return db.prepare("SELECT * FROM store_settings WHERE id = 1").get();
}

export function updateStoreSettings(input) {
  db.prepare(`UPDATE store_settings SET store_name = ?, store_address = ?, contact_number = ?, tax_id = ?, operating_hours = ? WHERE id = 1`)
    .run(input.storeName, input.storeAddress, input.contactNumber, input.taxId, input.operatingHours);
}

export function updateUserProfile(userId, input) {
  db.prepare(`UPDATE users SET full_name = ?, email = ?, phone = ? WHERE id = ?`).run(input.fullName, input.email, input.phone, userId);
}

export function updatePassword(userId, newPassword) {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), userId);
}

export function updateNotifications(input) {
  db.prepare(`UPDATE store_settings SET low_stock_alert = ?, out_of_stock_alert = ?, daily_sales_alert = ?, weekly_sales_alert = ? WHERE id = 1`)
    .run(input.lowStockAlert ? 1 : 0, input.outOfStockAlert ? 1 : 0, input.dailySalesAlert ? 1 : 0, input.weeklySalesAlert ? 1 : 0);
}

export function updateAppearance(input) {
  db.prepare(`UPDATE store_settings SET theme = ?, color_scheme = ? WHERE id = 1`).run(input.theme, input.colorScheme);
}

export function listInventory(search = "", status = "all") {
  const pattern = `%${search.trim()}%`;
  const items = db.prepare(`
    SELECT *
    FROM inventory_items
    WHERE name LIKE ? OR category LIKE ?
    ORDER BY name
  `).all(pattern, pattern).map((row) => ({
    ...row,
    status: computeStatus(row.stock_quantity, row.reorder_level),
    profit: row.selling_price - row.unit_price
  }));

  if (status === "all") return items;
  return items.filter((item) => item.status === status);
}

export function getInventorySummary() {
  const items = listInventory("");
  return {
    total: items.length,
    inStock: items.filter((item) => item.status === "In Stock").length,
    lowStock: items.filter((item) => item.status === "Low Stock").length,
    outOfStock: items.filter((item) => item.status === "Out of Stock").length
  };
}

export function addInventoryItem(input) {
  db.prepare(`INSERT INTO inventory_items (name, category, stock_quantity, unit_price, selling_price, reorder_level) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(input.name, input.category, Number(input.stockQuantity), Number(input.unitPrice), Number(input.sellingPrice), Number(input.reorderLevel));
}

export function updateInventoryItem(id, input) {
  db.prepare(`UPDATE inventory_items SET name = ?, category = ?, stock_quantity = ?, unit_price = ?, selling_price = ?, reorder_level = ? WHERE id = ?`)
    .run(input.name, input.category, Number(input.stockQuantity), Number(input.unitPrice), Number(input.sellingPrice), Number(input.reorderLevel), id);
}

export function deleteInventoryItem(id) {
  const relatedSales = db.prepare("SELECT COUNT(*) AS count FROM sale_items WHERE inventory_item_id = ?").get(id).count;
  if (relatedSales > 0) throw new Error("This item already exists in sales history and cannot be deleted.");
  db.prepare("DELETE FROM inventory_items WHERE id = ?").run(id);
}

export function listSales(filter = "all") {
  let clause = "";
  const params = [];
  if (filter === "today") {
    clause = "WHERE sale_date = ?";
    params.push(toIsoDate(getTodayDate()));
  } else if (filter === "week") {
    clause = "WHERE sale_date >= ?";
    params.push(toIsoDate(shiftDate(getTodayDate(), -6)));
  } else if (filter === "month") {
    clause = "WHERE sale_date >= ?";
    params.push(toIsoDate(shiftDate(getTodayDate(), -29)));
  }

  const sales = db.prepare(`SELECT * FROM sales ${clause} ORDER BY sale_date DESC, id DESC`).all(...params);
  const itemStmt = db.prepare(`SELECT inventory_item_id, item_name, quantity, price, total FROM sale_items WHERE sale_id = ?`);
  return sales.map((sale) => ({ ...sale, items: itemStmt.all(sale.id) }));
}

export function getSalesMetrics() {
  const rows = listSales("all");
  const now = startOfDay();
  const isoDate = toIsoDate(now);
  const todaySales = rows.filter((sale) => sale.sale_date === isoDate);
  const weekThreshold = shiftDate(now, -6);
  const monthThreshold = shiftDate(now, -29);
  const weeklySales = rows.filter((sale) => new Date(sale.sale_date) >= weekThreshold);
  const monthlySales = rows.filter((sale) => new Date(sale.sale_date) >= monthThreshold);

  return {
    todayTotal: todaySales.reduce((sum, sale) => sum + sale.total_amount, 0),
    todayTransactions: todaySales.length,
    todayItems: todaySales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0),
    weeklyTotal: weeklySales.reduce((sum, sale) => sum + sale.total_amount, 0),
    monthlyTotal: monthlySales.reduce((sum, sale) => sum + sale.total_amount, 0)
  };
}

export function getQuickSaleRecommendations() {
  const availableItems = listInventory("").filter((item) => item.stock_quantity > 0);
  const itemsById = new Map(availableItems.map((item) => [item.id, item]));
  const allSales = listSales("all");
  const todayKey = toIsoDate(getTodayDate());
  const weekThreshold = shiftDate(getTodayDate(), -6);
  const todayScores = new Map();
  const weekScores = new Map();
  const smartScores = new Map();

  function addScore(map, itemId, amount) {
    map.set(itemId, (map.get(itemId) || 0) + amount);
  }

  allSales.forEach((sale) => {
    const saleDate = startOfDay(new Date(`${sale.sale_date}T00:00:00`));
    const daysAgo = Math.max(0, Math.round((startOfDay(getTodayDate()) - saleDate) / 86400000));
    const recencyWeight = Math.max(1, 14 - daysAgo);

    sale.items.forEach((item) => {
      if (!itemsById.has(item.inventory_item_id)) return;
      if (sale.sale_date === todayKey) addScore(todayScores, item.inventory_item_id, item.quantity);
      if (saleDate >= weekThreshold) addScore(weekScores, item.inventory_item_id, item.quantity);
      addScore(smartScores, item.inventory_item_id, (item.quantity * 3) + recencyWeight);
    });
  });

  function buildList(scores, limit) {
    return [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([itemId, score]) => ({ ...itemsById.get(itemId), score }));
  }

  const fallback = availableItems.slice(0, 8);

  return {
    today: buildList(todayScores, 6),
    week: buildList(weekScores, 6),
    smart: buildList(smartScores, 8).length ? buildList(smartScores, 8) : fallback
  };
}

export function getDashboardData() {
  const inventory = listInventory("");
  const summary = getInventorySummary();
  const salesMetrics = getSalesMetrics();
  const bestSelling = getBestSellingData();
  const dailySeries = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = shiftDate(getTodayDate(), -offset);
    const dateKey = toIsoDate(current);
    const total = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS total FROM sales WHERE sale_date = ?").get(dateKey).total;
    dailySeries.push({ label: current.toLocaleDateString("en-US", { weekday: "short" }), total });
  }

  return {
    metrics: {
      totalProducts: summary.total,
      lowStockItems: summary.lowStock,
      outOfStockItems: summary.outOfStock,
      dailySales: salesMetrics.todayTotal,
      weeklySales: salesMetrics.weeklyTotal,
      monthlySales: salesMetrics.monthlyTotal
    },
    lowStockItems: inventory.filter((item) => item.status !== "In Stock").slice(0, 4),
    bestSellingItem: bestSelling.items[0] || null,
    dailySeries
  };
}

export function getDashboardChartData(range = "daily") {
  const normalizedRange = ["daily", "weekly", "monthly", "yearly"].includes(range) ? range : "daily";
  const rows = listSales("all");
  const totals = new Map();

  if (normalizedRange === "daily") {
    for (let offset = 6; offset >= 0; offset -= 1) {
      const current = shiftDate(getTodayDate(), -offset);
      const key = toIsoDate(current);
      totals.set(key, {
        label: current.toLocaleDateString("en-US", { weekday: "short" }),
        sortKey: key,
        total: 0
      });
    }

    rows.forEach((sale) => {
      if (totals.has(sale.sale_date)) {
        totals.get(sale.sale_date).total += sale.total_amount;
      }
    });
  }

  if (normalizedRange === "weekly") {
    for (let offset = 5; offset >= 0; offset -= 1) {
      const end = shiftDate(getTodayDate(), -(offset * 7));
      const start = shiftDate(end, -6);
      const key = `${toIsoDate(start)}_${toIsoDate(end)}`;
      totals.set(key, {
        label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { day: "numeric" })}`,
        sortKey: key,
        total: 0
      });
    }

    rows.forEach((sale) => {
      const saleDate = startOfDay(new Date(`${sale.sale_date}T00:00:00`));
      for (const [key, bucket] of totals.entries()) {
        const [startIso, endIso] = key.split("_");
        const start = startOfDay(new Date(`${startIso}T00:00:00`));
        const end = startOfDay(new Date(`${endIso}T00:00:00`));
        if (saleDate >= start && saleDate <= end) {
          bucket.total += sale.total_amount;
          break;
        }
      }
    });
  }

  if (normalizedRange === "monthly") {
    for (let offset = 5; offset >= 0; offset -= 1) {
      const current = new Date();
      current.setDate(1);
      current.setMonth(current.getMonth() - offset);
      const key = `${current.getFullYear()}-${padNumber(current.getMonth() + 1)}`;
      totals.set(key, {
        label: current.toLocaleDateString("en-US", { month: "short" }),
        sortKey: key,
        total: 0
      });
    }

    rows.forEach((sale) => {
      const key = sale.sale_date.slice(0, 7);
      if (totals.has(key)) totals.get(key).total += sale.total_amount;
    });
  }

  if (normalizedRange === "yearly") {
    const currentYear = getTodayDate().getFullYear();
    for (let offset = 4; offset >= 0; offset -= 1) {
      const year = currentYear - offset;
      const key = String(year);
      totals.set(key, {
        label: key,
        sortKey: key,
        total: 0
      });
    }

    rows.forEach((sale) => {
      const key = sale.sale_date.slice(0, 4);
      if (totals.has(key)) totals.get(key).total += sale.total_amount;
    });
  }

  const series = [...totals.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  return {
    range: normalizedRange,
    title: `${normalizedRange[0].toUpperCase()}${normalizedRange.slice(1)} Sales`,
    labels: series.map((item) => item.label),
    values: series.map((item) => item.total)
  };
}

export function getReportsData() {
  const weeklySeries = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const current = shiftDate(getTodayDate(), -offset);
    const dateKey = toIsoDate(current);
    const total = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS total FROM sales WHERE sale_date = ?").get(dateKey).total;
    weeklySeries.push({ label: current.toLocaleDateString("en-US", { weekday: "short" }), total });
  }

  const monthlySeries = db.prepare(`
    SELECT strftime('%Y-%m', sale_date) AS month_key, COALESCE(SUM(total_amount), 0) AS total
    FROM sales
    GROUP BY month_key
    ORDER BY month_key
  `).all().map((row) => ({
    label: new Date(`${row.month_key}-01T00:00:00`).toLocaleDateString("en-US", { month: "short" }),
    total: row.total
  }));

  const categoryBreakdown = db.prepare(`
    SELECT ii.category AS category, COALESCE(SUM(si.total), 0) AS revenue
    FROM sale_items si
    INNER JOIN inventory_items ii ON ii.id = si.inventory_item_id
    GROUP BY ii.category
    ORDER BY revenue DESC
  `).all();

  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) AS total FROM sales").get().total;
  const averageDaily = weeklySeries.reduce((sum, item) => sum + item.total, 0) / weeklySeries.length;
  return { totalRevenue, averageDaily, bestCategory: categoryBreakdown[0] || null, weeklySeries, monthlySeries, categoryBreakdown };
}

export function getBestSellingData() {
  const items = db.prepare(`
    SELECT ii.id, ii.name, SUM(si.quantity) AS quantity_sold, SUM(si.total) AS revenue
    FROM sale_items si
    INNER JOIN inventory_items ii ON ii.id = si.inventory_item_id
    GROUP BY ii.id, ii.name
    ORDER BY quantity_sold DESC, revenue DESC
  `).all().map((row, index) => ({ ...row, rank: index + 1, averagePrice: row.quantity_sold ? row.revenue / row.quantity_sold : 0 }));

  return {
    items,
    topItem: items[0] || null,
    totalUnitsSold: items.reduce((sum, item) => sum + item.quantity_sold, 0),
    totalRevenue: items.reduce((sum, item) => sum + item.revenue, 0)
  };
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}

export function exportInventoryCsv() {
  const items = listInventory("");
  const headers = ["Name", "Category", "Stock Quantity", "Unit Price", "Selling Price", "Profit", "Status", "Reorder Level"];
  const rows = items.map((item) => [item.name, item.category, item.stock_quantity, item.unit_price, item.selling_price, item.profit, item.status, item.reorder_level]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function exportSalesCsv() {
  const sales = listSales("all");
  const headers = ["Transaction Code", "Date", "Payment Method", "Total Amount", "Items"];
  const rows = sales.map((sale) => [sale.transaction_code, sale.sale_date, sale.payment_method, sale.total_amount, sale.items.map((item) => `${item.item_name} x${item.quantity}`).join("; ")]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function getDatabasePath() {
  return dbPath;
}

export function resetAllData() {
  db.exec(`
    DELETE FROM sale_items;
    DELETE FROM sales;
    DELETE FROM inventory_items;
    DELETE FROM store_settings;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);
  seedDefaults();
}
