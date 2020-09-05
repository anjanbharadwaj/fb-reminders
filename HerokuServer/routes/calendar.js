const express = require('express')
const router = express.Router()
const CalendarEvent = require('../models/calendar-event')
const Chat = require('../models/chat')
var ObjectId = require('mongoose').Types.ObjectId; 
const myagenda = require('../myagenda');
var dispatchMessage = myagenda.dispatchMessage;
var undispatchMessage = myagenda.undispatchMessage;

//test: get all calendar events globally
router.get('/', async (req, res) => {
    // res.send("Getting all calendar events globally")
    try {
        const events = await CalendarEvent.find()
        res.json(events)
      } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//get all calendar events from a certain chat id
router.get('/:chatid', getChat, async (req, res) => {
    if(res.existingchat === undefined){
        res.status(404).json({ message: 'Cant find event'})
    }
    else res.json(res.existingchat)
})

router.post('/:chatid', getChat, async (req, res) => {
    existingchat = res.existingchat
    var chat = null
    reminderJson = req.body.reminder
    const event = new CalendarEvent({
        title: reminderJson.title,
        description: reminderJson.description,
        cronTime: reminderJson.cronTime,
        humanTime: reminderJson.humanTime,
        priority: reminderJson.priority
    });
    console.log("Existing Chat" + existingchat)
    if(existingchat === undefined || existingchat === null){
        
        chat = new Chat({
            chatID: req.params.chatid,
            reminders: event
        })
        try {
            console.log(typeof req.params.chatid)
            dispatchMessage(req.params.chatid, event._id, Date.parse(reminderJson.humanTime))
            const chatUpdateReminders = await chat.save()
            res.status(201).json(chatUpdateReminders)
          } catch (err) {
            res.status(400).json({ message: err.message })
          }
    } else{
        existingchat.reminders = existingchat.reminders.concat(event)
        try {
            console.log(typeof req.params.chatid)
            dispatchMessage(req.params.chatid, event._id, Date.parse(reminderJson.humanTime))
            const chatUpdateReminders = await existingchat.save()
            res.status(201).json(chatUpdateReminders)
          } catch (err) {
            res.status(400).json({ message: err.message })
          }
    }
  
    
  })

router.delete('/:chatid', getChat, async (req, res) => {
    var existingchat = res.existingchat
    const idToDelete = req.body.deleteId

    try {
      existingchat.reminders.id(idToDelete).remove();
      console.log(existingchat.reminders)
      existingchat.save(function (err) {
        if (err) return err;
        console.log('the subdocs were removed');
        res.json(existingchat);
      });
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:chatid', getChat, async (req, res) => {
  var existingchat = res.existingchat
  reminderJson = req.body.reminder
  const idToUpdate = reminderJson.updateId
  console.log("updateid" + idToUpdate)
  // CalendarEvent.findByIdAndUpdate(id, { $set: }, options, callback)
  try{
    var oldhumantime = existingchat.reminders.id(idToUpdate).humanTime;
    console.log("oldhumantime vs reminderjson time")
    existingchat.reminders.id(idToUpdate).title = reminderJson.title
    existingchat.reminders.id(idToUpdate).description = reminderJson.description
    existingchat.reminders.id(idToUpdate).cronTime = reminderJson.cronTime
    existingchat.reminders.id(idToUpdate).humanTime = reminderJson.humanTime
    existingchat.reminders.id(idToUpdate).priority = reminderJson.priority

    existingchat.save(async function (err) {
      if (err) return handleError(err);
      console.log('the subdocs were updated');

      //save some time: don't need to reschedule a job if we didnt actually change the time/date, and only changed the title/description
      if(Date.parse(oldhumantime) != Date.parse(reminderJson.humanTime)){
        console.log("timechange")
        await undispatchMessage(req.params.chatid, ObjectId(idToUpdate))
        await dispatchMessage(req.params.chatid, ObjectId(idToUpdate), Date.parse(reminderJson.humanTime))  
      }

      res.json(existingchat);
    });
  }catch(err) {
    res.status(500).json({ message: err.message })
  }

})


async function getChat(req, res, next) {
    try {
      existingchat = await Chat.findOne({ chatID: req.params.chatid});

    } catch(err){
      return res.status(500).json({ message: err.message })
    }
 
    res.existingchat = existingchat
    next()
}
module.exports = router
