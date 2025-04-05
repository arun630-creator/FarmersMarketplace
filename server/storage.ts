import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  reviews, Review, InsertReview,
  cartItems, CartItem, InsertCartItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByFarmer(farmerId: number): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Review methods
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Cart methods
  getCartItems(sessionId: string): Promise<CartItem[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private categoryId: number;
  private productId: number;
  private orderId: number;
  private orderItemId: number;
  private reviewId: number;
  private cartItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.cartItems = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.productId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.reviewId = 1;
    this.cartItemId = 1;

    // Initialize with some sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample categories
    const categoriesData: InsertCategory[] = [
      { name: "Fruits", slug: "fruits", description: "Fresh fruits from local farms", imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1470&auto=format&fit=crop" },
      { name: "Vegetables", slug: "vegetables", description: "Organic vegetables grown locally", imageUrl: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=1632&auto=format&fit=crop" },
      { name: "Grains", slug: "grains", description: "Locally grown grains and cereals", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b1e?q=80&w=1470&auto=format&fit=crop" },
      { name: "Dairy", slug: "dairy", description: "Farm-fresh dairy products", imageUrl: "https://images.unsplash.com/photo-1628689469838-524a4a973b8e?q=80&w=1470&auto=format&fit=crop" },
      { name: "Herbs", slug: "herbs", description: "Fresh herbs and spices", imageUrl: "https://images.unsplash.com/photo-1583751636853-eda5aa610aaa?q=80&w=1374&auto=format&fit=crop" },
      { name: "Specialty", slug: "specialty", description: "Specialty products from local farms", imageUrl: "https://images.unsplash.com/photo-1627735747011-b8d9089ab95c?q=80&w=1470&auto=format&fit=crop" }
    ];

    categoriesData.forEach(category => {
      this.createCategory(category);
    });

    // Create sample users (farmers and customers)
    const usersData: InsertUser[] = [
      {
        username: "farmerJohn",
        password: "$2a$10$y5yJrG7XF0.TgBxI8xH33.a8/RwwU4.qGfFRm3oxYGK7U73ZONKoO", // "password123"
        email: "john@organicfarm.com",
        firstName: "John",
        lastName: "Smith",
        address: "123 Farm Road",
        city: "Farmville",
        state: "CA",
        zipCode: "95432",
        phone: "555-123-4567",
        isFarmer: true,
        farmName: "John's Organic Farm",
        farmDescription: "Specializing in organic fruits and vegetables grown without harmful pesticides. Our farm has been family-owned for three generations."
      },
      {
        username: "greenValley",
        password: "$2a$10$y5yJrG7XF0.TgBxI8xH33.a8/RwwU4.qGfFRm3oxYGK7U73ZONKoO",
        email: "contact@greenvalley.com",
        firstName: "Sarah",
        lastName: "Johnson",
        address: "456 Dairy Lane",
        city: "Greenfield",
        state: "WI",
        zipCode: "53521",
        phone: "555-987-6543",
        isFarmer: true,
        farmName: "Green Valley Dairy",
        farmDescription: "Our happy cows produce the creamiest milk, yogurt, and cheese. We believe in ethical treatment of animals and sustainable farming practices."
      },
      {
        username: "sunsetApiaries",
        password: "$2a$10$y5yJrG7XF0.TgBxI8xH33.a8/RwwU4.qGfFRm3oxYGK7U73ZONKoO",
        email: "info@sunsetapiaries.com",
        firstName: "Michael",
        lastName: "Williams",
        address: "789 Honey Road",
        city: "Beeville",
        state: "TX",
        zipCode: "78102",
        phone: "555-456-7890",
        isFarmer: true,
        farmName: "Sunset Apiaries",
        farmDescription: "Our bees pollinate local wildflowers to create unique, flavorful honey varieties. We're committed to protecting bee populations."
      },
      {
        username: "customer1",
        password: "$2a$10$y5yJrG7XF0.TgBxI8xH33.a8/RwwU4.qGfFRm3oxYGK7U73ZONKoO",
        email: "customer1@example.com",
        firstName: "Alice",
        lastName: "Brown",
        address: "123 Main St",
        city: "Anytown",
        state: "NY",
        zipCode: "10001",
        phone: "555-111-2222",
        isFarmer: false
      }
    ];

    usersData.forEach(user => {
      this.createUser(user);
    });

    // Create sample products
    const productsData: InsertProduct[] = [
      {
        name: "Organic Apples",
        slug: "organic-apples",
        description: "Fresh organic apples from our orchard. No pesticides used.",
        price: 3.99,
        unit: "kg",
        stock: 100,
        imageUrl: "https://images.unsplash.com/photo-1594062936242-82babba8738c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        categoryId: 1,
        farmerId: 1,
        isFeatured: true
      },
      {
        name: "Fresh Carrots",
        slug: "fresh-carrots",
        description: "Locally grown carrots harvested at peak ripeness.",
        price: 2.49,
        unit: "kg",
        stock: 75,
        imageUrl: "https://images.unsplash.com/photo-1509222796416-4a1fef025e92?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        categoryId: 2,
        farmerId: 1,
        isFeatured: false
      },
      {
        name: "Organic Honey",
        slug: "organic-honey",
        description: "Pure, raw honey made by our happy bees.",
        price: 8.99,
        unit: "500g",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        categoryId: 6,
        farmerId: 3,
        isFeatured: true
      },
      {
        name: "Farm Fresh Eggs",
        slug: "farm-fresh-eggs",
        description: "Free-range eggs from our happy hens.",
        price: 4.50,
        unit: "dozen",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1598170845053-a6b5fd007f93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        categoryId: 4,
        farmerId: 2,
        isFeatured: false
      }
    ];

    productsData.forEach(product => {
      this.createProduct(product);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const newUser: User = { ...user, id, createdAt: now, updatedAt: now };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsByFarmer(farmerId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.farmerId === farmerId
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { ...product, id, createdAt: now, updatedAt: now };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { 
      ...product, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const now = new Date();
    const newOrder: Order = { ...order, id, createdAt: now, updatedAt: now };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      status, 
      updatedAt: new Date() 
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }

  // Review methods
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const now = new Date();
    const newReview: Review = { ...review, id, createdAt: now };
    this.reviews.set(id, newReview);
    return newReview;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const now = new Date();
    const newCartItem: CartItem = { ...cartItem, id, createdAt: now };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem: CartItem = { 
      ...cartItem, 
      quantity
    };
    
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = await this.getCartItems(sessionId);
    cartItems.forEach(item => {
      this.cartItems.delete(item.id);
    });
    return true;
  }
}

export const storage = new MemStorage();
