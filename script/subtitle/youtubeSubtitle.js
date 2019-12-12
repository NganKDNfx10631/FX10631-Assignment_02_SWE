let url = window.location.href;
if(!url.includes("?&cc_load_policy=1&cc_lang_pref=en&hl=en&autohide=1&autoplay=1"))
{
   location.replace(url + "?&cc_load_policy=1&cc_lang_pref=en&hl=en&autohide=1&autoplay=1");
}

let youtubeSubtitle, vi, bs, eng,
    iconBtn, viBtn, engBtn, offBtn, settingMenu,
    captionNode;

$(document).ready(function() {
   initData();
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

function initComponents(type) {

   if(!type)
   {
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
   } else {
      youtubeSubtitle.changeSubtitle = function() {
         let lines = $("div:not(#funix-subtitle) .ytp-caption-segment");
         let currentLine = $(lines[lines.length - 1]);
         let base = bs.find(url => url.includes(currentLine.text()));
         if(base != undefined && base != youtubeSubtitle.oldSubtitle)
         {
            let translatedTxt = getTranslate(base.trim());
            if(translatedTxt !== undefined)
            {
               $(captionNode).text(translatedTxt);
               youtubeSubtitle.oldSubtitle = base;
            }
         }
      }
   }
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
         getData(res.data).then(() => {
            youtubeSubtitle = new subtitleObserver("");
            youtubeSubtitle.initData(bs, vi, eng);
            initComponents(res.data.isAuto);
            showConfirm(res.data.isAuto);
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

function showConfirm(type)
{
   getSettingData().then(res => {
      let subtitleMode = res.modeSubtitle;
      if (subtitleMode === "1") {
         confirmSubtitle().then(mode => {
            youtubeSubtitle.mode = mode;
            initButton();
            startObserver();
            if(type)
            {
               startSubtitleModeOnYotube();
               initVisibleSubtitle();
            }
         });
      } else if (subtitleMode === "0") {
         youtubeSubtitle.mode = 1;
         initButton();
         setActiveButton(viBtn);
         startObserver();
         if(type)
         {
            startSubtitleModeOnYotube();
            initVisibleSubtitle();
         }
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

function startSubtitleModeOnYotube() {
   $(".ytp-subtitles-button")
   .trigger("click");
}

function initVisibleSubtitle() {
   let container = $('<div class="caption-window ytp-caption-window-bottom ytp-caption-window-rollup" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none; text-align: left; overflow: hidden; left: 21.2%; width: 1093px; height: 100px; bottom: 2%;"> <span class="captions-text" style="overflow-wrap: normal; display: block;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="display: inline-block; white-space: pre-wrap; background: rgba(8, 8, 8, 0.5); -webkit-box-decoration-break: clone; border-radius: 5.20556px; font-size: 41.6444px; color: rgb(255, 255, 255); fill: rgb(255, 255, 255); font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"></span> </span> </span> </div>');
   captionNode = container.find(".ytp-caption-segment");
   setTimeout(() => {
      $("#caption-window-1")
      .css('display', 'none')
      .before(container);
   }, 1000);
}
