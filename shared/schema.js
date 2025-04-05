import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model - for both customers and farmers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("customer"), // "customer" or "farmer"
  address: text("address"),
  phone: text("phone"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  created: timestamp("created").defaultNow(),
});

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(), // e.g., "lb", "dozen", "jar"
  image: text("image"),
  stock: integer("stock").notNull().default(0),
  farmerId: integer("farmer_id").notNull(), // references user id
  categoryId: integer("category_id").notNull(), // references category id
  isOrganic: boolean("is_organic").default(false),
  tags: text("tags").array(), // e.g., ["Organic", "Free Range", "Seasonal"]
  created: timestamp("created").defaultNow(),
});

// Cart model
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references user id
  created: timestamp("created").defaultNow(),
});

// Cart Item model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(), // references cart id
  productId: integer("product_id").notNull(), // references product id
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(), // store price at the time of adding to cart
});

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references user id
  status: text("status").notNull().default("pending"), // "pending", "processing", "shipped", "delivered", "cancelled"
  total: doublePrecision("total").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  created: timestamp("created").defaultNow(),
});

// Order Item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(), // references order id
  productId: integer("product_id").notNull(), // references product id
  farmerId: integer("farmer_id").notNull(), // references user id
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(), // store price at the time of ordering
});

// Review model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // references user id
  productId: integer("product_id").notNull(), // references product id
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created: timestamp("created").defaultNow(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created: true
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true, 
  created: true
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  created: true
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  created: true
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  created: true
});

// Instead of TypeScript types, we'll use JSDoc comments for better code assistance

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} password
 * @property {string} email
 * @property {string} name
 * @property {string} role
 * @property {string|null} address
 * @property {string|null} phone
 * @property {string|null} bio
 * @property {string|null} profileImage
 * @property {Date|null} created
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} image
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} unit
 * @property {string|null} image
 * @property {number} stock
 * @property {number} farmerId
 * @property {number} categoryId
 * @property {boolean|null} isOrganic
 * @property {string[]|null} tags
 * @property {Date|null} created
 */

/**
 * @typedef {Object} Cart
 * @property {number} id
 * @property {number} userId
 * @property {Date|null} created
 */

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {number} cartId
 * @property {number} productId
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {number} userId
 * @property {string} status
 * @property {number} total
 * @property {string} address
 * @property {string} phone
 * @property {Date|null} created
 */

/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {number} orderId
 * @property {number} productId
 * @property {number} farmerId
 * @property {number} quantity
 * @property {number} price
 */

/**
 * @typedef {Object} Review
 * @property {number} id
 * @property {number} userId
 * @property {number} productId
 * @property {number} rating
 * @property {string|null} comment
 * @property {Date|null} created
 */