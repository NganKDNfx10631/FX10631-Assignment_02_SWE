class UdacitySubtitle extends SubtitleBase{
   constructor() {
      super();
      this.cid = "udacity"
      this.selector = '#funix-subtitle > p';
      this.parseSubtitle = SubtitleHandling.parseSubByRegex.bind(SubtitleHandling);
   }
   getId()
   {
      return (window.location.pathname).split("/").slice(-1)[0];
   }
   initElement()
   {
      let subtitleContainer = $('<div id="funix-subtitle" style=" position: absolute; bottom: 12%; left: 10%; background-color: rgba(0, 0, 0, 0.75); height: 7%; width: 80%; text-align: center; "> <p style=" color:white; font-size: 1vw; left: 50%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); "></p> </div>');
      $(".vjs-text-track-display").append(subtitleContainer);
   }
}

$(document).ready(function() {
   (new UdacitySubtitle()).run();
});
