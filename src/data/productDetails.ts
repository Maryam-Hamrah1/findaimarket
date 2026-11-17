import type { Product } from '../types/product'
import type {
  ProductDetails,
  ProductImage,
  ProductOption,
  ProductSpec,
  ProductVideo,
} from '../types/productDetails'
import { slugify } from '../utils/slug'
import { PRODUCTS } from './products'
import { getStoreDetails } from './storeDetails'
import { getStoreByName } from './stores'

/*
  Product page content (mock data, no backend yet).

  The catalogue entry (data/products.ts) stays the single source of truth for
  name, price, rating, store and so on. This file only adds what a product page
  needs on top of it. Anything a product does not have is simply left out, and
  the page never shows an empty section or option.
*/

interface Extra {
  summary: string
  features: string[]
  specs: Array<[label: string, value: string]>
  options?: ProductOption[]
  /** Extra photos. When omitted, detail views of the main photo are used. */
  images?: string[]
  video?: ProductVideo
  brand?: string
  /** Units in stock (sample). When omitted a sample value is derived. */
  stock?: number
  /** Overrides the store policy for this product only */
  shipping?: string
  returns?: string
}

/* ---------- Helpers for writing options ---------- */

const option = (
  id: string,
  label: string,
  values: string[],
  unavailable: string[] = [],
): ProductOption => ({
  id,
  label,
  values: values.map((value) => ({ value, available: !unavailable.includes(value) })),
})

const APPAREL = ['S', 'M', 'L', 'XL']
const size = (values: string[] = APPAREL, off: string[] = []) =>
  option('size', 'Size', values, off)
const color = (values: string[], off: string[] = []) =>
  option('color', 'Color', values, off)
const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45']

/* ---------- Content, one entry per catalogue id ---------- */

