const mongoose = require('mongoose');
// const validator = require('validator'); // for advanced string validation

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Category name must be at least 3 characters'],
    maxlength: [50, 'Category name must be at most 50 characters'],
  }, 
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
  },
  hexcode: {
    type: String,
    default: null,
     unique: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Color", colorSchema)