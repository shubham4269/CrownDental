import Gallery from "../models/Gallery.js";

export const getGallery = async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 });
  res.json(items);
};

export const addGallery = async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    const item = new Gallery({ imageUrl, caption });
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

