import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
  insertFarmerSchema,
  insertTestimonialSchema
} from "@shared/schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Authentication middleware
const authenticate = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Farmer authorization middleware
const authorizeFarmer = async (req: Request, res: Response, next: Function) => {
  const user = (req as any).user;
  
  if (user.role !== "farmer") {
    return res.status(403).json({ message: "Access denied. Farmers only." });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username) || 
                           await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Create JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Categories routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Products routes
  app.get("/api/products", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/products/featured", async (_req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/products/category/:categoryId", async (req: Request, res: Response) => {
    try {
      const { categoryId } = req.params;
      const products = await storage.getProductsByCategory(parseInt(categoryId));
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/products", authenticate, authorizeFarmer, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const user = (req as any).user;
      
      // Set the farmerId to the current user's ID
      const product = await storage.createProduct({
        ...productData,
        farmerId: user.id
      });
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/products/:id", authenticate, authorizeFarmer, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const product = await storage.getProduct(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure the farmer owns the product
      if (product.farmerId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this product" });
      }
      
      const updatedProduct = await storage.updateProduct(parseInt(id), req.body);
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/products/:id", authenticate, authorizeFarmer, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const product = await storage.getProduct(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure the farmer owns the product
      if (product.farmerId !== user.id) {
        return res.status(403).json({ message: "Not authorized to delete this product" });
      }
      
      const success = await storage.deleteProduct(parseInt(id));
      
      if (!success) {
        return res.status(400).json({ message: "Failed to delete product" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Cart routes
  app.get("/api/cart", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const cartItems = await storage.getCartItems(user.id);
      
      // Get full product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/cart", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Add to cart
      const cartItem = await storage.addToCart(cartItemData);
      
      // Get the product details
      const cartItemWithProduct = {
        ...cartItem,
        product
      };
      
      res.status(201).json(cartItemWithProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/cart/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(parseInt(id), quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Get the product details
      const product = await storage.getProduct(updatedItem.productId);
      
      const cartItemWithProduct = {
        ...updatedItem,
        product
      };
      
      res.json(cartItemWithProduct);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/cart/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.removeFromCart(parseInt(id));
      
      if (!success) {
        return res.status(400).json({ message: "Failed to remove item from cart" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Orders routes
  app.get("/api/orders", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orders = await storage.getOrders(user.id);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const orderItems = Array.from((await storage.orderItems).values())
            .filter(item => item.orderId === order.id);
            
          // Get product details for each order item
          const itemsWithProducts = await Promise.all(
            orderItems.map(async (item) => {
              const product = await storage.getProduct(item.productId);
              return {
                ...item,
                product
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithProducts
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/orders/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const order = await storage.getOrder(parseInt(id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if order belongs to the user or if user is a farmer with items in this order
      if (order.customerId !== user.id && user.role === "customer") {
        return res.status(403).json({ message: "Not authorized to view this order" });
      }
      
      // Get order items
      const orderItems = Array.from((await storage.orderItems).values())
        .filter(item => item.orderId === order.id);
        
      // If user is a farmer, filter items to only show their own products
      const filteredItems = user.role === "farmer" 
        ? orderItems.filter(item => item.farmerId === user.id) 
        : orderItems;
      
      // Get product details for each order item
      const itemsWithProducts = await Promise.all(
        filteredItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      const orderWithItems = {
        ...order,
        items: itemsWithProducts
      };
      
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/orders", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Get cart items
      const cartItems = await storage.getCartItems(user.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Calculate total
      let total = 0;
      const orderItems: any[] = [];
      
      for (const cartItem of cartItems) {
        const product = await storage.getProduct(cartItem.productId);
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${cartItem.productId}` });
        }
        
        total += product.price * cartItem.quantity;
        
        orderItems.push({
          productId: product.id,
          farmerId: product.farmerId,
          quantity: cartItem.quantity,
          price: product.price,
          status: "pending"
        });
      }
      
      // Validate order data
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: user.id,
        total
      });
      
      // Create order
      const order = await storage.createOrder(orderData, orderItems);
      
      // Clear cart
      await storage.clearCart(user.id);
      
      // Get order with items
      const createdOrderItems = Array.from((await storage.orderItems).values())
        .filter(item => item.orderId === order.id);
      
      // Get product details for each order item
      const itemsWithProducts = await Promise.all(
        createdOrderItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      const orderWithItems = {
        ...order,
        items: itemsWithProducts
      };
      
      res.status(201).json(orderWithItems);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/orders/:id", authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = (req as any).user;
      const order = await storage.getOrder(parseInt(id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Only allow the customer who placed the order to update it
      if (order.customerId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this order" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(parseInt(id), status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Farmer order routes
  app.get("/api/farmer/orders", authenticate, authorizeFarmer, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const orderItems = await storage.getFarmerOrders(user.id);
      
      // Get order and product details for each order item
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item) => {
          const order = await storage.getOrder(item.orderId);
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            order,
            product
          };
        })
      );
      
      res.json(itemsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/farmer/orders/:id", authenticate, authorizeFarmer, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = (req as any).user;
      const orderItem = await storage.orderItems.get(parseInt(id));
      
      if (!orderItem) {
        return res.status(404).json({ message: "Order item not found" });
      }
      
      // Ensure the farmer owns the product in the order item
      if (orderItem.farmerId !== user.id) {
        return res.status(403).json({ message: "Not authorized to update this order item" });
      }
      
      const updatedOrderItem = await storage.updateOrderItemStatus(parseInt(id), status);
      res.json(updatedOrderItem);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Reviews routes
  app.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const reviews = await storage.getProductReviews(parseInt(id));
      
      // Get user details for each review
      const reviewsWithUsers = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            user: user ? {
              id: user.id,
              username: user.username,
              fullName: user.fullName
            } : null
          };
        })
      );
      
      res.json(reviewsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/products/:id/reviews", authenticate, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const product = await storage.getProduct(parseInt(id));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user has already reviewed this product
      const existingReviews = await storage.getProductReviews(parseInt(id));
      const userReview = existingReviews.find(review => review.userId === user.id);
      
      if (userReview) {
        return res.status(400).json({ message: "You have already reviewed this product" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: user.id,
        productId: parseInt(id)
      });
      
      const review = await storage.createReview(reviewData);
      
      // Add user details to response
      const reviewWithUser = {
        ...review,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName
        }
      };
      
      res.status(201).json(reviewWithUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Farmers routes
  app.get("/api/farmers", async (_req: Request, res: Response) => {
    try {
      const farmers = await storage.getFarmers();
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/farmers/featured", async (_req: Request, res: Response) => {
    try {
      const farmers = await storage.getFeaturedFarmers();
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/farmers/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const farmer = await storage.getFarmer(parseInt(id));
      
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      
      // Get farmer's products
      const products = await storage.getProductsByFarmer(farmer.userId);
      
      const farmerWithProducts = {
        ...farmer,
        products
      };
      
      res.json(farmerWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/farmers", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      // Check if user is already registered as a farmer
      const existingFarmer = Array.from((await storage.farmers).values())
        .find(farmer => farmer.userId === user.id);
      
      if (existingFarmer) {
        return res.status(400).json({ message: "You are already registered as a farmer" });
      }
      
      // Update user role to farmer
      await storage.updateUser(user.id, { role: "farmer" });
      
      const farmerData = insertFarmerSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const farmer = await storage.createFarmer(farmerData);
      res.status(201).json(farmer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Testimonials routes
  app.get("/api/testimonials", async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      
      // Get user details for each testimonial
      const testimonialsWithUsers = await Promise.all(
        testimonials.map(async (testimonial) => {
          const user = await storage.getUser(testimonial.userId);
          return {
            ...testimonial,
            user: user ? {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              profileImage: user.profileImage
            } : null
          };
        })
      );
      
      res.json(testimonialsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/testimonials/featured", async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      
      // Get user details for each testimonial
      const testimonialsWithUsers = await Promise.all(
        testimonials.map(async (testimonial) => {
          const user = await storage.getUser(testimonial.userId);
          return {
            ...testimonial,
            user: user ? {
              id: user.id,
              username: user.username,
              fullName: user.fullName,
              profileImage: user.profileImage
            } : null
          };
        })
      );
      
      res.json(testimonialsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/testimonials", authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        userId: user.id
      });
      
      const testimonial = await storage.createTestimonial(testimonialData);
      
      // Add user details to response
      const testimonialWithUser = {
        ...testimonial,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          profileImage: user.profileImage
        }
      };
      
      res.status(201).json(testimonialWithUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  return httpServer;
}