const EXTRAS: Record<number, Extra> = {
  1: {
    summary: 'A structured everyday handbag in smooth leather, with a soft cotton lining and a magnetic closure that stays quiet.',
    features: ['Full leather outer', 'Zip pocket and two slip pockets inside', 'Detachable shoulder strap'],
    specs: [['Material', 'Leather'], ['Lining', 'Cotton'], ['Size', '30 × 22 × 11 cm'], ['Closure', 'Magnetic']],
    options: [color(['Black', 'Tan', 'Burgundy'], ['Burgundy'])],
  },
  2: {
    summary: 'A generous scarf knitted from fine merino wool. Soft against the skin and warm without bulk.',
    features: ['100% merino wool', 'Wide enough to wrap twice', 'Naturally breathable'],
    specs: [['Material', '100% merino wool'], ['Length', '180 cm'], ['Care', 'Hand wash cold']],
    options: [color(['Oat', 'Charcoal', 'Forest'])],
  },
  3: {
    summary: 'A loose, lightweight overshirt in washed linen. Wear it open over a tee or buttoned on its own.',
    features: ['Pre-washed for softness', 'Two chest pockets', 'Relaxed, boxy fit'],
    specs: [['Material', '100% linen'], ['Fit', 'Relaxed'], ['Care', 'Machine wash 30°C']],
    options: [size(APPAREL, ['XL']), color(['Sand', 'Olive'])],
  },
  4: {
    summary: 'A roomy tote that holds a laptop and still looks tidy. Made from vegetable-tanned leather that darkens with use.',
    features: ['Fits a 14-inch laptop', 'Inner zip pocket', 'Reinforced handles'],
    specs: [['Material', 'Vegetable-tanned leather'], ['Size', '38 × 30 × 12 cm'], ['Handle drop', '24 cm']],
    options: [color(['Black', 'Cognac'])],
  },
  5: {
    summary: 'Three everyday tees in organic cotton. Soft from the first wear and cut to hold their shape wash after wash.',
    features: ['Pack of three', 'Organic cotton jersey', 'Tag-free neck'],
    specs: [['Material', '100% organic cotton'], ['Weight', '180 gsm'], ['Pack', '3 tees']],
    options: [size(APPAREL), color(['White', 'Black', 'Grey'])],
  },
  6: {
    summary: 'A long winter coat in a warm wool blend with a clean, straight line. Lined to keep the cold out.',
    features: ['Wool-blend outer', 'Fully lined', 'Deep side pockets'],
    specs: [['Material', '60% wool, 40% recycled polyester'], ['Length', 'Knee length'], ['Care', 'Dry clean']],
    options: [size(APPAREL, ['XL']), color(['Camel', 'Navy'])],
  },
  7: {
    summary: 'A broken-in denim jacket with the faded look of a favourite old piece.',
    features: ['Washed cotton denim', 'Metal button front', 'Four pockets'],
    specs: [['Material', '100% cotton denim'], ['Fit', 'Regular'], ['Care', 'Machine wash cold']],
    options: [size(APPAREL)],
  },
  8: {
    summary: 'A close-fitting beanie in pure cashmere. Light enough to wear indoors, warm enough for a cold walk.',
    features: ['100% cashmere', 'Fold-over cuff', 'One size fits most'],
    specs: [['Material', '100% cashmere'], ['Size', 'One size'], ['Care', 'Hand wash cold']],
    options: [color(['Grey', 'Ink', 'Rust'])],
  },
  9: {
    summary: 'Over-ear wireless headphones with active noise cancelling, built for long flights and busy offices.',
    features: ['Active noise cancelling', 'Up to 30 hours of playback', 'Folds flat into the included case'],
    specs: [['Connection', 'Bluetooth 5.3'], ['Battery', 'Up to 30 h'], ['Charging', 'USB-C'], ['Weight', '250 g']],
    options: [color(['Black', 'Silver'])],
  },
  10: {
    summary: 'A slim 14-inch laptop that stays light in a bag and quick enough for everyday work.',
    features: ['14-inch Full HD display', 'Backlit keyboard', 'All-day battery'],
    specs: [['Display', '14-inch Full HD'], ['Memory', '16 GB'], ['Weight', '1.2 kg'], ['Ports', '2 × USB-C, 1 × USB-A, HDMI']],
    options: [option('storage', 'Storage', ['256 GB', '512 GB', '1 TB'], ['1 TB'])],
  },
  11: {
    summary: 'A compact 35mm film camera with a sharp prime lens. Simple controls, honest results.',
    features: ['35mm film, 36 exposures', 'Built-in flash', 'Manual film advance'],
    specs: [['Format', '35mm film'], ['Lens', '38 mm f/2.8'], ['Power', '1 × AA battery'], ['Weight', '340 g']],
  },
  12: {
    summary: 'A pocket-sized Bluetooth speaker with a surprisingly full sound and a splash-proof body.',
    features: ['Splash-proof', '12 hours of playback', 'Built-in microphone for calls'],
    specs: [['Connection', 'Bluetooth 5.2'], ['Battery', 'Up to 12 h'], ['Rating', 'IPX5']],
    options: [color(['Black', 'Blue', 'Sand'])],
  },
  13: {
    summary: 'A compact mechanical keyboard with a satisfying, quiet action and a layout that saves desk space.',
    features: ['Hot-swappable switches', 'USB-C and Bluetooth', 'Compact 75% layout'],
    specs: [['Layout', '75%'], ['Connection', 'USB-C, Bluetooth'], ['Keycaps', 'PBT']],
    options: [option('switch', 'Switch', ['Linear', 'Tactile', 'Clicky'], ['Clicky'])],
  },
  14: {
    summary: 'A 20,000 mAh power bank that fast-charges a phone several times over.',
    features: ['Fast charging up to 22.5 W', 'Two USB-C ports and one USB-A', 'Charge-level display'],
    specs: [['Capacity', '20,000 mAh'], ['Output', '22.5 W'], ['Weight', '420 g']],
  },
  15: {
    summary: 'A fitness smartwatch that tracks workouts, sleep and heart rate, with a battery that lasts the week.',
    features: ['Heart-rate and sleep tracking', 'GPS for runs and rides', 'Up to 7 days of battery'],
    specs: [['Display', '1.4-inch AMOLED'], ['Water resistance', '5 ATM'], ['Battery', 'Up to 7 days']],
    options: [color(['Black', 'Silver']), size(['S/M', 'M/L'])],
  },
  16: {
    summary: 'A clean-faced wrist watch with a slim case and a soft leather strap. Easy to wear every day.',
    features: ['Slim 7 mm case', 'Genuine leather strap', 'Quartz movement'],
    specs: [['Case', '38 mm stainless steel'], ['Strap', 'Leather, 18 mm'], ['Water resistance', '3 ATM']],
    options: [color(['Brown', 'Black'])],
  },
  17: {
    summary: 'Lightweight sunglasses with a modern shape and lenses that cut glare.',
    features: ['UV400 protection', 'Lightweight frame', 'Soft case included'],
    specs: [['Lens', 'UV400 polarised'], ['Frame', 'Acetate'], ['Width', '142 mm']],
    options: [color(['Black', 'Tortoise', 'Clear'], ['Clear'])],
  },
  18: {
    summary: 'A slim wallet in full-grain leather that softens and takes on character over the years.',
    features: ['Six card slots', 'Note compartment', 'Stitched by hand'],
    specs: [['Material', 'Full-grain leather'], ['Size', '11 × 9 cm'], ['Card slots', '6']],
    options: [color(['Black', 'Brown'])],
  },
  19: {
    summary: 'A small pendant on a fine chain, in sterling silver with a polished finish.',
    features: ['925 sterling silver', 'Adjustable chain', 'Gift pouch included'],
    specs: [['Material', '925 sterling silver'], ['Pendant', '12 mm'], ['Closure', 'Lobster clasp']],
    options: [option('length', 'Chain length', ['40 cm', '45 cm', '50 cm'])],
  },
  20: {
    summary: 'A woven leather belt with a brushed buckle. Flexible, comfortable and easy to dress up or down.',
    features: ['Woven leather', 'Brushed metal buckle', 'Fits through standard loops'],
    specs: [['Material', 'Leather'], ['Width', '3 cm'], ['Buckle', 'Brushed metal']],
    options: [size(['S', 'M', 'L'])],
  },
  21: {
    summary: 'A lightweight silk scarf with a soft drape. Wear it at the neck, in the hair or on a bag handle.',
    features: ['Pure silk', 'Hand-rolled edges', 'Vintage-inspired pattern'],
    specs: [['Material', '100% silk'], ['Size', '70 × 70 cm'], ['Care', 'Dry clean']],
  },
  22: {
    summary: 'Light hoop earrings with a warm gold plating, sized to wear all day.',
    features: ['Gold-plated brass', 'Hypoallergenic posts', 'Lightweight'],
    specs: [['Material', 'Gold-plated brass'], ['Diameter', '25 mm'], ['Weight', '3 g per pair']],
  },
  23: {
    summary: 'An LED desk lamp with a warm, even light that is easy on the eyes during long evenings.',
    features: ['Three brightness levels', 'Warm 2,700 K light', 'Flexible neck'],
    specs: [['Light', 'LED, 2,700 K'], ['Power', '8 W'], ['Height', '46 cm']],
    options: [color(['White', 'Black'])],
  },
  24: {
    summary: 'A ceramic pour-over set for slow, careful coffee: dripper, server and two cups.',
    features: ['Dripper, server and two cups', 'Glazed stoneware', 'Dishwasher safe'],
    specs: [['Material', 'Glazed stoneware'], ['Server', '600 ml'], ['Includes', 'Dripper, server, 2 cups']],
  },
  25: {
    summary: 'A double-wall insulated mug that keeps drinks hot for hours and fits most cup holders.',
    features: ['Keeps drinks hot for 6 hours', 'Leak-resistant lid', 'Fits most cup holders'],
    specs: [['Material', 'Stainless steel'], ['Insulation', 'Double wall']],
    options: [size(['350 ml', '500 ml']), color(['Steel', 'Black', 'Forest'], ['Forest'])],
  },
  26: {
    summary: 'A manual burr grinder with a smooth hand crank and a consistent grind from espresso to French press.',
    features: ['Ceramic conical burrs', 'Adjustable grind size', 'Holds 30 g of beans'],
    specs: [['Burrs', 'Ceramic conical'], ['Capacity', '30 g'], ['Weight', '580 g']],
  },
  27: {
    summary: 'A set of three hand-poured soy wax candles with soft, warm scents.',
    features: ['Soy wax, cotton wick', 'About 40 hours of burn time each', 'Set of three'],
    specs: [['Wax', 'Soy'], ['Burn time', 'About 40 h each'], ['Set', '3 candles']],
    options: [option('scent', 'Scent', ['Cedar & Vanilla', 'Fig', 'Sea Salt'], ['Sea Salt'])],
  },
  28: {
    summary: 'A soft linen throw for the sofa or the end of the bed. It gets softer with every wash.',
    features: ['Stonewashed linen', 'Fringed edges', 'Light but warm'],
    specs: [['Material', '100% linen'], ['Size', '130 × 170 cm'], ['Care', 'Machine wash 30°C']],
    options: [color(['Oat', 'Slate', 'Terracotta'])],
  },
  29: {
    summary: 'A solid oak wall shelf with hidden brackets, finished with a natural oil.',
    features: ['Solid oak', 'Hidden mounting brackets', 'Natural oil finish'],
    specs: [['Material', 'Solid oak'], ['Load', 'Up to 10 kg'], ['Fixings', 'Included']],
    options: [option('length', 'Length', ['40 cm', '60 cm', '80 cm'], ['80 cm'])],
  },
  30: {
    summary: 'A brass table lamp with a fabric shade that gives off a soft, warm glow.',
    features: ['Solid brass base', 'Fabric shade', 'Inline dimmer'],
    specs: [['Material', 'Brass, linen shade'], ['Height', '42 cm'], ['Bulb', 'E27, not included']],
  },
  31: {
    summary: 'A minimalist ceramic vase with a matte glaze. It looks good with a single stem or on its own.',
    features: ['Matte glaze', 'Waterproof inside', 'Made in small batches'],
    specs: [['Material', 'Ceramic'], ['Finish', 'Matte']],
    options: [size(['Small', 'Medium', 'Large'], ['Large'])],
  },
  32: {
    summary: 'A lightweight serum that hydrates deeply and sits well under moisturiser and makeup.',
    features: ['Hyaluronic acid', 'Fragrance-free', 'Suitable for sensitive skin'],
    specs: [['Type', 'Serum'], ['Skin type', 'All'], ['Key ingredient', 'Hyaluronic acid']],
    options: [size(['30 ml', '50 ml'])],
  },
  33: {
    summary: 'A natural bristle brush that smooths and adds shine, with a beechwood handle.',
    features: ['Natural boar bristles', 'Beechwood handle', 'Gentle on the scalp'],
    specs: [['Bristles', 'Natural'], ['Handle', 'Beechwood'], ['Length', '23 cm']],
  },
  34: {
    summary: 'An eau de parfum with a warm heart of rose and amber, soft at first and lasting through the day.',
    features: ['Top: bergamot, pink pepper', 'Heart: rose, jasmine', 'Base: amber, musk'],
    specs: [['Type', 'Eau de parfum'], ['Family', 'Floral amber']],
    options: [size(['50 ml', '100 ml'])],
  },
  35: {
    summary: 'A light day cream with vitamin C for a brighter, more even look, and an SPF-friendly finish.',
    features: ['Vitamin C', 'Light, non-greasy texture', 'Works under makeup'],
    specs: [['Type', 'Day cream'], ['Size', '50 ml'], ['Skin type', 'All']],
  },
  36: {
    summary: 'A nourishing hair treatment with argan oil to tame frizz and add shine.',
    features: ['Pure argan oil', 'Absorbs quickly', 'Use on damp or dry hair'],
    specs: [['Type', 'Hair oil'], ['Size', '100 ml'], ['Key ingredient', 'Argan oil']],
  },
  37: {
    summary: 'A bath and body gift set with a body wash, lotion and bath salts in a presentation box.',
    features: ['Body wash, lotion and bath salts', 'Gift box', 'Soft floral scent'],
    specs: [['Includes', 'Body wash, lotion, bath salts'], ['Scent', 'Soft floral']],
  },
  38: {
    summary: 'Running shoes with a responsive midsole and a breathable upper, made for everyday miles.',
    features: ['Breathable mesh upper', 'Responsive cushioning', 'Grippy outsole'],
    specs: [['Drop', '8 mm'], ['Upper', 'Engineered mesh'], ['Use', 'Road running']],
    options: [option('size', 'Size (EU)', shoeSizes, ['38', '45']), color(['Black', 'White'])],
  },
  39: {
    summary: 'Cushioned running shoes on a wider last, for runners who need more room in the forefoot.',
    features: ['Wide-fit last', 'Extra cushioning', 'Breathable upper'],
    specs: [['Fit', 'Wide'], ['Drop', '10 mm'], ['Use', 'Road running']],
    options: [option('size', 'Size (EU)', shoeSizes, ['38'])],
  },
  40: {
    summary: 'A non-slip yoga mat with enough cushioning for knees and wrists, and a grip that holds when wet.',
    features: ['Non-slip surface', '6 mm cushioning', 'Carry strap included'],
    specs: [['Material', 'Natural rubber'], ['Thickness', '6 mm'], ['Size', '183 × 61 cm']],
    options: [color(['Slate', 'Sage', 'Plum'])],
  },
  41: {
    summary: 'An adjustable dumbbell pair that replaces a whole rack and stores in a small space.',
    features: ['Weight adjusts in 2.5 kg steps', 'Secure locking dial', 'Storage tray included'],
    specs: [['Material', 'Steel, rubber coating'], ['Tray', 'Included']],
    options: [option('weight', 'Weight', ['2 × 5 kg', '2 × 10 kg', '2 × 20 kg'], ['2 × 20 kg'])],
  },
  42: {
    summary: 'A double-wall steel water bottle that keeps water cold all day and drinks hot for hours.',
    features: ['Cold for 24 hours, hot for 12', 'Leak-proof cap', 'BPA free'],
    specs: [['Material', 'Stainless steel'], ['Insulation', 'Double wall']],
    options: [size(['500 ml', '750 ml']), color(['Steel', 'Black', 'Blue'])],
  },
  43: {
    summary: 'A lightweight backpack for trails and long days out, with a ventilated back panel.',
    features: ['Ventilated back panel', 'Hydration-bladder sleeve', 'Rain cover included'],
    specs: [['Weight', '780 g'], ['Material', 'Ripstop nylon'], ['Rain cover', 'Included']],
    options: [option('capacity', 'Capacity', ['20 L', '28 L']), color(['Black', 'Moss'])],
  },
  44: {
    summary: 'Three pairs of compression running socks with arch support and breathable zones.',
    features: ['Arch support', 'Breathable zones', 'Pack of three pairs'],
    specs: [['Pack', '3 pairs'], ['Material', 'Nylon, elastane']],
    options: [size(['S', 'M', 'L'])],
  },
}

