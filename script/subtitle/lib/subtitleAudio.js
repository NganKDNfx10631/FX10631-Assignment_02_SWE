var subTileAudio = {
    idTagAudio: 'audio-speech',
    isLoading: false,
    isPlay: false,
    isPause: false,
    audio: null,
    video: null,
    init: function (video) {
        this.video = video;
        this.autoloadEvent();
    },

    /**
     * auto load Event
     */
    autoloadEvent: function () {
        var self = this;
        var video = self.video;
        video.onpause = function () {
            subTileAudio.setCurrentTimeAudio(video);
        };

        video.onplay = function () {
            subTileAudio.setCurrentTimeAudio(video);
        };

        video.onvolumechange = function () {
            if (video.muted) {
                self.audio.muted = false;
            } else {
                self.audio.muted = true;
            }
        };
    },

    /**
     * set Current Time Audio
     * @param video
     */
    setCurrentTimeAudio: function (video) {
        var self = this;
        if (!self.audio || self.audio.length == 0 || !video)
            return false;

        self.audio.currentTime = video.currentTime; // set time current
        if (video.paused) { // check status play or pause
            self.audio.pause();
        } else {
            self.audio.play();
        }
    },

    /**
     * build Tag Html Audio
     * @param linkAudio
     * @param idAppend
     * @returns {boolean}
     */
    buildTagHtmlAudio: function (linkAudio, idAppend = '') {
        var self = this;
        if (!linkAudio || !idAppend)
            return false;

        var idTagAudio = $('#' + self.idTagAudio);
        if (idTagAudio.length > 0)
            return false;

        var tagAudio = '<audio id="' + self.idTagAudio + '" src="' + linkAudio + '" controls="controls" style="width: 100%;display: none"></audio>';
        $(idAppend).append(tagAudio);
        self.audio = document.getElementById(self.idTagAudio);
    }
};