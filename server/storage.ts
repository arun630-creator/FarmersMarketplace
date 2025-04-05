import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  reviews, type Review, type InsertReview,
  farmers, type Farmer, type InsertFarmer,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByFarmer(farmerId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart operations
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getFarmerOrders(farmerId: number): Promise<OrderItem[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  updateOrderItemStatus(id: number, status: string): Promise<OrderItem | undefined>;
  
  // Review operations
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Farmer operations
  getFarmers(): Promise<Farmer[]>;
  getFarmer(id: number): Promise<Farmer | undefined>;
  getFeaturedFarmers(): Promise<Farmer[]>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private farmers: Map<number, Farmer>;
  private testimonials: Map<number, Testimonial>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private cartItemId: number;
  private orderId: number;
  private orderItemId: number;
  private reviewId: number;
  private farmerId: number;
  private testimonialId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.farmers = new Map();
    this.testimonials = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.cartItemId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.reviewId = 1;
    this.farmerId = 1;
    this.testimonialId = 1;
    
    // Initialize with some categories
    this.initializeCategories();
  }
  
  private initializeCategories() {
    const categoriesData: InsertCategory[] = [
      { name: 'Vegetables', slug: 'vegetables', icon: 'carrot', iconBgColor: 'bg-primary/10', iconTextColor: 'text-primary' },
      { name: 'Fruits', slug: 'fruits', icon: 'apple-alt', iconBgColor: 'bg-red-100', iconTextColor: 'text-red-500' },
      { name: 'Grains', slug: 'grains', icon: 'wheat-awn', iconBgColor: 'bg-amber-100', iconTextColor: 'text-amber-600' },
      { name: 'Dairy', slug: 'dairy', icon: 'bottle-water', iconBgColor: 'bg-blue-100', iconTextColor: 'text-blue-500' },
      { name: 'Eggs', slug: 'eggs', icon: 'egg', iconBgColor: 'bg-pink-100', iconTextColor: 'text-pink-500' },
      { name: 'Meat', slug: 'meat', icon: 'drumstick-bite', iconBgColor: 'bg-orange-100', iconTextColor: 'text-orange-500' },
      { name: 'Herbs', slug: 'herbs', icon: 'seedling', iconBgColor: 'bg-emerald-100', iconTextColor: 'text-emerald-500' },
      { name: 'Honey', slug: 'honey', icon: 'honey-pot', iconBgColor: 'bg-yellow-100', iconTextColor: 'text-yellow-500' }
    ];
    
    categoriesData.forEach(category => {
      this.createCategory(category);
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const newUser: User = { ...user, id, createdAt: now };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(category => category.slug === slug);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }
  
  async getProductsByFarmer(farmerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.farmerId === farmerId);
  }
  
  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now, 
      rating: 0, 
      reviewCount: 0 
    };
    
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, update: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...update };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Cart operations
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the product is already in the cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === cartItem.userId && item.productId === cartItem.productId
    );
    
    if (existingItem) {
      // Update quantity if already in cart
      return this.updateCartItem(existingItem.id, existingItem.quantity + cartItem.quantity) as Promise<CartItem>;
    }
    
    // Add new item to cart
    const id = this.cartItemId++;
    const now = new Date();
    const newCartItem: CartItem = { ...cartItem, id, createdAt: now };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    let success = true;
    Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .forEach(item => {
        if (!this.cartItems.delete(item.id)) {
          success = false;
        }
      });
    return success;
  }
  
  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.customerId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getFarmerOrders(farmerId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.farmerId === farmerId)
      .sort((a, b) => {
        const orderA = this.orders.get(a.orderId);
        const orderB = this.orders.get(b.orderId);
        if (!orderA || !orderB) return 0;
        return orderB.createdAt.getTime() - orderA.createdAt.getTime();
      });
  }
  
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Create the order
    const id = this.orderId++;
    const now = new Date();
    const newOrder: Order = { ...order, id, createdAt: now };
    this.orders.set(id, newOrder);
    
    // Create the order items
    items.forEach(item => {
      const orderItemId = this.orderItemId++;
      const newOrderItem: OrderItem = { ...item, id: orderItemId, orderId: id };
      this.orderItems.set(orderItemId, newOrderItem);
    });
    
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  async updateOrderItemStatus(id: number, status: string): Promise<OrderItem | undefined> {
    const orderItem = this.orderItems.get(id);
    if (!orderItem) return undefined;
    
    const updatedOrderItem = { ...orderItem, status };
    this.orderItems.set(id, updatedOrderItem);
    return updatedOrderItem;
  }
  
  // Review operations
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const now = new Date();
    const newReview: Review = { ...review, id, createdAt: now };
    this.reviews.set(id, newReview);
    
    // Update product rating
    const product = this.products.get(review.productId);
    if (product) {
      const reviews = await this.getProductReviews(review.productId);
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;
      
      this.updateProduct(review.productId, { 
        rating: Math.round(avgRating * 10) / 10, 
        reviewCount: reviews.length 
      });
    }
    
    return newReview;
  }
  
  // Farmer operations
  async getFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values());
  }
  
  async getFarmer(id: number): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }
  
  async getFeaturedFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values()).filter(farmer => farmer.featured);
  }
  
  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const id = this.farmerId++;
    const newFarmer: Farmer = { ...farmer, id };
    this.farmers.set(id, newFarmer);
    return newFarmer;
  }
  
  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.featured);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
}

export const storage = new MemStorage();
