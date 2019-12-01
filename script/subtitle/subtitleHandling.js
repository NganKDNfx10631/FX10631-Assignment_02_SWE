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
   static parseYoutubeSub(f){
      let result = [];
      let pattern = /(\d+)\n([\d:,]+)\s+-{2}\>\s+([\d:,]+)\n([\s\S]*?(?=\n{2}|$))\n([\s\S]*?(?=\n{2}|$))/gm;
      let _regExp = new RegExp(pattern);
      let matches;

      f = f.replace(/\r\n|\r|\n/g, '\n')

      while ((matches = pattern.exec(f)) != null) {
         result.push(matches[4] +"\r\n"+ matches[5]);
      }
      return result;
   }
}
