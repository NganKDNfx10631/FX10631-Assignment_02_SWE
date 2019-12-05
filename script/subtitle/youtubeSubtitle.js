let url = window.location.href;
if(!url.includes("?&cc_load_policy=1&cc_lang_pref=en&hl=en"))
{
   location.replace(url + "?&cc_load_policy=1&cc_lang_pref=en&hl=en");
}

let youtubeSubtitle, vi, bs, eng,
    iconBtn, viBtn, engBtn, offBtn, settingMenu;

$(document).ready(function() {
   initComponents();
});

function getTranslate(current) {
   let translatedTxt = undefined;
   if(youtubeSubtitle.mode == 1)
   {
      translatedTxt = youtubeSubtitle.dictVi[current];
   } else if(youtubeSubtitle.mode == 2)
   {
      translatedTxt = youtubeSubtitle.dictEng[current];
   }
   return translatedTxt;
}

function changeText(translatedTxt)
{
   let cut = translatedTxt.split("\r\n");
   $(".ytp-caption-segment").each(function(index, el) {
         $(el).text(cut[index]);
   });
}

function startObserver() {
   try {
      youtubeSubtitle.startObserver($("#player > div").get(0));
   } catch (e) {
      setTimeout(function() {
         startObserver();
      }, 1000);
   }
}

function initComponents() {

   youtubeSubtitle = new subtitleObserver("");
   youtubeSubtitle.changeSubtitle = function() {
      let current = getCurrentSubtitle();
      if(current !== youtubeSubtitle.oldSubtitle)
      {
         let translatedTxt = getTranslate(current);
         if(translatedTxt !== undefined)
         {
            changeText(translatedTxt);
            youtubeSubtitle.oldSubtitle = current;
         }
      }
   }
   initData();
}

function initData()
{
   let request = {
      content: "POST Request",
      requestUrl: "https://funix-subtitle.firebaseapp.com/get",
      requestBody: {
         cid: 'youtube',
         lid: getVideoID()
      }
   };
   sendMessagePromise(request).then(res => {
      if(res.code === 200)
      {
         getData(res.data).then(res => {
            youtubeSubtitle.initData(bs, vi, eng);
            showConfirm();
         });
      }
   });
}

function initButton()
{
   iconBtn = $('<button class="ytp-button" aria-haspopup="true" aria-owns="funix-setting" aria-label="Funix Subtitle Setting" title="Funix Subtitle Setting"> <img src="https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c" style="height:90%;width:90%;"></button>');
   settingMenu = $('<div class="ytp-popup ytp-settings-menu" data-layer="6" id="funix-setting" style="width: 251px; height: 112px; display:none;"> <div class="ytp-panel" style="min-width: 200px; width: 251px; height: 112px;"> <div class="ytp-panel-menu" role="menu" style="height: 112px;"> </div> </div> </div>');
   viBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label">Vietnamese</div></div>');
   engBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label">English</div></div>');
   offBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label">Off</div></div>');

   iconBtn.click(function(event) {
      settingMenu.slideToggle("fast",function() {});
   });
   viBtn.click(function(event) {
      setActiveButton(viBtn);
      youtubeSubtitle.mode = 1;
      changeText(getTranslate(youtubeSubtitle.oldSubtitle));
      settingMenu.slideToggle("fast",function() {});
   });
   engBtn.click(function(event) {
      setActiveButton(engBtn);
      youtubeSubtitle.mode = 2;
      changeText(getTranslate(youtubeSubtitle.oldSubtitle));
      settingMenu.slideToggle("fast",function() {});
   });
   offBtn.click(function(event) {
      setActiveButton(offBtn);
      youtubeSubtitle.mode = 0;
      changeText(youtubeSubtitle.oldSubtitle);
      settingMenu.slideToggle("fast",function() {});
   });

   settingMenu.find(".ytp-panel-menu").append(viBtn);
   settingMenu.find(".ytp-panel-menu").append(engBtn);
   settingMenu.find(".ytp-panel-menu").append(offBtn);
   $("#player > div").append(settingMenu);
   $(".ytp-right-controls").prepend(iconBtn);
}

function showConfirm()
{
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
                     youtubeSubtitle.mode = 1;
                     initButton();
                     setActiveButton(viBtn);
                     startObserver();
                  }
               },
               eng: {
                  text: 'English',
                  action: function() {
                     youtubeSubtitle.mode = 2;
                     initButton();
                     setActiveButton(engBtn);
                     startObserver();
                  }
               },
               off: {
                  text: 'Keep original',
                  action: function() {
                     youtubeSubtitle.mode = 0;
                     initButton();
                     setActiveButton(offBtn);
                     startObserver();
                  }
               }
            }
         });
      } else if (subtitleMode === "0") {
         youtubeSubtitle.mode = 1;
         initButton();
         setActiveButton(viBtn);
         startObserver();
      } else if (subtitleMode === "2") {
         setActiveButton(offBtn);
      }
   });
}

async function getData(data)
{
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: data.vi,
   }).then(data => {
      vi = SubtitleHandling.parseYoutubeSub(data);
   });
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: data.bs,
   }).then(data => {
      bs = SubtitleHandling.parseYoutubeSub(data);
   });
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: data.en,
   }).then(data => {
      eng = SubtitleHandling.parseYoutubeSub(data);
   });
}

function getCurrentSubtitle()
{
   let subtitle = "";
   $(".ytp-caption-segment").each(function(index, el) {
         subtitle += $(el).text();
         subtitle += "\r\n";
   });
   return subtitle.trim();
}

function setActiveButton(button) {
   $("#funix-setting .ytp-swatch-color").removeClass('ytp-swatch-color');
   button.addClass('ytp-swatch-color');
}

function getVideoID() {
   return (window.location.pathname).split("/")[2];
}
