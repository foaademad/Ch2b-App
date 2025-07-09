// Mock API service
// In a real app, this would connect to a backend API

import { Product } from '../types';

// Dummy data for products
const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 199.99,
    rating: 4.8,
    reviews: 1234,
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg',
    description: 'High-quality wireless headphones with noise cancellation.',
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 299.99,
    rating: 4.7,
    reviews: 856,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    description: 'Advanced smartwatch with health monitoring features.',
    category: 'Electronics',
  },
  {
    id: 3,
    name: 'Fitness Tracker',
    price: 79.99,
    rating: 4.6,
    reviews: 2345,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg',
    description: 'Track your fitness goals with this advanced fitness tracker.',
    category: 'Electronics',
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    price: 129.99,
    rating: 4.9,
    reviews: 1890,
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    description: 'Premium wireless earbuds with active noise cancellation.',
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'Smart LED TV',
    price: 599.99,
    rating: 4.7,
    reviews: 567,
    image: 'https://images.pexels.com/photos/6976094/pexels-photo-6976094.jpeg',
    description: '4K Smart LED TV with built-in streaming apps.',
    category: 'Electronics',
  },
  {
    id: 6,
    name: 'Robot Vacuum',
    price: 299.99,
    rating: 4.5,
    reviews: 890,
    image: 'https://images.pexels.com/photos/4087396/pexels-photo-4087396.jpeg',
    description: 'Smart robot vacuum with app control and mapping.',
    category: 'Electronics',
  },
  {
    id: 7,
    name: 'Coffee Maker',
    price: 89.99,
    rating: 4.4,
    reviews: 1234,
    image: 'https://images.pexels.com/photos/6803503/pexels-photo-6803503.jpeg',
    description: 'Programmable coffee maker with thermal carafe.',
    category: 'Home',
  },
  {
    id: 8,
    name: 'Air Fryer',
    price: 69.99,
    rating: 4.6,
    reviews: 2345,
    image: 'https://images.pexels.com/photos/6996101/pexels-photo-6996101.jpeg',
    description: 'Digital air fryer with multiple cooking functions.',
    category: 'Home',
  }
];

// Categories
const categories = [
  { id: 'electronics', name: 'Electronics', icon: '🖥️' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'jewelry', name: 'Jewelry', icon: '💍' },
  { id: 'home', name: 'Home & Living', icon: '🏠' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  await delay(1000);
  return dummyProducts;
};

// Get product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  await delay(500);
  return dummyProducts.find(product => product.id === id);
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(800);
  return dummyProducts.filter(product => product.category === category);
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(600);
  return dummyProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description?.toLowerCase().includes(query.toLowerCase())
  );
};

// Get trending products
export const getTrendingProducts = async (): Promise<Product[]> => {
  await delay(800);
  return dummyProducts.sort((a, b) => b.reviews - a.reviews).slice(0, 4);
};

// Get best sellers
export const getBestSellers = async (): Promise<Product[]> => {
  await delay(800);
  return dummyProducts.sort((a, b) => b.rating - a.rating).slice(0, 4);
};

// Get new arrivals
export const getNewArrivals = async (): Promise<Product[]> => {
  await delay(800);
  return dummyProducts.slice(-4);
};

// Get daily deals
export const getDailyDeals = async (): Promise<Product[]> => {
  await delay(800);
  return dummyProducts
    .map(product => ({
      ...product,
      oldPrice: product.price * 1.2,
      timeLeft: '08:45:30'
    }))
    .slice(0, 3);
};

// Get recommendations
export const getRecommendations = async (): Promise<Product[]> => {
  await delay(800);
  return dummyProducts.sort(() => Math.random() - 0.5).slice(0, 4);
};

// Get all categories
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 300);
  });
};

// Mock user authentication API
export const userApi = {
  login: (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'user@example.com' && password === 'password') {
          resolve({
            id: '1',
            email,
            name: 'Demo User',
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  },
  
  register: (name: string, email: string, password: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          email,
          name,
        });
      }, 1000);
    });
  },
};