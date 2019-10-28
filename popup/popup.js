var tabQuery =
{
   "active" : true,
   "currentWindow": true
};
$(document).ready(function() {
   initComponents();
   updateUI();
   addEvent();
});

/*Dropdown Menu*/
function initComponents(){

   var defaultselectbox = $('#cusSelectbox');
   var numOfOptions = $('#cusSelectbox').children('option').length;

   // hide select tag
   defaultselectbox.addClass('s-hidden');

   // wrapping default selectbox into custom select block
   defaultselectbox.wrap('<div class="cusSelBlock"></div>');

   // creating custom select div
   defaultselectbox.after('<div class="selectLabel"></div>');

   // getting default select box selected value
   $('.selectLabel').text(defaultselectbox.children('option').eq(0).text());

   // appending options to custom un-ordered list tag
   var cusList = $('<ul/>', {
      'class': 'options'
   }).insertAfter($('.selectLabel'));

   // generating custom list items
   for (var i = 0; i < numOfOptions; i++) {
      $('<li/>', {
         text: defaultselectbox.children('option').eq(i).text(),
         rel: defaultselectbox.children('option').eq(i).val()
      }).appendTo(cusList);
   }

   // open-list and close-list items functions
   function openList() {
      for (var i = 0; i < numOfOptions; i++) {
         $('.options').children('li').eq(i).attr('tabindex', i).css(
            'transform', 'translateY(' + (i * 100 + 100) + '%)').css(
            'transition-delay', i * 30 + 'ms');
      }
   }

   function closeList() {
      for (var i = 0; i < numOfOptions; i++) {
         $('.options').children('li').eq(i).css(
            'transform', 'translateY(' + i * 0 + 'px)').css('transition-delay', i * 0 + 'ms');
      }
      $('.options').children('li').eq(1).css('transform', 'translateY(' + 2 + 'px)');
      $('.options').children('li').eq(2).css('transform', 'translateY(' + 4 + 'px)');
   }

   // click event functions
   $('.selectLabel').click(function() {
      $(this).toggleClass('active');
      if ($(this).hasClass('active')) {
         openList();
         focusItems();
      } else {
         closeList();
      }
   });

   $(".options li").on('keypress click', async function(e) {
		e.preventDefault();
		$('.options li').siblings().removeClass();
		closeList();
		$('.selectLabel').removeClass('active');
		let text = $(this).text();
		$('.selectLabel').text(text);
		defaultselectbox.val(text);
		let mode =  $(this).attr("tabindex");
      updateSetting('modeSubtitle', mode);
		// await chrome.storage.sync.set({modeSubtitle:mode}, function() {});
   });
}

function updateSetting(name, data) {
   getSettingData()
   .then(res => {
      res[name] = data;
      chrome.storage.sync.set({funixPassportSetting:res}, function() {});
   })
}

function updateUI() {
   getSettingData().then(res => {
		$('.selectLabel').text($($("option")[res.modeSubtitle]).text());
      if(res.float)
      {
         $("#floating #toggle-on").prop('checked',true);
      } else $("#floating #toggle-off").prop('checked',true);
   });
}

function addEvent() {
   $($("#floating label")[0]).click(function(event) {
      updateSetting("float", true);
   });
   $($("#floating label")[1]).click(function(event) {
      updateSetting("float", false);
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

function focusItems() {

   $('.options').on('focus', 'li', function() {
      $this = $(this);
      $this.addClass('active').siblings().removeClass();
   }).on('keydown', 'li', function(e) {
      $this = $(this);
      if (e.keyCode == 40) {
         $this.next().focus();
         return false;
      } else if (e.keyCode == 38) {
         $this.prev().focus();
         return false;
      }
   }).find('li').first().focus();

}
