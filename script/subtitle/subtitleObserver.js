class subtitleObserver {
   constructor(direct_sub_node) {
      this.direct_sub_node = direct_sub_node;
      this.subtitleObserver = new MutationObserver((function() {
         this.changeSubtitle();
      }).bind(this));
   }
   initData(base, vi, eng){
      this.dictEng = [];
      this.dictVi = [];
      for (var i = 0; i < base.length; i++) {
         this.dictVi[base[i].trim()] = vi[i];
         this.dictEng[base[i].trim()] = eng[i];
      }
   }
   changeSubtitle(){
      let $captionNode = $(this.direct_sub_node);
      let eng = $captionNode.text().trim(); // get current subtitle
      let translatedTxt;
      if (this.mode === 0) {
         this.oldSubtitle = eng;
         return;
      } else if (this.mode === 1) {
         translatedTxt = this.dictVi[eng];
      } else if (this.mode === 2) {
         translatedTxt = this.dictEng[eng];
      } else {
         return;
      }
      if (translatedTxt !== undefined && translatedTxt !== eng) {
         $captionNode.text(translatedTxt);
         this.oldSubtitle = eng;
      }
   }
   startObserver(element){
      this.subtitleObserver.observe(element, {
         subtree: true,
         childList: true,
         characterData: true
     });
   }
}
