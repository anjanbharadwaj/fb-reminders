const mongoose = require('mongoose')

const calendarEventSchema = new mongoose.Schema({

    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    cronTime: {
      type: String,
      required: true
    },
    humanTime: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      required: true
    }
  })

module.exports = mongoose.model('CalendarEvent', calendarEventSchema)
