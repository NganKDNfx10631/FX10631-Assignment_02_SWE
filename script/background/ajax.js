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
