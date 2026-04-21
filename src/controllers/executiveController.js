// Get all executives
export const getExecutives = async (req, res) => {
  try {
    const executives = await Executive.find();
    res.json(executives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single executive
export const getExecutive = async (req, res) => {
  try {
    const executive = await Executive.findById(req.params.id);
    if (!executive) return res.status(404).json({ message: "Executive not found" });
    res.json(executive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update executive
export const updateExecutive = async (req, res) => {
  try {
    const { name, department, position } = req.body;
    const executive = await Executive.findById(req.params.id);
    if (!executive) return res.status(404).json({ message: "Executive not found" });
    if (name !== undefined) executive.name = name;
    if (department !== undefined) executive.department = department;
    if (position !== undefined) executive.position = position;
    if (req.file) executive.image = `/executives/${req.file.filename}`;
    await executive.save();
    res.json(executive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete executive
export const deleteExecutive = async (req, res) => {
  try {
    const executive = await Executive.findByIdAndDelete(req.params.id);
    if (!executive) return res.status(404).json({ message: "Executive not found" });
    res.json({ message: "Executive deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Executive from "../models/executive.model.js";

// Create Executive (with image upload)
export const createExecutive = async (req, res) => {
  try {
    const { name, department, position } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const executive = new Executive({
      name,
      department,
      position,
      image: `/executives/${req.file.filename}`,
    });
    await executive.save();
    res.status(201).json(executive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
