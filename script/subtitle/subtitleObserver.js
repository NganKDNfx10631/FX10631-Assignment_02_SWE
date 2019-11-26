function subtitleObserver(callback) {
   this.subtitleObserver = new MutationObserver(function() {
      callback();
   });
}

function startObserver(element) {
   this.subtitleObserver.observe(element, {
      subtree: true,
      childList: true,
      characterData: true
   });
}

subtitleObserver.prototype = {
   constructor: subtitleObserver,
   startObserver: startObserver
};
