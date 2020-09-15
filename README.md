# 

# Overview
This is a personal project I've been working on to make messenger.com a little more functional. In the past, users used to be able to set reminders within group chats, which my friends and I all found super useful. Unfortunately, Facebook recently removed this feature, so I decided to create a workaround, in the form of a Chrome Extension.
# ToDo

 - [ ] Finish setting up online MongoDB -- currently using local DB stored on computer
 - [ ] Automate facebook bot sign-in and sign-out to simulate real auth 
 - [ ] Push chrome extension to Google Play Store
 - [ ] Update guide to explain Heroku setup
 - [ ] Add more utilities to extension
	 - [ ] Random number generator/random user selector

# Setup

There are two components to this project: the extension and the web server, which can be hosted locally or on Heroku, Digital Ocean, etc.

 1. Clone from this repository with `git clone https://github.com/anjanbharadwaj/fb-reminders.git`
 2. Head to `chrome://extensions` in your Chrome browser
 3. Click the **load unpacked** button at the top left, and select the **/MessengerPlatform/Extension** folder
 4. Once it loads in, you should be set with this component!
 5. Open up a terminal and cd into the **/MessengerPlatform/HerokuServer** folder
 6. Open up the **server.js** file and add in the email and password for your preferred Facebook "bot" (just any other Facebook account). It is HIGHLY recommended you don't use your personal account for this, as this entire project makes use of the unofficial [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api), and if your account displays suspicious behavior, it may be flagged, suspended, or completely removed
 8. Run node server.js to start the Express application
 9. Install the *MongoDB shell* if you don't already have it. Then, open up another terminal window and run `mongo` to start your local instance of your reminders database
 10. You should be all set with both components of the project! Open messenger.com, add your Facebook "bot" to your chat, and you'll see a "Set Reminders" button on the side, which you can use to view and set new reminders!
