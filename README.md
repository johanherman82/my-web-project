# Olav & Jack’s Haberdashery — Fine Nordic Tailoring & Craft Goods

A refined, light Nordic webshop front page for **Olav & Jack’s Haberdashery** (est. 1928, Copenhagen & Oslo), built with semantic HTML5, modern vanilla CSS, and client-side JavaScript.

---

## ❄️ Nordic Light Design Aesthetic

- **Minimalist Palette**: Clean white background (`#ffffff`), subtle off-white and chalk tones (`#fbfbfa`, `#f4f3ef`), paired with Nordic slate (`#384a56`), fjord blue (`#2c4356`), pine sage (`#3c5249`), and warm antique brass accents (`#b8860b`).
- **Editorial Typography**: Pairing of **Cormorant Garamond** (Nordic heritage serif) for refined headings with **Plus Jakarta Sans** for clean, legible interfaces.
- **Natural Tactility**: Vector illustrations and custom SVGs depicting hand-forged shears, natural horn buttons, pure wool spools, and saddle leather tape measures.

---

## 🛍️ Interactive Webshop Features

1. **Curated Product Catalog**:
   - 9 artisanal haberdashery goods across Tailoring Tools, Natural Horn Buttons, Pure Spun Wools, and Silk Accessories.
   - Category filtering, real-time sorting (Featured, Price, Rating, Alphabetical), and empty-state fallbacks.

2. **Slide-Out Cart Drawer**:
   - Live quantity adjustment, item removal, and subtotal calculation.
   - Dynamic **Free Shipping Progress Tracker** with remaining amount calculation to reach the €120 threshold.
   - Promo code validation supporting `NORDIC10` (10% off), `OLAVJACK` (€15 voucher), and `WELCOME` (free shipping + 5% off).

3. **Multi-Currency Conversion**:
   - Real-time price calculation across **EUR (€)**, **USD ($)**, **GBP (£)**, and **NOK (kr)**.

4. **Interactive Atelier Bundle Builder**:
   - Interactive 3-step configurator allowing tailors to customize their own starter kit (Shears + Buttons + Thread) with an automatic **15% bundle discount**.

5. **Product Quick View Modal**:
   - Deep-dive product preview with specifications table (craft origin, materials, dimensions, weight), reviews rating, and direct Add-to-Bag interaction.

6. **Live Instant Search**:
   - Real-time keyword matching across titles, categories, and descriptions.
   - Keyboard shortcut (`/` key) to open search instantly.

7. **Saved Wishlist Drawer**:
   - Heart items on the catalog grid, view saved notions, and move directly to cart with local storage persistence.

8. **Newsletter & Gazette Subscription**:
   - Form validation with instant discount code grant.

---

## 🚀 Getting Started

Open [`index.html`](index.html) directly in any modern web browser or serve locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node / npx
npx serve .
```

---

## 📁 File Structure

```
my-web-project/
├── index.html     # Semantic HTML5 markup, accessible landmarks, and modal drawers
├── styles.css     # Light Nordic design system, CSS variables, fluid layout
├── app.js         # Webshop state, cart engine, currency math, search, bundle builder
├── .gitignore     # Git ignore rules
└── README.md      # Project documentation
```
