$(document).ready(function () {
    udaCitySubtitleLearn.init();
});

var udaCitySubtitleLearn = {
    courseraSubtitleObserver: null,
    vi: '',
    eng: '',
    jp: '',
    oldURL: '',
    currentURL: '',
    audio_vi: '',
    audio_en: '',
    audio_jp: '',
    arraySubType: null,
    isShowPopup: false,
    containerClass: ".vds-loading",
    boxSubtitleTextClass: "subtitle-funix",
    removeTagTrackTextSubOriginal: ".vjs-text-track-display",
    isStartCheckChangeUrl: false,
    init: function (loading) {
        this.autoload();
    },

    /**
     *
     */
    autoload: function () {
        var self = this;

        self.oldURL = window.location.pathname;
        self.currentURL = window.location.pathname;

        var timeCountDown = setInterval(function () {
            if (self.isShowPopup) { // check block duplicate popup confirm Subtitle
                clearInterval(timeCountDown); // clear Interval
                self.checkURLChange(self.oldURL);
                return;
            }
            self.initComponent();
        }, 3000);
    },

    /**
     *
     * @returns {boolean}
     */
    initComponent: function () {
        var self = this;
        if (self.checkPopup()) // check if popup confirm
            return false;

        self.initData().then((status) => {
            if (status) {
                getSettingData().then(res => {
                    let subtitleMode = res.modeSubtitle;
                    if (subtitleMode === "0") {
                        let video = $("video"); // check tag video
                        if (!video || video.length == 0)
                            return false;

                        Notifycation.confirmSubtitle(arraySubType).then(mode => {
                            if (mode !== 0) {
                                self.isShowPopup = true;
                                self.createElement(mode);
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * init Data - check data
     * @returns {Promise<boolean>}
     */
    initData: async function () {
        var self = this;
        var url = window.location.pathname.replace(/\/instructions+/g, ''); // remove text /instructions in url
        let id = url.split("/").splice(-1)[0];

        console.log(id);
        let request = {
            content: "POST Request",
            requestUrl: "https://funix-subtitle.firebaseapp.com/get",
            requestBody: {
                cid: "udacity",
                lid: id
            }
        };

        let resAPI = {};
        await sendMessagePromise(request).then(res => {
            resAPI = res;
        });
        console.log(resAPI);

        self.arraySubType = []; // reset type - show popup confirm
        if (resAPI.code === 200) {
            if (resAPI.data.audio_vi) {
                self.audio_vi = resAPI.data.audio_vi;
                self.arraySubType.push('audio_vi');
            } else {
                audio_vi = '';
            }

            if (resAPI.data.audio_en) {
                self.audio_en = resAPI.data.audio_en;
                self.arraySubType.push('audio_en');
            } else {
                self.audio_en = '';
            }

            if (resAPI.data.audio_jp) {
                self.audio_jp = resAPI.data.audio_jp;
                self.arraySubType.push('audio_jp');
            } else {
                self.audio_jp = '';
            }

            await
                sendMessagePromise({
                    content: "GET Request",
                    requestUrl: resAPI.data.vi,
                }).then(data => {
                    // alert("data : " + JSON.stringify(data));
                    if (data !== undefined) {
                        self.vi = SubtitleHandling.parseSubByRegex(data);
                    }
                });

            await
                sendMessagePromise({
                    content: "GET Request",
                    requestUrl: resAPI.data.jp,
                }).then(data => {
                    if (data !== undefined) {
                        self.jp = SubtitleHandling.parseSubByRegex(data);
                    }
                });

            if (self.vi.length > 0)
                arraySubType.push('vi');

            if (self.jp.length > 0)
                arraySubType.push('jp');

            return true;
        }
        return false;
    },

    /**
     * start Ob server
     * @param mode
     */
    startObserver: function (mode = 0) {
        var self = this;

        let video = $("video").get(0);
        if (video !== undefined) {
            // start Ob server - video subtile
            self.courseraSubtitleObserver.startObserver(video);

            // check chose type audio
            if (mode == typeSub.audio_vi || mode == typeSub.audio_jp || mode == typeSub.audio_en) {
                video.muted = true; // off mute video current
                // init subTileAudio
                subTileAudio.init(video); // load audio
            } else {
                video.muted = false; // turn on mute
            }
        } else {
            setTimeout(function () {
                self.startObserver(mode); // request check data
            }, 1000);
        }
    },

    /**
     * create Element HTML + check audio + render tag audio
     * @param mode
     */
    createElement: function (mode) {
        var self = this;

        $('.' + self.boxSubtitleTextClass).remove();
        let container = $('<div class="' + self.boxSubtitleTextClass + '" style ="position: absolute;bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: center;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 2.5vh; opacity: 0.75;" id="funix-text"></div> </div>');

        self.courseraSubtitleObserver = new subtitleObserver("#funix-text");
        self.courseraSubtitleObserver.initData(self.vi, self.eng, self.jp);
        self.courseraSubtitleObserver.mode = mode;

        subTileAudio.removeTagEventAudio(); // on change url video => reset tag + event audio
        if (self.audio_vi && mode == typeSub.audio_vi) // add tag audio
            subTileAudio.buildTagHtmlAudio(self.audio_vi);

        if (self.audio_en && mode == typeSub.audio_en) // add tag audio
            subTileAudio.buildTagHtmlAudio(self.audio_en);

        if (self.audio_jp && mode == typeSub.audio_jp) // add tag audio
            subTileAudio.buildTagHtmlAudio(self.audio_jp);

        self.startObserver(mode);

        // remove Tag Track TextSub Original
        $(self.removeTagTrackTextSubOriginal).hide();

        $(self.containerClass).append(container);
        $(self.containerClass).css("position", "relative");

        let funixSubtitle = document.getElementById("funix-text");
        if (funixSubtitle === undefined || funixSubtitle === null) {
            setTimeout(function () {
                self.createElement(mode);
            }, 1000);
        }
    },

    /**
     * check URL Change
     */
    checkURLChange: function () {
        var self = this;

        console.log('checkURLChange');
        console.log(window.location.pathname);
        console.log(self.oldURL);

        if (window.location.pathname !== self.oldURL) {
            self.oldURL = window.location.pathname;
            self.initComponent();
        }

        setTimeout(function () {
            self.checkURLChange();
        }, 1000);

    },

    /**
     * check Popup - empty
     * @returns {boolean}
     */
    checkPopup: function () {
        let popup = $(".jconfirm-modern"); // check tag video
        if (!popup || popup.length == 0)
            return false;
        else
            return true;
    }
};