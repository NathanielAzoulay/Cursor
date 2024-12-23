const mongoose = require('mongoose');
const Property = require('../models/Property');
require('dotenv').config();

const sampleProperties = [
  {
    title: "Appartement moderne à Tel Aviv",
    address: {
      street: "Dizengoff 123",
      city: "Tel Aviv",
      neighborhood: "Centre",
    },
    details: {
      price: 2500000,
      surface: 85,
      rooms: 3,
      bathrooms: 2,
      parking: true,
      floor: 4,
      type: "apartment"
    },
    financials: {
      monthlyRent: 6500,
      yearlyReturn: 3.12,
      lastValuation: 2600000,
      purchasePrice: 2300000,
      purchaseDate: new Date('2020-01-15')
    }
  },
  // Ajoutez plus d'exemples...
];

const marketData = {
  "2019": { avgPrice: 1800000, transactions: 12500 },
  "2020": { avgPrice: 1950000, transactions: 11800 },
  "2021": { avgPrice: 2100000, transactions: 13200 },
  "2022": { avgPrice: 2300000, transactions: 12900 },
  "2023": { avgPrice: 2450000, transactions: 12600 }
};

// Script pour insérer les données 