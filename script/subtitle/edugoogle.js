let edugoogleSubtitleObserver,vi, eng, jp,oldURL,currentURL;
function initComponent() {
   initData().then((status) => {
      if(status)
      {
         getSettingData().then(res => {
            
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
               Notifycation.confirmSubtitle().then(mode => {
                  if(mode !== 0)
                  {
                     createElement(mode);
                  }
               });
            } 
            // else if (subtitleMode === "0") {
            //    createElement(1);
            // } else if (subtitleMode === "2") {}
         })
      }
   });
}

function checkURLchange(currentURL){
   if(currentURL != oldURL){
       oldURL = currentURL;
       initComponent();
   }

   oldURL = $("video.show > source").attr('src');
   setTimeout(function() {
       checkURLchange($("video.show > source").attr('src'));
   }, 1000);
}

function createElement(mode){
      //let container = $('<div class="vjs-react c-video vjs-fluid video-js vjs-controls-disabled vjs-workinghover vjs-has-started vjs-paused vjs-user-inactive" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: left;overflow: hidden;left: 5%;width: 90%;height: auto;bottom: 2%;position: absolute;"> <span class="captions-text" style="overflow-wrap: normal; display: block;bottom: 2%;position: absolute;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');
      //let container = $('<div class="vjs-react c-video vjs-fluid video-js vjs-controls-disabled vjs-workinghover vjs-has-started vjs-paused vjs-user-inactive" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: center;overflow: hidden;left: 5%;width: 90%;height: 42px;bottom: 2%;position: absolute;font-size: 18px"> <span class="captions-text" style="overflow-wrap: normal; display: block;position: absolute;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');
      
      let container = $('<div id="funix-text-bound" style ="position: absolute;bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: left;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 18px; opacity: 0.75;" id="funix-text"></div> </div>');
      //setTimeout(() => {
      //courseraSubtitleObserver = new subtitleObserver("#funix-text .ytp-caption-segment");
      edugoogleSubtitleObserver = new subtitleObserver("#funix-text");
      // alert(JSON.stringify(vi));
      edugoogleSubtitleObserver.initData(vi, eng, jp);
      edugoogleSubtitleObserver.mode = mode;
         
      $('#funix-text-bound').remove();
      startObserver();
      
      $(".gallery-content").append(container);
      //}, 1000);

      let funixSubtitle = document.getElementById("funix-text");

      if (funixSubtitle === undefined || funixSubtitle === null) {
         setTimeout(function() {
            createElement(mode);
         }, 1000);
      }
   }
   function startObserver() {
      //let video = $("video").get(0);
      let video = $("video.show").get(0);
      if(video !== undefined)
      {
         //alert("add subtitle mode " + mode);
         edugoogleSubtitleObserver.startObserver(video);
      } else {
         setTimeout(function() {
            startObserver();
         }, 1000);
      }
   }
   async function initData(){
      let urlSrc = $("video.show > source").attr('src');
      let id = urlSrc.split("/").splice(-1)[0].replace(".mp4", "");
      let request = {
         content: "POST Request",
         requestUrl: "https://funix-subtitle.firebaseapp.com/get",
         requestBody: {
            cid: "edugoogle",
            lid: id
         }
      };
      let resAPI = {};
      await sendMessagePromise(request).then(res => {
         resAPI = res;
      });
      if(resAPI.code === 200)
      {
         await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.vi,
         }).then(data => {
            vi = SubtitleHandling.parseSub(data);
            alert("data vi: " + JSON.stringify(data));
         });
         await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.jp,
         }).then(data => {
            jp = SubtitleHandling.parseSub(data);
         });
         return true;
      }
      return false;
   }


$(document).ready(function() {
   //(new CourseraSubtitle()).run();
   oldURL = $("video.show > source").attr('src');
   currentURL = $("video.show > source").attr('src');
   checkURLchange(oldURL);
   initComponent();
});


