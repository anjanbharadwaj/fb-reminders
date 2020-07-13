const jq = require('jquery')
require('bootstrap');
const flatpickr = require("flatpickr");
var moment = require('moment'); // require

jq(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
        window.close();
    }
});

function onPost() {
	console.log("ONPOST")
    var mytitle = document.getElementById('title').value;
    const fp = document.querySelector("#basicDate")._flatpickr;
    var mytime = (fp.selectedDates)[0];
    var mytimecron = buildCron(mytime);
	console.log("TIMECRON" + mytimecron)
	chrome.runtime.sendMessage({type:'event_create', title: mytitle, timecron: mytimecron, time: mytime});

    // chrome.runtime.getBackgroundPage(function(bgWindow) {
    //     bgWindow.createEvent(title, timecron, time);
    //     window.close();     // Close dialog
    // });
};


function buildCron(time){
    var date = moment(time).toDate();//time.toDate();
    // var cronExp = new cb();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var cronString = "0"
    cronString = cronString.concat(" " + date.getMinutes())
    cronString = cronString.concat(" " + date.getHours())
    cronString = cronString.concat(" " + date.getDate())
    cronString = cronString.concat(" " + monthNames[date.getMonth()] )
    cronString = cronString.concat(" ?")
    cronString = cronString.concat(" " + date.getFullYear())
    
    return cronString
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}




//Reminders Button Below
function insertButton(){

    var element = getElementByXpath("/html/body/div/div/div/div[2]/span/div[2]/div[1]/div/div/div[1]/div/div/div/div[2]/div[2]/span")
    var remindersButtonParent = document.createElement("div");
    remindersButtonParent.id = "remindersButtonParent"
    remindersButtonParent.className = "_3szo _6y4w"
    remindersButtonParent.setAttribute("tabindex","0")
    remindersButtonParent.setAttribute("role","button")

    var remindersButtonLevel2 = document.createElement("div");
    remindersButtonLevel2.id = "remindersButtonLevel2"
    remindersButtonLevel2.className = "_3szp"

    var remindersButtonLevel3 = document.createElement("div");
    remindersButtonLevel3.id = "remindersButtonLevel3"
    remindersButtonLevel3.className = "_6ybx"

    var remindersButtonLevel4 = document.createElement("img");
    remindersButtonLevel4.id = "remindersButtonLevel4"
    remindersButtonLevel4.className = "_7oal"
    remindersButtonLevel4.setAttribute("height","26px")
    remindersButtonLevel4.setAttribute("width","26px")
    var url = chrome.runtime.getURL('assets/calendar-icon.svg');
    remindersButtonLevel4.setAttribute("src",url)

    var remindersButtonLevel2_1 = document.createElement("div");
    remindersButtonLevel2_1.id = "remindersButtonLevel2_1"
    remindersButtonLevel2_1.className = "_3szq"
    remindersButtonLevel2_1.innerHTML = "Set Reminder"

    // remindersButtonParent.setAttribute("data-toggle","modal")
	// remindersButtonParent.setAttribute("data-target","#myModal") 
    remindersButtonParent.onclick = calendarAction
    element.appendChild(remindersButtonParent);
    remindersButtonParent.appendChild(remindersButtonLevel2)
    remindersButtonLevel2.appendChild(remindersButtonLevel3)
    remindersButtonLevel3.appendChild(remindersButtonLevel4)
    remindersButtonParent.appendChild(remindersButtonLevel2_1)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type==="switchTab"){
        if (request.message === 'TabUpdated') {
            console.log(document.location.href);
        insertButton();
        setupModal()
        }
    } else if (request.type==="loadReminders"){
        var obj = JSON.parse(request.message)
        console.log(request.message)
        if(request.message!==null){
            setupRemindersBox(obj)
        }
    }
})

function calendarAction() {
	var mychatid = document.location.href.replace("https://www.messenger.com/t/","")
	document.ex
	console.log("CalendarAction")
    jq('#myModal').modal('show');
    // chrome.runtime.sendMessage({type:'request_popup', chatid: mychatid});
    // var url_id = document.location.href.substring(27)
    // window.open("https://calendar.google.com#"+url_id)
};

function setupRemindersBox(chatid){
    var reminders = chatid.reminders;
    for(var i = 0; i<reminders.length; i++){
        var reminder = reminders[i];
        var title = reminder.title;
        var cronTime = reminder.cronTime
    }
}

function setupModal(){
    jq.get(chrome.extension.getURL('/dialog.html'), function(data) {
		console.log(data)
        jq(jq.parseHTML(data)).appendTo('body');
	});
	
    document.getElementById("positive").addEventListener("click", onPost);
    flatpickr("#basicDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i"}
    );

	// var s = document.createElement('script');
	// s.src = chrome.runtime.getURL('popup.js');
	// s.onload = function() {
	// 	this.remove();
	// };
	// (document.head || document.documentElement).appendChild(s);

}