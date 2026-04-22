import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register Controller
export const register = async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    const user = new User({ email, password, username, firstName, lastName, role });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const wantsJson = req.get('Accept')?.includes('application/json');

    if (!user) {
      if (wantsJson) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      return res.render('login', { title: 'Login — TESA OAU', error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      if (wantsJson) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      return res.render('login', { title: 'Login — TESA OAU', error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const sessionUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    if (!req.session) {
      throw new Error('Session is not initialized. Did you forget to use express-session middleware?');
    }

    req.session.user = sessionUser;

    if (wantsJson) {
      return res.json({ user: sessionUser, token });
    }

    return res.redirect('/dashboard');
  } catch (error) {
    if (req.get('Accept')?.includes('application/json')) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).render('login', { title: 'Login — TESA OAU', error: 'Unable to login. Please try again.' });
  }
};
