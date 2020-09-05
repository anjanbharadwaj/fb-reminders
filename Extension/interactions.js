const $ = require('jquery')
require('materialize-css')
const flatpickr = require("flatpickr");
var moment = require('moment');

$(document).keydown(function(e) {
    // ESCAPE key pressed
    if (e.keyCode == 27) {
      closeModal();
    }
});
function createPost() {
    var mytitle = document.getElementById('title').value;
    const fp = document.querySelector("#basicDate")._flatpickr;

    //send message to content script to make it run onPost()

    var mytime = (fp.selectedDates)[0];
    var mytimecron = buildCron(mytime);
    // chrome.runtime.sendMessage({type:'event_create', title: mytitle, timecron: mytimecron, time: mytime});

    // chrome.runtime.getBackgroundPage(function(bgWindow) {
    //     bgWindow.createEvent(title, timecron, time);
    //     window.close();     // Close dialog
    // });
};

function closeModal(){
	$('#myModal').modal();
}
function openModal(){
    $('#myModal').modal();
}
function setupModal(){
    document.getElementById("positive").addEventListener("click", createPost);
    // document.getElementById("negative").addEventListener("click", closeModal);
    flatpickr("#basicDate", {
        enableTime: true,
        dateFormat: "Y-m-d H:i"}
    );
    $('.tabs').tabs();

}

document.addEventListener('ModalEvent', function (e) {
    var data = e.detail;
    openModal()
});

setupModal()