let courseraSubtitleObserver, vi, eng, jp, oldURL, currentURL, audio_vi = audio_en = audio_jp = '', arraySubType = [];
var isShowPopup = false;

function initComponent() {
    if (checkPopup())
        return false;

    initData().then((status) => {
        if (status) {
            getSettingData().then(res => {
                let subtitleMode = res.modeSubtitle;
                if (subtitleMode === "0") {
                    let video = $("video"); // check tag video
                    if (!video || video.length == 0)
                        return false;

                    Notifycation.confirmSubtitle(arraySubType).then(mode => {
                        isShowPopup = true;
                        if (mode !== 0) {
                            createElement(mode);
                        }
                    });
                }
            });
        }
    });
}

function createElement(mode) {
    let container = $('<div style ="position: absolute;bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: center;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 2.5vh; opacity: 0.75;" id="funix-text"></div> </div>');

    courseraSubtitleObserver = new subtitleObserver("#funix-text");
    courseraSubtitleObserver.initData(vi, eng, jp);
    courseraSubtitleObserver.mode = mode;

    subTileAudio.removeTagEventAudio(); // on change url video => reset tag + event audio
    if (audio_vi && mode == typeSub.audio_vi) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_vi, mode, '.rc-VideoControlsContainer');

    if (audio_en && mode == typeSub.audio_en) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_en, mode, '.rc-VideoControlsContainer');

    if (audio_jp && mode == typeSub.audio_jp) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_jp, mode, '.rc-VideoControlsContainer');

    startObserver();
    $(".rc-VideoControlsContainer").append(container);

    let funixSubtitle = document.getElementById("funix-text");
    if (funixSubtitle === undefined || funixSubtitle === null) {
        setTimeout(function () {
            createElement(mode);
        }, 1000);
    }
}

function startObserver() {
    let video = $("video").get(0);
    if (video !== undefined) {
        video.muted = false; // turn on mute
        // start Ob server - video subtile
        courseraSubtitleObserver.startObserver(video);

        if (audio_vi || audio_jp || audio_en) {
            video.muted = true; // off mute video current
            // init subTileAudio
            subTileAudio.init(video); // load audio
        } // add tag audio
    } else {
        setTimeout(function () {
            startObserver();
        }, 1000);
    }
}

async function initData() {
    let id = window.location.pathname.split("/").splice(-1)[0];
    let request = {
        content: "POST Request",
        requestUrl: "https://funix-subtitle.firebaseapp.com/get",
        requestBody: {
            cid: "coursera",
            lid: id
        }
    };
    let resAPI = {};
    await sendMessagePromise(request).then(res => {
        resAPI = res;
    });

    if (resAPI.code === 200) {
        if (resAPI.data.audio_vi) {
            audio_vi = resAPI.data.audio_vi;
            arraySubType.push('audio_vi');
        }else{
            audio_vi = '';
        }

        if (resAPI.data.audio_en) {
            audio_en = resAPI.data.audio_en;
            arraySubType.push('audio_en');
        }else{
            audio_en = '';
        }

        if (resAPI.data.audio_jp) {
            audio_jp = resAPI.data.audio_jp;
            arraySubType.push('audio_jp');
        }else{
            audio_jp = '';
        }

        // check duplicate id
        if (resAPI.data.numb !== undefined) {
            let pathFile = window.location.pathname;
            let numb = resAPI.data.numb;
            let isNew = "1";
            for (var i = 1; i <= numb; i++) {
                let request2 = {
                    content: "POST Request",
                    requestUrl: "https://funix-subtitle.firebaseapp.com/get",
                    requestBody: {
                        cid: "coursera",
                        lid: id + "_" + i.toString()
                    }
                };
                let resAPI2 = {};
                await sendMessagePromise(request2).then(res => {
                    resAPI2 = res;
                });
                if (resAPI2.code === 200) {
                    if (resAPI2.data.url !== undefined && resAPI2.data.url.includes(pathFile)) {
                        await sendMessagePromise({
                            content: "GET Request",
                            requestUrl: resAPI2.data.vi,
                        }).then(data => {
                            if (data !== undefined) {
                                vi = SubtitleHandling.parseSubByRegex(data);
                            }
                        });

                        await sendMessagePromise({
                            content: "GET Request",
                            requestUrl: resAPI2.data.jp,
                        }).then(data => {
                            if (data !== undefined) {
                                jp = SubtitleHandling.parseSubByRegex(data);
                            }
                        });
                        isNew = "2";
                    }
                }
            }

            if (isNew === "2") {

            } else {
                await sendMessagePromise({
                    content: "GET Request",
                    requestUrl: resAPI.data.vi,
                }).then(data => {
                    if (data !== undefined) {
                        vi = SubtitleHandling.parseSubByRegex(data);
                    }
                });

                await sendMessagePromise({
                    content: "GET Request",
                    requestUrl: resAPI.data.jp,
                }).then(data => {
                    if (data !== undefined) {
                        jp = SubtitleHandling.parseSubByRegex(data);
                    }
                });
            }

        } else {
            await sendMessagePromise({
                content: "GET Request",
                requestUrl: resAPI.data.vi,
            }).then(data => {
                // alert("data : " + JSON.stringify(data));
                if (data !== undefined) {
                    vi = SubtitleHandling.parseSubByRegex(data);
                }
            });

            await sendMessagePromise({
                content: "GET Request",
                requestUrl: resAPI.data.jp,
            }).then(data => {
                if (data !== undefined) {
                    jp = SubtitleHandling.parseSubByRegex(data);
                }
            });

        }

        if (eng && eng.length > 0)
            arraySubType.push('en');

        if (vi && vi.length > 0)
            arraySubType.push('vi');

        if (jp && jp.length > 0)
            arraySubType.push('jp');

        return true;
    }
    return false;
}

$(document).ready(function () {
    oldURL = window.location.pathname;
    currentURL = window.location.pathname;
    var timeCountDown = setInterval(function () {
        if (isShowPopup) {
            clearInterval(timeCountDown);
            checkURLchange(oldURL);
            return;
        }
        initComponent();
    }, 3000);
});

/**
 * check URL change
 * @param currentURL
 */
function checkURLchange(currentURL) {
    if (currentURL !== oldURL) {
        oldURL = currentURL;
        initComponent();
    }

    setTimeout(function () {
        checkURLchange(window.location.pathname);
    }, 1000);
}

function checkPopup() {
    let popup = $(".jconfirm-modern"); // check tag video
    if (!popup || popup.length == 0)
        return false;
    else
        return true;
}