let captionNode = '.ytp-caption-segment:nth-child(0)';
let youtubeSubtitle, vi, bs;

$(document).ready(function() {
   youtubeSubtitle = new subtitleObserver("");
   initData().then(res => {
      youtubeSubtitle.initData(bs, vi, vi);
      youtubeSubtitle.changeSubtitle = function() {
         let current = getCurrentSubtitle();
         if(current !== this.oldSubtitle)
         {
            let translatedTxt = this.dictVi[current];
            if(translatedTxt !== undefined)
            {
               let cut = translatedTxt.split("\r\n");
               $(".ytp-caption-segment").each(function(index, el) {
                     $(el).text(cut[index]);
               });
            }
         }
      }
      startObserver();
   });;
});

function startObserver() {
   try {
      youtubeSubtitle.startObserver($("#player > div").get(0));
   } catch (e) {
      setTimeout(function() {
         startObserver();
      }, 1000);
   }
}

async function initData()
{
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: "https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/%5BDownSub.com%5D%20Tip%201_%20Think%20Before%20You%20Share%20(1).srt?alt=media&token=d49f7b44-d7d7-4420-aa48-c9e81ad8819d",
   }).then(data => {
      vi = SubtitleHandling.parseYoutubeSub(data);
   });
   await sendMessagePromise({
      content: "GET Request",
      requestUrl: "https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/%5BDownSub.com%5D%20Tip%201_%20Think%20Before%20You%20Share.srt?alt=media&token=2bb851ea-7f53-411d-bfdb-d2a298287f96",
   }).then(data => {
      bs = SubtitleHandling.parseYoutubeSub(data);
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
