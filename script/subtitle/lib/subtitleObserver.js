class subtitleObserver {
   constructor(direct_sub_node) {
      this.direct_sub_node = direct_sub_node;
      // this.subtitleObserver = new MutationObserver((function() {
      //    this.changeSubtitle();
      // }).bind(this));
   }
   initData(vi, eng){
      this.dictEng = eng;
      this.dictVi = vi;
   }
   changeSubtitle(){
      let $captionNode = $(this.direct_sub_node);
      let time = this.videoElement.currentTime*1000;
      let translatedOb;
      if (this.mode === 0) {
         return;
      } else if (this.mode === 1) {
         translatedOb = this.dictVi.find(el => (el.start <= time && el.end >= time));
      } else if (this.mode === 2) {
         translatedOb = this.dictEng.find(el => (el.start <= time && el.end >= time));
      } else {
         return;
      }
      if (translatedOb !== undefined) {
         $captionNode.text(translatedOb.text);
      } else $captionNode.text("");
   }
   startObserver(element){
      this.videoElement = element
      let self = this;
      $(element).on(
        "timeupdate",
        function(event){
          self.changeSubtitle();
     });
   }
}
