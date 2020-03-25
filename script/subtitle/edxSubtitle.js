class EdxSubtitle {
   constructor() {
      this.cid = "edx";
      this.parseSubtitle = SubtitleHandling.parseSubByRegex.bind(SubtitleHandling);
   }
   run(){
      this.initData();
   }
   async initData(){
      let id = EdxId.getID();
      await RequestData.requestSubtitleData(this.cid, id, this.parseSubtitle)
      .then(res => {this.data = res});
      if(!this.data) return ;

      getSettingData().then(res => {
         let subtitleMode = res.modeSubtitle;
         if (subtitleMode === "1") {
            Notifycation.confirmSubtitle().then(mode => {
               this.startSubtitle(mode);
            });
         } else if (subtitleMode === "0") {
            this.startSubtitle(1);
         } else if (subtitleMode === "2") {}
      })
   }
   startSubtitle(mode){
      this.subtitleObserver = new subtitleObserver("#funixSubtitle");
      this.subtitleObserver.initData(this.data.vi, this.data.en);
      this.subtitleObserver.mode = mode;

      this.initElement(parseInt(mode));
      this.subtitleObserver.startObserver($("video").get(0));
   }
   initElement(mode){
      $(".closed-captions").remove();
      $(".toggle-captions").remove();
      let subtitleEle = $('<div class="closed-captions is-visible" style="display: block;" lang="funix" id = "funixSubtitle"><div>');
      let menuBtn = $('<button class="control subtitle" aria-disabled="false" title="FUNiX Subtitle" aria-label="FUNiX Subtitle"><span class="icon fa" aria-hidden="true"><img src="https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c"></span></button>');
      let menuContainer = $('<div class="menu-container" id= "funixSubtitleMenu" role="application"> <ol class="langs-list menu"></ol> </div>');

      let viBtn = $('<li><button class="control control-lang">Vietnamese</button></li>');
      let enBtn = $('<li><button class="control control-lang">English</button></li>');
      let offBtn = $('<li><button class="control control-lang">Off</button></li>');

      viBtn.click(() => {
         this.subtitleObserver.mode = 1;
         $(menuContainer).removeClass('is-opened');
         this.setActiveBtn(viBtn);
         $(subtitleEle).addClass('is-visible');
      });

      enBtn.click(() => {
         this.subtitleObserver.mode = 2;
         $(menuContainer).removeClass('is-opened');
         this.setActiveBtn(enBtn);
         $(subtitleEle).addClass('is-visible');
      });

      offBtn.click(() => {
         this.subtitleObserver.mode = 0;
         $(menuContainer).removeClass('is-opened');
         this.setActiveBtn(offBtn);
         $(subtitleEle).removeClass('is-visible');
      });

      menuBtn.click(
         () => {
            if($(menuContainer).hasClass('is-opened'))
            {
               $(menuContainer).removeClass('is-opened');
            } else {
               $(menuContainer).addClass('is-opened');
            }
         }
      )

      $([offBtn, viBtn, enBtn][mode]).trigger('click');

      menuContainer.find("ol").append(enBtn);
      menuContainer.find("ol").append(viBtn);
      menuContainer.find("ol").append(offBtn);
      $(".video-wrapper").append(subtitleEle);
      $(".add-fullscreen").after(menuBtn);
      $(".lang.menu-container").after(menuContainer);
   }
   setActiveBtn(btn){
      $("#funixSubtitleMenu .is-active").removeClass('is-active');
      $(btn).addClass('is-active');
   }
}

$(document).ready(function() {
   (new EdxSubtitle()).run();
});
