const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: String,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    neighborhood: String,
    country: { type: String, default: 'Israel' },
    postalCode: String
  },
  details: {
    price: Number,
    surface: Number,
    rooms: Number,
    bathrooms: Number,
    parking: Boolean,
    floor: Number,
    totalFloors: Number,
    type: {
      type: String,
      enum: ['apartment', 'house', 'studio', 'penthouse'],
      default: 'apartment'
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'sold'],
      default: 'available'
    }
  },
  financials: {
    monthlyRent: Number,
    yearlyReturn: Number,
    lastValuation: Number,
    purchasePrice: Number,
    purchaseDate: Date
  },
  tenant: {
    name: String,
    phone: String,
    email: String,
    leaseStart: Date,
    leaseEnd: Date
  },
  images: [{
    url: String,
    main: Boolean
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', propertySchema); 