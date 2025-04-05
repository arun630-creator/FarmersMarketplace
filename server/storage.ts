import { 
  users, User, InsertUser, 
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  carts, Cart, InsertCart,
  cartItems, CartItem, InsertCartItem,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  reviews, Review, InsertReview
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getFarmers(): Promise<User[]>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByFarmer(farmerId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Cart operations
  getCart(userId: number): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(cartId: number): Promise<boolean>;

  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getFarmerOrders(farmerId: number): Promise<Order[]>;

  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private categoriesData: Map<number, Category>;
  private productsData: Map<number, Product>;
  private cartsData: Map<number, Cart>;
  private cartItemsData: Map<number, CartItem>;
  private ordersData: Map<number, Order>;
  private orderItemsData: Map<number, OrderItem>;
  private reviewsData: Map<number, Review>;
  
  sessionStore: any;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private cartIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private reviewIdCounter: number;

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
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with sample categories
    this.seedCategories();
  }

  private seedCategories() {
    const categories: InsertCategory[] = [
      { name: "Vegetables", description: "Fresh, locally grown vegetables", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf" },
      { name: "Fruits", description: "Seasonal and exotic fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b" },
      { name: "Grains", description: "Wholesome grains and cereals", image: "https://images.unsplash.com/photo-1602087594298-706cce33e523" },
      { name: "Dairy", description: "Farm fresh dairy products", image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b" },
      { name: "Honey", description: "Organic and raw honey products", image: "https://images.unsplash.com/photo-1550828520-4cb496926fc9" },
      { name: "Eggs", description: "Free-range eggs", image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const created = new Date();
    // Set default values for required fields
    const newUser: User = {
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

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  async getFarmers(): Promise<User[]> {
    return Array.from(this.usersData.values()).filter(
      (user) => user.role === "farmer"
    );
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesData.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesData.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = { 
      ...category, 
      id,
      description: category.description || null,
      image: category.image || null
    };
    this.categoriesData.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.productsData.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsData.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.productsData.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsByFarmer(farmerId: number): Promise<Product[]> {
    return Array.from(this.productsData.values()).filter(
      (product) => product.farmerId === farmerId
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const created = new Date();
    const newProduct: Product = { 
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

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.productsData.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.productsData.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.productsData.delete(id);
  }

  // Cart operations
  async getCart(userId: number): Promise<Cart | undefined> {
    return Array.from(this.cartsData.values()).find(
      (cart) => cart.userId === userId
    );
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const id = this.cartIdCounter++;
    const created = new Date();
    const newCart: Cart = { ...cart, id, created };
    this.cartsData.set(id, newCart);
    return newCart;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItemsData.values()).filter(
      (item) => item.cartId === cartId
    );
  }

  async addCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = { ...cartItem, id };
    this.cartItemsData.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemsData.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItemsData.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItemsData.delete(id);
  }

  async clearCart(cartId: number): Promise<boolean> {
    let success = true;
    const cartItems = await this.getCartItems(cartId);
    
    for (const item of cartItems) {
      const deleted = await this.removeCartItem(item.id);
      if (!deleted) success = false;
    }
    
    return success;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.ordersData.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.ordersData.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const created = new Date();
    const newOrder: Order = { 
      ...order, 
      id, 
      created: created, 
      status: order.status || "pending"
    };
    this.ordersData.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.ordersData.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.ordersData.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItemsData.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItemsData.set(id, newOrderItem);
    return newOrderItem;
  }

  async getFarmerOrders(farmerId: number): Promise<Order[]> {
    // Get all order items for this farmer
    const farmerOrderItems = Array.from(this.orderItemsData.values()).filter(
      (item) => item.farmerId === farmerId
    );
    
    // Get unique order IDs
    const orderIds = new Set(farmerOrderItems.map(item => item.orderId));
    
    // Get orders by IDs
    return Array.from(orderIds).map(orderId => this.ordersData.get(orderId)!).filter(Boolean);
  }

  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviewsData.values()).filter(
      (review) => review.productId === productId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const created = new Date();
    const newReview: Review = { 
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
