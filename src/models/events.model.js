import mongoose from "mongoose";

const EVENT_MODES = ["physical", "virtual", "hybrid"];
const EVENT_STATUSES = ["completed", "upcoming", "ongoing"];

const eventSchema = new mongoose.Schema(
  {
    featuredImage: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: EVENT_MODES,
      required: true,
    },
    venueLocation: {
      type: String,
      required: function() { return this.mode === "physical" || this.mode === "hybrid"; },
    },
    onlineLink: {
      type: String,
      required: function() { return this.mode === "virtual" || this.mode === "hybrid"; },
    },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      required: true,
    },
    registrationLink: {
      type: String,
      required: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
