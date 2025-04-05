import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";

/**
 * @typedef {import('../shared/schema').User} User
 */

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password with salt
 */
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Compare a supplied password with a stored password
 * @param {string} supplied - The password to check
 * @param {string} stored - The stored password hash
 * @returns {Promise<boolean>} - Whether the passwords match
 */
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Set up authentication for the Express app
 * @param {import('express').Express} app - The Express app
 */
export function setupAuth(app) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "farmfresh-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create new user
      const hashedPassword = await hashPassword(req.body.password);
      const userData = {
        ...req.body,
        password: hashedPassword,
      };

      const user = await storage.createUser(userData);
      
      // Create cart for user
      await storage.createCart({ userId: user.id });

      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user;
    res.json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      address: user.address,
      phone: user.phone,
      bio: user.bio,
      profileImage: user.profileImage
    });
  });
}