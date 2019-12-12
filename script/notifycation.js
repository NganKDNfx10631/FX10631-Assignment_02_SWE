function creatPrompt(submit) {
   let html =
   '<div id="reportForm"> <div class="wrapper" > <form> <div class="group"> <input id="name" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Name</label> </div> <div class="group"> <input id="email" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Email FUNiX</label> </div> <div class="group"> <textarea id="message" type="textarea" rows="5" required="required"></textarea><span class="highlight"></span><span class="bar"></span> <label>Message</label> </div> </form> </div> </div>'
   return {
      theme: 'modern',
      title: 'FUNiX Passport',
      boxWidth: '750px',
      useBootstrap: false,
      content: html,
       buttons: {
           formSubmit: {
               text: 'Submit',
               btnClass: 'btn-blue',
               action: submit
           },
           cancel: function () {},
       }
   };
}

function creatLoadingAjax(action) {
   return {
      title: '',
      closeIcon: false,
      boxWidth: '500px',
      useBootstrap: false,
      content: action
   };
}

function notify(text) {
   $.alert({
       title: 'Alert!',
       content: text,
       boxWidth: '500px',
       useBootstrap: false,
       closeIcon: true,
   });
}

function confirmSubtitle() {
   return new Promise(function(resolve, reject) {
      $.alert({
         icon: '',
         theme: 'modern',
         title: 'FUNiX Passport',
         content: "This page already has subtitles support, which language do you want to translate?",
         boxWidth: '500px',
         useBootstrap: false,
         buttons: {
            vi: {
               text: 'Vietnamese',
               action: function() {
                  // youtubeSubtitle.mode = 1;
                  // initButton();
                  // setActiveButton(viBtn);
                  // startObserver();
                  // startSubtitleModeOnYotube();
                  resolve(1);
               }
            },
            eng: {
               text: 'English',
               action: function() {
                  // youtubeSubtitle.mode = 2;
                  // initButton();
                  // setActiveButton(engBtn);
                  // startObserver();
                  // startSubtitleModeOnYotube();
                  resolve(2);
               }
            },
            off: {
               text: 'Keep original',
               action: function() {
                  // youtubeSubtitle.mode = 0;
                  // initButton();
                  // setActiveButton(offBtn);
                  // startObserver();
                  // startSubtitleModeOnYotube();
                  resolve(0);
               }
            }
         }
      });
   });
}
