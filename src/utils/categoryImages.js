// src/utils/categoryImages.js
// Static image map for all non-leaf categories
// Images live in /public/images/categories/
// Add your own photos there — filenames match the keys below

export const CATEGORY_IMAGES = {

  // ── Level 1 — Root categories ──────────────────────────────────────────────
  'men':                  '/images/categories/men.jpg',
  'women':                '/images/categories/women.jpg',
  'kids':                 '/images/categories/kids.jpg',
  'footwear':             '/images/categories/footwear.jpg',
  'special-collections':  '/images/categories/special-collections.jpg',

  // ── Men Level 2 ────────────────────────────────────────────────────────────
  'men-western-wear':     '/images/categories/men-western-wear.jpg',
  'men-ethnic-wear':      '/images/categories/men-ethnic-wear.jpg',
  'men-innerwear':        '/images/categories/men-innerwear.jpg',
  'men-plus-size':        '/images/categories/men-plus-size.jpg',

  // ── Women Level 2 ──────────────────────────────────────────────────────────
  'women-western-wear':   '/images/categories/women-western-wear.jpg',
  'women-ethnic-wear':    '/images/categories/women-ethnic-wear.jpg',
  'women-lingerie':       '/images/categories/women-lingerie.jpg',
  'women-maternity':      '/images/categories/women-maternity.jpg',
  'women-plus-size':      '/images/categories/women-plus-size.jpg',

  // ── Footwear Level 2 ───────────────────────────────────────────────────────
  'footwear-men':         '/images/categories/footwear-men.jpg',
  'footwear-women':       '/images/categories/footwear-women.jpg',
  'footwear-kids':        '/images/categories/footwear-kids.jpg',

  // ── Kids Level 2 ───────────────────────────────────────────────────────────
  'kids-boys':            '/images/categories/kids-boys.jpg',
  'kids-girls':           '/images/categories/kids-girls.jpg',
  'kids-infants':         '/images/categories/kids-infants.jpg',
}

// Returns the image for a category slug, or null if not mapped
export const getCategoryImage = (slug) => CATEGORY_IMAGES[slug] || null
