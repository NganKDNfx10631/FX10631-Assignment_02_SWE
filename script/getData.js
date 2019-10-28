function sendMessagePromise(request) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(request, res => {
          resolve(res);
      });
   });
}

function getSettingData() {
   return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['funixPassportSetting'], function(result) {
         if(result.funixPassportSetting === undefined)
         {
            resolve({
               modeSubtitle: "1",
               float: true
            });
         } else {
            resolve(result.funixPassportSetting);
         }
     });
  });
}
