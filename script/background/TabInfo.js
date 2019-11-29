// Get info of current tab
class TabInfo {
   constructor() {}
   static getTabID()
   {
      return new Promise((resolve, reject) => {
         chrome.tabs.query({currentWindow: true, active : true}, function(tabs){
            console.log(tabs);
            resolve("tabs");
         });
     });
  }
}
