const mongoose = require('mongoose')

const calendarEventSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    cronTime: {
      type: String,
      required: true
    },
    humanTime: {
      type: String,
      required: true
    },
  })

module.exports = mongoose.model('CalendarEvent', calendarEventSchema)
