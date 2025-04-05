import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for both farmers and customers)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("customer"), // farmer or customer
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  farmName: text("farm_name"), // for farmers only
  farmDescription: text("farm_description"), // for farmers only
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow()
});

// Product categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  iconBgColor: text("icon_bg_color").notNull(),
  iconTextColor: text("icon_text_color").notNull()
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  unit: text("unit").notNull(), // lb, basket, dozen, etc.
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  farmerId: integer("farmer_id").notNull(),
  categoryId: integer("category_id").notNull(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, canceled
  total: doublePrecision("total").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  paymentMethod: text("payment_method").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  farmerId: integer("farmer_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  status: text("status").notNull().default("pending") // pending, processing, shipped, delivered, canceled
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow()
});

// Farmers
export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  farmName: text("farm_name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  specialties: json("specialties").notNull().$type<string[]>(), // Array of specialties (tags)
  featured: boolean("featured").default(false)
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  customerType: text("customer_type"), // e.g., "Loyal customer for 2 years", "Weekly subscriber"
  featured: boolean("featured").default(false)
});

// Insertion schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertFarmerSchema = createInsertSchema(farmers).omit({ id: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Farmer = typeof farmers.$inferSelect;
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
