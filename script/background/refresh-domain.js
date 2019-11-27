// Refresh domain each day or when user open Chrome
const TIME_REFRESH_DOMAIN = 86400000; // 1 day

$.post("https://translation.funix.edu.vn/get-all-selector", res => {
   chrome.storage.sync.set({domainList: res}, function() {
      setTimeout(function(){
         refreshDomainList();
      }, TIME_REFRESH_DOMAIN);
   });
});
