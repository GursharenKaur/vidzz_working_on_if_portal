const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  website: {
    type: String,
    // match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid website URL']
  },
  logo: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  contactPhone: {
    type: String,
    match: [/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 'Please enter a valid phone number']
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: {
      type: String,
      match: [/^[0-9]{5}(?:-[0-9]{4})?$/, 'Please enter a valid postal code']
    },
    country: { type: String }
  },
  industry: {
    type: String,
    enum: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
      'Retail', 'Hospitality', 'Entertainment', 'Other'
    ]
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  foundedYear: {
    type: Number,
    min: [1800, 'Founded year seems too early'],
    max: [new Date().getFullYear(), 'Founded year cannot be in the future']
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
