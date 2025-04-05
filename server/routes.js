import { createServer } from "http";
import { storage } from "./storage.js";
import { setupAuth } from "./auth.js";
import { 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema,
  insertReviewSchema
} from "@shared/schema.js";

/**
 * Register all routes for the Express app
 * @param {import('express').Express} app - The Express app
 * @returns {import('http').Server} - The HTTP server
 */
export async function registerRoutes(app) {
  // Setup authentication routes
  setupAuth(app);

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.getCategory(categoryId);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      let products;
      
      if (req.query.categoryId) {
        const categoryId = parseInt(req.query.categoryId);
        products = await storage.getProductsByCategory(categoryId);
      } else if (req.query.farmerId) {
        const farmerId = parseInt(req.query.farmerId);
        products = await storage.getProductsByFarmer(farmerId);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can create products" });
    }

    try {
      const productData = insertProductSchema.parse(req.body);
      productData.farmerId = req.user.id; // Set farmer ID from authenticated user
      
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can update products" });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure farmer can only update their own products
      if (product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You can only update your own products" });
      }
      
      const updatedProduct = await storage.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can delete products" });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Ensure farmer can only delete their own products
      if (product.farmerId !== req.user.id) {
        return res.status(403).json({ message: "You can only delete your own products" });
      }
      
      const success = await storage.deleteProduct(productId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to delete product" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Farmers routes
  app.get("/api/farmers", async (req, res) => {
    try {
      const farmers = await storage.getFarmers();
      
      // Filter out sensitive information
      const sanitizedFarmers = farmers.map(farmer => ({
        id: farmer.id,
        name: farmer.name,
        bio: farmer.bio,
        profileImage: farmer.profileImage
      }));
      
      res.json(sanitizedFarmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmers" });
    }
  });

  app.get("/api/farmers/:id", async (req, res) => {
    try {
      const farmerId = parseInt(req.params.id);
      const farmer = await storage.getUser(farmerId);
      
      if (!farmer || farmer.role !== "farmer") {
        return res.status(404).json({ message: "Farmer not found" });
      }
      
      // Filter out sensitive information
      const sanitizedFarmer = {
        id: farmer.id,
        name: farmer.name,
        bio: farmer.bio,
        profileImage: farmer.profileImage
      };
      
      res.json(sanitizedFarmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to access your cart" });
    }

    try {
      const userId = req.user.id;
      let cart = await storage.getCart(userId);
      
      // Create cart if it doesn't exist
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each cart item
      const cartItemsWithProduct = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        id: cart.id,
        items: cartItemsWithProduct,
        total: cartItemsWithProduct.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart/items", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to add items to your cart" });
    }

    try {
      const userId = req.user.id;
      let cart = await storage.getCart(userId);
      
      // Create cart if it doesn't exist
      if (!cart) {
        cart = await storage.createCart({ userId });
      }
      
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        cartId: cart.id
      });
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if product is in stock
      if (product.stock < cartItemData.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Check if product already in cart
      const cartItems = await storage.getCartItems(cart.id);
      const existingItem = cartItems.find(item => item.productId === cartItemData.productId);
      
      let cartItem;
      if (existingItem) {
        // Update quantity if product already in cart
        const newQuantity = existingItem.quantity + cartItemData.quantity;
        
        // Check if new quantity exceeds stock
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
        
        cartItem = await storage.updateCartItem(existingItem.id, newQuantity);
      } else {
        // Add new item to cart
        cartItem = await storage.addCartItem({
          ...cartItemData,
          price: product.price
        });
      }
      
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to update cart items" });
    }

    try {
      const itemId = parseInt(req.params.id);
      const quantity = parseInt(req.body.quantity);
      
      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
      
      // Get cart item
      const userId = req.user.id;
      const cart = await storage.getCart(userId);
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      const cartItem = cartItems.find(item => item.id === itemId);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Check if product has enough stock
      const product = await storage.getProduct(cartItem.productId);
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      
      // Update cart item
      const updatedItem = await storage.updateCartItem(itemId, quantity);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to remove cart items" });
    }

    try {
      const itemId = parseInt(req.params.id);
      
      // Get cart item
      const userId = req.user.id;
      const cart = await storage.getCart(userId);
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      const cartItem = cartItems.find(item => item.id === itemId);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      // Remove cart item
      const success = await storage.removeCartItem(itemId);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to remove cart item" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to clear your cart" });
    }

    try {
      const userId = req.user.id;
      const cart = await storage.getCart(userId);
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Clear cart
      const success = await storage.clearCart(cart.id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(500).json({ message: "Failed to clear cart" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to access orders" });
    }

    try {
      const userId = req.user.id;
      let orders;
      
      // If user is a farmer, get orders for their products
      if (req.user.role === "farmer") {
        orders = await storage.getFarmerOrders(userId);
      } else {
        // Otherwise get user's orders
        orders = await storage.getOrders(userId);
      }
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to access orders" });
    }

    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user has access to this order
      const userId = req.user.id;
      const userRole = req.user.role;
      
      if (order.userId !== userId && userRole !== "farmer") {
        return res.status(403).json({ message: "You don't have access to this order" });
      }
      
      // If user is a farmer, check if they have products in this order
      if (userRole === "farmer") {
        const orderItems = await storage.getOrderItems(orderId);
        const hasFarmerItems = orderItems.some(item => item.farmerId === userId);
        
        if (!hasFarmerItems) {
          return res.status(403).json({ message: "You don't have access to this order" });
        }
      }
      
      // Get order items
      const items = await storage.getOrderItems(orderId);
      
      // Get product details for each order item
      const itemsWithProduct = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json({
        ...order,
        items: itemsWithProduct
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create an order" });
    }

    try {
      const userId = req.user.id;
      
      // Get user's cart
      const cart = await storage.getCart(userId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
      }
      
      // Calculate total
      let total = 0;
      
      // Check product availability and calculate total
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
          });
        }
        
        total += item.price * item.quantity;
      }
      
      // Create order
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
        total
      });
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          farmerId: product.farmerId,
          quantity: item.quantity,
          price: item.price
        });
        
        // Update product stock
        await storage.updateProduct(item.productId, {
          stock: product.stock - item.quantity
        });
      }
      
      // Clear cart
      await storage.clearCart(cart.id);
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only farmers can update order status" });
    }

    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["processing", "shipped", "delivered", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if farmer has products in this order
      const orderItems = await storage.getOrderItems(orderId);
      const farmerId = req.user.id;
      const hasFarmerItems = orderItems.some(item => item.farmerId === farmerId);
      
      if (!hasFarmerItems) {
        return res.status(403).json({ message: "You don't have access to this order" });
      }
      
      // Update order status
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const reviews = await storage.getProductReviews(productId);
      
      // Get user details for each review
      const reviewsWithUser = await Promise.all(
        reviews.map(async (review) => {
          const user = await storage.getUser(review.userId);
          return {
            ...review,
            username: user ? user.username : null,
            userProfileImage: user ? user.profileImage : null
          };
        })
      );
      
      res.json(reviewsWithUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to leave a review" });
    }

    try {
      const productId = parseInt(req.params.id);
      const userId = req.user.id;
      
      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if user has ordered this product
      const userOrders = await storage.getOrders(userId);
      let hasOrdered = false;
      
      for (const order of userOrders) {
        const orderItems = await storage.getOrderItems(order.id);
        if (orderItems.some(item => item.productId === productId)) {
          hasOrdered = true;
          break;
        }
      }
      
      if (!hasOrdered) {
        return res.status(403).json({ message: "You can only review products you've purchased" });
      }
      
      // Check if user already reviewed this product
      const productReviews = await storage.getProductReviews(productId);
      const existingReview = productReviews.find(review => review.userId === userId);
      
      if (existingReview) {
        return res.status(400).json({ message: "You've already reviewed this product" });
      }
      
      // Create review
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
        productId
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}