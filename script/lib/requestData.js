class RequestData {
   static async requestSubtitleData(cid, id, parseSubtitle)
   {
      let request = {
         content: "POST Request",
         requestUrl: "https://funix-subtitle.firebaseapp.com/get",
         requestBody: {
            cid: cid,
            lid: id
         }
      };
      let resAPI = {};
      await sendMessagePromise(request).then(res => {
         resAPI = res;
      });
      if(resAPI.code != 200) return null;
      let out = {};
      await sendMessagePromise({
         content: "GET Request",
         requestUrl: resAPI.data.vi,
      }).then(data => {
         out.vi = parseSubtitle(data);
      });
      await sendMessagePromise({
         content: "GET Request",
         requestUrl: resAPI.data.en,
      }).then(data => {
         out.en = parseSubtitle(data);
      });
      return out;
   }
}