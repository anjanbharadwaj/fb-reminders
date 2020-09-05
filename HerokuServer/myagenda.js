const Agenda = require('agenda');
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/calendar-db", {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

mongoose.set('useFindAndModify', false);

const CalendarEvent = require('./models/calendar-event')
const Chat = require('./models/chat')
var ObjectId = require('mongoose').Types.ObjectId; 

const connectionString = 'mongodb://localhost:27017/agendatest';

const agenda = new Agenda({
    db: {address: connectionString, collection: 'jobs'},
    processEvery: '1 minute'
});
const login = require("facebook-chat-api");

const fs = require("fs");
var api_instance = "";
login({email: "gjacbev_moidusen_1587767783@tfbnw.net", password: "8npe599gp5a"}, (err, api) => {
    if(err) return console.error(err);
    api_instance = api;
    console.log("yo");
    // fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    agenda.start();
    // dispatchMessage("2624993000918406", "5f460e938930d0bc426448df")
});
agenda.define('send reminder', {priority: 'high', concurrency: 10}, async job => {
    const {id, reminder_id} = job.attrs.data;
    console.log(id + "      " + reminder_id)
    
    var results = await Chat.find({ chatID: id}).exec()
    var results_copy = results;
    results = results[0]
    console.log(results.reminders)
    var final_result = {}
    for(var i = 0; i<results.reminders.length; i++){
        var obj = results.reminders[i]
        console.log(obj._id)
        if(obj._id == reminder_id){
            final_result = obj
            console.log("we found it!")
            break;
        }
    }
    if(final_result != {}){
        console.log("FINAL RESULT IS " + final_result.title)
        sendAlert("*Event happening now:* \n" + final_result.title + "\n\n" + final_result.description , id, job, reminder_id, results);
    }
});

async function sendAlert(eventname, chatid, job, reminder_id, chatobject){
    console.log("im in here" + api_instance)
    await api_instance.sendMessage(eventname, "4327274094013230");
    await job.remove();
    chatobject.reminders.id(reminder_id).remove();
      console.log(chatobject.reminders)
      chatobject.save(function (err) {
        if (err) return err;
        console.log('the reminder has been removed');
      });

}
// agenda.start();

// (async function(chatid, reminderid) {
//     await agenda.start();
//     await agenda.schedule('in 5 seconds', 'send reminder', {id: chatid, reminder_id: reminderid});
//   })("2624993000918406", "5f460cd38930d0bc426448da");

async function dispatchMessage(chatid, reminderid, whentosend) {
    // await agenda.start();
    // var d = new Date();
    // d.setSeconds(d.getSeconds()+2)
    console.log("dispathing message at: " + whentosend)
    agenda.schedule(whentosend, 'send reminder', {id: chatid, reminder_id: reminderid});
}

module.exports.dispatchMessage = dispatchMessage;



































// const Agenda = require('agenda');
// const mongoose = require('mongoose')
// mongoose.connect("mongodb://localhost:27017/calendar-db", {useNewUrlParser: true});
// const db = mongoose.connection
// db.on('error', (error) => console.error(error))
// db.once('open', () => console.log('connected to database'))


// const CalendarEvent = require('../models/calendar-event')
// const Chat = require('../models/chat')
// var ObjectId = require('mongoose').Types.ObjectId; 

// const connectionString = 'mongodb://localhost:27017/agendatest';

// const agenda = new Agenda({
//     db: {address: connectionString, collection: 'jobs'},
// });


// agenda.define('send reminder', {priority: 'high', concurrency: 10}, async job => {
//     const {id, reminder_id} = job.attrs.data;
//     console.log(id + "      " + reminder_id)
//     var results = await Chat.find({ chatID: id}).exec()
//     results = results[0]
//     console.log(results.reminders)
//     var final_result = {}
//     for(var i = 0; i<results.reminders.length; i++){
//         var obj = results.reminders[i]
//         console.log(obj._id)
//         if(obj._id == reminder_id){
//             final_result = obj
//             console.log("we found it!")
//             break;
//         }
//     }
//     if(final_result != {}){
//         console.log("FINAL RESULT IS " + final_result.title)
//         sendAlert("Event happening now: " + final_result.title + " -- " + final_result.description , id, job);
//     }
//     // process.exit(0);
// });

// // async function sendAlert(eventname, chatid, job){
// //     console.log("im in here" + api)
// //     await api.sendMessage(eventname + " is happening now.", chatid);
// //     await job.remove();

// //     // process.exit(0)

// // }

// (async function() {
//     console.log("first")
//     await agenda.start();
//     console.log("second")
//     await agenda.schedule('in 5 seconds', 'send reminder', {id: "2624993000918406", reminder_id: "5f460cd38930d0bc426448da"});
//   })();


