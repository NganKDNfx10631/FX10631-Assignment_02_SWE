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

        // event pause
        video.onpause = function () {
            console.log('onpause');
            subTileAudio.setCurrentTimeAudio(video);
        };

        // event play
        video.onplay = function () {
            console.log('onplay');
            subTileAudio.setCurrentTimeAudio(video);
        };

        video.onseeked = function () {
            console.log('seeked');
            subTileAudio.setCurrentTimeAudio(video);
        };

        // on change volume
        video.onvolumechange = function () {
            console.log('onvolumechange');
            subTileAudio.setCurrentTimeAudio(video);
        };

        // on change speed
        video.onratechange = function () {
            console.log('onratechange');
            subTileAudio.setCurrentTimeAudio(video);
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
        self.audio.playbackRate = video.playbackRate; // set speed audio

        if (video.muted) {
            self.audio.muted = false;
        } else {
            self.audio.muted = true;
        }

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
    buildTagHtmlAudio: function (linkAudio, idAppend = 'body') {
        console.log(linkAudio);
        console.log(idAppend);
        var self = this;
        if (!linkAudio || !idAppend)
            return false;

        var idTagAudio = $('#' + self.idTagAudio);
        if (idTagAudio.length > 0)
            return false;

        var tagAudio = '<audio id="' + self.idTagAudio + '" src="' + linkAudio + '" controls="controls" style="width: 100%;display: none"></audio>';
        $(idAppend).append(tagAudio);
        self.audio = document.getElementById(self.idTagAudio);
        console.log('buildTagHtmlAudio');
    }
};