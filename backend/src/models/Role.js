const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stipend: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);
