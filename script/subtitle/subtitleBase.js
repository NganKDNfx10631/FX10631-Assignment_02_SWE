class SubtitleBase {
   constructor() {

   }
   async initData(){
      await RequestData.requestSubtitleData(this.cid, this.getId(), this.parseSubtitle)
      .then(res => {this.data = res});
      if(!this.data) return ;
      getSettingData().then(res => {
         let subtitleMode = res.modeSubtitle;
         if (subtitleMode === "0") {
            Notifycation.confirmSubtitle().then(mode => {
               if(mode !== 0)
               {
                  this.startSubtitle(mode);
               }
            });
         } 
         // else if (subtitleMode === "0") {
         //    this.startSubtitle(1);
         // } else if (subtitleMode === "2") {}
      })
   }
   run(){
      this.initData();
   }
   getId(){}
   startSubtitle(mode){
      let selector = this.selector || '#funixSubtitle';
      this.subtitleObserver = new subtitleObserver(selector);
      this.subtitleObserver.initData(this.data.vi, this.data.en);
      this.subtitleObserver.mode = mode;

      this.initElement(parseInt(mode));
      this.subtitleObserver.startObserver($("video").get(0));
   }
   initElement(mode){

   }
}