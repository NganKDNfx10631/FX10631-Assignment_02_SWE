let courseraSubtitleObserver, vi, eng, jp, oldURL, currentURL;
function initComponent() {
   initData().then((status) => {
      if (status) {
         getSettingData().then(res => {
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
               let video = $("video"); // check tag video
               if (!video || video.length == 0)
                  return false;

               Notifycation.confirmSubtitle().then(mode => {
                  if (mode !== 0) {
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

function checkURLchange(currentURL) {
   if (currentURL != oldURL) {
      oldURL = currentURL;
      initComponent();
   }

   oldURL = window.location.pathname;
   setTimeout(function () {
      checkURLchange(window.location.pathname);
   }, 1000);
}

function createElement(mode) {
   //let container = $('<div class="vjs-react c-video vjs-fluid video-js vjs-controls-disabled vjs-workinghover vjs-has-started vjs-paused vjs-user-inactive" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: left;overflow: hidden;left: 5%;width: 90%;height: auto;bottom: 2%;position: absolute;"> <span class="captions-text" style="overflow-wrap: normal; display: block;bottom: 2%;position: absolute;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');
   //let container = $('<div class="vjs-react c-video vjs-fluid video-js vjs-controls-disabled vjs-workinghover vjs-has-started vjs-paused vjs-user-inactive" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: center;overflow: hidden;left: 5%;width: 90%;height: 42px;bottom: 2%;position: absolute;font-size: 18px"> <span class="captions-text" style="overflow-wrap: normal; display: block;position: absolute;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');

   let container = $('<div style ="position: absolute;bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: center;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 2.5vh; opacity: 0.75;" id="funix-text"></div> </div>');
   //setTimeout(() => {
   //courseraSubtitleObserver = new subtitleObserver("#funix-text .ytp-caption-segment");
   courseraSubtitleObserver = new subtitleObserver("#funix-text");
   // alert(JSON.stringify(vi));
   courseraSubtitleObserver.initData(vi, eng, jp);
   courseraSubtitleObserver.mode = mode;

   startObserver();

   $(".rc-VideoControlsContainer").append(container);
   //}, 1000);

   let funixSubtitle = document.getElementById("funix-text");

   if (funixSubtitle === undefined || funixSubtitle === null) {
      setTimeout(function () {
         createElement(mode);
      }, 1000);
   }
}
function startObserver() {
   let video = $("video").get(0);
   if (video !== undefined) {
      courseraSubtitleObserver.startObserver(video);
   } else {
      setTimeout(function () {
         startObserver();
      }, 1000);
   }
}
async function initData() {
   let id = window.location.pathname.split("/").splice(-1)[0];
   let request = {
      content: "POST Request",
      requestUrl: "https://funix-subtitle.firebaseapp.com/get",
      requestBody: {
         cid: "coursera",
         lid: id
      }
   };
   let resAPI = {};
   await sendMessagePromise(request).then(res => {
      resAPI = res;
   });

   if (resAPI.code === 200) {
      // check duplicate id
      if (resAPI.data.numb !== undefined) {
         let pathFile = window.location.pathname;
         let numb = resAPI.data.numb;
         let isNew = "1";
         for (var i = 1; i <= numb; i++) {
            let request2 = {
               content: "POST Request",
               requestUrl: "https://funix-subtitle.firebaseapp.com/get",
               requestBody: {
                  cid: "coursera",
                  lid: id + "_" + i.toString()
               }
            };
            let resAPI2 = {};
            await sendMessagePromise(request2).then(res => {
               resAPI2 = res;
            });
            if (resAPI2.code === 200) {
               if (resAPI2.data.url !== undefined && resAPI2.data.url.includes(pathFile)) {
                  await sendMessagePromise({
                     content: "GET Request",
                     requestUrl: resAPI2.data.vi,
                  }).then(data => {
                     if (data !== undefined) {
                        vi = SubtitleHandling.parseSubByRegex(data);
                     }
                  });

                  await sendMessagePromise({
                     content: "GET Request",
                     requestUrl: resAPI2.data.jp,
                  }).then(data => {
                     if (data !== undefined) {
                        jp = SubtitleHandling.parseSubByRegex(data);
                     }
                  });
                  isNew = "2";
               }
            }
         }
         if (isNew === "2") {

         }
         else {
            await sendMessagePromise({
               content: "GET Request",
               requestUrl: resAPI.data.vi,
            }).then(data => {
               if (data !== undefined) {
                  vi = SubtitleHandling.parseSubByRegex(data);
               }
            });

            await sendMessagePromise({
               content: "GET Request",
               requestUrl: resAPI.data.jp,
            }).then(data => {
               if (data !== undefined) {
                  jp = SubtitleHandling.parseSubByRegex(data);
               }
            });
         }

      } else {

         await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.vi,
         }).then(data => {
            // alert("data : " + JSON.stringify(data));
            if (data !== undefined) {
               vi = SubtitleHandling.parseSubByRegex(data);
            }
         });
         // await sendMessagePromise({
         //    content: "GET Request",
         //    requestUrl: resAPI.data.en,
         // }).then(data => {
         //    self.en = SubtitleHandling.parseSub(data);
         // });

         await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.jp,
         }).then(data => {
            if (data !== undefined) {
               jp = SubtitleHandling.parseSubByRegex(data);
            }
         });

      }
      return true;
   }
   return false;
}


$(document).ready(function () {
   //(new CourseraSubtitle()).run();
   oldURL = window.location.pathname;
   currentURL = window.location.pathname;
   checkURLchange(oldURL);
   setTimeout(function () {
      initComponent();
   }, 3000);
});