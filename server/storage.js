import { 
  users, insertUserSchema,
  categories, insertCategorySchema,
  products, insertProductSchema,
  carts, insertCartSchema,
  cartItems, insertCartItemSchema,
  orders, insertOrderSchema,
  orderItems, insertOrderItemSchema,
  reviews, insertReviewSchema
} from "@shared/schema.js";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

/**
 * @typedef {import('../shared/schema').User} User
 * @typedef {import('../shared/schema').Category} Category
 * @typedef {import('../shared/schema').Product} Product
 * @typedef {import('../shared/schema').Cart} Cart
 * @typedef {import('../shared/schema').CartItem} CartItem
 * @typedef {import('../shared/schema').Order} Order
 * @typedef {import('../shared/schema').OrderItem} OrderItem
 * @typedef {import('../shared/schema').Review} Review
 */

// Storage class implementation
export class MemStorage {
  constructor() {
    this.usersData = new Map();
    this.categoriesData = new Map();
    this.productsData = new Map();
    this.cartsData = new Map();
    this.cartItemsData = new Map();
    this.ordersData = new Map();
    this.orderItemsData = new Map();
    this.reviewsData = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.cartIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.reviewIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Seed some sample data
    this.seedCategories();
    this.seedFarmers().then(() => {
      this.seedProducts();
    });
  }

