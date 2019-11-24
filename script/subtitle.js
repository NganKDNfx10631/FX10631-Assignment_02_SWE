var dictEng, dictVi, currentDict, // HashMap store sub data
   mode,
   videoObserver, subtitleObserver,
   button, iconBtn, viBtn, engBtn, offBtn,
   oldSubtitle,
   enable, // Check if Extension is enable
   pathname = window.location.pathname;
var vi,
   eng,
   base;
const caption = ".captions-display--captions-container--1-aQJ"
direct_sub_node = '.captions-display--captions-cue-text--ECkJu';

async function initData() {
   vi = [];
   eng = [];
   dictVi = Object.create(null);
   dictEng = Object.create(null);
   // Get data
   let params = window.location.pathname.split("/");
   let body = {};
   if(params.length === 6)
   {
      body = {
         cid: params[2],
         lid: params[5]
      }
   } else if(params.length === 5)
   {
      body = {
         cid: params[1],
         lid: params[4]
      }
   }
   let request = {
      content: "POST Request",
      requestUrl: "https://funix-subtitle.firebaseapp.com/get",
      requestBody: body
   };
   let resAPI = {};
   await sendMessagePromise(request).then(res => {
      resAPI = res;
   });
   if (resAPI.code === 200) {
      // get Eng sub
      await sendMessagePromise({
         content: "GET Request",
         requestUrl: resAPI.data.en,
      }).then(data => {
         eng = parseSub(data);
      });
      // Get Viet sub
      await sendMessagePromise({
         content: "GET Request",
         requestUrl: resAPI.data.vi,
      }).then(data => {
         vi = parseSub(data);
      });
      // Get base sub
      await sendMessagePromise({
         content: "GET Request",
         requestUrl: resAPI.data.bs,
      }).then(data => {
         base = parseSub(data);
      });

      for (var i = 0; i < base.length; i++) {
         dictVi[base[i]] = vi[i];
         dictEng[base[i]] = eng[i];
      }
      console.log(dictVi);
   }
   return resAPI.code;
}

// convert .srt file into text array
function parseSub(data) {
   var result = [];
   let items = data.split("\n\r\n");
   $.each(items, function(index, el) {
      let cut = el.split("\r\n");
      try {
         result.push(cut[2].trim());
      } catch (e) {
         result.push("");
      }
   });
   return result;
}

$(document).ready(function() {
   enable = false;
   initComponents();
   changeSubtitle();
   startObserver();
   initData()
      .then(data => {
         pageLoad(data);
      });
});

function initComponents() {
   // Setup Subtitle button
   initButton();

   //Observe the paragraph
   subtitleObserver = new MutationObserver(function(mutations) {
      changeSubtitle();
   }.bind(this));

   // reload subtitle when user change lesson.
   videoObserver = new MutationObserver(function(mutations) {
      // Check if user change lesson.
      if (window.location.pathname !== pathname) {
         pathname = window.location.pathname;
         mode = 0;
         initData().then(code => {
            pageLoad(code);
         });
      }
   });
}

function pageLoad(code) {
   // Pause video;
   $("button[aria-label=\"Pause\"]").trigger("click");
   startObserver();
   if (code === 200) {
      getSettingData().then(res => {
         let subtitleMode = res.modeSubtitle;
         if (subtitleMode === "1") {
            $.alert({
               icon: '',
               theme: 'modern',
               title: 'FUNiX Passport',
               content: "This Lecture already has subtitles support, which language do you want to translate?",
               boxWidth: '500px',
               useBootstrap: false,
               buttons: {
                  vi: {
                     text: 'Vietnamese',
                     action: function() {
                        start(1, res.float);
                        changeSubtitle();
                        setActiveButton(viBtn);
                     }
                  },
                  eng: {
                     text: 'English',
                     action: function() {
                        start(2, res.float);
                        changeSubtitle();
                        setActiveButton(engBtn);
                     }
                  },
                  off: {
                     text: 'Keep original',
                     action: function() {
                        setActiveButton(offBtn);
                     }
                  }
               }
            });
         } else if (subtitleMode === "0") {
            start(1, res.float);
         } else if (subtitleMode === "2") {
            setActiveButton(offBtn);
         }
      });
   }
}

function start(type, float) {
   mode = type;
   // Add Subtitle Button
   button.insertAfter("button[aria-label=\"Captions\"]");

   // Change Transcript when user open
   $("[aria-label=\"Transcript\"]").parent().parent().click(function() {
      if (mode === 1) changeTranscript(dictVi);
      else if (mode === 2) changeTranscript(dictEng);
   });
   // Change transcript if is exit when user open page
   if ($(".transcript--cue-container--wu3UY").length > 0) {
      changeTranscript(dictVi);
   }

   turnSubtitleOn();
   changeSubtitle();
   if(float) initMenuComponents();
}

