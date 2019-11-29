chrome.runtime.onMessage.addListener(async function(req, sender, sendResponse) {
   if(req.content === 'Add youtube')
   {
      chrome.webNavigation.getAllFrames({tabId:sender.tab.id},function(frames){
         console.log(frames);
         frames.forEach(element => {
            if(new URL(element.url).hostname === "www.youtube.com")
            {
               // chrome.tabs.executeScript(sender.tab.id,{
               //     frameId: element.frameId,
               //     file: "script/subtitle/youtubeObserver.js"
               // },function(results){
               //     console.log(results);
               // });
            }
         });
      });
   }
});
