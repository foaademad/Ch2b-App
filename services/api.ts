// Mock API service
// In a real app, this would connect to a backend API

// Sample product data
const products = [
  { id: 1, title: 'Smartphone X', price: 699, image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.5 },
  { id: 2, title: 'Laptop Pro', price: 1299, image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.8 },
  { id: 3, title: 'Designer Watch', price: 199, image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'jewelry', rating: 4.2 },
  { id: 4, title: 'Cotton T-Shirt', price: 29, image: 'https://images.pexels.com/photos/5868207/pexels-photo-5868207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'clothing', rating: 4.0 },
  { id: 5, title: 'Smart Speaker', price: 89, image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.3 },
  { id: 6, title: 'Running Shoes', price: 119, image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'sports', rating: 4.6 },
  { id: 7, title: 'Gold Necklace', price: 349, image: 'https://images.pexels.com/photos/10983713/pexels-photo-10983713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'jewelry', rating: 4.7 },
  { id: 8, title: 'Wireless Earbuds', price: 149, image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.4 },
  { id: 9, title: 'Stylish Sunglasses', price: 79, image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'accessories', rating: 4.1 },
  { id: 10, title: 'Smart Watch', price: 249, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.5 },
  { id: 11, title: 'Leather Wallet', price: 59, image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'accessories', rating: 4.2 },
  { id: 12, title: 'Fitness Tracker', price: 79, image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.3 },
  { id: 13, title: 'Smart Watch', price: 249, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.5 },
  { id: 14, title: 'Leather Wallet', price: 59, image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'accessories', rating: 4.2 },
  { id: 15, title: 'Fitness Tracker', price: 79, image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.3 },
  { id: 16, title: 'Smart Watch', price: 249, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.5 },
  { id: 17, title: 'Leather Wallet', price: 59, image: 'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'accessories', rating: 4.2 },
  { id: 18, title: 'Fitness Tracker', price: 79, image: 'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', category: 'electronics', rating: 4.3 },
]
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

// Get all products with delay to simulate network request
export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};

// Get product by ID
export const getProductById = (id: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find(p => p.id.toString() === id.toString());
      resolve(product || null);
    }, 300);
  });
};

// Get products by category
export const getProductsByCategory = (category: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = products.filter(
        p => category === 'all' || p.category === category
      );
      resolve(filteredProducts);
    }, 500);
  });
};

// Get related products based on category
export const getRelatedProducts = (category: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const relatedProducts = products
        .filter(p => p.category === category)
        .slice(0, 4);
      resolve(relatedProducts);
    }, 300);
  });
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