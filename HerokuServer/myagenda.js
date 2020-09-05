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

const connectionString = 'mongodb://localhost:27017/agendatest'; //this should be your connection string, as this is a local DB, but if it doesn't work for you, you may not be using the default localhost port.

const agenda = new Agenda({
    db: {address: connectionString, collection: 'jobs'},
    processEvery: '30 seconds' //can change to 1 minute if server is being overloaded with process requests
});
const login = require("facebook-chat-api");

const fs = require("fs");
var api_instance = "";

login({email: "BOT_EMAIL", password: "BOT_PASSWORD"}, (err, api) => {
    if(err) return console.error(err);
    api_instance = api;
    // fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    agenda.start();
    // dispatchMessage("2624993000918406", "5f460e938930d0bc426448df")
});
agenda.define('send reminder', {priority: 'high', concurrency: 10}, async job => {
    var {id, reminder_id} = job.attrs.data;
    console.log(id + "      " + reminder_id)
    
    var results = await Chat.find({ chatID: id}).exec()
    var results_copy = results;
    results = results[0]
    console.log(results.reminders)
    var final_result = {}
    for(var i = 0; i<results.reminders.length; i++){
        var obj = results.reminders[i]
        Obj
        var objid = ObjectId(obj._id).toString()
        reminder_id = "" + reminder_id
        if(objid == reminder_id){
            final_result = JSON.parse(JSON.stringify(obj));
            break;
        }
    }
    if(final_result != {}){
        console.log(JSON.stringify(final_result))
        sendAlert("*Event happening now:* \n" + final_result.title + "\n\n" + final_result.description , id, job, reminder_id, results);
    }
});

async function sendAlert(eventname, chatid, job, reminder_id, chatobject){
    console.log("im in here" + api_instance)
    await api_instance.sendMessage(eventname, chatid); 
    // await api_instance.sendMessage(eventname, "4327274094013230");
    await job.remove();
    chatobject.reminders.id(reminder_id).remove();
      console.log(chatobject.reminders)
      chatobject.save(function (err) {
        if (err) return err;
        console.log('the reminder has been removed');
      });

}
// agenda.start();

async function dispatchMessage(chatid, reminderid, whentosend) {
    // await agenda.start();
    // var d = new Date();
    // d.setSeconds(d.getSeconds()+2)
    console.log("dispatching message at: " + whentosend)
    agenda.schedule(whentosend, 'send reminder', {id: chatid, reminder_id: reminderid});
}

async function undispatchMessage(chatid, reminderid){
    console.log("undispatching")

    // const jobs = await agenda.jobs({name: 'send reminder'});
    await agenda.cancel({data: {id: chatid, reminder_id: reminderid} } );
}

module.exports.dispatchMessage = dispatchMessage;
module.exports.undispatchMessage = undispatchMessage;





