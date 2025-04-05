import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json, jsonb } from "drizzle-orm/pg-core";
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

// Define type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
