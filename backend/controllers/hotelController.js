const fs = require('fs');
const path = require('path');

const defaultHotels = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Ocean View Suites',
    description: 'A modern seaside getaway with panoramic ocean views and a calming open-air lounge.',
    latitude: 36.1699,
    longitude: -115.1398,
    price: 220,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    title: 'Mountain Crest Hotel',
    description: 'A cozy mountain retreat known for warm hospitality, firepit evenings, and scenic hiking trails.',
    latitude: 39.7392,
    longitude: -104.9903,
    price: 180,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    title: 'City Lights Inn',
    description: 'A stylish urban hotel close to dining, nightlife, and skyline attractions.',
    latitude: 40.7128,
    longitude: -74.006,
    price: 260,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    title: 'Desert Bloom Resort',
    description: 'A tranquil desert stay with a pool, wellness spa, and star-filled evenings.',
    latitude: 33.4484,
    longitude: -112.074,
    price: 210,
    created_at: new Date().toISOString(),
  },
];

let hotels = [...defaultHotels];

const getHotels = async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const minPrice = req.query.minPrice !== undefined ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : null;
    let page = Number(req.query.page || 1);
    let limit = Number(req.query.limit || 6);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 6;
    }

    const filteredHotels = hotels.filter((hotel) => {
      const matchesSearch = !search || hotel.title.toLowerCase().includes(search.toLowerCase());
      const matchesMin = minPrice === null || Number.isNaN(minPrice) || hotel.price >= minPrice;
      const matchesMax = maxPrice === null || Number.isNaN(maxPrice) || hotel.price <= maxPrice;
      return matchesSearch && matchesMin && matchesMax;
    });

    const total = filteredHotels.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * limit;
    const paginatedHotels = filteredHotels.slice(offset, offset + limit);

    res.status(200).json({
      hotels: paginatedHotels,
      total,
      page: safePage,
      limit,
      totalPages,
      offset,
    });
  } catch (error) {
    console.error('Get hotels error:', error.message);
    res.status(500).json({
      message: 'Failed to fetch hotels.',
      error: error.message,
    });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = hotels.find((item) => String(item.id) === String(id));

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    res.status(200).json({ hotel });
  } catch (error) {
    console.error('Get hotel by id error:', error.message);
    res.status(500).json({
      message: 'Failed to fetch hotel details.',
      error: error.message,
    });
  }
};

const createHotel = async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Hotel image is required.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedLatitude)) {
      return res.status(400).json({ message: 'Latitude must be a valid number.' });
    }

    if (!Number.isFinite(parsedLongitude)) {
      return res.status(400).json({ message: 'Longitude must be a valid number.' });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number.' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const nextId = hotels.length ? Math.max(...hotels.map((hotel) => Number(hotel.id))) + 1 : 1;

    const newHotel = {
      id: nextId,
      image: imagePath,
      title: title.trim(),
      description: description.trim(),
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      price: parsedPrice,
      created_at: new Date().toISOString(),
    };

    hotels.unshift(newHotel);

    res.status(201).json({
      message: 'Hotel created successfully.',
      hotel: newHotel,
    });
  } catch (error) {
    console.error('Create hotel error:', error.message);

    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Failed to create hotel.',
      error: error.message,
    });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, latitude, longitude, price } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Hotel ID is required.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required.' });
    }

    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);
    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedLatitude)) {
      return res.status(400).json({ message: 'Latitude must be a valid number.' });
    }

    if (!Number.isFinite(parsedLongitude)) {
      return res.status(400).json({ message: 'Longitude must be a valid number.' });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number.' });
    }

    const index = hotels.findIndex((hotel) => String(hotel.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    const existingHotel = hotels[index];
    let imagePath = existingHotel.image;

    if (req.file) {
      const oldImagePath = existingHotel.image ? path.join(__dirname, '..', existingHotel.image) : null;

      if (oldImagePath && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedHotel = {
      ...existingHotel,
      image: imagePath,
      title: title.trim(),
      description: description.trim(),
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      price: parsedPrice,
    };

    hotels[index] = updatedHotel;

    res.status(200).json({
      message: 'Hotel updated successfully.',
      hotel: updatedHotel,
    });
  } catch (error) {
    console.error('Update hotel error:', error.message);

    if (req.file) {
      const filePath = path.join(__dirname, '../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      message: 'Failed to update hotel.',
      error: error.message,
    });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const index = hotels.findIndex((hotel) => String(hotel.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    const removedHotel = hotels[index];

    if (removedHotel.image) {
      const imagePath = path.join(__dirname, '..', removedHotel.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    hotels.splice(index, 1);

    res.status(200).json({
      message: 'Hotel deleted successfully.',
      id,
    });
  } catch (error) {
    console.error('Delete hotel error:', error.message);
    res.status(500).json({
      message: 'Failed to delete hotel.',
      error: error.message,
    });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
