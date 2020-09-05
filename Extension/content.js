require('materialize-css')
var moment = require('moment');
var dateinstance;
var timeinstance;

function onPost() {
  var eventname = document.getElementById("eventname").value;
  var description = document.getElementById("description").value;
  // var date = document.getElementById("datepicker");
  // var time = document.getElementById("timepicker");
  var date = dateinstance.date
  var time = timeinstance.time
  console.log("TIME: " + time.a)
  var mins = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1])
  if(timeinstance.amOrPm == "PM"){
    mins += 12*60
  }
  date.setMinutes(mins)
  console.log("DATE:" + date)

  var mytimecron = buildCron(date);
  chrome.runtime.sendMessage({type:'event_create', title: eventname, desc: description, cron: mytimecron, date: date, priority: "low_priority"});

  pageBack()
};

function loadReminders(){

}

function buildCron(date){
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

    remindersButtonParent.onclick = openModal
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
        console.log(obj)
        if(request.message!==null){
            setupRemindersBox(obj.reminders)
            // setupRemindersBox(obj)
        }
    }
})

function openModal() {
  var mychatid = document.location.href.replace("https://www.messenger.com/t/","")
	console.log("openModal")
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems);
	var elem = document.querySelector('#myModal');
  var instance = M.Modal.getInstance(elem);
  instance.open();

  var content1 = document.getElementById('content1')
  var content2 = document.getElementById('content2')
  content2.style.display = "none";
  content1.style.display = "initial ";

  var add_reminder_btn = document.getElementsByClassName("add-reminder-btn")[0];
  add_reminder_btn.onclick = addReminder;

  var edit_btns = document.getElementsByClassName("edit-reminder-btn");
  for(var i = 0; i<edit_btns.length; i++){
    edit_btns[i].addEventListener('click', function(){
      editReminder(this);
    });
  }


  chrome.runtime.sendMessage({type: "reminders_read"}, function(response) {
    // console.log(response.farewell);
  });
  
};

function addReminder(){
  console.log("AddReminder")
  var content1 = document.getElementById('content1')
  var content2 = document.getElementById('content2')
  content1.style.display = "none";
  content2.style.display = "initial";
  var date_picker_elem = document.querySelector('.datepicker');
  dateinstance = M.Datepicker.init(date_picker_elem);

  var time_picker_elem = document.querySelector('.timepicker');
  timeinstance = M.Timepicker.init(time_picker_elem);

  var back_button = document.getElementById("back")
  var add_button = document.getElementById("add")

  back_button.onclick = pageBack
  add_button.onclick = onPost
  // document.dispatchEvent(new CustomEvent('ModalEvent', { detail: data }));
  // chrome.runtime.sendMessage({type:'request_popup', chatid: mychatid});
  
}

function pageBack(){
  console.log("Page Back")
  var content1 = document.getElementById('content1')
  var content2 = document.getElementById('content2')

  document.getElementById("eventname").value = "";
  document.getElementById("description").value = "";
  document.getElementById("timepicker").value = "";
  document.getElementById("datepicker").value = "";

  M.updateTextFields();

  content1.style.display = "initial";
  content2.style.display = "none";
}

function editReminder(element){
  console.log("EditReminder")
  element = element.parentElement  
  var priority_level = element.getElementsByClassName('priority-level')[0].innerHTML;
  var event_name = element.getElementsByClassName('title')[0].innerHTML;
  var datetime = element.getElementsByClassName('datetime')[0].innerHTML;
  var description = element.getElementsByClassName('description')[0].innerHTML;
  var content1 = document.getElementById('content1')
  var content2 = document.getElementById('content2')
  content1.style.display = "none";
  content2.style.display = "initial";

  document.getElementById("eventname").value = event_name;
  document.getElementById("description").value = description;
  document.getElementById("datepicker").value = datetime;
  M.updateTextFields();

  // document.getElementById("timepicker").value = "";

  var date_picker_elem = document.querySelector('.datepicker');
  dateinstance = M.Datepicker.init(date_picker_elem);

  var time_picker_elem = document.querySelector('.timepicker');
  timeinstance = M.Timepicker.init(time_picker_elem);

  var back_button = document.getElementById("back")
  var edit_button = document.getElementById("add")
  edit_button.innerHTML = "Edit"

  back_button.onclick = pageBack

  

}


function setupRemindersBox(reminders){
    for(var i = 0; i<reminders.length; i++){
        var reminder = reminders[i];
        injectOneReminder(reminder)
    }
}

function injectOneReminder(reminder){
  var title = reminder.title;
  var description = reminder.description;
  var date = reminder.humanTime
  var dateText = moment(date)
  var priority = reminder.priority

  var parent = document.createElement("li");
  parent.className = "collection-item avatar"

  var child1 = document.createElement("i")
  if(priority == "priority_high"){
    child1.className = "material-icons circle red priority-level"
  } else {
    child1.className = "material-icons circle green priority-level"
  }
  child1.innerHTML = priority

  var child2 = document.createElement("span")
  child2.className = "title"
  child2.innerHTML = title

  var child3 = document.createElement("p")
  child3.className = "datetime"
  child3.innerHTML = date

  var child4 = document.createElement("p")
  child4.className = "description"
  child4.innerHTML = description

  var child5 = document.createElement("a")
  child5.className = "secondary-content edit-reminder-btn"
  child5.addEventListener('click', function(){
    editReminder(this);
  });
  var child6 = document.createElement("i")
  child6.className = "material-icons light-blue-text"
  child6.innerHTML = "edit"

  child5.appendChild(child6)

  parent.appendChild(child1)
  parent.appendChild(child2)
  parent.appendChild(child3)
  parent.appendChild(child4)
  parent.appendChild(child5)
  var table = document.getElementById("remindersCollection")
  table.appendChild(parent)
}
function setupModal(){
    injectJS('/thirdParty/materialize.js')
    injectJS('/main.js')
    injectCSS('/thirdParty/materialize.css')
    // injectCSS('dialog.css')
    injectCSS("/fonts/material-icons.css")
    $.get(chrome.extension.getURL('/dialog.html'), function(data) {
        $($.parseHTML(data)).appendTo('body');
        // injectJS('/thirdParty/jquery.min.js')

        // injectJS('injected.js')

    });


    
}

function injectJS(name){
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(name);
    (document.body || document.documentElement).appendChild(s);
}
function injectCSS(name){
    $(document).ready(function() {
        var path = chrome.extension.getURL(name);
        $('head').append($('<link>')
            .attr("rel","stylesheet")
            .attr("type","text/css")
            .attr("href", path));
    });
}
