
import express from "express";
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent } from "../controllers/eventController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import allowOrganiserOrAdmin from "../middlewares/eventRoleMiddleware.js";

const router = express.Router();

// Create Event (organiser/admin only)
router.post("/events", authMiddleware, allowOrganiserOrAdmin, createEvent);
// Update Event (organiser/admin only)
router.put("/events/:id", authMiddleware, allowOrganiserOrAdmin, updateEvent);
// Delete Event (organiser/admin only)
router.delete("/events/:id", authMiddleware, allowOrganiserOrAdmin, deleteEvent);
// Get All Events (with optional filtering)
router.get("/events", getEvents);
// Get Single Event
router.get("/events/:id", getEvent);

export default router;
