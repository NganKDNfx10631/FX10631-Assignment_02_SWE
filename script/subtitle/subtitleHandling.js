class SubtitleHandling {
   static parseSub(data){
      let result = [];
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
}
