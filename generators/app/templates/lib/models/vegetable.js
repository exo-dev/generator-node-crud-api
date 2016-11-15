'use strict';

const mongoose = require('mongoose');

const VegetableSchema = new mongoose.Schema({
    name: String,
    weight: Number
});

VegetableSchema.swaggerName = 'Vegetable';

module.exports = mongoose.model('Vegetable', VegetableSchema);