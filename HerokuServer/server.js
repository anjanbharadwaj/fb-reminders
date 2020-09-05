var express = require('express');
var app = express();
// var MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose')
require('dotenv').config()
// require('./myagenda')


mongoose.connect(process.env.LOCAL_DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))
const c = db.collection('reminders');
app.use(express.json())
const calendarRouter = require('./routes/calendar')
app.use('/calendar', calendarRouter)



app.get('/messages', function(req, res){
    
    res.send("Message requested")
});




app.listen(3000);
console.log("Server running on port 3000");


