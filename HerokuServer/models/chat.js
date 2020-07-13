const mongoose = require('mongoose')
const CalendarEvent = require('../models/calendar-event').schema

const chatSchema = new mongoose.Schema({
    chatID: {
      type: String,
      required: true
    },
    reminders: {
      type: [CalendarEvent],
      required: true
    }
  })

module.exports = mongoose.model('Chat', chatSchema)
