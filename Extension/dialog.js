// const flatpickr = require("flatpickr");
// const $ = require('jquery')
// var moment = require('moment'); // require

// function onPost() {
//     var title = document.getElementById('title').value;
//     const fp = document.querySelector("#basicDate")._flatpickr;
//     var time = (fp.selectedDates)[0];
//     // var timecron = document.getElementById('time').value;
//     var timecron = buildCron(time);
//     console.log("TIMECRON" + timecron)
//     chrome.runtime.getBackgroundPage(function(bgWindow) {
//         bgWindow.createEvent(title, timecron, time);
//         window.close();     // Close dialog
//     });
// };

// flatpickr("#basicDate", {
//     enableTime: true,
//     dateFormat: "Y-m-d H:i"}
// );

// function buildCron(time){
//     var date = moment(time).toDate();//time.toDate();
//     // var cronExp = new cb();
//     const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//     var cronString = "0"
//     cronString = cronString.concat(" " + date.getMinutes())
//     cronString = cronString.concat(" " + date.getHours())
//     cronString = cronString.concat(" " + date.getDate())
//     cronString = cronString.concat(" " + monthNames[date.getMonth()] )
//     cronString = cronString.concat(" ?")
//     cronString = cronString.concat(" " + date.getFullYear())
    
//     return cronString
// }