  /**
   * Seeds categories with sample data
   * @private
   */
  seedCategories() {
    const categories = [
      { name: "Vegetables", description: "Fresh, locally grown vegetables", image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80" },
      { name: "Fruits", description: "Seasonal and exotic fruits", image: "https://images.unsplash.com/photo-1610397962076-02407a169a5b?q=80" },
      { name: "Grains", description: "Wholesome grains and cereals", image: "https://cdn.pixabay.com/photo/2014/12/11/02/55/cereals-563796_1280.jpg" },
      { name: "Dairy", description: "Farm fresh dairy products", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80" },
      { name: "Honey", description: "Organic and raw honey products", image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80" },
      { name: "Eggs", description: "Free-range eggs", image: "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?q=80" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
  }
  
  /**
   * Seeds farmers with sample data
   * @private
   */
  async seedFarmers() {
    const farmers = [
      {
        username: "sarahfarms",
        password: "$2b$10$RiU.R2lWc5tH.P1/ArWJ.ux.N5kQYz/I0X.Ih/cHcHZBEsyNmFkuS", // "farmerpw"
        email: "sarah@greenfarms.com",
        name: "Sarah Green",
        role: "farmer",
        bio: "Third-generation farmer specializing in organic vegetables. Our farm has been in the family for over 70 years, practicing sustainable agriculture.",
        profileImage: "https://images.unsplash.com/photo-1607611439230-fcbf50e42f5c"
      },
      {
        username: "johndairy",
        password: "$2b$10$RiU.R2lWc5tH.P1/ArWJ.ux.N5kQYz/I0X.Ih/cHcHZBEsyNmFkuS", // "farmerpw"
        email: "john@happycows.com",
        name: "John Miller",
        role: "farmer",
        bio: "Dairy farmer with a focus on ethical animal care. Our cows graze on open pastures and are treated like family, resulting in the highest quality milk products.",
        profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
      },
      {
        username: "mapleorchards",
        password: "$2b$10$RiU.R2lWc5tH.P1/ArWJ.ux.N5kQYz/I0X.Ih/cHcHZBEsyNmFkuS", // "farmerpw"
        email: "emily@mapleorchards.com",
        name: "Emily Johnson",
        role: "farmer",
        bio: "Fruit orchards maintained using integrated pest management. Our apples, peaches, and berries are grown with minimal intervention and maximum flavor.",
        profileImage: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463"
      }
    ];
  
    for (const farmer of farmers) {
      await this.createUser(farmer);
    }
  }
  
  /**
   * Seeds products with sample data
   * @private
   */
  async seedProducts() {
    const products = [
      {
        name: "Organic Carrots",
        description: "Sweet and crunchy organic carrots harvested fresh from our farm.",
        price: 2.99,
        unit: "bunch",
        farmerId: 1,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80",
        stock: 50,
        isOrganic: true,
        tags: ["Organic", "Seasonal"]
      },
      {
        name: "Fresh Spinach",
        description: "Nutrient-rich dark leafy greens perfect for salads and cooking.",
        price: 3.49,
        unit: "bag",
        farmerId: 1,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb",
        stock: 30,
        isOrganic: true,
        tags: ["Organic", "Leafy Greens"]
      },
      {
        name: "Heirloom Tomatoes",
        description: "Colorful variety of heritage tomatoes bursting with flavor.",
        price: 4.99,
        unit: "lb",
        farmerId: 1,
        categoryId: 1,
        image: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924",
        stock: 25,
        isOrganic: true,
        tags: ["Heirloom", "Seasonal"]
      },
      {
        name: "Artisanal Cheese",
        description: "Small-batch aged cheese made from our own grass-fed cows' milk.",
        price: 6.99,
        unit: "piece",
        farmerId: 2,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
        stock: 15,
        isOrganic: false,
        tags: ["Artisanal", "Grass-fed"]
      },
      {
        name: "Fresh Milk",
        description: "Creamy whole milk from pasture-raised cows, bottled on our farm.",
        price: 4.49,
        unit: "quart",
        farmerId: 2,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b",
        stock: 20,
        isOrganic: true,
        tags: ["Grass-fed", "Raw"]
      },
      {
        name: "Greek Yogurt",
        description: "Thick, protein-rich yogurt made using traditional methods.",
        price: 5.49,
        unit: "tub",
        farmerId: 2,
        categoryId: 4,
        image: "https://images.unsplash.com/photo-1488477181946-6428eeb47fcc",
        stock: 15,
        isOrganic: true,
        tags: ["Probiotic", "High-protein"]
      },
      {
        name: "Fresh Apples",
        description: "Crisp and juicy apples picked at peak ripeness from our orchards.",
        price: 3.99,
        unit: "lb",
        farmerId: 3,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb",
        stock: 40,
        isOrganic: true,
        tags: ["Seasonal", "Fresh-picked"]
      },
      {
        name: "Mixed Berries",
        description: "Assortment of sweet strawberries, blueberries, and blackberries.",
        price: 5.99,
        unit: "pint",
        farmerId: 3,
        categoryId: 2,
        image: "https://images.unsplash.com/photo-1563746924237-f4471ca64673",
        stock: 15,
        isOrganic: true,
        tags: ["Antioxidant-rich", "Seasonal"]
      }
    ];

    for (const product of products) {
      await this.createProduct(product);
    }
  }

  // User operations
  /**
   * Get a user by ID
   * @param {number} id - The user ID
   * @returns {Promise<User|undefined>}
   */
  async getUser(id) {
    return this.usersData.get(id);
  }

  /**
   * Get a user by username
   * @param {string} username - The username
   * @returns {Promise<User|undefined>}
   */
  async getUserByUsername(username) {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  /**
   * Get a user by email
   * @param {string} email - The email
   * @returns {Promise<User|undefined>}
   */
  async getUserByEmail(email) {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  /**
   * Create a new user
   * @param {Object} user - The user data
   * @returns {Promise<User>}
   */
  async createUser(user) {
    const id = this.userIdCounter++;
    const created = new Date();
    // Set default values for required fields
    const newUser = {
      ...user,
      id,
      created,
      role: user.role || "customer", // Default role
      address: user.address || null,
      phone: user.phone || null,
      bio: user.bio || null,
      profileImage: user.profileImage || null
    };
    this.usersData.set(id, newUser);
    return newUser;
  }

  /**
   * Update a user
   * @param {number} id - The user ID
   * @param {Object} userData - The user data to update
   * @returns {Promise<User|undefined>}
   */
  async updateUser(id, userData) {
    const user = this.usersData.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  /**
   * Get all farmers
   * @returns {Promise<User[]>}
   */
  async getFarmers() {
    return Array.from(this.usersData.values()).filter(
      (user) => user.role === "farmer"
    );
  }

  // Category operations
  /**
   * Get all categories
   * @returns {Promise<Category[]>}
   */
  async getCategories() {
    return Array.from(this.categoriesData.values());
  }

  /**
   * Get a category by ID
   * @param {number} id - The category ID
   * @returns {Promise<Category|undefined>}
   */
  async getCategory(id) {
    return this.categoriesData.get(id);
  }

  /**
   * Create a new category
   * @param {Object} category - The category data
   * @returns {Promise<Category>}
   */
  async createCategory(category) {
    const id = this.categoryIdCounter++;
    const newCategory = { 
      ...category, 
      id,
      description: category.description || null,
      image: category.image || null
    };
    this.categoriesData.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  /**
   * Get all products
   * @returns {Promise<Product[]>}
   */
  async getProducts() {
    return Array.from(this.productsData.values());
  }

  /**
   * Get a product by ID
   * @param {number} id - The product ID
   * @returns {Promise<Product|undefined>}
   */
  async getProduct(id) {
    return this.productsData.get(id);
  }

  /**
   * Get products by category
   * @param {number} categoryId - The category ID
   * @returns {Promise<Product[]>}
   */
  async getProductsByCategory(categoryId) {
    return Array.from(this.productsData.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  /**
   * Get products by farmer
   * @param {number} farmerId - The farmer ID
   * @returns {Promise<Product[]>}
   */
  async getProductsByFarmer(farmerId) {
    return Array.from(this.productsData.values()).filter(
      (product) => product.farmerId === farmerId
    );
  }

  /**
   * Create a new product
   * @param {Object} product - The product data
   * @returns {Promise<Product>}
   */
  async createProduct(product) {
    const id = this.productIdCounter++;
    const created = new Date();
    const newProduct = { 
      ...product, 
      id, 
      created, 
      image: product.image || null,
      stock: product.stock || 0,
      isOrganic: product.isOrganic || null,
      tags: product.tags || null
    };
    this.productsData.set(id, newProduct);
    return newProduct;
  }

  /**
   * Update a product
   * @param {number} id - The product ID
   * @param {Object} productData - The product data to update
   * @returns {Promise<Product|undefined>}
   */
  async updateProduct(id, productData) {
    const product = this.productsData.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.productsData.set(id, updatedProduct);
    return updatedProduct;
  }

  /**
   * Delete a product
   * @param {number} id - The product ID
   * @returns {Promise<boolean>}
   */
  async deleteProduct(id) {
    return this.productsData.delete(id);
  }

  // Cart operations
  /**
   * Get a user's cart
   * @param {number} userId - The user ID
   * @returns {Promise<Cart|undefined>}
   */
  async getCart(userId) {
    return Array.from(this.cartsData.values()).find(
      (cart) => cart.userId === userId
    );
  }

  /**
   * Create a new cart
   * @param {Object} cart - The cart data
   * @returns {Promise<Cart>}
   */
  async createCart(cart) {
    const id = this.cartIdCounter++;
    const created = new Date();
    const newCart = { ...cart, id, created };
    this.cartsData.set(id, newCart);
    return newCart;
  }

  /**
   * Get items in a cart
   * @param {number} cartId - The cart ID
   * @returns {Promise<CartItem[]>}
   */
  async getCartItems(cartId) {
    return Array.from(this.cartItemsData.values()).filter(
      (item) => item.cartId === cartId
    );
  }

  /**
   * Add an item to a cart
   * @param {Object} cartItem - The cart item data
   * @returns {Promise<CartItem>}
   */
  async addCartItem(cartItem) {
    const id = this.cartItemIdCounter++;
    const newCartItem = { ...cartItem, id };
    this.cartItemsData.set(id, newCartItem);
    return newCartItem;
  }

  /**
   * Update a cart item quantity
   * @param {number} id - The cart item ID
   * @param {number} quantity - The new quantity
   * @returns {Promise<CartItem|undefined>}
   */
  async updateCartItem(id, quantity) {
    const cartItem = this.cartItemsData.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItemsData.set(id, updatedCartItem);
    return updatedCartItem;
  }

  /**
   * Remove an item from a cart
   * @param {number} id - The cart item ID
   * @returns {Promise<boolean>}
   */
  async removeCartItem(id) {
    return this.cartItemsData.delete(id);
  }

  /**
   * Clear all items from a cart
   * @param {number} cartId - The cart ID
   * @returns {Promise<boolean>}
   */
  async clearCart(cartId) {
    let success = true;
    const cartItems = await this.getCartItems(cartId);
    
    for (const item of cartItems) {
      const deleted = await this.removeCartItem(item.id);
      if (!deleted) success = false;
    }
    
    return success;
  }

  // Order operations
  /**
   * Get a user's orders
   * @param {number} userId - The user ID
   * @returns {Promise<Order[]>}
   */
  async getOrders(userId) {
    return Array.from(this.ordersData.values()).filter(
      (order) => order.userId === userId
    );
  }

  /**
   * Get an order by ID
   * @param {number} id - The order ID
   * @returns {Promise<Order|undefined>}
   */
  async getOrder(id) {
    return this.ordersData.get(id);
  }

  /**
   * Create a new order
   * @param {Object} order - The order data
   * @returns {Promise<Order>}
   */
  async createOrder(order) {
    const id = this.orderIdCounter++;
    const created = new Date();
    const newOrder = { 
      ...order, 
      id, 
      created: created, 
      status: order.status || "pending"
    };
    this.ordersData.set(id, newOrder);
    return newOrder;
  }

  /**
   * Update an order's status
   * @param {number} id - The order ID
   * @param {string} status - The new status
   * @returns {Promise<Order|undefined>}
   */
  async updateOrderStatus(id, status) {
    const order = this.ordersData.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.ordersData.set(id, updatedOrder);
    return updatedOrder;
  }

  /**
   * Get items in an order
   * @param {number} orderId - The order ID
   * @returns {Promise<OrderItem[]>}
   */
  async getOrderItems(orderId) {
    return Array.from(this.orderItemsData.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  /**
   * Add an item to an order
   * @param {Object} orderItem - The order item data
   * @returns {Promise<OrderItem>}
   */
  async createOrderItem(orderItem) {
    const id = this.orderItemIdCounter++;
    const newOrderItem = { ...orderItem, id };
    this.orderItemsData.set(id, newOrderItem);
    return newOrderItem;
  }

  /**
   * Get a farmer's orders
   * @param {number} farmerId - The farmer ID
   * @returns {Promise<Order[]>}
   */
  async getFarmerOrders(farmerId) {
    // Get all order items for this farmer
    const farmerOrderItems = Array.from(this.orderItemsData.values()).filter(
      (item) => item.farmerId === farmerId
    );
    
    // Get unique order IDs
    const orderIds = new Set(farmerOrderItems.map(item => item.orderId));
    
    // Get orders by IDs
    return Array.from(orderIds).map(orderId => this.ordersData.get(orderId)).filter(Boolean);
  }

  // Review operations
  /**
   * Get reviews for a product
   * @param {number} productId - The product ID
   * @returns {Promise<Review[]>}
   */
  async getProductReviews(productId) {
    return Array.from(this.reviewsData.values()).filter(
      (review) => review.productId === productId
    );
  }

  /**
   * Create a new review
   * @param {Object} review - The review data
   * @returns {Promise<Review>}
   */
  async createReview(review) {
    const id = this.reviewIdCounter++;
    const created = new Date();
    const newReview = { 
      ...review, 
      id, 
      created,
      comment: review.comment || null
    };
    this.reviewsData.set(id, newReview);
    return newReview;
  }
}

export const storage = new MemStorage();