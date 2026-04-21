import Event from "../models/events.model.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { featuredImage, title, description, date, startTime, mode, venueLocation, onlineLink, status, registrationLink } = req.body;
    const event = new Event({
      featuredImage,
      title,
      description,
      date,
      startTime,
      mode,
      venueLocation: mode === "physical" || mode === "hybrid" ? venueLocation : undefined,
      onlineLink: mode === "virtual" || mode === "hybrid" ? onlineLink : undefined,
      status,
      registrationLink,
      creator: req.user._id,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Events (with optional filtering)
export const getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const events = await Event.find(filter).populate("creator", "username email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("creator", "username email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const { featuredImage, title, description, date, startTime, mode, venueLocation, onlineLink, status, registrationLink } = req.body;
    if (featuredImage !== undefined) event.featuredImage = featuredImage;
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (startTime !== undefined) event.startTime = startTime;
    if (mode !== undefined) event.mode = mode;
    if (venueLocation !== undefined) event.venueLocation = venueLocation;
    if (onlineLink !== undefined) event.onlineLink = onlineLink;
    if (status !== undefined) event.status = status;
    if (registrationLink !== undefined) event.registrationLink = registrationLink;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
