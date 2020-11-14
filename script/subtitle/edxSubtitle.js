class EdxSubtitle {
   constructor() {
      this.cid = "edx";
      this.parseSubtitle = SubtitleHandling.parseSubByRegex.bind(SubtitleHandling);
   }
   run(){
      $("#sequence-list").click(() => {
         this.initData();
      });
      this.initData();
   }
   async initData(){

      // Number video
      this.numbVi = $("video").length;
      
      let id = EdxId.getID();
      await RequestData.requestSubtitleData(this.cid, id, this.parseSubtitle)
      .then(res => {this.data = res});
      if(!this.data) return ;

      this.data[1] = this.data;

      let i = 2;
      for (i = 2; i <= this.numbVi; i++){
         await RequestData.requestSubtitleData(this.cid, id + "_" + i, this.parseSubtitle)
         .then(res => {this.data[i] = res});
         //alert(i + "---" + JSON.stringify(this.data[i]));
      }

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
      let i = 1;
      for (i = 1; i <= this.numbVi ; i++){
         if (this.data[i]){
            //alert('Add sub ' + i);
            this.subtitleObserver = new subtitleObserver("#funixSubtitle" + i);
            this.subtitleObserver.initData(this.data[i].vi, this.data[i].en);
            this.subtitleObserver.mode = mode;

            this.initElement(parseInt(mode), i);
            this.subtitleObserver.startObserver($("video").get(i-1));
         }
      }

   }
   initElement(mode , idx){
      if (idx === 1) {
         $(".closed-captions").remove();
         $(".toggle-captions").remove();
      }
      
      let funixsubid = "<div class='closed-captions is-visible' style='display: block;' lang='funix' id = 'funixSubtitle" + idx +  "'><div>";
      let subtitleEle = $(funixsubid);

      //let subtitleEle = $('<div class="closed-captions is-visible" style="display: block;" lang="funix" id = "funixSubtitle"><div>');
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

      //$(".video-wrapper").append(subtitleEle);
      let count = 0;
      $(".video-wrapper").each(function(a){
         count = count + 1;
         if (count === idx) {
            $(this).append(subtitleEle);
         }
      });

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
