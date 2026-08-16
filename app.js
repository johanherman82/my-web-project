/**
 * Olav & Jack’s Haberdashery — Interactive Webshop Engine
 * Handles catalog rendering, dynamic currency conversion, cart drawer,
 * custom bundle builder, quick view modal, live search, and wishlist.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // State & Data Models
  // =========================================================================
  const currencies = {
    EUR: { symbol: '€', rate: 1.00, format: (amt) => `€${amt.toFixed(2)}` },
    USD: { symbol: '$', rate: 1.08, format: (amt) => `$${amt.toFixed(2)}` },
    GBP: { symbol: '£', rate: 0.85, format: (amt) => `£${amt.toFixed(2)}` },
    NOK: { symbol: 'kr', rate: 11.50, format: (amt) => `${Math.round(amt)} kr` }
  };

  let currentCurrency = 'EUR';
  let activeFilter = 'all';
  let activeSort = 'featured';
  let appliedPromo = null; // { code: 'NORDIC10', type: 'percent', value: 0.10 }

  const FREE_SHIPPING_THRESHOLD_EUR = 120;
  const STANDARD_SHIPPING_EUR = 9.50;

  // Product Catalog
  const products = [
    {
      id: 'shears-105',
      name: 'Master Tailor’s Forged Shears (10.5")',
      category: 'tools',
      categoryLabel: 'Tailoring Tools',
      priceEUR: 135.00,
      rating: 4.9,
      reviewsCount: 38,
      badge: 'Heritage Essential',
      excerpt: 'Hand-forged from high-carbon Swedish cutlery steel with hand-tuned brass pivot bolt.',
      description: 'Balanced specifically for effortlessly gliding through multi-layered heavy wools and delicate silks alike. Hand-sharpened on wet sandstone wheels in Eskilstuna, Sweden. Comes with a lifetime complimentary sharpening guarantee.',
      specs: {
        'Craft Origin': 'Eskilstuna, Sweden',
        'Blade Material': 'Forged High-Carbon Swedish Steel',
        'Hardware': 'Solid Brushed Brass Pivot Bolt',
        'Total Length': '265 mm (10.5 in)',
        'Weight': '420 grams'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <g transform="translate(45, 30) rotate(25 60 70)">
            <path d="M20 15 L120 75 L20 40 Z" fill="#191c1e"/>
            <path d="M20 40 L120 78 L20 65 Z" fill="#2c3035"/>
            <line x1="25" y1="39" x2="115" y2="76" stroke="#878f97" stroke-width="1"/>
            <circle cx="55" cy="48" r="6.5" fill="#b8860b"/>
            <circle cx="55" cy="48" r="3.5" fill="#8f6808"/>
            <path d="M20 15 C 2 8, -15 22, -15 42 C -15 58, 5 62, 20 45 Z" fill="none" stroke="#b8860b" stroke-width="6" stroke-linecap="round"/>
            <path d="M20 65 C 2 72, -18 65, -18 88 C -18 108, 5 110, 22 88 Z" fill="none" stroke="#b8860b" stroke-width="6" stroke-linecap="round"/>
          </g>
        </svg>
      `
    },
    {
      id: 'horn-buttons-24',
      name: 'Norwegian Horn Button Set (24-Piece)',
      category: 'buttons',
      categoryLabel: 'Buttons & Shell',
      priceEUR: 48.00,
      rating: 5.0,
      reviewsCount: 52,
      badge: 'Bestseller',
      excerpt: 'Turned from ethically sourced natural horn with rich amber striations and a matte buffed finish.',
      description: 'Complete tailored suit button set. Each button displays unique natural horn marbling. Includes 6 jacket front buttons (20mm), 12 sleeve cuff buttons (15mm), and 6 trouser buttons (15mm).',
      specs: {
        'Craft Origin': 'Bergen, Norway',
        'Raw Material': '100% Natural Buffalo & Ox Horn',
        'Quantity': '24 Buttons (6 x 20mm, 18 x 15mm)',
        'Holes': '4-Hole Tailor Drilled',
        'Finish': 'Satin Matte Polish'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Big Button -->
          <g transform="translate(60, 45)">
            <circle cx="40" cy="40" r="34" fill="#302720" stroke="#4a3c32" stroke-width="2"/>
            <circle cx="38" cy="38" r="28" fill="#382e26" opacity="0.6"/>
            <!-- Holes -->
            <circle cx="32" cy="32" r="2.5" fill="#f4f3ef"/>
            <circle cx="48" cy="32" r="2.5" fill="#f4f3ef"/>
            <circle cx="32" cy="48" r="2.5" fill="#f4f3ef"/>
            <circle cx="48" cy="48" r="2.5" fill="#f4f3ef"/>
            <line x1="32" y1="32" x2="48" y2="48" stroke="#f4f3ef" stroke-width="1.5"/>
            <line x1="48" y1="32" x2="32" y2="48" stroke="#f4f3ef" stroke-width="1.5"/>
          </g>
          <!-- Small Button -->
          <g transform="translate(105, 105)">
            <circle cx="25" cy="25" r="22" fill="#42342b" stroke="#5a473b" stroke-width="1.5"/>
            <circle cx="20" cy="20" r="2" fill="#f4f3ef"/>
            <circle cx="30" cy="20" r="2" fill="#f4f3ef"/>
            <circle cx="20" cy="30" r="2" fill="#f4f3ef"/>
            <circle cx="30" cy="30" r="2" fill="#f4f3ef"/>
          </g>
        </svg>
      `
    },
    {
      id: 'wool-thread-trio',
      name: 'Gudbrandsdalen Pure Wool Thread Trio',
      category: 'threads',
      categoryLabel: 'Threads & Wool',
      priceEUR: 28.00,
      rating: 4.8,
      reviewsCount: 29,
      badge: 'Organic',
      excerpt: 'Triple-twist sewing cord spun from long-staple Norwegian valley sheep wool.',
      description: 'Engineered for handcrafted buttonholes, heavy coat construction, and pick-stitching lapels. Packaged as a curated trio: Fjord Blue, Natural Oat, and Pine Sage.',
      specs: {
        'Craft Origin': 'Gudbrandsdalen Valley, Norway',
        'Fibre': '100% Traceable Norwegian Fleece',
        'Spool Volume': '3 spools x 50 meters (150m total)',
        'Spool Body': 'Turned Birchwood',
        'Ply': '3-Ply Waxed Cord'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Spool 1 (Fjord Blue) -->
          <g transform="translate(45, 65)">
            <rect x="0" y="8" width="30" height="50" rx="3" fill="#2c4356"/>
            <ellipse cx="15" cy="8" rx="15" ry="6" fill="#d6c6b2"/>
            <ellipse cx="15" cy="58" rx="15" ry="6" fill="#ab967d"/>
            <line x1="3" y1="20" x2="27" y2="20" stroke="#3b566e" stroke-width="1"/>
            <line x1="3" y1="35" x2="27" y2="35" stroke="#3b566e" stroke-width="1"/>
          </g>
          <!-- Spool 2 (Pine Sage) -->
          <g transform="translate(85, 55)">
            <rect x="0" y="8" width="30" height="55" rx="3" fill="#3c5249"/>
            <ellipse cx="15" cy="8" rx="15" ry="6" fill="#d6c6b2"/>
            <ellipse cx="15" cy="63" rx="15" ry="6" fill="#ab967d"/>
            <line x1="3" y1="22" x2="27" y2="22" stroke="#4f6a5f" stroke-width="1"/>
            <line x1="3" y1="40" x2="27" y2="40" stroke="#4f6a5f" stroke-width="1"/>
          </g>
          <!-- Spool 3 (Terracotta) -->
          <g transform="translate(125, 75)">
            <rect x="0" y="8" width="30" height="45" rx="3" fill="#9e4736"/>
            <ellipse cx="15" cy="8" rx="15" ry="6" fill="#d6c6b2"/>
            <ellipse cx="15" cy="53" rx="15" ry="6" fill="#ab967d"/>
            <path d="M15 53 C 25 70, -20 80, -40 85" stroke="#9e4736" stroke-width="1.5" stroke-dasharray="2 1" fill="none"/>
          </g>
        </svg>
      `
    },
    {
      id: 'leather-tape-150',
      name: 'Saddle Leather Retractable Tape Measure',
      category: 'tools',
      categoryLabel: 'Tailoring Tools',
      priceEUR: 54.00,
      rating: 4.9,
      reviewsCount: 44,
      badge: 'Handmade',
      excerpt: 'Hand-stitched vegetable-tanned Swedish leather case with solid brass center release button.',
      description: 'A tactile measuring tape built for everyday tailor fittings. Dual metric (150cm) and imperial (60 inches) scale on heavy-duty non-stretch fiberglass tape.',
      specs: {
        'Craft Origin': 'Tärnsjö Tannery, Sweden',
        'Leather': 'Full-Grain Vegetable-Tanned Cowhide',
        'Hardware': 'Solid Turned Brass Push-Button',
        'Length': '150 cm / 60 inches',
        'Mechanism': 'Auto-Locking Spring Return'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Circular Leather Body -->
          <circle cx="100" cy="100" r="48" fill="#96603a" stroke="#754826" stroke-width="2"/>
          <circle cx="100" cy="100" r="42" stroke="#d6a77a" stroke-width="1" stroke-dasharray="3 2" fill="none"/>
          <!-- Brass Stud -->
          <circle cx="100" cy="100" r="14" fill="#b8860b" stroke="#8f6808" stroke-width="1.5"/>
          <circle cx="100" cy="100" r="7" fill="#d49b13"/>
          <!-- Tape Tongue protruding -->
          <rect x="145" y="93" width="22" height="14" rx="2" fill="#fffcee" stroke="#878f97" stroke-width="1"/>
          <line x1="152" y1="93" x2="152" y2="100" stroke="#191c1e" stroke-width="1"/>
          <line x1="158" y1="93" x2="158" y2="98" stroke="#191c1e" stroke-width="1"/>
          <circle cx="163" cy="100" r="2.5" fill="#b8860b"/>
        </svg>
      `
    },
    {
      id: 'pocket-square-fjord',
      name: 'Hand-Rolled Silk & Linen Pocket Square',
      category: 'accessories',
      categoryLabel: 'Accessories & Silk',
      priceEUR: 65.00,
      rating: 5.0,
      reviewsCount: 19,
      badge: 'New Arrival',
      excerpt: 'Woven on traditional Copenhagen looms with hand-rolled and hand-stitched edges.',
      description: 'A blend of 60% fine mulberry silk and 40% crisp Belgian flax linen. Features an understated Nordic geometric motif in fjord slate and chalk white.',
      specs: {
        'Craft Origin': 'Copenhagen, Denmark',
        'Composition': '60% Mulberry Silk, 40% Flax Linen',
        'Dimensions': '38 cm x 38 cm (15 x 15 in)',
        'Hemming': 'Hand-Rolled & Sewn by Master Seamstresses',
        'Care': 'Dry Clean or Gentle Cold Hand Wash'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Folded Square -->
          <polygon points="100,35 160,95 100,155 40,95" fill="#2c4356" stroke="#1c2d3b" stroke-width="1.5"/>
          <polygon points="100,55 145,100 100,145 55,100" fill="#384f63"/>
          <polygon points="100,75 125,100 100,125 75,100" fill="#f4f3ef" opacity="0.9"/>
          <!-- Delicate stitch outline -->
          <polygon points="100,40 155,95 100,150 45,95" fill="none" stroke="#b8860b" stroke-width="1" stroke-dasharray="2 2"/>
        </svg>
      `
    },
    {
      id: 'mop-buttons-18',
      name: 'Mother-of-Pearl Shirt Button Set (18-Piece)',
      category: 'buttons',
      categoryLabel: 'Buttons & Shell',
      priceEUR: 36.00,
      rating: 4.9,
      reviewsCount: 31,
      badge: 'Artisan',
      excerpt: 'Deep-water white lip oyster shell with shimmering iridescence and thick 3.5mm profile.',
      description: 'Carved specifically for bespoke dress shirts. Heavy gauge shell resists chipping during commercial pressing. Includes 14 standard front/cuff buttons and 4 smaller collar/sleeve placket buttons.',
      specs: {
        'Craft Origin': 'Artisan Workshop in Gotland',
        'Material': '100% Genuine White Lip Mother-of-Pearl',
        'Quantity': '18 Buttons (14 x 11.5mm, 4 x 9mm)',
        'Thickness': '3.5 mm Heavy Gauge',
        'Profile': 'Sunken Dish Center with 4 Holes'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Shimmering Pearl Button 1 -->
          <circle cx="80" cy="80" r="30" fill="#fbfaf7" stroke="#ded8cc" stroke-width="2"/>
          <circle cx="80" cy="80" r="22" fill="#f4efe6"/>
          <circle cx="75" cy="75" r="2" fill="#5e656d"/>
          <circle cx="85" cy="75" r="2" fill="#5e656d"/>
          <circle cx="75" cy="85" r="2" fill="#5e656d"/>
          <circle cx="85" cy="85" r="2" fill="#5e656d"/>
          <!-- Shimmering Pearl Button 2 -->
          <circle cx="125" cy="125" r="24" fill="#faf8f2" stroke="#ded8cc" stroke-width="1.5"/>
          <circle cx="125" cy="125" r="17" fill="#ede7db"/>
          <circle cx="121" cy="121" r="1.5" fill="#5e656d"/>
          <circle cx="129" cy="121" r="1.5" fill="#5e656d"/>
          <circle cx="121" cy="129" r="1.5" fill="#5e656d"/>
          <circle cx="129" cy="129" r="1.5" fill="#5e656d"/>
        </svg>
      `
    },
    {
      id: 'cedar-clapper-kit',
      name: 'Cedar Tailor’s Clapper & Chalk Kit',
      category: 'tools',
      categoryLabel: 'Tailoring Tools',
      priceEUR: 42.00,
      rating: 4.8,
      reviewsCount: 22,
      badge: 'Tailor Favourite',
      excerpt: 'Solid Scandinavian red cedar block with 3 natural clay triangular tailor’s chalks.',
      description: 'Essential pressing companion for setting sharp creases, flattening collar points, and pressing wool seams without scorch or shine. Includes white, slate, and ochre natural clay marking chalks.',
      specs: {
        'Craft Origin': 'Småland Woodcraft, Sweden',
        'Wood Species': 'Solid Untreated Nordic Red Cedar',
        'Dimensions': '240 mm x 65 mm x 40 mm',
        'Included Chalks': '3 Triangular Organic Clay Chalks',
        'Ergonomics': 'Deep Side Grooves for Sure Grip'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Cedar Clapper Block -->
          <g transform="translate(60, 45) rotate(15 40 50)">
            <rect x="0" y="0" width="80" height="35" rx="5" fill="#a46d50" stroke="#7e4c33" stroke-width="1.5"/>
            <rect x="5" y="5" width="70" height="25" rx="3" fill="#b97e5f"/>
            <line x1="15" y1="12" x2="65" y2="12" stroke="#8d563a" stroke-width="1"/>
            <line x1="10" y1="20" x2="70" y2="20" stroke="#8d563a" stroke-width="1"/>
          </g>
          <!-- Tailor Chalk Triangle -->
          <polygon points="120,110 155,145 105,155" fill="#e8dfcc" stroke="#cfc4ac" stroke-width="1.5"/>
          <circle cx="125" cy="135" r="4" fill="#b8860b" opacity="0.4"/>
        </svg>
      `
    },
    {
      id: 'waxed-tool-roll',
      name: 'Waxed Canvas Tailor’s Tool Roll',
      category: 'accessories',
      categoryLabel: 'Accessories & Silk',
      priceEUR: 85.00,
      rating: 4.9,
      reviewsCount: 17,
      badge: 'Waterproof',
      excerpt: '14oz heavy dry-waxed cotton canvas with 8 tool slots and bridle leather buckle cinch.',
      description: 'Organize your shears, rulers, chalks, and thread spools in a rugged, moisture-resistant carry roll. Hand-riveted with solid copper burrs at high-strain points.',
      specs: {
        'Craft Origin': 'Aarhus Workshop, Denmark',
        'Material': '14oz British Millerain Waxed Canvas',
        'Straps': 'Vegetable-Tanned Bridle Leather',
        'Hardware': 'Solid Brass Roller Buckle & Copper Rivets',
        'Capacity': '8 Dedicated Tool Pockets + Zipper Needle Pouch'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Rolled Canvas Cylinder -->
          <g transform="translate(45, 60) rotate(-15 60 40)">
            <rect x="15" y="10" width="85" height="55" rx="8" fill="#3c5249" stroke="#2b3b34" stroke-width="2"/>
            <!-- Leather Straps -->
            <rect x="35" y="5" width="10" height="65" rx="2" fill="#8c5835"/>
            <rect x="75" y="5" width="10" height="65" rx="2" fill="#8c5835"/>
            <!-- Brass Buckles -->
            <rect x="33" y="32" width="14" height="10" rx="1" fill="#b8860b" stroke="#6d4f06" stroke-width="1"/>
            <rect x="73" y="32" width="14" height="10" rx="1" fill="#b8860b" stroke="#6d4f06" stroke-width="1"/>
          </g>
        </svg>
      `
    },
    {
      id: 'brass-thimble-casket',
      name: 'Solid Brass Thimble & Needle Casket',
      category: 'tools',
      categoryLabel: 'Tailoring Tools',
      priceEUR: 32.00,
      rating: 5.0,
      reviewsCount: 41,
      badge: 'Crest Engraved',
      excerpt: 'Precision knurled brass thimble with screw-top capsule containing 10 Swedish needles.',
      description: 'Machined from a single block of solid brass. Deep recessed knurling prevents needle slippage during thick canvas and coat sleeve stitching.',
      specs: {
        'Craft Origin': 'Helsinki Toolmakers, Finland',
        'Material': 'Solid Untreated Brass',
        'Includes': '10 Assorted Gold-Eye Hand Sewing Needles',
        'Sizing': 'Available in Size Medium (16mm) / Large (18mm)',
        'Engraving': 'Olav & Jack 1928 Atelier Seal'
      },
      visualSvg: `
        <svg viewBox="0 0 200 200" class="product-visual-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="85" fill="#f4f3ef"/>
          <!-- Thimble -->
          <g transform="translate(60, 65)">
            <path d="M15 50 L40 50 L35 15 C 33 8, 22 8, 20 15 Z" fill="#b8860b" stroke="#876208" stroke-width="1.5"/>
            <!-- Dimples -->
            <circle cx="27" cy="22" r="1.5" fill="#755306"/>
            <circle cx="23" cy="30" r="1.5" fill="#755306"/>
            <circle cx="31" cy="30" r="1.5" fill="#755306"/>
            <circle cx="20" cy="38" r="1.5" fill="#755306"/>
            <circle cx="27" cy="38" r="1.5" fill="#755306"/>
            <circle cx="34" cy="38" r="1.5" fill="#755306"/>
          </g>
          <!-- Needle Case -->
          <g transform="translate(105, 55)">
            <rect x="0" y="10" width="18" height="65" rx="3" fill="#d49b13" stroke="#876208" stroke-width="1.5"/>
            <rect x="-2" y="18" width="22" height="4" fill="#876208"/>
            <!-- Shiny needle sticking out -->
            <line x1="9" y1="10" x2="9" y2="-10" stroke="#cfd6dc" stroke-width="2"/>
            <ellipse cx="9" cy="-8" rx="1.5" ry="3" fill="#b8860b"/>
          </g>
        </svg>
      `
    }
  ];

  // =========================================================================
  // Persistent Cart & Wishlist Storage
  // =========================================================================
  let cart = [];
  let wishlist = [];

  try {
    const savedCart = localStorage.getItem('olav_jacks_cart_v1');
    if (savedCart) cart = JSON.parse(savedCart);
    const savedWishlist = localStorage.getItem('olav_jacks_wishlist_v1');
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
  } catch (e) {
    console.error('Storage parse error:', e);
  }

  function saveCart() {
    try {
      localStorage.setItem('olav_jacks_cart_v1', JSON.stringify(cart));
    } catch (e) {}
    renderCart();
  }

  function saveWishlist() {
    try {
      localStorage.setItem('olav_jacks_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {}
    updateWishlistUI();
  }

  // =========================================================================
  // DOM References
  // =========================================================================
  const productGrid = document.getElementById('product-grid');
  const productCountDisplay = document.getElementById('product-count-display');
  const filterPills = document.querySelectorAll('.filter-pill');
  const sortSelect = document.getElementById('sort-select');
  const currencySelect = document.getElementById('currency-select');
  const noResultsBlock = document.getElementById('no-results');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  // Header Elements
  const headerCartTotal = document.getElementById('header-cart-total');
  const cartCountBadge = document.getElementById('cart-count');
  const wishlistCountBadge = document.getElementById('wishlist-count');
  const btnCartTrigger = document.getElementById('btn-cart-trigger');
  const btnWishlistTrigger = document.getElementById('btn-wishlist-trigger');
  const btnSearchTrigger = document.getElementById('btn-search-trigger');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');

  // Cart Drawer
  const cartDrawer = document.getElementById('cart-drawer');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const cartDrawerItems = document.getElementById('cart-drawer-items');
  const cartDrawerCount = document.getElementById('cart-drawer-count');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountEl = document.getElementById('cart-discount');
  const discountRowEl = document.getElementById('discount-row');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartGrandTotalEl = document.getElementById('cart-grand-total');
  const trackerMessage = document.getElementById('tracker-message');
  const trackerRemaining = document.getElementById('tracker-remaining');
  const trackerProgress = document.getElementById('tracker-progress');
  const btnCheckout = document.getElementById('btn-checkout');
  const promoInput = document.getElementById('promo-input');
  const btnApplyPromo = document.getElementById('btn-apply-promo');
  const promoAppliedTag = document.getElementById('promo-applied-tag');
  const promoCodeName = document.getElementById('promo-code-name');
  const btnRemovePromo = document.getElementById('btn-remove-promo');

  // Quick View Modal
  const quickViewOverlay = document.getElementById('quick-view-overlay');
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewBody = document.getElementById('quick-view-body');
  const btnCloseQuickView = document.getElementById('btn-close-quick-view');

  // Live Search Modal
  const searchModalOverlay = document.getElementById('search-modal-overlay');
  const liveSearchInput = document.getElementById('live-search-input');
  const btnCloseSearch = document.getElementById('btn-close-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const searchResultsList = document.getElementById('search-results-list');
  const searchTags = document.querySelectorAll('.tag-chip');

  // Wishlist Drawer
  const wishlistOverlay = document.getElementById('wishlist-overlay');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const btnCloseWishlist = document.getElementById('btn-close-wishlist');
  const wishlistDrawerCount = document.getElementById('wishlist-drawer-count');
  const wishlistItemsContainer = document.getElementById('wishlist-items-container');

  // Bundle Builder
  const bundleRadios = document.querySelectorAll('.bundle-radio-card input');
  const bundleOriginalPrice = document.getElementById('bundle-original-price');
  const bundleFinalPrice = document.getElementById('bundle-final-price');
  const bundleSavingsTag = document.getElementById('bundle-savings-tag');
  const btnAddBundle = document.getElementById('btn-add-bundle');

  // Newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterStatus = document.getElementById('newsletter-status');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // Currency Formatter Helper
  // =========================================================================
  function formatPrice(eurAmount) {
    const cur = currencies[currentCurrency] || currencies.EUR;
    return cur.format(eurAmount * cur.rate);
  }

  // =========================================================================
  // Toast Notification System
  // =========================================================================
  function showToast(message, iconSvg = '') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      ${iconSvg || '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>'}
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // Render Product Catalog
  // =========================================================================
  function renderProducts() {
    let filtered = products.filter(p => {
      if (activeFilter === 'all') return true;
      return p.category === activeFilter;
    });

    // Sorting
    if (activeSort === 'price-low') {
      filtered.sort((a, b) => a.priceEUR - b.priceEUR);
    } else if (activeSort === 'price-high') {
      filtered.sort((a, b) => b.priceEUR - a.priceEUR);
    } else if (activeSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    productCountDisplay.textContent = `Showing ${filtered.length} of ${products.length} items`;

    if (filtered.length === 0) {
      productGrid.innerHTML = '';
      noResultsBlock.style.display = 'block';
      return;
    }

    noResultsBlock.style.display = 'none';

    productGrid.innerHTML = filtered.map(product => {
      const isWishlisted = wishlist.includes(product.id);
      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image-wrap">
            <span class="product-badge">${product.badge}</span>
            <button type="button" class="btn-wishlist-toggle ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}" aria-label="Save ${product.name} to wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            ${product.visualSvg}
            <button type="button" class="product-quick-view-overlay-btn" data-quick-view-id="${product.id}">
              Quick View
            </button>
          </div>

          <div class="product-info">
            <div class="product-meta-row">
              <span class="product-category-tag">${product.categoryLabel}</span>
              <div class="product-rating" title="${product.rating} stars from ${product.reviewsCount} reviews">
                <span class="product-star-symbol">★</span>
                <span>${product.rating.toFixed(1)} (${product.reviewsCount})</span>
              </div>
            </div>

            <h3 class="product-title">${product.name}</h3>
            <p class="product-excerpt">${product.excerpt}</p>

            <div class="product-action-row">
              <span class="product-price">${formatPrice(product.priceEUR)}</span>
              <button type="button" class="btn-add-to-cart" data-add-to-cart-id="${product.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachProductCardEvents();
  }

  // Attach card event listeners
  function attachProductCardEvents() {
    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.addToCartId;
        addToCart(id, 1);
      });
    });

    // Quick view buttons
    document.querySelectorAll('[data-quick-view-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.quickViewId;
        openQuickView(id);
      });
    });

    // Wishlist toggles
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.wishlistId;
        toggleWishlist(id);
      });
    });
  }

  // =========================================================================
  // Cart Actions & Calculation
  // =========================================================================
  function addToCart(productId, quantity = 1, customName = null, customPrice = null) {
    const product = products.find(p => p.id === productId);
    if (!product && !customName) return;

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: customName || product.name,
        priceEUR: customPrice !== null ? customPrice : product.priceEUR,
        quantity: quantity,
        category: product ? product.categoryLabel : 'Haberdashery Set'
      });
    }

    saveCart();
    openCart();
    showToast(`Added "${customName || product.name}" to your bag`);
  }

  function updateItemQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }

    saveCart();
  }

  function removeItemFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
  }

  function renderCart() {
    const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
    cartCountBadge.textContent = totalItems;
    cartDrawerCount.textContent = `(${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;

    // Calculate EUR subtotal
    const subtotalEUR = cart.reduce((acc, i) => acc + (i.priceEUR * i.quantity), 0);
    headerCartTotal.textContent = formatPrice(subtotalEUR);

    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `
        <div class="cart-empty-state">
          <svg class="cart-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h4>Your bag is currently empty</h4>
          <p style="font-size: 0.8125rem; margin-top: 0.35rem;">Explore our hand-forged shears and natural notions to begin.</p>
        </div>
      `;
    } else {
      cartDrawerItems.innerHTML = cart.map(item => {
        const prod = products.find(p => p.id === item.id);
        const itemSvg = prod ? prod.visualSvg : `
          <svg viewBox="0 0 100 100" style="width: 100%; height: 100%;" fill="none">
            <rect width="100" height="100" rx="4" fill="#f4f3ef"/>
            <path d="M30 30 L70 70 M70 30 L30 70" stroke="#191c1e" stroke-width="3"/>
          </svg>
        `;

        return `
          <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-img">
              ${itemSvg}
            </div>
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.name}</h4>
              <span class="cart-item-price">${formatPrice(item.priceEUR * item.quantity)}</span>
              <div class="cart-item-actions">
                <div class="quantity-control">
                  <button type="button" class="btn-qty btn-minus" data-qty-id="${item.id}" data-delta="-1" aria-label="Decrease quantity">&minus;</button>
                  <span class="qty-val">${item.quantity}</span>
                  <button type="button" class="btn-qty btn-plus" data-qty-id="${item.id}" data-delta="1" aria-label="Increase quantity">&plus;</button>
                </div>
                <button type="button" class="btn-remove-item" data-remove-id="${item.id}">Remove</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Cart item quantity handlers
      cartDrawerItems.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.qtyId;
          const delta = parseInt(btn.dataset.delta, 10);
          updateItemQuantity(id, delta);
        });
      });

      cartDrawerItems.querySelectorAll('.btn-remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.removeId;
          removeItemFromCart(id);
        });
      });
    }

    // Shipping Tracker Math
    const qualifiesFreeShipping = subtotalEUR >= FREE_SHIPPING_THRESHOLD_EUR;
    if (qualifiesFreeShipping) {
      trackerMessage.className = 'tracker-message qualified';
      trackerMessage.innerHTML = '🎉 <strong>Complimentary Express Shipping Qualified!</strong>';
      trackerProgress.style.width = '100%';
    } else {
      trackerMessage.className = 'tracker-message';
      const remainingEUR = FREE_SHIPPING_THRESHOLD_EUR - subtotalEUR;
      trackerRemaining.textContent = formatPrice(remainingEUR);
      trackerMessage.innerHTML = `Add <strong id="tracker-remaining">${formatPrice(remainingEUR)}</strong> more to qualify for complimentary express shipping!`;
      const progressPercent = Math.min(100, (subtotalEUR / FREE_SHIPPING_THRESHOLD_EUR) * 100);
      trackerProgress.style.width = `${progressPercent}%`;
    }

    // Cost Breakdown
    cartSubtotalEl.textContent = formatPrice(subtotalEUR);

    let discountEUR = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percent') {
        discountEUR = subtotalEUR * appliedPromo.value;
      } else if (appliedPromo.type === 'flat') {
        discountEUR = Math.min(subtotalEUR, appliedPromo.value);
      }
      discountRowEl.style.display = 'flex';
      cartDiscountEl.textContent = `-${formatPrice(discountEUR)}`;
    } else {
      discountRowEl.style.display = 'none';
    }

    let shippingEUR = 0;
    if (subtotalEUR > 0) {
      shippingEUR = (qualifiesFreeShipping || (appliedPromo && appliedPromo.freeShipping)) ? 0 : STANDARD_SHIPPING_EUR;
    }
    cartShippingEl.textContent = shippingEUR === 0 ? (subtotalEUR > 0 ? 'Free' : '€0.00') : formatPrice(shippingEUR);

    const grandTotalEUR = Math.max(0, subtotalEUR - discountEUR + shippingEUR);
    cartGrandTotalEl.textContent = formatPrice(grandTotalEUR);
  }

  // Cart Drawer open/close
  function openCart() {
    cartDrawerOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    cartDrawer.setAttribute('aria-hidden', 'false');
    cartDrawerOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    cartDrawerOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    cartDrawer.setAttribute('aria-hidden', 'true');
    cartDrawerOverlay.setAttribute('aria-hidden', 'true');
  }

  btnCartTrigger.addEventListener('click', openCart);
  btnCloseCart.addEventListener('click', closeCart);
  cartDrawerOverlay.addEventListener('click', closeCart);

  // Promo Code Application
  btnApplyPromo.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) return;

    if (code === 'NORDIC10') {
      appliedPromo = { code: 'NORDIC10', type: 'percent', value: 0.10, label: '-10%' };
      showPromoTag();
      showToast('10% Nordic discount applied!');
    } else if (code === 'OLAVJACK') {
      appliedPromo = { code: 'OLAVJACK', type: 'flat', value: 15.00, label: '-€15.00' };
      showPromoTag();
      showToast('€15 Atelier founder voucher applied!');
    } else if (code === 'WELCOME') {
      appliedPromo = { code: 'WELCOME', type: 'percent', value: 0.05, freeShipping: true, label: 'Free Shipping + 5%' };
      showPromoTag();
      showToast('Welcome discount & free shipping applied!');
    } else {
      showToast('Invalid promo code. Try "NORDIC10"');
    }
    renderCart();
  });

  function showPromoTag() {
    promoAppliedTag.style.display = 'flex';
    promoCodeName.textContent = appliedPromo.code;
    promoInput.value = '';
  }

  btnRemovePromo.addEventListener('click', () => {
    appliedPromo = null;
    promoAppliedTag.style.display = 'none';
    renderCart();
    showToast('Promo code removed.');
  });

  // Checkout Handler
  btnCheckout.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your bag is empty.');
      return;
    }
    showToast('✨ Thank you! Proceeding to encrypted Atelier checkout...');
    setTimeout(() => {
      alert(`Olav & Jack’s Haberdashery — Order Confirmation\n\nThank you for choosing artisanal craftsmanship! Your order total is ${cartGrandTotalEl.textContent}.\n\nA dispatch receipt has been queued.`);
      cart = [];
      appliedPromo = null;
      promoAppliedTag.style.display = 'none';
      saveCart();
      closeCart();
    }, 600);
  });

  // =========================================================================
  // Wishlist Logic
  // =========================================================================
  function toggleWishlist(productId) {
    const exists = wishlist.includes(productId);
    const prod = products.find(p => p.id === productId);

    if (exists) {
      wishlist = wishlist.filter(id => id !== productId);
      showToast(`Removed from wishlist: ${prod ? prod.name : ''}`);
    } else {
      wishlist.push(productId);
      showToast(`Saved to wishlist: ${prod ? prod.name : ''}`);
    }

    saveWishlist();
    renderProducts();
  }

  function updateWishlistUI() {
    wishlistCountBadge.textContent = wishlist.length;
    wishlistDrawerCount.textContent = `(${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'})`;

    if (wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <h4>No saved items yet</h4>
          <p style="font-size: 0.8125rem; margin-top: 0.35rem;">Click the heart icon on any product to save it here for later.</p>
        </div>
      `;
    } else {
      const savedProds = products.filter(p => wishlist.includes(p.id));
      wishlistItemsContainer.innerHTML = savedProds.map(p => `
        <div class="cart-item">
          <div class="cart-item-img">
            ${p.visualSvg}
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${p.name}</h4>
            <span class="cart-item-price">${formatPrice(p.priceEUR)}</span>
            <div class="cart-item-actions">
              <button type="button" class="btn btn-sm btn-dark" data-wishlist-add-cart="${p.id}">Move to Bag</button>
              <button type="button" class="btn-remove-item" data-wishlist-remove="${p.id}">Remove</button>
            </div>
          </div>
        </div>
      `).join('');

      wishlistItemsContainer.querySelectorAll('[data-wishlist-add-cart]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.wishlistAddCart;
          addToCart(id, 1);
          toggleWishlist(id);
          closeWishlist();
        });
      });

      wishlistItemsContainer.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.wishlistRemove;
          toggleWishlist(id);
        });
      });
    }
  }

  function openWishlist() {
    wishlistOverlay.classList.add('active');
    wishlistDrawer.classList.add('active');
    wishlistDrawer.setAttribute('aria-hidden', 'false');
    wishlistOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeWishlist() {
    wishlistOverlay.classList.remove('active');
    wishlistDrawer.classList.remove('active');
    wishlistDrawer.setAttribute('aria-hidden', 'true');
    wishlistOverlay.setAttribute('aria-hidden', 'true');
  }

  btnWishlistTrigger.addEventListener('click', openWishlist);
  btnCloseWishlist.addEventListener('click', closeWishlist);
  wishlistOverlay.addEventListener('click', closeWishlist);

  // =========================================================================
  // Quick View Modal
  // =========================================================================
  function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let specsHtml = '';
    for (const [key, val] of Object.entries(product.specs)) {
      specsHtml += `
        <div class="spec-row">
          <span class="spec-label">${key}</span>
          <span class="spec-val">${val}</span>
        </div>
      `;
    }

    quickViewBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-visual-wrap">
          ${product.visualSvg}
        </div>
        <div class="modal-content-wrap">
          <span class="modal-badge">${product.badge} &bull; ${product.categoryLabel}</span>
          <h2 class="modal-title">${product.name}</h2>
          
          <div class="modal-price-rating">
            <span class="modal-price">${formatPrice(product.priceEUR)}</span>
            <div class="product-rating">
              <span class="product-star-symbol">★</span>
              <span>${product.rating.toFixed(1)} (${product.reviewsCount} Master Tailor reviews)</span>
            </div>
          </div>

          <p class="modal-description">${product.description}</p>

          <div class="modal-specs-table">
            ${specsHtml}
          </div>

          <div class="modal-actions-row">
            <button type="button" class="btn btn-dark btn-lg btn-block" id="btn-quick-add-cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Add to Atelier Bag</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-quick-add-cart').addEventListener('click', () => {
      addToCart(product.id, 1);
      closeQuickView();
    });

    quickViewOverlay.classList.add('active');
    quickViewOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeQuickView() {
    quickViewOverlay.classList.remove('active');
    quickViewOverlay.setAttribute('aria-hidden', 'true');
  }

  btnCloseQuickView.addEventListener('click', closeQuickView);
  quickViewOverlay.addEventListener('click', (e) => {
    if (e.target === quickViewOverlay) closeQuickView();
  });

  // =========================================================================
  // Live Search Modal
  // =========================================================================
  function openSearch() {
    searchModalOverlay.classList.add('active');
    searchModalOverlay.setAttribute('aria-hidden', 'false');
    liveSearchInput.focus();
    renderSearchResults('');
  }

  function closeSearch() {
    searchModalOverlay.classList.remove('active');
    searchModalOverlay.setAttribute('aria-hidden', 'true');
    liveSearchInput.value = '';
    btnClearSearch.style.display = 'none';
  }

  btnSearchTrigger.addEventListener('click', openSearch);
  btnCloseSearch.addEventListener('click', closeSearch);
  searchModalOverlay.addEventListener('click', (e) => {
    if (e.target === searchModalOverlay) closeSearch();
  });

  // Keyboard shortcut '/' to search
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
      closeQuickView();
      closeCart();
      closeWishlist();
    }
  });

  liveSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    btnClearSearch.style.display = query ? 'block' : 'none';
    renderSearchResults(query);
  });

  btnClearSearch.addEventListener('click', () => {
    liveSearchInput.value = '';
    btnClearSearch.style.display = 'none';
    liveSearchInput.focus();
    renderSearchResults('');
  });

  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const term = tag.dataset.searchTerm;
      liveSearchInput.value = term;
      btnClearSearch.style.display = 'block';
      renderSearchResults(term);
    });
  });

  function renderSearchResults(query) {
    if (!query) {
      searchResultsList.innerHTML = products.slice(0, 4).map(p => `
        <div class="search-result-item" data-search-select-id="${p.id}">
          <div class="search-item-info">
            <span class="search-item-title">${p.name}</span>
            <span class="search-item-cat">${p.categoryLabel} &bull; ${p.badge}</span>
          </div>
          <span class="search-item-price">${formatPrice(p.priceEUR)}</span>
        </div>
      `).join('');
    } else {
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResultsList.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
            <p>No haberdashery goods matching "<strong>${query}</strong>"</p>
          </div>
        `;
      } else {
        searchResultsList.innerHTML = matches.map(p => `
          <div class="search-result-item" data-search-select-id="${p.id}">
            <div class="search-item-info">
              <span class="search-item-title">${p.name}</span>
              <span class="search-item-cat">${p.categoryLabel}</span>
            </div>
            <span class="search-item-price">${formatPrice(p.priceEUR)}</span>
          </div>
        `).join('');
      }
    }

    searchResultsList.querySelectorAll('[data-search-select-id]').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.searchSelectId;
        closeSearch();
        openQuickView(id);
      });
    });
  }

  // =========================================================================
  // Custom Bundle Configurator
  // =========================================================================
  function recalculateBundle() {
    let sumEUR = 0;
    const selectedInputs = document.querySelectorAll('.bundle-radio-card input:checked');

    selectedInputs.forEach(input => {
      const price = parseFloat(input.dataset.price);
      sumEUR += price;
    });

    const bundleDiscount = sumEUR * 0.15; // 15% discount
    const finalBundleEUR = sumEUR - bundleDiscount;

    bundleOriginalPrice.textContent = formatPrice(sumEUR);
    bundleFinalPrice.textContent = formatPrice(finalBundleEUR);
    bundleSavingsTag.textContent = `Save ${formatPrice(bundleDiscount)} (15%)`;
  }

  bundleRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const parentGroup = radio.closest('.bundle-options-group');
      parentGroup.querySelectorAll('.bundle-radio-card').forEach(card => card.classList.remove('active'));
      radio.closest('.bundle-radio-card').classList.add('active');
      recalculateBundle();
    });
  });

  btnAddBundle.addEventListener('click', () => {
    const selectedInputs = document.querySelectorAll('.bundle-radio-card input:checked');
    let sumEUR = 0;
    const itemNames = [];

    selectedInputs.forEach(input => {
      sumEUR += parseFloat(input.dataset.price);
      const prod = products.find(p => p.id === input.value);
      if (prod) itemNames.push(prod.name);
    });

    const finalBundleEUR = sumEUR * 0.85; // 15% off

    addToCart(
      `bundle-${Date.now()}`,
      1,
      `Bespoke Workshop Kit (${itemNames.length} items)`,
      finalBundleEUR
    );
    showToast('✨ Bespoke Kit bundle added with 15% discount!');
  });

  // =========================================================================
  // Filtering & Sorting Controls
  // =========================================================================
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeFilter = pill.dataset.category;
      renderProducts();
    });
  });

  // Nav bar category link clicks
  document.querySelectorAll('[data-filter-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.dataset.filterTarget;
      activeFilter = target;
      filterPills.forEach(p => {
        const isMatch = p.dataset.category === target;
        p.classList.toggle('active', isMatch);
        p.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
      renderProducts();
      if (mainNav.classList.contains('mobile-open')) {
        mainNav.classList.remove('mobile-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  sortSelect.addEventListener('change', (e) => {
    activeSort = e.target.value;
    renderProducts();
  });

  btnResetFilters.addEventListener('click', () => {
    activeFilter = 'all';
    filterPills.forEach(p => {
      const isAll = p.dataset.category === 'all';
      p.classList.toggle('active', isAll);
      p.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });
    renderProducts();
  });

  // =========================================================================
  // Currency Selector
  // =========================================================================
  currencySelect.addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    renderProducts();
    renderCart();
    recalculateBundle();
    updateWishlistUI();
    showToast(`Currency converted to ${currentCurrency} (${currencies[currentCurrency].symbol})`);
  });

  // =========================================================================
  // Mobile Menu Toggle
  // =========================================================================
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('mobile-open');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // =========================================================================
  // Newsletter Subscription
  // =========================================================================
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email || !email.includes('@')) {
      newsletterStatus.className = 'form-help-text error';
      newsletterStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    newsletterStatus.className = 'form-help-text success';
    newsletterStatus.textContent = 'Velkommen! Check your inbox for your 10% welcome code: NORDIC10';
    newsletterEmail.value = '';
    showToast('🎉 Subscribed to The Haberdasher’s Gazette!');
  });

  // =========================================================================
  // Initialization
  // =========================================================================
  renderProducts();
  renderCart();
  updateWishlistUI();
  recalculateBundle();
});
