chrome.runtime.onMessage.addListener(function(req){
   switch (req) {
      case "report":{
         reportIssue()
         break;
      }
   }
});

function reportIssue() {
   $.confirm(Notifycation.creatPrompt(function() {
      return postReport(this);
   }));
}

function postReport(self) {
   let data = {};
   data.name = self.$content.find('#name').val();
   data.email = self.$content.find('#email').val();
   data.message = self.$content.find('#message').val();

   data.url = window.location.href;
   // Validate
   if(data.name === "" || data.email === "" || data.message === "")
   {
      Notifycation.notify("Fill all information!");
      return false;
   }
   data.date = (new Date()).toLocaleDateString("vi");
   let report = {
      id: (new Date()).getTime() + "",
      data: data
   };

   $.alert(Notifycation.creatLoadingAjax(function() {
      var self = this;
      self.showLoading(true);
      let request = {
         content: "POST Request",
         requestUrl: "https://funix-onpage-translator.firebaseapp.com/add-ticket",
         requestBody: report
      };
      chrome.runtime.sendMessage(request, res => {
         if(res.code === 200) self.setContent("Thanks for report!");
         else self.setContent("Can't send report! Try again :(");
         self.hideLoading(true);
      });
   }));

   let reportMail = {
      toemail: data.email
   };

   let requestSendMail = {
      content: "POST Request",
      requestUrl: "https://funix-onpage-translator.firebaseapp.com/send-email-ticket",
      requestBody: reportMail
   };
   chrome.runtime.sendMessage(requestSendMail, res => {
   });
}
