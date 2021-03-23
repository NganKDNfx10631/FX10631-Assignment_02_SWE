let youtubeSubtitle, vi, bs, eng, jp,
    iconBtn, viBtn, engBtn, offBtn, settingMenu,
    captionNode;

$(document).ready(function() {
   initData();
});

function startObserver() {
   let video = $("video").get(0);
   if(video !== undefined)
   {
      youtubeSubtitle.startObserver(video);
   } else {
      setTimeout(function() {
         startObserver();
      }, 1000);
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
            youtubeSubtitle = new subtitleObserver("#funix-text .ytp-caption-segment");
            youtubeSubtitle.initData(vi, eng , jp);
            showConfirm();
         });
      }
   });
}

function initButton()
{
   iconBtn = $('<button class="ytp-button" aria-haspopup="true" aria-owns="funix-setting" aria-label="Funix Subtitle Setting" title="Funix Subtitle Setting"> <img src="https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c" style="height:90%;width:90%;"></button>');
   settingMenu = $('<div class="ytp-popup ytp-settings-menu" data-layer="6" id="funix-setting" style="width: 251px; height: 112px; display:none;"> <div class="ytp-panel" style="min-width: 200px; width: 251px; height: 112px;"> <div class="ytp-panel-menu" role="menu" style="height: 112px;"> </div> </div> </div>');
   viBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label" style = "padding-left:15px;">Vietnamese</div></div>');
   engBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label" style = "padding-left:15px;">English</div></div>');
   offBtn = $('<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0"> <div class="ytp-menuitem-label" style = "padding-left:15px;">Off</div></div>');

   iconBtn.click(function(event) {
      settingMenu.slideToggle("fast",function() {});
   });
   viBtn.click(function(event) {
      setActiveButton(viBtn);
      youtubeSubtitle.mode = 1;
      settingMenu.slideToggle("fast",function() {});
   });
   engBtn.click(function(event) {
      setActiveButton(engBtn);
      youtubeSubtitle.mode = 2;
      settingMenu.slideToggle("fast",function() {});
   });
   offBtn.click(function(event) {
      setActiveButton(offBtn);
      youtubeSubtitle.mode = 0;
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
         Notifycation.confirmSubtitle().then(mode => {
            youtubeSubtitle.mode = mode;
            initButton();
            setActiveButton([offBtn, viBtn, engBtn][mode]);
            startObserver();
            initVisibleSubtitle();
         });
      } else if (subtitleMode === "0") {
         youtubeSubtitle.mode = 1;
         initButton();
         setActiveButton(viBtn);
         startObserver();
         initVisibleSubtitle();
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
      vi = SubtitleHandling.parseSubByRegex(data);
   });
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: data.en,
   }).then(data => {
      eng = SubtitleHandling.parseSubByRegex(data);
   });
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: data.jp,
   }).then(data => {
      if (data !== undefined) {
         jp = SubtitleHandling.parseSubByRegex(data);
      }
   });
}

function setActiveButton(button) {
   $("#funix-setting .ytp-swatch-color").removeClass('ytp-swatch-color');
   $(button).addClass('ytp-swatch-color');
}

function getVideoID() {
   return (window.location.pathname).split("/")[2];
}

function initVisibleSubtitle() {
   let container = $('<div class="caption-window ytp-caption-window-bottom ytp-caption-window-rollup" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: left;overflow: hidden;left: 5%;width: 90%;height: auto;bottom: 2%;"> <span class="captions-text" style="overflow-wrap: normal; display: block;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');
   setTimeout(() => {
      $("#player > div")
      .append(container);
   }, 1000);
}
