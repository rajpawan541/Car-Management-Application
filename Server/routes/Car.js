const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Car = require('../models/Car');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Setup file storage configuration with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Unique file name using timestamp
  },
});

const upload = multer({
  storage,
  limits: { fileCount: 10 }, // Ensure no more than 10 files are uploaded
}).array('images', 10); // Allow up to 10 files

// Middleware to verify token (still used for authenticated routes)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.userId;
    next();
  });
};

// Create a new car (Requires authentication)
router.post('/', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading images: ' + err.message });
    }

    const { title, description, tags } = req.body;
    const images = req.files.map(file => file.path); // Save image paths

    if (images.length > 10) {
      return res.status(400).json({ message: 'You can upload up to 10 images only.' });
    }

    try {
      const newCar = new Car({ userId: req.userId, title, description, tags, images });
      await newCar.save();
      res.status(201).json(newCar); // Return the created car as response
    } catch (error) {
      console.error("Error creating car:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
});

// List all cars (Authenticated route, only for the current user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId }); // Get only cars that belong to the authenticated user
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Error fetching cars", error: error.message });
  }
});

// Get a particular car's details (Authenticated route, only for the current user)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, userId: req.userId }); // Get the car if it belongs to the authenticated user
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });
    res.json(car);
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ message: "Error fetching car details", error: error.message });
  }
});

// Update car (Requires authentication)
router.put('/:id', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading images: ' + err.message });
    }

    const { title, description, tags } = req.body;
    const images = req.files ? req.files.map(file => file.path) : []; // Initialize to empty array if no new images
    const deletedImages = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : []; // Ensure deletedImages is an array

    // Check if the total number of images (existing + new) and deleted images exceeds the limit
    if (images.length + deletedImages.length > 10) {
      return res.status(400).json({ message: 'You can upload up to 10 images only.' });
    }

    try {
      const car = await Car.findOne({ _id: req.params.id, userId: req.userId }); // Find car belonging to the current user
      if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });

      // Delete old images that are marked for deletion
      deletedImages.forEach(imagePath => {
        const filePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the old image from disk
        }
      });

      // Remove the deleted images from the car's image list
      car.images = car.images.filter(image => !deletedImages.includes(image));

      // Update car fields
      car.title = title || car.title;
      car.description = description || car.description;
      car.tags = tags || car.tags;

      // Add new images to the list (if any)
      car.images = [...car.images, ...images];

      await car.save();
      res.json(car); // Return the updated car as response
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
});

// Delete a car (Requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, userId: req.userId }); // Ensure the car belongs to the authenticated user
    if (!car) return res.status(404).json({ message: 'Car not found or unauthorized' });

    // Delete images from disk (if needed)
    car.images.forEach(imagePath => {
      const filePath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(filePath)) { // Check if the file exists before attempting to delete
        fs.unlinkSync(filePath); // Remove the file from the filesystem
      } else {
        console.log(`File not found: ${filePath}`); // Log if the file is not found
      }
    });

    await car.deleteOne(); // Use deleteOne() instead of remove()
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Error deleting car", error: error.message });
  }
});

module.exports = router;
