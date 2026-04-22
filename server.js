import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './src/config/db.config.js';
import articleRoutes from './src/routes/article.route.js';
import authRoutes from './src/routes/auth.route.js';
import eventRoutes from './src/routes/event.route.js'
import executiveRoutes from './src/routes/executive.route.js'
import { register, login } from './src/controllers/authController.js';
import session from 'express-session';
import jwt from 'jsonwebtoken';

import Article from './src/models/article.model.js';
import Event from './src/models/events.model.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/executives', executiveRoutes)

// Home route
app.get('/', (req, res) => {
    res.render('index', { title: 'TESA OAU', user: req.session?.user });
});

// Auth routes (for page rendering)
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login — TESA OAU' });
});

app.get('/register', (req, res) => {
    res.render('signup', { title: 'Sign Up — TESA OAU' });
});

app.get('/logout', (req, res) => {
    if (!req.session) return res.redirect('/');

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session during logout:', err);
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Auth POST routes
app.post('/login', login);

// Unify /signup and /register
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up — TESA OAU' });
});
app.post('/signup', async (req, res, next) => {
    req.url = '/register';
    next();
});
app.post('/register', async (req, res, next) => {
    try {
        const { email, password, username, firstName, lastName, role } = req.body;
        const User = (await import('./src/models/user.js')).default;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                return res.status(400).json({ message: 'Email or username already exists' });
            }
            return res.render('signup', { title: 'Sign Up — TESA OAU', error: 'Email or username already exists' });
        }
        const user = new User({ email, password, username, firstName, lastName, role });
        await user.save();
        safeSetSessionUser(req, {
            _id: user._id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        });
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(201).json({ user: req.session.user, token });
        }
        res.redirect('/dashboard');
    } catch (err) {
        next(err);
    }
});

// Dashboard route (protected)
function requireAuth(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}
app.get('/dashboard', requireAuth, (req, res) => {
    res.render('dashboard', { title: 'Dashboard — TESA OAU', user: req.session.user });
});

// All Articles Page
app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.render('all-articles', {
            title: 'All Articles — TESA OAU',
            articles
        });
    } catch (error) {
        console.error(error);
        res.render('all-articles', {
            title: 'All Articles — TESA OAU',
            articles: []
        });
    }
});

// Single Article Page
app.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username email');
        if (!article) {
            return res.status(404).render('article-detail', {
                title: 'Article Not Found',
                article: null
            });
        }
        res.render('article-detail', {
            title: `${article.title} — TESA OAU`,
            article
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('article-detail', {
            title: 'Error Loading Article',
            article: null
        });
    }
});

// All Events Page
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.render('all-events', {
            title: 'All Events — TESA OAU',
            events
        });
    } catch (error) {
        console.error(error);
        res.render('all-events', {
            title: 'All Events — TESA OAU',
            events: []
        });
    }
});

// Single Event Page
app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('creator', 'username email');
        if (!event) {
            return res.status(404).render('event-detail', {
                title: 'Event Not Found',
                event: null
            });
        }
        res.render('event-detail', {
            title: `${event.title} — TESA OAU`,
            event
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('event-detail', {
            title: 'Error Loading Event',
            event: null
        });
    }
});

const PORT = process.env.PORT;   
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Ensure session is initialized before setting req.session.user
function safeSetSessionUser(req, userObj) {
  if (!req.session) throw new Error('Session is not initialized. Did you forget to use express-session middleware?');
  req.session.user = userObj;
}