/* ---------- Slugs ---------- */

export function getProductSlug(product: Product): string {
  return slugify(product.name)
}

export function getProductPath(product: Product): string {
  return `/product/${getProductSlug(product)}`
}

export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (slug === undefined) return undefined
  return PRODUCTS.find((product) => getProductSlug(product) === slug)
}

/* ---------- Gallery ---------- */

const DETAIL_CROPS = ['entropy', 'bottom'] as const

/** Higher resolution version of a catalogue photo, used by the lightbox. */
function toFull(url: string): string {
  return url.replace('w=600', 'w=1600')
}

function buildGallery(product: Product, extra: Extra | undefined): ProductImage[] {
  if (product.image === '') return []

  const urls = [product.image, ...(extra?.images ?? [])]

  // With no extra photos, offer close-up views of the main photo
  if (extra?.images === undefined && product.image.includes('images.unsplash.com')) {
    const base = product.image.split('?')[0]
    for (const crop of DETAIL_CROPS) {
      urls.push(`${base}?w=600&q=80&h=600&fit=crop&crop=${crop}`)
    }
  }

  return urls.map((src, index) => ({
    src,
    full: toFull(src),
    alt: index === 0 ? product.name : `${product.name}, view ${index + 1}`,
  }))
}

/* ---------- Public API ---------- */

export function getProductDetails(product: Product): ProductDetails {
  const extra = EXTRAS[product.id]
  const store = getStoreByName(product.store)
  const policies = store ? getStoreDetails(store.slug)?.policies : undefined

  const specs: ProductSpec[] = (extra?.specs ?? []).map(([label, value]) => ({
    label,
    value,
  }))

  return {
    sku: `FAI-${String(product.id).padStart(4, '0')}`,
    brand: extra?.brand,
    summary: extra?.summary ?? `${product.name}, sold by ${product.store}.`,
    features: extra?.features ?? [],
    specs,
    options: extra?.options ?? [],
    gallery: buildGallery(product, extra),
    video: extra?.video,
    stock: product.inStock ? (extra?.stock ?? 8 + ((product.id * 7) % 33)) : 0,
    shipping: extra?.shipping ?? policies?.shipping,
    returns: extra?.returns ?? policies?.returns,
  }
}

/** Same category first, then same store, closest in price first. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const score = (other: Product): number =>
    (other.category === product.category ? 100 : 0) +
    (other.store === product.store ? 20 : 0) -
    Math.abs(other.price - product.price) / 10

  return PRODUCTS.filter((other) => other.id !== product.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit)
}

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}
