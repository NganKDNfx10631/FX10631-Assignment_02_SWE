let courseraSubtitleObserver,vi, eng;
function initComponent(){
   // alert("coursera init");
   initData().then((status) => {
      if(status)
      {
         getSettingData().then(res => {

            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "1") {
               Notifycation.confirmSubtitle().then(mode => {
                  if(mode != 0)
                  {
                     createElement(mode);
                  }
               });
            } else if (subtitleMode === "0") {
               createElement(1);
            } else if (subtitleMode === "2") {}
         })
      }
   });
}
function createElement(mode){
      //let container = $('<div class="vjs-react c-video vjs-fluid video-js vjs-controls-disabled vjs-workinghover vjs-has-started vjs-paused vjs-user-inactive" id="funix-text" dir="ltr" tabindex="0" aria-live="assertive" lang="en" draggable="true" data-layer="4" style="touch-action: none;text-align: left;overflow: hidden;left: 0;width: 100%;height: 50px;bottom: 2%;"> <span class="captions-text" style="overflow-wrap: normal; display: block;"> <span class="caption-visual-line" style="display: block;"> <span class="ytp-caption-segment" style="word-wrap: break-word;width: 100%;display: inline-block;white-space: pre-wrap;background: rgba(8, 8, 8, 0.5);-webkit-box-decoration-break: clone;border-radius: 5.20556px;font-size: 2.5vw;color: rgb(255, 255, 255);fill: rgb(255, 255, 255);font-family: &quot;YouTube Noto&quot;, Roboto, &quot;Arial Unicode Ms&quot;, Arial, Helvetica, Verdana, &quot;PT Sans Caption&quot;, sans-serif;"> </span> </span> </span> </div>');
      let container = $("<div class='closed-captions is-visible' style='display: block;padding-top:2.5px; background-color: grey; color: white; height : 30px;text-align: center' lang='funix' id = 'funix-text'><div>");
      setTimeout(() => {
         //courseraSubtitleObserver = new subtitleObserver("#funix-text .ytp-caption-segment");
         courseraSubtitleObserver = new subtitleObserver("#funix-text");
         // alert(JSON.stringify(vi));
         courseraSubtitleObserver.initData(vi, eng);
         courseraSubtitleObserver.mode = mode;
            
         startObserver();
         // alert("add sub");
         //$(".rc-VideoMiniPlayer").append('<h4>Storm Rider </h4>');
         $(".rc-VideoMiniPlayer").append(container);
        }, 5000);
   }
   function startObserver() {
      let video = $("video").get(0);
      if(video !== undefined)
      {
         // alert("coursera start");

         courseraSubtitleObserver.startObserver(video);
      } else {
         setTimeout(function() {
            startObserver();
         }, 1000);
      }
   }
   async function initData(){

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
      if(resAPI.code === 200)
      {
         await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.vi,
         }).then(data => {
            // alert("data : " + JSON.stringify(data));
            vi = SubtitleHandling.parseSubByRegex(data);
         });
         // await sendMessagePromise({
         //    content: "GET Request",
         //    requestUrl: resAPI.data.en,
         // }).then(data => {
         //    self.en = SubtitleHandling.parseSub(data);
         // });
         return true;
      }
      return false;
   }


$(document).ready(function() {
   //(new CourseraSubtitle()).run();
   initComponent();
});
