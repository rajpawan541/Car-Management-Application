// const mongoose = require('mongoose');

// const carSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   title: { type: String, required: true },
//   description: { type: String },
//   tags: [String],
//   images: [String], // Store the file paths of the images
// });

// module.exports = mongoose.model('Car', carSchema);


const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [String],
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length <= 10; // Validate that no more than 10 images are added
      },
      message: 'You can only upload up to 10 images.'
    }
  },
});

module.exports = mongoose.model('Car', carSchema);
