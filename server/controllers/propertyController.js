const Property = require('../models/Property');

// GET /api/properties
// Owners see their own properties.
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort('-createdAt');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { name, address, rooms, monthlyRent } = req.body;

    if (!name || !address || !rooms || !monthlyRent) {
      return res.status(400).json({ message: 'Name, address, rooms and rent are all required.' });
    }

    const property = await Property.create({
      name,
      address,
      rooms,
      monthlyRent,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'No property found with that id.' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own properties.' });
    }

    Object.assign(property, req.body);
    await property.save();

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'No property found with that id.' });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own properties.' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProperties, createProperty, updateProperty, deleteProperty };