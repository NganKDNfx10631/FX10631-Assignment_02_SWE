chrome.notifications.onClicked.addListener((id) => {
   if(id == "FUNiX Passport Updated")
   {
      chrome.notifications.clear("FUNiX Passport Updated");
   }
})

chrome.runtime.onInstalled.addListener(function (details) {
   var thisVersion = chrome.runtime.getManifest().version;
   if (details.reason == "install") {

   }
   else if (details.reason == "update") {
     let message = '\r\nCurrent version: '+ thisVersion +'\r\nClick to see what news :)';
     let options = {
        type: "basic",
        title: "FUNiX Passport Updated!",
        message: message,
        eventTime: 3000,
        iconUrl: "../../icon/funix-passport-icon-512x512.png"
     }
     chrome.notifications.create("FUNiX Passport Updated", options);

   }
});