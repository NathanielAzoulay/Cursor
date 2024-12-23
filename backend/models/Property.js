const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  details: {
    price: {
      type: Number,
      required: true
    },
    surface: {
      type: Number,
      required: true
    },
    rooms: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      default: 'apartment'
    }
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema); 