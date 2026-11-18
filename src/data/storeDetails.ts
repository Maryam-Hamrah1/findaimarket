import { storeRegistry } from '../services/storeRegistry'
import type { StoreDetails } from '../types/store'

/*
  Sample storefront content (mock data, no backend yet).
  Everything here is invented for the design preview: people, e-mail addresses
  (reserved ".example" domain), phone numbers (fictional ranges), policies and
  reviews. Nothing describes a real business or a verified purchase.
*/

const CARDS = ['Credit and debit cards', 'PayPal']
const CARDS_WALLETS = ['Credit and debit cards', 'PayPal', 'Apple Pay']

export const STORE_DETAILS: ReadonlyArray<StoreDetails> = [
  {
    slug: 'modern-style',
    story: [
      'Modern Style began with a single leather tote and a simple idea: a good bag should look better every year you own it. Every design is drawn in our London studio and tested on daily commutes before it goes on sale.',
      'We work with small tanneries that use vegetable tanning, and we keep the range small on purpose. Fewer styles means more care for each one.',
    ],
    seller: {
      name: 'Amelia Hart',
      role: 'Founder and lead designer',
      bio: 'Amelia trained as a leatherworker before starting the brand. She still approves every sample herself.',
    },
    established: 2019,
    contact: {
      email: 'hello@modernstyle.example',
      phone: '+44 20 7946 0123',
      hours: 'Mon to Fri, 9:00 to 17:00 (GMT)',
    },
    policies: {
      shipping: 'Orders ship within 2 working days. Delivery takes 3 to 6 days in Europe and 7 to 12 days worldwide.',
      returns: 'Unused items can be returned within 30 days of delivery. Return shipping is free within the UK.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'facebook', url: 'https://www.facebook.com/' },
      { platform: 'website', url: 'https://example.com/' },
    ],
    reviews: [
      { id: 'ms-1', author: 'Emma R.', rating: 5, date: '2026-10-21', text: 'The leather feels far more expensive than the price. My handbag has been to work every day this month and still looks new.' },
      { id: 'ms-2', author: 'Daniel K.', rating: 5, date: '2026-10-03', text: 'Bought the wallet as a gift. It arrived in lovely packaging and my father uses it daily.' },
      { id: 'ms-3', author: 'Sofia M.', rating: 4, date: '2026-09-18', text: 'Beautiful tote, a little stiff at first but it softens quickly. Delivery took a week.' },
      { id: 'ms-4', author: 'Liam T.', rating: 5, date: '2026-08-29', text: 'Great sunglasses for the price. They came with a hard case, which I did not expect.' },
      { id: 'ms-5', author: 'Hannah P.', rating: 3, date: '2026-08-02', text: 'Good quality, but the colour was slightly darker than in the photos. Support answered quickly.' },
    ],
  },
  {
    slug: 'tech-haven',
    story: [
      'Tech Haven started as a weekend blog where we tested headphones and chargers until we ran out of desk space. Today we sell only the products we would happily use ourselves.',
      'Every item goes through a hands-on check before listing. If a gadget does not meet our standard, it does not make the shelf.',
    ],
    seller: {
      name: 'Marcus Reyes',
      role: 'Co-founder and product tester',
      bio: 'Marcus has tested more than a thousand gadgets and writes every product description himself.',
    },
    established: 2016,
    contact: {
      email: 'support@techhaven.example',
      phone: '+1 512 555 0142',
      hours: 'Mon to Fri, 8:00 to 18:00 (CST)',
    },
    policies: {
      shipping: 'Free tracked shipping on orders over $75 within the United States. International orders ship in 5 to 10 working days.',
      returns: 'Return any unopened item within 30 days. Opened electronics can be exchanged within 14 days if faulty.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'x', url: 'https://x.com/' },
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'website', url: 'https://example.com/' },
    ],
    reviews: [
      { id: 'th-1', author: 'Noah B.', rating: 5, date: '2026-11-04', text: 'The noise-cancelling headphones are excellent for the price. Battery lasted my whole week of flights.' },
      { id: 'th-2', author: 'Priya S.', rating: 5, date: '2026-10-19', text: 'Fast shipping and the laptop was exactly as described. Setup took ten minutes.' },
      { id: 'th-3', author: 'Chris D.', rating: 4, date: '2026-10-05', text: 'Good Bluetooth speaker, loud and clear. I wish the strap were a bit longer.' },
      { id: 'th-4', author: 'Yuki A.', rating: 5, date: '2026-09-22', text: 'The power bank charged my phone four times on a hiking trip. Very happy.' },
      { id: 'th-5', author: 'Oliver W.', rating: 3, date: '2026-09-01', text: 'Smartwatch works well but the app is basic. Customer service was helpful with the setup.' },
    ],
  },
  {
    slug: 'home-essence',
    story: [
      'Home Essence is a small Hamburg studio for people who like their home to feel calm. We choose lighting, scents and simple furniture that work together instead of competing for attention.',
      'Our candles are poured in small batches with soy wax, and our shelves are made from solid oak by a family workshop in northern Germany.',
    ],
    seller: {
      name: 'Lena Fischer',
      role: 'Owner and interior stylist',
      bio: 'Lena spent ten years styling homes for magazines before opening the shop. She picks every product by living with it first.',
    },
    contact: {
      email: 'hallo@homeessence.example',
      hours: 'Mon to Sat, 10:00 to 17:00 (CET)',
    },
    policies: {
      shipping: 'Orders ship within 3 working days. Delivery takes 2 to 4 days in Germany and 4 to 8 days across Europe.',
      returns: 'Returns are accepted within 14 days if the item is unused. Furniture is collected free of charge in Germany.',
      payments: CARDS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'facebook', url: 'https://www.facebook.com/' },
    ],
    reviews: [
      { id: 'he-1', author: 'Marta L.', rating: 5, date: '2026-11-08', text: 'The desk lamp gives a really warm light and looks lovely on my desk. Packed very carefully.' },
      { id: 'he-2', author: 'Jonas H.', rating: 5, date: '2026-10-27', text: 'The oak shelf is solid and easy to mount. It looks even better than the photo.' },
      { id: 'he-3', author: 'Clara V.', rating: 5, date: '2026-10-11', text: 'The candle set smells wonderful without being heavy. I bought a second one as a present.' },
      { id: 'he-4', author: 'Ben S.', rating: 4, date: '2026-09-25', text: 'Very nice bath set. Delivery to Austria took six days.' },
      { id: 'he-5', author: 'Ines F.', rating: 5, date: '2026-09-06', text: 'Lovely shop with a very consistent style. Everything I ordered matched.' },
    ],
  },
  {
    slug: 'atelier-nord',
    story: [
      'Atelier Nord designs wardrobe essentials for long Nordic winters: soft wool, clean cuts and colours that go with everything. We work with mills that publish where their wool comes from.',
    ],
    seller: {
      name: 'Elin Andersson',
      role: 'Founder',
      bio: 'Elin worked in textile design for a decade before starting a label focused on pieces people keep for years.',
    },
    established: 2022,
    contact: {
      email: 'hej@ateliernord.example',
      hours: 'Mon to Fri, 9:00 to 16:00 (CET)',
    },
    policies: {
      shipping: 'Orders ship within 2 working days from Stockholm. Delivery takes 3 to 7 days in Europe.',
      returns: 'Free returns within 30 days on unworn items with the tags attached.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'website', url: 'https://example.com/' },
    ],
    reviews: [
      { id: 'an-1', author: 'Karin J.', rating: 5, date: '2026-11-02', text: 'The merino scarf is incredibly soft and does not itch at all. A perfect gift.' },
      { id: 'an-2', author: 'Tom G.', rating: 5, date: '2026-10-14', text: 'The winter coat is warm and fits true to size. Worth the price.' },
      { id: 'an-3', author: 'Alva N.', rating: 4, date: '2026-09-30', text: 'Great t-shirts that hold their shape after many washes.' },
    ],
  },
  {
    slug: 'casa-luna',
    story: [
      'Casa Luna is a concept store from Valencia. We gather linen, ceramics, brass lamps and small-batch self-care from makers around the Mediterranean, all in one calm, sunny shop.',
    ],
    seller: {
      name: 'Carmen Ortega',
      role: 'Owner',
      bio: 'Carmen opened the shop after years of collecting pieces from local workshops for her own home.',
    },
    established: 2024,
    contact: {
      email: 'hola@casaluna.example',
      hours: 'Mon to Sat, 10:00 to 18:00 (CET)',
    },
    policies: {
      shipping: 'Orders ship within 3 working days. Delivery takes 3 to 6 days in Europe.',
      returns: 'Returns are accepted within 14 days if the item is unused and in its original packaging.',
      payments: CARDS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
    ],
    reviews: [
      { id: 'cl-1', author: 'Isabel R.', rating: 5, date: '2026-10-28', text: 'The linen throw is lovely and the brass lamp gives a beautiful glow.' },
      { id: 'cl-2', author: 'Pedro M.', rating: 4, date: '2026-10-09', text: 'The ceramic coffee set is elegant. One cup arrived with a tiny chip, but support replaced it.' },
      { id: 'cl-3', author: 'Julia K.', rating: 5, date: '2026-09-20', text: 'Gorgeous silk scarf for a very fair price.' },
    ],
  },
  {
    slug: 'urban-thread',
    story: [
      'Urban Thread started in a Portland garage, restoring vintage denim jackets. Today we design our own pieces with the same worn-in look and sell leather goods that age well.',
    ],
    seller: {
      name: 'Jordan Blake',
      role: 'Founder',
      bio: 'Jordan collects vintage workwear and turned the hobby into a small label.',
    },
    contact: {
      email: 'team@urbanthread.example',
      hours: 'Mon to Fri, 10:00 to 17:00 (PST)',
    },
    policies: {
      shipping: 'Orders ship within 3 working days. Free shipping in the United States on orders over $60.',
      returns: 'Returns accepted within 30 days on unworn items. Fitness equipment must be returned unused.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'x', url: 'https://x.com/' },
    ],
    reviews: [
      { id: 'ut-1', author: 'Mia C.', rating: 5, date: '2026-10-24', text: 'The denim jacket has the perfect worn-in look. I get compliments every time I wear it.' },
      { id: 'ut-2', author: 'Ethan P.', rating: 4, date: '2026-10-01', text: 'Solid leather belt. The buckle is heavy, which I like.' },
      { id: 'ut-3', author: 'Zoe L.', rating: 4, date: '2026-09-15', text: 'Dumbbells arrived quickly and work as described.' },
    ],
  },
  {
    slug: 'peak-and-pace',
    story: [
      'Peak & Pace was started by a group of runners in Vancouver who were tired of gear that fell apart after one season. We test every product on local trails before it reaches the shop.',
      'From first running shoes to trail packs, we aim to make outdoor gear honest, durable and easy to choose.',
    ],
    seller: {
      name: 'Sam Nguyen',
      role: 'Co-founder and head of testing',
      bio: 'Sam has run more than twenty marathons and tests every shoe over at least 100 kilometres.',
    },
    established: 2018,
    contact: {
      email: 'crew@peakandpace.example',
      hours: 'Mon to Sat, 8:00 to 17:00 (PST)',
    },
    policies: {
      shipping: 'Free shipping in Canada on orders over $80. Orders ship within 2 working days.',
      returns: 'Try any shoes for 30 days. Unused gear can be returned within 60 days.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'facebook', url: 'https://www.facebook.com/' },
      { platform: 'website', url: 'https://example.com/' },
    ],
    reviews: [
      { id: 'pp-1', author: 'Alex T.', rating: 5, date: '2026-11-07', text: 'Wide-fit running shoes that finally fit. Comfortable from the first run.' },
      { id: 'pp-2', author: 'Rachel B.', rating: 5, date: '2026-10-18', text: 'The yoga mat does not slip, even with sweaty hands. Very good value.' },
      { id: 'pp-3', author: 'Kenji O.', rating: 4, date: '2026-09-29', text: 'The trail backpack is light and has plenty of pockets. The chest strap could be softer.' },
    ],
  },
  {
    slug: 'kobo-studio',
    story: [
      'Kōbō Studio is a small design workshop in Kyoto. We make limited runs of cameras, desk tools and ceramics, always in quantities we can finish by hand.',
    ],
    seller: {
      name: 'Haruto Mori',
      role: 'Workshop director',
      bio: 'Haruto leads a team of four makers who combine traditional crafts with modern electronics.',
    },
    established: 2026,
    contact: {
      email: 'info@kobostudio.example',
      hours: 'Mon to Fri, 9:00 to 17:00 (JST)',
    },
    policies: {
      shipping: 'Orders ship within 5 working days. Worldwide tracked shipping takes 6 to 12 days.',
      returns: 'Items can be returned within 14 days of delivery. Made-to-order pieces cannot be returned.',
      payments: CARDS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'website', url: 'https://example.com/' },
    ],
    reviews: [
      { id: 'ks-1', author: 'Nina F.', rating: 5, date: '2026-11-10', text: 'The film camera is beautiful and works perfectly. A true piece of craft.' },
      { id: 'ks-2', author: 'David C.', rating: 5, date: '2026-10-26', text: 'My new keyboard feels wonderful to type on. Packaging was very careful.' },
      { id: 'ks-3', author: 'Aiko S.', rating: 4, date: '2026-10-08', text: 'Lovely ceramic vase. Shipping took ten days, but it was worth waiting for.' },
    ],
  },
  {
    slug: 'lumiere-atelier',
    story: [
      'Lumière Atelier makes jewelry in a small workshop in Lyon. Each piece is hand-finished and made to be worn every day.',
    ],
    seller: {
      name: 'Camille Laurent',
      role: 'Jeweler',
      bio: 'Camille trained as a goldsmith and designs every piece herself.',
    },
    established: 2025,
    contact: {
      email: 'bonjour@lumiereatelier.example',
      hours: 'Tue to Sat, 10:00 to 17:00 (CET)',
    },
    policies: {
      shipping: 'Orders ship within 3 working days in a gift box. Delivery takes 3 to 7 days in Europe.',
      returns: 'Returns accepted within 14 days if the item is unworn.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
    ],
    reviews: [
      { id: 'la-1', author: 'Léa D.', rating: 5, date: '2026-11-11', text: 'The silver pendant is delicate and beautifully made. It came in a lovely box.' },
      { id: 'la-2', author: 'Anna W.', rating: 5, date: '2026-10-22', text: 'The gold-plated earrings are light and comfortable all day.' },
      { id: 'la-3', author: 'Rosa M.', rating: 4, date: '2026-10-17', text: 'Pretty and well finished. I would love more sizes of hoops.' },
    ],
  },
  {
    slug: 'lumiere-beaute',
    story: [
      'Lumière Beauté makes simple, gentle skincare and fragrance in Paris. We keep formulas short, avoid unnecessary ingredients and explain what each product is for.',
    ],
    seller: {
      name: 'Claire Dubois',
      role: 'Founder and formulator',
      bio: 'Claire worked in a cosmetic laboratory before starting a brand with shorter ingredient lists.',
    },
    established: 2021,
    contact: {
      email: 'contact@lumierebeaute.example',
      hours: 'Mon to Fri, 9:00 to 17:00 (CET)',
    },
    policies: {
      shipping: 'Orders ship within 2 working days. Delivery takes 2 to 5 days in Europe and 6 to 12 days worldwide.',
      returns: 'Unopened products can be returned within 30 days. Opened products cannot be returned for hygiene reasons.',
      payments: CARDS_WALLETS,
    },
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/' },
      { platform: 'facebook', url: 'https://www.facebook.com/' },
    ],
    reviews: [
      { id: 'lb-1', author: 'Margaux T.', rating: 5, date: '2026-11-09', text: 'The facial serum made my skin feel soft within a week. The packaging is beautiful too.' },
      { id: 'lb-2', author: 'Emily H.', rating: 5, date: '2026-10-30', text: 'The rose and amber perfume is warm and lasts all day.' },
      { id: 'lb-3', author: 'Sara B.', rating: 4, date: '2026-10-12', text: 'Gentle day cream. I would like a larger size option.' },
    ],
  },
]

export function getStoreDetails(slug: string): StoreDetails | undefined {
  return (
    STORE_DETAILS.find((details) => details.slug === slug) ??
    storeRegistry.getBySlug(slug)?.details
  )
}
