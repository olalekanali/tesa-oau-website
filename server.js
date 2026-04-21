import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './src/config/db.config.js';
import articleRoutes from './src/routes/article.route.js';
import authRoutes from './src/routes/auth.route.js';
import eventRoutes from './src/routes/event.route.js'
import executiveRoutes from './src/routes/executive.route.js'
import { register, login } from './src/controllers/authController.js';

import Article from './src/models/article.model.js';
import Event from './src/models/events.model.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/executives', executiveRoutes)

// Auth routes (for page rendering)
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login — TESA OAU' });
});

app.get('/register', (req, res) => {
    res.render('signup', { title: 'Sign Up — TESA OAU' });
});

// Auth POST routes
app.post('/login', login);
app.post('/register', register);
app.post('/signup', register); // Alias for /register

app.get('/', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        const events = await Event.find().sort({ date: 1 });

        res.render('index', {
            title: 'TESA OAU Website',
            articles,
            events
        });

    } catch (error) {
        console.error(error);
        res.render('index', {
            title: 'TESA OAU Website',
            articles: [],
            events: []
        });
    }
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