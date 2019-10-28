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
