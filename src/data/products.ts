import type { Product } from '../types/product'

/*
  Sample catalogue (mock data, no backend yet).
  Images that fail to load fall back to a neutral placeholder inside ProductCard,
  so empty `image` values are fine until real product photos exist.
*/

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=600&q=80`

const HANDBAG = photo('1584917865442-de89df76afd3')
const WATCH = photo('1523275335684-37898b6baf30')
const SUNGLASSES = photo('1511499767150-a48a237f0083')
const RUNNER = photo('1542291026-7eec264c27ff')
const HEADPHONES = photo('1505740420928-5e560c06d30e')
const LAPTOP = photo('1496181133206-80ce9b88a853')
const CAMERA = photo('1526170375885-4d8ecf77b99f')
const SNEAKER = photo('1491553895911-0055eca6402d')

export const PRODUCTS: Product[] = [
  // ---------- Fashion ----------
  {
    id: 1, name: 'Elegant Leather Handbag', category: 'fashion', price: 49.99, oldPrice: 69.99,
    rating: 4.8, reviews: 124, image: HANDBAG, store: 'Modern Style', location: 'United Kingdom',
    condition: 'new', inStock: true, isNew: true, isFeatured: true, sales: 940, views: 12800, addedAt: '2026-11-02',
    tags: ['bag', 'handbag', 'leather', 'gift', 'mother', 'minimalist', 'women'],
  },
  {
    id: 2, name: 'Merino Wool Scarf', category: 'fashion', price: 38, rating: 4.7, reviews: 186,
    image: '', store: 'Atelier Nord', location: 'Sweden',
    condition: 'new', inStock: true, sales: 1210, views: 15400, addedAt: '2026-10-11',
    tags: ['scarf', 'wool', 'warm', 'winter', 'gift', 'mother', 'cozy', 'minimalist'],
  },
  {
    id: 3, name: 'Relaxed Linen Overshirt', category: 'fashion', price: 64, oldPrice: 82,
    rating: 4.5, reviews: 73, image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'new', inStock: true, sales: 420, views: 6100, addedAt: '2026-09-21',
    tags: ['shirt', 'linen', 'summer', 'men', 'minimalist'],
  },
  {
    id: 4, name: 'Everyday Leather Tote', category: 'fashion', price: 89, rating: 4.6, reviews: 98,
    image: HANDBAG, store: 'Modern Style', location: 'United Kingdom',
    condition: 'new', inStock: true, isFeatured: true, sales: 560, views: 9300, addedAt: '2026-10-28',
    tags: ['bag', 'tote', 'leather', 'work', 'women', 'gift'],
  },
  {
    id: 5, name: 'Organic Cotton Tee, 3-Pack', category: 'fashion', price: 29, rating: 4.4, reviews: 402,
    image: '', store: 'Atelier Nord', location: 'Sweden',
    condition: 'new', inStock: true, sales: 1980, views: 21000, addedAt: '2026-08-14',
    tags: ['tshirt', 'tee', 'cotton', 'basic', 'organic', 'minimalist'],
  },
  {
    id: 6, name: 'Wool-Blend Winter Coat', category: 'fashion', price: 148, oldPrice: 190,
    rating: 4.8, reviews: 61, image: '', store: 'Atelier Nord', location: 'Sweden',
    condition: 'new', inStock: true, isNew: true, sales: 260, views: 7400, addedAt: '2026-11-08',
    tags: ['coat', 'wool', 'warm', 'winter', 'jacket'],
  },
  {
    id: 7, name: 'Vintage Denim Jacket', category: 'fashion', price: 45, rating: 4.3, reviews: 37,
    image: '', store: 'Urban Thread', location: 'United States',
    condition: 'used', inStock: true, sales: 150, views: 3900, addedAt: '2026-10-02',
    tags: ['jacket', 'denim', 'vintage', 'retro'],
  },
  {
    id: 8, name: 'Cashmere Beanie', category: 'fashion', price: 42, rating: 4.9, reviews: 54,
    image: '', store: 'Atelier Nord', location: 'Sweden',
    condition: 'new', inStock: false, sales: 380, views: 5200, addedAt: '2026-10-19',
    tags: ['hat', 'beanie', 'cashmere', 'warm', 'winter', 'gift'],
  },

  // ---------- Electronics ----------
  {
    id: 9, name: 'Wireless Noise-Cancelling Headphones', category: 'electronics', price: 129, oldPrice: 169,
    rating: 4.7, reviews: 312, image: HEADPHONES, store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: true, isFeatured: true, sales: 2310, views: 31000, addedAt: '2026-09-30',
    tags: ['audio', 'headphone', 'wireless', 'music', 'gift', 'travel'],
  },
  {
    id: 10, name: 'Slim 14-inch Laptop', category: 'electronics', price: 899, rating: 4.5, reviews: 58,
    image: LAPTOP, store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: true, sales: 190, views: 8800, addedAt: '2026-10-05',
    tags: ['computer', 'laptop', 'work', 'ultralight'],
  },
  {
    id: 11, name: 'Retro 35mm Film Camera', category: 'electronics', price: 120, rating: 4.6, reviews: 41,
    image: CAMERA, store: 'Kōbō Studio', location: 'Japan',
    condition: 'used', inStock: true, sales: 95, views: 4300, addedAt: '2026-09-12',
    tags: ['camera', 'photo', 'film', 'vintage', 'retro', 'gift'],
  },
  {
    id: 12, name: 'Portable Bluetooth Speaker', category: 'electronics', price: 59.9, oldPrice: 79,
    rating: 4.4, reviews: 220, image: '', store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: true, sales: 1340, views: 14900, addedAt: '2026-08-30',
    tags: ['audio', 'speaker', 'music', 'wireless', 'outdoor', 'gift'],
  },
  {
    id: 13, name: 'Compact Mechanical Keyboard', category: 'electronics', price: 79, rating: 4.7, reviews: 144,
    image: '', store: 'Kōbō Studio', location: 'Japan',
    condition: 'new', inStock: true, isNew: true, sales: 610, views: 9900, addedAt: '2026-11-05',
    tags: ['keyboard', 'computer', 'work', 'typing', 'minimalist'],
  },
  {
    id: 14, name: 'Fast-Charge Power Bank 20,000 mAh', category: 'electronics', price: 29.99, rating: 4.5, reviews: 530,
    image: '', store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: false, sales: 1100, views: 11200, addedAt: '2026-07-20',
    tags: ['battery', 'charger', 'travel', 'phone'],
  },
  {
    id: 15, name: 'Fitness Smartwatch', category: 'electronics', price: 99, oldPrice: 129,
    rating: 4.3, reviews: 275, image: WATCH, store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: true, sales: 870, views: 13500, addedAt: '2026-10-15',
    tags: ['watch', 'smartwatch', 'fitness', 'running', 'health', 'gift'],
  },

  // ---------- Accessories ----------
  {
    id: 16, name: 'Classic Minimalist Wrist Watch', category: 'accessories', price: 35, rating: 4.6, reviews: 87,
    image: WATCH, store: 'Tech Haven', location: 'United States',
    condition: 'new', inStock: true, isFeatured: true, sales: 730, views: 10400, addedAt: '2026-10-22',
    tags: ['watch', 'minimalist', 'gift', 'classic', 'men', 'women'],
  },
  {
    id: 17, name: 'Modern Fashion Sunglasses', category: 'accessories', price: 24.99, oldPrice: 39.99,
    rating: 4.9, reviews: 215, image: SUNGLASSES, store: 'Modern Style', location: 'United Kingdom',
    condition: 'new', inStock: true, sales: 1420, views: 17600, addedAt: '2026-09-02',
    tags: ['sunglasses', 'glasses', 'summer', 'sun', 'gift'],
  },
  {
    id: 18, name: 'Full-Grain Leather Wallet', category: 'accessories', price: 32, rating: 4.7, reviews: 162,
    image: '', store: 'Modern Style', location: 'United Kingdom',
    condition: 'new', inStock: true, sales: 990, views: 11800, addedAt: '2026-08-25',
    tags: ['wallet', 'leather', 'gift', 'men', 'minimalist', 'father'],
  },
  {
    id: 19, name: 'Sterling Silver Pendant Necklace', category: 'accessories', price: 58, rating: 4.8, reviews: 92,
    image: '', store: 'Lumière Atelier', location: 'France',
    condition: 'new', inStock: true, isNew: true, sales: 480, views: 8100, addedAt: '2026-11-10',
    tags: ['necklace', 'jewelry', 'silver', 'gift', 'mother', 'minimalist', 'women'],
  },
  {
    id: 20, name: 'Woven Leather Belt', category: 'accessories', price: 27, rating: 4.4, reviews: 66,
    image: '', store: 'Urban Thread', location: 'United States',
    condition: 'new', inStock: true, sales: 310, views: 4400, addedAt: '2026-09-17',
    tags: ['belt', 'leather', 'men'],
  },
  {
    id: 21, name: 'Vintage Silk Scarf', category: 'accessories', price: 18, rating: 4.5, reviews: 29,
    image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'used', inStock: true, sales: 70, views: 2100, addedAt: '2026-10-06',
    tags: ['scarf', 'silk', 'vintage', 'retro', 'gift', 'mother'],
  },
  {
    id: 22, name: 'Gold-Plated Hoop Earrings', category: 'accessories', price: 26, oldPrice: 34,
    rating: 4.6, reviews: 138, image: '', store: 'Lumière Atelier', location: 'France',
    condition: 'new', inStock: true, sales: 820, views: 9700, addedAt: '2026-09-27',
    tags: ['earrings', 'jewelry', 'gold', 'gift', 'minimalist', 'women'],
  },

  // ---------- Home & Living ----------
  {
    id: 23, name: 'Warm-Light LED Desk Lamp', category: 'home-living', price: 42.5, oldPrice: 55,
    rating: 4.8, reviews: 203, image: '', store: 'Home Essence', location: 'Germany',
    condition: 'new', inStock: true, isFeatured: true, sales: 1160, views: 16200, addedAt: '2026-10-09',
    tags: ['lamp', 'light', 'desk', 'warm', 'office', 'led', 'study', 'minimalist'],
  },
  {
    id: 24, name: 'Ceramic Pour-Over Coffee Set', category: 'home-living', price: 46, rating: 4.9, reviews: 167,
    image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'new', inStock: true, isNew: true, sales: 690, views: 11300, addedAt: '2026-11-04',
    tags: ['coffee', 'ceramic', 'kitchen', 'brew', 'gift', 'minimalist'],
  },
  {
    id: 25, name: 'Insulated Travel Coffee Mug', category: 'home-living', price: 24, rating: 4.6, reviews: 341,
    image: '', store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 1470, views: 15100, addedAt: '2026-08-09',
    tags: ['coffee', 'mug', 'travel', 'insulated', 'gift', 'tea'],
  },
  {
    id: 26, name: 'Manual Burr Coffee Grinder', category: 'home-living', price: 52, rating: 4.7, reviews: 118,
    image: '', store: 'Kōbō Studio', location: 'Japan',
    condition: 'new', inStock: true, sales: 540, views: 8600, addedAt: '2026-09-08',
    tags: ['coffee', 'grinder', 'kitchen', 'espresso', 'gift'],
  },
  {
    id: 27, name: 'Soy Wax Scented Candle Set', category: 'home-living', price: 28, rating: 4.8, reviews: 256,
    image: '', store: 'Home Essence', location: 'Germany',
    condition: 'new', inStock: true, sales: 1590, views: 18700, addedAt: '2026-10-24',
    tags: ['candle', 'scented', 'warm', 'gift', 'mother', 'cozy', 'relax'],
  },
  {
    id: 28, name: 'Linen Throw Blanket', category: 'home-living', price: 59, oldPrice: 75,
    rating: 4.7, reviews: 84, image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'new', inStock: true, sales: 390, views: 6700, addedAt: '2026-10-30',
    tags: ['blanket', 'throw', 'linen', 'warm', 'cozy', 'sofa', 'gift', 'minimalist'],
  },
  {
    id: 29, name: 'Solid Oak Wall Shelf', category: 'home-living', price: 44, rating: 4.5, reviews: 52,
    image: '', store: 'Home Essence', location: 'Germany',
    condition: 'new', inStock: true, sales: 210, views: 3600, addedAt: '2026-09-04',
    tags: ['shelf', 'wood', 'oak', 'storage', 'minimalist'],
  },
  {
    id: 30, name: 'Brass Table Lamp with Warm Glow', category: 'home-living', price: 68, rating: 4.6, reviews: 47,
    image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'used', inStock: true, sales: 85, views: 2800, addedAt: '2026-10-13',
    tags: ['lamp', 'light', 'brass', 'warm', 'vintage', 'table'],
  },
  {
    id: 31, name: 'Minimalist Ceramic Vase', category: 'home-living', price: 36, rating: 4.8, reviews: 71,
    image: '', store: 'Kōbō Studio', location: 'Japan',
    condition: 'new', inStock: true, sales: 330, views: 5900, addedAt: '2026-11-01',
    tags: ['vase', 'ceramic', 'decor', 'minimalist', 'gift', 'mother'],
  },

  // ---------- Beauty ----------
  {
    id: 32, name: 'Hydrating Facial Serum', category: 'beauty', price: 34, rating: 4.7, reviews: 389,
    image: '', store: 'Lumière Beauté', location: 'France',
    condition: 'new', inStock: true, isFeatured: true, sales: 1750, views: 19800, addedAt: '2026-09-15',
    tags: ['skincare', 'serum', 'face', 'hydrating', 'gift', 'women'],
  },
  {
    id: 33, name: 'Natural Bristle Hair Brush', category: 'beauty', price: 16, rating: 4.5, reviews: 105,
    image: '', store: 'Lumière Beauté', location: 'France',
    condition: 'new', inStock: true, sales: 640, views: 7300, addedAt: '2026-08-22',
    tags: ['hair', 'brush', 'natural', 'gift'],
  },
  {
    id: 34, name: 'Rose & Amber Eau de Parfum', category: 'beauty', price: 72, rating: 4.9, reviews: 143,
    image: '', store: 'Lumière Beauté', location: 'France',
    condition: 'new', inStock: true, isNew: true, sales: 700, views: 12600, addedAt: '2026-11-09',
    tags: ['perfume', 'fragrance', 'rose', 'gift', 'mother', 'warm', 'luxury'],
  },
  {
    id: 35, name: 'Vitamin C Day Cream', category: 'beauty', price: 26, oldPrice: 32,
    rating: 4.4, reviews: 214, image: '', store: 'Lumière Beauté', location: 'France',
    condition: 'new', inStock: true, sales: 1020, views: 10100, addedAt: '2026-08-05',
    tags: ['skincare', 'cream', 'face', 'vitamin'],
  },
  {
    id: 36, name: 'Argan Oil Hair Treatment', category: 'beauty', price: 22, rating: 4.6, reviews: 176,
    image: '', store: 'Casa Luna', location: 'Spain',
    condition: 'new', inStock: false, sales: 880, views: 8400, addedAt: '2026-09-09',
    tags: ['hair', 'oil', 'argan', 'natural'],
  },
  {
    id: 37, name: 'Bath & Body Gift Set', category: 'beauty', price: 48, oldPrice: 60,
    rating: 4.8, reviews: 122, image: '', store: 'Home Essence', location: 'Germany',
    condition: 'new', inStock: true, sales: 760, views: 11000, addedAt: '2026-10-26',
    tags: ['bath', 'body', 'gift', 'mother', 'relax', 'warm', 'set'],
  },

  // ---------- Sports ----------
  {
    id: 38, name: 'Premium Running Shoes', category: 'sports', price: 59.99, rating: 4.7, reviews: 96,
    image: RUNNER, store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, isNew: true, sales: 1620, views: 22400, addedAt: '2026-11-06',
    tags: ['running', 'shoe', 'sneaker', 'trainer', 'fitness', 'men', 'women'],
  },
  {
    id: 39, name: 'Cushioned Wide-Fit Running Shoes', category: 'sports', price: 84, rating: 4.6, reviews: 132,
    image: SNEAKER, store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 840, views: 12900, addedAt: '2026-10-17',
    tags: ['running', 'shoe', 'wide', 'foot', 'comfort', 'cushioned', 'trainer'],
  },
  {
    id: 40, name: 'Non-Slip Yoga Mat', category: 'sports', price: 31, rating: 4.6, reviews: 288,
    image: '', store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 1230, views: 13700, addedAt: '2026-09-19',
    tags: ['yoga', 'mat', 'fitness', 'home', 'workout'],
  },
  {
    id: 41, name: 'Adjustable Dumbbell Pair', category: 'sports', price: 110, rating: 4.4, reviews: 33,
    image: '', store: 'Urban Thread', location: 'United States',
    condition: 'used', inStock: true, sales: 60, views: 1900, addedAt: '2026-10-08',
    tags: ['dumbbell', 'weights', 'fitness', 'workout', 'gym'],
  },
  {
    id: 42, name: 'Insulated Steel Water Bottle', category: 'sports', price: 21, rating: 4.8, reviews: 467,
    image: '', store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 1510, views: 16800, addedAt: '2026-08-18',
    tags: ['bottle', 'water', 'insulated', 'outdoor', 'gym', 'gift'],
  },
  {
    id: 43, name: 'Lightweight Trail Backpack', category: 'sports', price: 67, oldPrice: 85,
    rating: 4.5, reviews: 79, image: '', store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 350, views: 6200, addedAt: '2026-10-21',
    tags: ['backpack', 'bag', 'hiking', 'trail', 'outdoor', 'travel'],
  },
  {
    id: 44, name: 'Compression Running Socks, 3-Pack', category: 'sports', price: 15, rating: 4.3, reviews: 205,
    image: '', store: 'Peak & Pace', location: 'Canada',
    condition: 'new', inStock: true, sales: 960, views: 7900, addedAt: '2026-08-11',
    tags: ['socks', 'running', 'compression', 'fitness'],
  },
]
