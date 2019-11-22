const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    locationName: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    ticketType: {
        type: String,
        required: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
