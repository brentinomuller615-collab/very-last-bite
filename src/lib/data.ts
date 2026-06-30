export type DealCategory = 'bakery' | 'cafe' | 'grocery' | 'restaurant';

export interface Deal {
  id: string;
  businessName: string;
  title: string;
  category: DealCategory;
  emoji: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  pickupTime?: string;
  pickupEndTime?: string;
  distance: number;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  bgColor: string;
  bakeryAddress?: string;
  bakeryPhone?: string;
  bakeryId?: string;
  pickupCode?: string;
  pickupCodeUsed?: boolean;
  status?: string;
  collectedAt?: any;
}

export const deals: Deal[] = [
  {
    id: '1',
    businessName: 'Stellenbosch Bakery',
    title: 'Surprise Pastry Bag',
    category: 'bakery',
    emoji: '🥐',
    originalPrice: 120,
    discountedPrice: 45,
    discountPercent: 63,
    pickupTime: '16:00',
    pickupEndTime: '17:30',
    distance: 0.6,
    description: 'A delightful mystery bag filled with freshly baked pastries — croissants, danishes, rusks, and more. Each bag is packed with love and surplus goodness.',
    tags: ['Pastries', 'Bread', 'Surprise'],
    rating: 4.8,
    reviewCount: 142,
    bgColor: '#F59E0B',
  },
  {
    id: '2',
    businessName: 'Bean & Bloom Café',
    title: 'Café Lunch Box',
    category: 'cafe',
    emoji: '🥗',
    originalPrice: 95,
    discountedPrice: 39,
    discountPercent: 59,
    pickupTime: '14:30',
    pickupEndTime: '15:30',
    distance: 1.2,
    description: 'A wholesome café lunch box loaded with a sandwich, seasonal salad, a sweet treat, and a fresh juice. Perfect midday fuel.',
    tags: ['Sandwich', 'Salad', 'Healthy'],
    rating: 4.6,
    reviewCount: 98,
    bgColor: '#10B981',
  },
  {
    id: '3',
    businessName: 'Forno Wood-Fired',
    title: 'Pizza Rescue Deal',
    category: 'restaurant',
    emoji: '🍕',
    originalPrice: 160,
    discountedPrice: 59,
    discountPercent: 63,
    pickupTime: '20:30',
    pickupEndTime: '21:30',
    distance: 2.1,
    description: 'End-of-night wood-fired pizza slices — Margherita, BBQ Chicken, and Quattro Formaggi. Still hot. Still incredible.',
    tags: ['Pizza', 'Wood-fired', 'Italian'],
    rating: 4.9,
    reviewCount: 217,
    bgColor: '#EF4444',
  },
  {
    id: '4',
    businessName: 'Green Market Grocer',
    title: 'Produce Bundle',
    category: 'grocery',
    emoji: '🥦',
    originalPrice: 140,
    discountedPrice: 49,
    discountPercent: 65,
    pickupTime: '17:00',
    pickupEndTime: '18:30',
    distance: 0.9,
    description: 'Fresh vegetables and seasonal fruit near their best-before date. Zero pesticides, maximum flavour. Great for batch cooking.',
    tags: ['Vegetables', 'Fruit', 'Fresh'],
    rating: 4.5,
    reviewCount: 74,
    bgColor: '#22C55E',
  },
  {
    id: '5',
    businessName: 'The Morning Press',
    title: 'Barista Pastry Pack',
    category: 'cafe',
    emoji: '☕',
    originalPrice: 110,
    discountedPrice: 42,
    discountPercent: 62,
    pickupTime: '13:00',
    pickupEndTime: '14:00',
    distance: 1.5,
    description: 'Paired for you: two freshly brewed filter coffees and three artisan pastries. The ideal afternoon reset.',
    tags: ['Coffee', 'Pastry', 'Artisan'],
    rating: 4.7,
    reviewCount: 189,
    bgColor: '#8B5CF6',
  },
  {
    id: '6',
    businessName: 'Harvest Naturals',
    title: 'Mixed Snack Pack',
    category: 'grocery',
    emoji: '🍎',
    originalPrice: 85,
    discountedPrice: 29,
    discountPercent: 66,
    pickupTime: '18:00',
    pickupEndTime: '19:00',
    distance: 0.4,
    description: 'Assorted healthy snacks — nuts, dried fruit, granola bars, and seasonal fresh bites. Grab-and-go goodness.',
    tags: ['Snacks', 'Healthy', 'Grab & Go'],
    rating: 4.4,
    reviewCount: 55,
    bgColor: '#F97316',
  },
  {
    id: '7',
    businessName: 'Sushi Republic',
    title: 'Sushi End-of-Day Tray',
    category: 'restaurant',
    emoji: '🍣',
    originalPrice: 220,
    discountedPrice: 79,
    discountPercent: 64,
    pickupTime: '21:00',
    pickupEndTime: '22:00',
    distance: 3.0,
    description: 'A premium platter of 24 pieces of freshly prepared sushi — nigiri, maki, and temaki. Crafted today, never tomorrow.',
    tags: ['Sushi', 'Seafood', 'Premium'],
    rating: 4.9,
    reviewCount: 301,
    bgColor: '#0EA5E9',
  },
  {
    id: '8',
    businessName: 'La Petite Boulangerie',
    title: 'French Bread Bundle',
    category: 'bakery',
    emoji: '🥖',
    originalPrice: 90,
    discountedPrice: 35,
    discountPercent: 61,
    pickupTime: '17:30',
    pickupEndTime: '18:30',
    distance: 1.8,
    description: 'Take home a baguette, two sourdough rolls, and a surprise dessert pastry. Straight from the oven, into your home.',
    tags: ['Bread', 'Sourdough', 'French'],
    rating: 4.8,
    reviewCount: 134,
    bgColor: '#D97706',
  },
];

export const stats = {
  mealsRescued: 12480,
  foodWastePrevented: 3120,
  communitySavings: 486200,
};
