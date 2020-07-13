var myRegExp = /https?:\/\/messenger\.com/;
var chatid = ""
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
          if((tab.url+"").includes("messenger.com")){
            chatid = (tab.url + "").replace("https://www.messenger.com/t/","");
            console.log("CHATID: " + chatid)
            loadReminders(tabId)
          }
        });
        // if (window.location.href.includes('www.messenger.com/t/')) {
            chrome.tabs.sendMessage(tabId, {
              type: "switchTab",
                message: 'TabUpdated'
              });
        // }
        
      }
    })
});


chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === 'event_create'){
    createEvent(request.title, request.timecron, request.time);
  }
  if (request.type === 'request_popup') {
    chatid = request.chatid
    // chrome.tabs.executeScript(null, {file: "popup.js"});

      chrome.tabs.create({
          url: chrome.extension.getURL('dialog.html'),
          active: false
      }, function(tab) {
          // After the tab has been created, open a window to inject the tab
          chrome.windows.create({
              tabId: tab.id,
              type:'popup',
              height: 400,
              width: 400,
              focused: true
              // incognito, top, left, ...
          });
      });
  }
});

function createEvent(title, timecron, time) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/calendar/"+chatid, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(title + "," + timecron + "," + time)
  xhr.send(JSON.stringify({
      reminder: {
        title: title,
        cronTime: timecron,
        humanTime: time
      }
  }));
//  console.log(password);
};

function loadReminders(tabId) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:3000/calendar/"+chatid, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhr.responseText);
      chrome.tabs.sendMessage(tabId, {
        type: "loadReminders",
        message: xhr.responseText
      });
    }
  };
  
};
