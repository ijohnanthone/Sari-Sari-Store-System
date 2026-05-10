function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysAgo(amount) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - amount);
  return toIsoDate(date);
}

export const seedInventoryItems = [
  { name: "Lucky Me Pancit Canton - Chilimansi", category: "Noodles", supplier: "Monde Nissin Distributor", stockQuantity: 45, unitPrice: 10.5, sellingPrice: 13, reorderLevel: 20 },
  { name: "Argentina Corned Beef 175g", category: "Canned Goods", supplier: "Century Pacific Supplier", stockQuantity: 15, unitPrice: 32, sellingPrice: 38, reorderLevel: 20 },
  { name: "Alaska Condensada 300ml", category: "Milk & Dairy", supplier: "Alaska Milk Distributor", stockQuantity: 0, unitPrice: 28, sellingPrice: 32, reorderLevel: 15 },
  { name: "Coca-Cola 1.5L", category: "Beverages", supplier: "Coca-Cola Bottlers", stockQuantity: 32, unitPrice: 45, sellingPrice: 55, reorderLevel: 15 },
  { name: "C2 Green Tea 1L", category: "Beverages", supplier: "Universal Robina Supplier", stockQuantity: 18, unitPrice: 28, sellingPrice: 35, reorderLevel: 20 },
  { name: "Eden Cheese 165g", category: "Dairy", supplier: "Mondelez Distributor", stockQuantity: 25, unitPrice: 65, sellingPrice: 75, reorderLevel: 10 },
  { name: "Century Tuna Flakes 155g", category: "Canned Goods", supplier: "Century Pacific Supplier", stockQuantity: 40, unitPrice: 28, sellingPrice: 33, reorderLevel: 20 },
  { name: "Skyflakes Crackers 250g", category: "Snacks", supplier: "Monde Nissin Distributor", stockQuantity: 55, unitPrice: 22, sellingPrice: 28, reorderLevel: 25 },
  { name: "Bear Brand Powdered Milk 300g", category: "Milk & Dairy", supplier: "Nestle Distributor", stockQuantity: 12, unitPrice: 125, sellingPrice: 145, reorderLevel: 15 },
  { name: "Surf Powder Detergent 30g", category: "Household", supplier: "Unilever Supplier", stockQuantity: 75, unitPrice: 5, sellingPrice: 7, reorderLevel: 50 },
  { name: "Colgate Toothpaste 150g", category: "Personal Care", supplier: "Colgate-Palmolive Supplier", stockQuantity: 8, unitPrice: 58, sellingPrice: 68, reorderLevel: 10 },
  { name: "Chippy BBQ 110g", category: "Snacks", supplier: "Jack 'n Jill Distributor", stockQuantity: 60, unitPrice: 18, sellingPrice: 23, reorderLevel: 30 },
  { name: "Piattos Cheese 85g", category: "Snacks", supplier: "Universal Robina Supplier", stockQuantity: 38, unitPrice: 31, sellingPrice: 38, reorderLevel: 20 },
  { name: "Nova Country Cheddar 78g", category: "Snacks", supplier: "Universal Robina Supplier", stockQuantity: 34, unitPrice: 30, sellingPrice: 37, reorderLevel: 20 },
  { name: "Boy Bawang Garlic 100g", category: "Snacks", supplier: "KSK Food Distributor", stockQuantity: 42, unitPrice: 18, sellingPrice: 24, reorderLevel: 25 },
  { name: "Oishi Prawn Crackers 90g", category: "Snacks", supplier: "Oishi Distributor", stockQuantity: 48, unitPrice: 17, sellingPrice: 22, reorderLevel: 25 },
  { name: "Nissin Cup Noodles Beef 40g", category: "Noodles", supplier: "Nissin Distributor", stockQuantity: 36, unitPrice: 24, sellingPrice: 30, reorderLevel: 20 },
  { name: "Payless Xtra Big Chilimansi 130g", category: "Noodles", supplier: "Monde Nissin Distributor", stockQuantity: 44, unitPrice: 14, sellingPrice: 18, reorderLevel: 25 },
  { name: "555 Sardines Tomato Sauce 155g", category: "Canned Goods", supplier: "Century Pacific Supplier", stockQuantity: 50, unitPrice: 23, sellingPrice: 29, reorderLevel: 25 },
  { name: "Mega Sardines 155g", category: "Canned Goods", supplier: "Mega Global Distributor", stockQuantity: 46, unitPrice: 22, sellingPrice: 28, reorderLevel: 25 },
  { name: "Purefoods Corned Beef 150g", category: "Canned Goods", supplier: "San Miguel Distributor", stockQuantity: 22, unitPrice: 39, sellingPrice: 48, reorderLevel: 15 },
  { name: "CDO Karne Norte 150g", category: "Canned Goods", supplier: "CDO Distributor", stockQuantity: 24, unitPrice: 28, sellingPrice: 35, reorderLevel: 15 },
  { name: "Milo Sachet 22g", category: "Beverages", supplier: "Nestle Distributor", stockQuantity: 90, unitPrice: 8, sellingPrice: 11, reorderLevel: 40 },
  { name: "Nescafe Classic Sachet 2g", category: "Beverages", supplier: "Nestle Distributor", stockQuantity: 100, unitPrice: 3, sellingPrice: 5, reorderLevel: 50 },
  { name: "Great Taste White Sachet 30g", category: "Beverages", supplier: "Universal Robina Supplier", stockQuantity: 85, unitPrice: 7, sellingPrice: 10, reorderLevel: 40 },
  { name: "Kopiko Blanca Twin Pack", category: "Beverages", supplier: "Mayora Distributor", stockQuantity: 72, unitPrice: 10, sellingPrice: 14, reorderLevel: 35 },
  { name: "Royal Tru Orange 1.5L", category: "Beverages", supplier: "Coca-Cola Bottlers", stockQuantity: 28, unitPrice: 45, sellingPrice: 55, reorderLevel: 15 },
  { name: "Sprite 1.5L", category: "Beverages", supplier: "Coca-Cola Bottlers", stockQuantity: 30, unitPrice: 45, sellingPrice: 55, reorderLevel: 15 },
  { name: "Wilkins Distilled Water 1L", category: "Beverages", supplier: "Coca-Cola Bottlers", stockQuantity: 40, unitPrice: 24, sellingPrice: 30, reorderLevel: 20 },
  { name: "Safeguard White 60g", category: "Personal Care", supplier: "Procter & Gamble Supplier", stockQuantity: 35, unitPrice: 28, sellingPrice: 35, reorderLevel: 20 },
  { name: "Sunsilk Smooth Sachet 12ml", category: "Personal Care", supplier: "Unilever Supplier", stockQuantity: 80, unitPrice: 5, sellingPrice: 8, reorderLevel: 40 },
  { name: "Head & Shoulders Sachet 12ml", category: "Personal Care", supplier: "Procter & Gamble Supplier", stockQuantity: 75, unitPrice: 6, sellingPrice: 9, reorderLevel: 40 },
  { name: "Closeup Toothpaste 20g", category: "Personal Care", supplier: "Unilever Supplier", stockQuantity: 42, unitPrice: 18, sellingPrice: 24, reorderLevel: 20 },
  { name: "Ariel Powder Detergent 70g", category: "Household", supplier: "Procter & Gamble Supplier", stockQuantity: 58, unitPrice: 12, sellingPrice: 16, reorderLevel: 30 },
  { name: "Tide Bar 380g", category: "Household", supplier: "Procter & Gamble Supplier", stockQuantity: 26, unitPrice: 34, sellingPrice: 42, reorderLevel: 15 },
  { name: "Joy Dishwashing Liquid 20ml", category: "Household", supplier: "Procter & Gamble Supplier", stockQuantity: 65, unitPrice: 6, sellingPrice: 9, reorderLevel: 35 },
  { name: "Zonrox Bleach 250ml", category: "Household", supplier: "Clorox Distributor", stockQuantity: 32, unitPrice: 22, sellingPrice: 29, reorderLevel: 20 },
  { name: "Silver Swan Soy Sauce 385ml", category: "Condiments", supplier: "NutriAsia Distributor", stockQuantity: 36, unitPrice: 29, sellingPrice: 36, reorderLevel: 18 },
  { name: "Datu Puti Vinegar 385ml", category: "Condiments", supplier: "NutriAsia Distributor", stockQuantity: 38, unitPrice: 27, sellingPrice: 34, reorderLevel: 18 },
  { name: "UFC Banana Ketchup 320g", category: "Condiments", supplier: "NutriAsia Distributor", stockQuantity: 30, unitPrice: 31, sellingPrice: 39, reorderLevel: 15 },
  { name: "Magic Sarap 8g", category: "Condiments", supplier: "Nestle Distributor", stockQuantity: 120, unitPrice: 3, sellingPrice: 5, reorderLevel: 60 },
  { name: "Knorr Beef Cube 10g", category: "Condiments", supplier: "Unilever Supplier", stockQuantity: 110, unitPrice: 5, sellingPrice: 7, reorderLevel: 50 },
  { name: "Star Margarine 100g", category: "Dairy", supplier: "San Miguel Distributor", stockQuantity: 25, unitPrice: 28, sellingPrice: 35, reorderLevel: 15 },
  { name: "Nestle Cream 250ml", category: "Milk & Dairy", supplier: "Nestle Distributor", stockQuantity: 20, unitPrice: 58, sellingPrice: 68, reorderLevel: 12 },
  { name: "Selecta Fortified Milk 1L", category: "Milk & Dairy", supplier: "Unilever Supplier", stockQuantity: 18, unitPrice: 82, sellingPrice: 95, reorderLevel: 10 }
];

