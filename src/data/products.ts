import { Product } from '../types';
import bannerImg from '../assets/images/mens_super_sale_banner_1786312326097.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Heritage Biker Leather Jacket',
    category: 'Outerwear',
    price: 349,
    originalPrice: 420,
    rating: 4.9,
    reviewCount: 68,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Crafted from supple full-grain Italian lambskin leather with heavy-duty silver hardware, satin lining, and custom zip pulls. Built for decades of timeless style.',
    material: '100% Full-Grain Italian Lambskin Leather',
    fit: 'Slim tailored fit through chest and sleeves',
    care: 'Professional leather dry clean only',
    colors: [
      { name: 'Midnight Black', hex: '#121212' },
      { name: 'Espresso Brown', hex: '#3D2314' },
      { name: 'Slate Gray', hex: '#4B5563' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 6,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'p2',
    title: 'Italian Wool Double-Breasted Suit',
    category: 'Formal Wear',
    price: 580,
    originalPrice: 695,
    rating: 4.9,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Exquisite two-piece suit constructed from superfine 130s Italian wool. Features peak lapels, half-canvas construction, and horn buttons.',
    material: '100% Superfine 130s Italian Merino Wool',
    fit: 'Tailored Italian structured silhouette',
    care: 'Dry clean only',
    colors: [
      { name: 'Charcoal Navy', hex: '#1E293B' },
      { name: 'Obsidian Black', hex: '#0F172A' },
      { name: 'Camel Tan', hex: '#9A7B56' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 4,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'p3',
    title: 'Japanese Selvedge Raw Denim Jeans',
    category: 'Denim & Pants',
    price: 185,
    originalPrice: 210,
    rating: 4.8,
    reviewCount: 114,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '14.5oz unwashed Japanese shuttle-loom denim featuring red ID selvedge line, custom brass rivets, and classic button fly.',
    material: '100% Cotton 14.5oz Kurabo Mills Selvedge',
    fit: 'Modern straight slim leg with medium rise',
    care: 'Wash inside out in cold water after 6 months wear',
    colors: [
      { name: 'Raw Indigo', hex: '#1A237E' },
      { name: 'Washed Black', hex: '#262626' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 12,
    isBestSeller: true
  },
  {
    id: 'p4',
    title: 'Minimalist Oxford Cotton Shirt',
    category: 'Casual Shirts',
    price: 95,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Heavyweight organic cotton Oxford shirt with a gentle brushed finish, natural mother-of-pearl buttons, and a clean button-down collar.',
    material: '100% Organic Egyptian Long-Staple Cotton',
    fit: 'Relaxed modern tailored fit',
    care: 'Machine wash warm, tumble dry low',
    colors: [
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#BAE6FD' },
      { name: 'Sand Beige', hex: '#E7E5E4' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 18,
    featured: true
  },
  {
    id: 'p20',
    title: 'Royal Pique Cotton Signature Polo Shirt',
    category: 'Casual Shirts',
    price: 78,
    originalPrice: 98,
    rating: 4.9,
    reviewCount: 135,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1625910513413-73024f2b5889?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Premium heavyweight cotton pique polo with embroidered Nahid Vault emblem, ribbed flat-knit collar, mother-of-pearl 2-button placket, and vented hem.',
    material: '100% Mercerized Pique Cotton',
    fit: 'Tailored athletic fit',
    care: 'Machine wash cold inside out',
    colors: [
      { name: 'Imperial Navy', hex: '#172554' },
      { name: 'Burgundy Wine', hex: '#881337' },
      { name: 'Classic White', hex: '#FAFAFA' },
      { name: 'Forest Green', hex: '#14532D' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 25,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'p21',
    title: 'Vintage Heavyweight Cotton Crewneck T-Shirt',
    category: 'Casual Shirts',
    price: 52,
    originalPrice: 68,
    rating: 4.8,
    reviewCount: 160,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '280gsm thick combed cotton streetwear t-shirt with garment-dyed wash for vintage character. Features reinforced neck ribbing and drop shoulders.',
    material: '100% Combed Heavy Cotton (280 GSM)',
    fit: 'Relaxed streetwear drop-shoulder fit',
    care: 'Cold wash, hang dry',
    colors: [
      { name: 'Washed Charcoal', hex: '#27272A' },
      { name: 'Sage Olive', hex: '#3F6212' },
      { name: 'Oatmeal Heather', hex: '#E7E5E4' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 30,
    isNewArrival: true
  },
  {
    id: 'p22',
    title: 'Pure Italian Linen Casual Button-Down Shirt',
    category: 'Casual Shirts',
    price: 110,
    originalPrice: 140,
    rating: 4.9,
    reviewCount: 74,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Lightweight, ultra-breathable pure linen shirt tailored in Northern Italy. Designed for effortless warm-weather sophistication and relaxed elegance.',
    material: '100% Pure Flax Italian Linen',
    fit: 'Modern regular fit',
    care: 'Hand wash or dry clean',
    colors: [
      { name: 'Sand Khaki', hex: '#D6C0B3' },
      { name: 'Sky Blue', hex: '#7DD3FC' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 16,
    featured: true
  },
  {
    id: 'p23',
    title: 'Slim-Fit Egyptian Cotton Formal Dress Shirt',
    category: 'Formal Wear',
    price: 125,
    originalPrice: 160,
    rating: 4.9,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Wrinkle-resistant 120s two-ply Egyptian cotton formal shirt with French cuffs, stiff spread collar, and mother-of-pearl buttons.',
    material: '100% Egyptian Giza 87 Cotton',
    fit: 'Slim executive tailored fit',
    care: 'Warm iron or dry clean',
    colors: [
      { name: 'Crisp Executive White', hex: '#FFFFFF' },
      { name: 'Soft Lavender', hex: '#DDD6FE' },
      { name: 'French Blue', hex: '#3B82F6' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 20,
    isBestSeller: true
  },
  {
    id: 'p11',
    title: 'BD Leather Slip-On Loafer',
    category: 'Footwear',
    price: 135,
    originalPrice: 195,
    rating: 4.9,
    reviewCount: 88,
    images: [
      bannerImg,
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'As featured in the Super Sale Campaign! Ergonomic brown leather slip-on loafer crafted with genuine calfskin, flexible elastic side gores, and high-density shock-absorbing rubber outsole.',
    material: '100% Genuine Calfskin Leather & Vulcanized Rubber Sole',
    fit: 'True to size with ergonomic arch support',
    care: 'Wipe with damp cloth, apply dark brown shoe wax',
    colors: [
      { name: 'Rich Chestnut Brown', hex: '#633013' },
      { name: 'Espresso Black', hex: '#1C1917' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 14,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'p24',
    title: 'Italian Leather Double Monk Strap Shoes',
    category: 'Footwear',
    price: 220,
    originalPrice: 275,
    rating: 4.9,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Hand-burnished Italian calfskin monk strap dress shoes featuring dual brass buckles, Goodyear welted leather sole, and leather lining.',
    material: '100% Full-Grain Italian Calfskin Leather',
    fit: 'Slightly elongated European formal last',
    care: 'Apply neutral wax polish and store with shoe trees',
    colors: [
      { name: 'Deep Mahogany', hex: '#451A03' },
      { name: 'Onyx Black', hex: '#0F172A' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 9,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'p5',
    title: 'Handcrafted Chelsea Boots in Suede',
    category: 'Footwear',
    price: 260,
    originalPrice: 295,
    rating: 4.9,
    reviewCount: 57,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Handmade Chelsea boots crafted with waterproof Italian suede, Goodyear welted leather sole, and twin elastic side gores for easy slip-on.',
    material: 'Italian Calf Suede Leather & Leather Sole',
    fit: 'Runs true to size with snug ankle hold',
    care: 'Suede brush and water repellent spray',
    colors: [
      { name: 'Tobacco Tan', hex: '#A16207' },
      { name: 'Midnight Charcoal', hex: '#334155' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 8,
    isBestSeller: true
  },
  {
    id: 'p13',
    title: 'Bata Comfort Flex Leather Driver Moccasins',
    category: 'Footwear',
    price: 115,
    originalPrice: 150,
    rating: 4.8,
    reviewCount: 92,
    images: [
      'https://images.unsplash.com/photo-1582844245801-1405e34be4b5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Ultra-flexible driving shoes with hand-stitched moc-toe detail, split rubber pebble pods for superior grip, and breathable perforated leather insoles.',
    material: 'Top-Grain Pebbled Italian Leather',
    fit: 'Glove-like fit that molds to your foot over time',
    care: 'Leather lotion and gentle brush',
    colors: [
      { name: 'Navy Blue', hex: '#1E3A8A' },
      { name: 'Cognac Tan', hex: '#92400E' },
      { name: 'Charcoal Black', hex: '#27272A' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 10,
    isBestSeller: true
  },
  {
    id: 'p14',
    title: 'Executive Handcrafted Wingtip Brogues',
    category: 'Footwear',
    price: 210,
    originalPrice: 280,
    rating: 5.0,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Classic burnished Oxford wingtips crafted with intricate laser-cut medallion broguing, stacked leather heel, and Goodyear welted sole.',
    material: 'Full-Grain Burnished Calfskin',
    fit: 'Structured formal last shape',
    care: 'Use wooden shoe trees and matching cream polish',
    colors: [
      { name: 'Burnished Tan', hex: '#B45309' },
      { name: 'Mahogany Brown', hex: '#451A03' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 6,
    isNewArrival: true
  },
  {
    id: 'p25',
    title: 'Tailored Stretch Cotton Chino Trousers',
    category: 'Denim & Pants',
    price: 92,
    originalPrice: 115,
    rating: 4.8,
    reviewCount: 83,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Versatile stretch cotton twill chinos with clean front flat design, horn buttons, coin pocket, and custom internal waistband detailing.',
    material: '98% Organic Cotton, 2% Elastane',
    fit: 'Slim tapered leg',
    care: 'Machine wash warm, iron medium',
    colors: [
      { name: 'Classic Khaki', hex: '#D6C0B3' },
      { name: 'Dark Navy', hex: '#1E293B' },
      { name: 'Olive Green', hex: '#3F6212' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 19,
    isBestSeller: true
  },
  {
    id: 'p6',
    title: 'Heavyweight Fleece Oversized Hoodie',
    category: 'Casual Shirts',
    price: 110,
    rating: 4.8,
    reviewCount: 130,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '450gsm ultra-soft French terry cotton hoodie featuring a seamless double-layered hood, dropped shoulders, and ribbed cuffs.',
    material: '100% Heavyweight French Terry Cotton (450 GSM)',
    fit: 'Boxy streetwear oversized fit',
    care: 'Cold wash with like colors',
    colors: [
      { name: 'Washed Slate', hex: '#64748B' },
      { name: 'Cream Oat', hex: '#F5F5F4' },
      { name: 'Onyx Black', hex: '#18181B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 15,
    isNewArrival: true
  },
  {
    id: 'p7',
    title: 'Automatic Chronograph Leather Watch',
    category: 'Accessories',
    price: 320,
    originalPrice: 380,
    rating: 5.0,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Precision 24-jewel Japanese mechanical movement visible through sapphire crystal caseback. Finished with genuine Horween leather strap.',
    material: '316L Stainless Steel & Sapphire Crystal Glass',
    fit: '41mm Case Diameter, 20mm Strap Width',
    care: 'Wipe with soft microfiber cloth; 50m water resistant',
    colors: [
      { name: 'Rose Gold & Brown', hex: '#B45309' },
      { name: 'Silver & Obsidian', hex: '#334155' }
    ],
    sizes: ['M', 'L'],
    inStock: true,
    stockCount: 5,
    featured: true
  },
  {
    id: 'p8',
    title: 'Tailored Wool-Blend Trench Coat',
    category: 'Outerwear',
    price: 420,
    originalPrice: 490,
    rating: 4.8,
    reviewCount: 53,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Sophisticated longline trench coat with water-repellent finish, belted waist, deep storm flap, and horn button closure.',
    material: '70% Recycled Melton Wool, 30% Cashmere Blend',
    fit: 'Structured longline tailored profile',
    care: 'Dry clean only',
    colors: [
      { name: 'Classic Camel', hex: '#D97706' },
      { name: 'Dark Navy', hex: '#1E293B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 3,
    isNewArrival: true
  },
  {
    id: 'p16',
    title: 'Nahid Vault Reversible Leather Belt & Wallet Set',
    category: 'Accessories',
    price: 85,
    originalPrice: 120,
    rating: 4.8,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Dual-sided reversible Italian leather belt (Black/Brown) with twist buckle, paired with a matching RFID-blocking bi-fold cardholder wallet in an executive gift box.',
    material: '100% Genuine Italian Cowhide Leather',
    fit: 'Cut-to-fit adjustable belt sizing up to 44"',
    care: 'Keep dry, wipe with clean soft cloth',
    colors: [
      { name: 'Reversible Black / Brown', hex: '#1C1917' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 22,
    isBestSeller: true
  },
  {
    id: 'p9',
    title: 'Italian Leather Weekender Duffle Bag',
    category: 'Accessories',
    price: 290,
    rating: 4.9,
    reviewCount: 71,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Spacious travel weekend bag constructed with full-grain vegetable-tanned leather, brass hardware, YKK zips, and padded laptop sleeve.',
    material: 'Full-Grain Tuscan Vegetable-Tanned Leather',
    fit: '45L Capacity (Flight Carry-On Approved)',
    care: 'Apply leather conditioner twice annually',
    colors: [
      { name: 'Cognac Brown', hex: '#92400E' },
      { name: 'Jet Black', hex: '#18181B' }
    ],
    sizes: ['M', 'L'],
    inStock: true,
    stockCount: 7
  },
  {
    id: 'p10',
    title: 'Minimalist Leather Low-Top Sneakers',
    category: 'Footwear',
    price: 175,
    originalPrice: 195,
    rating: 4.7,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Sleek Italian Nappa leather luxury sneakers with Margom rubber cupsole, gold stamped serial number on heel, and memory foam insoles.',
    material: '100% Italian Nappa Calfskin Leather',
    fit: 'Runs slightly large, recommend sizing down if between sizes',
    care: 'Wipe with damp cloth and leather cream',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Monochrome Black', hex: '#111827' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 10,
    isBestSeller: true
  },
  {
    id: 'p30',
    title: 'Swiss Skeleton Automatic Stainless Steel Watch',
    category: 'Accessories',
    price: 450,
    originalPrice: 520,
    rating: 5.0,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Exquisite open-heart skeleton timepiece with Swiss automatic mechanical movement, scratch-proof sapphire crystal, and 316L solid stainless steel mesh bracelet.',
    material: '316L Stainless Steel & Sapphire Crystal Glass',
    fit: '42mm Case Diameter with adjustable deployant clasp',
    care: 'Self-winding mechanical watch; 100m water resistance',
    colors: [
      { name: 'Silver Mesh', hex: '#94A3B8' },
      { name: 'Midnight Gunmetal', hex: '#334155' }
    ],
    sizes: ['M', 'L'],
    inStock: true,
    stockCount: 7,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'p31',
    title: 'Minimalist Sapphire Quartz Dress Watch',
    category: 'Accessories',
    price: 240,
    originalPrice: 290,
    rating: 4.8,
    reviewCount: 65,
    images: [
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Ultra-thin 7mm profile dress watch featuring brushed sunray dial, minimalist gold hour markers, and genuine Italian croc-embossed leather strap.',
    material: 'Italian Calfskin Leather & Gold PVD Stainless Steel',
    fit: '39mm Case Diameter, 20mm Strap Width',
    care: 'Wipe with soft microfiber cloth',
    colors: [
      { name: 'Champagne Gold & Brown', hex: '#B45309' },
      { name: 'Silver & Onyx Black', hex: '#18181B' }
    ],
    sizes: ['M', 'L'],
    inStock: true,
    stockCount: 12,
    isBestSeller: true
  },
  {
    id: 'p33',
    title: 'Premium Italian Silk Blend Resort Shirt',
    category: 'Casual Shirts',
    price: 135,
    originalPrice: 165,
    rating: 4.9,
    reviewCount: 51,
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Luxurious silk-viscose blend camp collar shirt with subtle jacquard weave, mother-of-pearl buttons, and relaxed Cuban silhouette.',
    material: '30% Mulberry Silk, 70% Viscose',
    fit: 'Relaxed resort fit',
    care: 'Dry clean or gentle hand wash cold',
    colors: [
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Sage Green', hex: '#4D7C0F' },
      { name: 'Onyx Navy', hex: '#1E293B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 15,
    isNewArrival: true,
    featured: true
  },
  {
    id: 'p34',
    title: 'Textured Knit Cotton Summer Polo',
    category: 'Casual Shirts',
    price: 82,
    originalPrice: 105,
    rating: 4.8,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1626497764746-6dc36546b388?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Retro open-knit cabana polo shirt crafted from breathable openwork cotton yarn with ribbed collar and placket detailing.',
    material: '100% Breathable Knitted Cotton',
    fit: 'Tailored casual fit',
    care: 'Hand wash cold and dry flat',
    colors: [
      { name: 'Terracotta Brown', hex: '#9A3412' },
      { name: 'Sand Beige', hex: '#D6C0B3' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 18,
    isBestSeller: true
  },
  {
    id: 'p36',
    title: 'Vintage Washed Slim Tapered Denim',
    category: 'Denim & Pants',
    price: 165,
    originalPrice: 195,
    rating: 4.9,
    reviewCount: 110,
    images: [
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1511105612320-2e62a04dd044?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Hand-distressed 13oz stretch indigo denim with soft vintage wash, custom branded copper rivets, and tapered ankle hem.',
    material: '99% Organic Cotton, 1% Elastane',
    fit: 'Slim tapered fit',
    care: 'Turn inside out, machine wash cold',
    colors: [
      { name: 'Vintage Stone Wash', hex: '#3B82F6' },
      { name: 'Dark Indigo Wash', hex: '#1D4ED8' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 14,
    isNewArrival: true
  },
  {
    id: 'p37',
    title: 'Heavyweight Raw Black Selvedge Denim',
    category: 'Denim & Pants',
    price: 175,
    originalPrice: 210,
    rating: 4.8,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=1000'
    ],
    description: '15oz heavy shuttle-loom black selvedge denim featuring stealth black hardware, tonal stitching, and red selvedge ID seam.',
    material: '100% Japanese Kurabo Shuttle-Loom Cotton',
    fit: 'Modern straight fit',
    care: 'Wash inside out in cold water',
    colors: [
      { name: 'Stealth Raw Black', hex: '#0F172A' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 11,
    isBestSeller: true
  },
  {
    id: 'p39',
    title: 'Handcrafted Italian Leather Penny Loafer',
    category: 'Footwear',
    price: 210,
    originalPrice: 260,
    rating: 4.9,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Classic Ivy-League penny loafer built in Tuscany with vegetable-tanned Italian calfskin, hand-stitched apron toe, and leather sole.',
    material: '100% Italian Vegetable-Tanned Calfskin',
    fit: 'Runs true to size with snug heel cup',
    care: 'Apply neutral wax polish and store with shoe trees',
    colors: [
      { name: 'Cognac Brown', hex: '#92400E' },
      { name: 'Dark Mahogany', hex: '#451A03' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 16,
    isBestSeller: true,
    featured: true
  },
  {
    id: 'p40',
    title: 'Classic Burnished Oxford Formal Dress Shoe',
    category: 'Footwear',
    price: 245,
    originalPrice: 295,
    rating: 5.0,
    reviewCount: 62,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1000'
    ],
    description: 'Impeccable closed-lacing Oxford shoe with hand-burnished toe cap, Goodyear welted construction, and stacked leather heel.',
    material: 'Full-Grain Aniline Calfskin Leather',
    fit: 'Structured formal last',
    care: 'Polish with matching dark brown cream',
    colors: [
      { name: 'Hand-Burnished Espresso', hex: '#271C19' },
      { name: 'Midnight Black', hex: '#09090B' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 8,
    isNewArrival: true,
    featured: true
  }
];

export const PROMO_CODES: Record<string, number> = {
  'NVM66': 0.10, // 10% off
  'STYLE10': 0.10, // 10% off
  'GENTLEMAN20': 0.20, // 20% off
  'FREESHIP': 0.05, // extra 5% off
  'SUPER30': 0.30, // 30% off Super Sale Banner code
  'AUTUMN25': 0.25, // 25% off Autumn Vault code
  'VAULTCLUB35': 0.35 // 35% off Member Club code
};



