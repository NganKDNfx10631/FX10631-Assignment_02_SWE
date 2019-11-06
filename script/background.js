const TIME_REFRESH_DOMAIN = 86400000; // 1 day

refreshDomainList();

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
   switch (req.content) {
      case "POST Request":
      {
         $.post(req.requestUrl, req.requestBody, data => {
            sendResponse(data);
         }).catch(err => {
            sendResponse(undefined);
         });
         break;
      }
      case "GET Request":
      {
         $.get(req.requestUrl, data => {
            sendResponse(data);
         });
         break;
      }
   }
   return true;
});

function refreshDomainList()
{
   $.post("https://funix-onpage.firebaseapp.com/get-all-selector", res => {
      chrome.storage.sync.set({domainList: res}, function() {
         setTimeout(function(){
            refreshDomainList();
         }, TIME_REFRESH_DOMAIN);
      });
   });
}