function changeSubtitle() {
   let captionNode = $(direct_sub_node);

   let eng = captionNode.text().trim(); // get current subtitle
   let translatedTxt;
   if (mode === 0) {
      oldSubtitle = eng;
      return;
   } else if (mode === 1) {
      translatedTxt = dictVi[eng];
   } else if (mode === 2) {
      translatedTxt = dictEng[eng];
   } else {
      return;
   }

   if (translatedTxt !== undefined && translatedTxt !== eng) {
      captionNode.text(translatedTxt);
      oldSubtitle = eng;
   }

}

function startObserver() {
   try {
      captionContainer = $(caption).get(0);
      subtitleObserver.observe(captionContainer, {
         subtree: true,
         childList: true,
         characterData: true
      });
      videoObserver.observe($("video").get(0), {
         attributes: true
      });
   } catch {
      setTimeout(function() {
         startObserver();
      }, 500);
   }
}

function changeTranscript(tranList) {
   setTimeout(function() {
      let container = $(".transcript--cue-container--wu3UY > p > span");
      if (container.length > 0) {
         $.each(container, function(index, value) {
            let text = $(value).text();
            let tranText = tranList[text];
            if (tranText !== undefined) {
               $(value).text(tranText);
            }
         });
      }
   }, 500);
}

function initButton() {
   // Init elements
   button = $("<div data-purpose=\"captions-menu-button\" class=\"menu--dropdown--3Vksr dropup btn-group\"></div>");
   iconBtn = $("<button aria-label=\"FUNiX\" data-purpose=\"theatre-mode-toggle-button\" aria-labelledby=\"popper10\" aria-describedby=\"popper10\" tabindex=\"0\" type=\"button\" class=\"control-bar-button--button--20ibv btn btn-text\"> <span class=\"control-bar-button--icon--28inh udi\"> <img src=\"https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c\"></span></button>");
   viBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a role=\"menuitem\" tabindex=\"-1\">Vietnamese [FUNiX]</a></li>");
   engBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a role=\"menuitem\" tabindex=\"-1\">English [FUNiX]</a></li>");
   offBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a data-purpose=\"go-to-settings\" role=\"menuitem\" tabindex=\"-1\">Keep original</a></li>");

   let list = $("<ul role=\"menu\" class=\"menu--menu--2Pw42 menu--captions-menu--beS8H dropdown-menu dropdown-menu-right\" aria-labelledby=\"captions-menu\" style=\"max-height: 418.6px;\"></ul>");

   // Add click Envents
   iconBtn.click(function(event) {
      if (enable) {
         button.removeClass("open");
         enable = false;
      } else {
         button.addClass("open");
         enable = true;
      }
   });

   viBtn.click(function(event) {
      turnSubtitleOn();
      setActiveButton(viBtn);
      $(direct_sub_node).text(oldSubtitle);
      mode = 1;
      changeSubtitle();
      if ($(".transcript--cue-container--wu3UY").length > 0) {
         changeTranscript(dictVi);
      }
   });

   engBtn.click(function(event) {
      turnSubtitleOn();
      setActiveButton(engBtn);
      $(direct_sub_node).text(oldSubtitle);
      mode = 2;
      changeSubtitle();
      if ($(".transcript--cue-container--wu3UY").length > 0) {
         changeTranscript(dictEng);
      }
   });

   offBtn.click(function(event) {
      setActiveButton(offBtn);
      $(direct_sub_node).text(oldSubtitle);
      mode = 0;
   });


   // Add elements
   list.append(viBtn);
   list.append(engBtn);
   list.append($("<li role=\"separator\" class=\" menu--menu--2Pw42 menu--item--2IgLt divider\"></li>"));
   list.append(offBtn);
   button.append(iconBtn);
   button.append(list);
}

function setActiveButton(buttonActive) {
   viBtn.removeClass("active");
   engBtn.removeClass("active");
   offBtn.removeClass("active");

   buttonActive.addClass("active");
   button.removeClass("open");
}

function turnSubtitleOn() {
   try {
      let el = $("button[aria-label=\"Captions\"]").parent().find("ul > li > a")[4];
      var evObj = document.createEvent('Events');
      evObj.initEvent("click", true, false);
      let out = el.dispatchEvent(evObj);
   } catch (e) {
      setTimeout(function() {
         turnSubtitleOn();
      }, 500);
   }
}