export const seedSales = [
  { date: daysAgo(0), paymentMethod: "Cash", items: [{ itemName: "Lucky Me Pancit Canton - Chilimansi", quantity: 3, price: 13 }, { itemName: "Coca-Cola 1.5L", quantity: 2, price: 55 }] },
  { date: daysAgo(0), paymentMethod: "GCash", items: [{ itemName: "Century Tuna Flakes 155g", quantity: 2, price: 33 }, { itemName: "Skyflakes Crackers 250g", quantity: 1, price: 28 }, { itemName: "Eden Cheese 165g", quantity: 1, price: 75 }] },
  { date: daysAgo(0), paymentMethod: "Cash", items: [{ itemName: "Chippy BBQ 110g", quantity: 5, price: 23 }] },
  { date: daysAgo(1), paymentMethod: "Cash", items: [{ itemName: "Lucky Me Pancit Canton - Chilimansi", quantity: 10, price: 13 }, { itemName: "Coca-Cola 1.5L", quantity: 3, price: 55 }, { itemName: "C2 Green Tea 1L", quantity: 2, price: 35 }] },
  { date: daysAgo(1), paymentMethod: "GCash", items: [{ itemName: "Century Tuna Flakes 155g", quantity: 4, price: 33 }, { itemName: "Argentina Corned Beef 175g", quantity: 2, price: 38 }] },
  { date: daysAgo(2), paymentMethod: "Cash", items: [{ itemName: "Chippy BBQ 110g", quantity: 8, price: 23 }, { itemName: "Skyflakes Crackers 250g", quantity: 5, price: 28 }] }
];
