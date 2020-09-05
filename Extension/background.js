var myRegExp = /https?:\/\/messenger\.com/;
var chatid = ""
var oldtabid = ""
// use a regexp to match the URLs you want
// for example, this will only match stackoverflow.com pages

// chrome.tabs.onUpdated.addListener(function(tabID, info, tab) {
//     if (myRegExp.test(tab.url)) { // if the url matches, inject your script
//         // chrome.tabs.executeScript(tabID, {file: "getCurrentURL.js", runAt: "document_end"});
//         alert("messenger!")
//     }
// });


chrome.runtime.onInstalled.addListener(function() {
    // ...
    
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      
      

      if (changeInfo.status === 'complete') {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function(tabs) {
          var tab = tabs[0];
          // if((tab.url+"").includes("https://www.facebook.com/messages/")){
          //   tempchatid = (tab.url + "").replace("https://www.facebook.com/messages/t/","");
            if((tab.url+"").includes("messenger.com")){
            tempchatid = (tab.url + "").replace("https://www.messenger.com/t/","");
            tempchatid = tempchatid.split("#")[0]
            if(tabId != oldtabid || tempchatid != chatid){
              oldtabid = tabId
              chatid = tempchatid
              console.log("CHATID: " + chatid)
              // loadReminders(tabId)
              chrome.tabs.sendMessage(tabId, {
                type: "switchTab",
                  message: 'TabUpdated'
                });
            }
          }
        });
      }
    })
});


chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === 'event_create'){
    createEvent(request.title, request.desc, request.cron, request.date, request.priority);
  }
  else if (request.type === 'event_edit'){
    editEvent(request.reminderid, request.title, request.desc, request.cron, request.date, request.priority);
  }
  if (request.type === 'reminders_read'){
    return loadReminders(oldtabid)
  }
});

function createEvent(title, description, cron, date, priority) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/calendar/"+chatid, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(title + "," + description + ", " + cron + "," + date + ", " + priority)
  xhr.send(JSON.stringify({
      reminder: {
        title: title,
        description: description,
        cronTime: cron,
        humanTime: date,
        priority: priority
      }
  }));
//  console.log(password);
};

function editEvent(reminderid, title, description, cron, date, priority) {
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:3000/calendar/"+chatid, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(title + "," + description + ", " + cron + "," + date + ", " + priority)
  xhr.send(JSON.stringify({
      reminder: {
        updateId: reminderid,
        title: title,
        description: description,
        cronTime: cron,
        humanTime: date,
        priority: priority
      }
  }));
//  console.log(password);
};

function loadReminders(tabId) {
  console.log("Loading Reminders from: " + chatid)
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/calendar/"+chatid, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhr.responseText);
      // return xhr.responseText
      chrome.tabs.sendMessage(tabId, {
        type: "loadReminders",
        message: xhr.responseText
      });
    }
  };
  
};
