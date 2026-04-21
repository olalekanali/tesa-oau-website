import mongoose from "mongoose";

const executiveSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, required: true }, // store filename or relative path
});

const Executive = mongoose.model("Executive", executiveSchema);
export default Executive;