let courseraSubtitleObserver, vi, eng, jp, oldURL, currentURL, audio_vi = '';
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

                    isShowPopup = true;
                    Notifycation.confirmSubtitle().then(mode => {
                        if (mode !== 0) {
                            createElement(mode);
                        }
                    });
                }
                // else if (subtitleMode === "0") {
                //    createElement(1);
                // } else if (subtitleMode === "2") {}
            })
        }
    });
}

function checkURLchange(currentURL) {
    if (currentURL != oldURL) {
        oldURL = currentURL;
        initComponent();
    } else {
        oldURL = window.location.pathname;
    }

    setTimeout(function () {
        checkURLchange(window.location.pathname);
    }, 1000);
}

function createElement(mode) {
    let container = $('<div style ="position: absolute;bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: center;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 2.5vh; opacity: 0.75;" id="funix-text"></div> </div>');

    courseraSubtitleObserver = new subtitleObserver("#funix-text");
    courseraSubtitleObserver.initData(vi, eng, jp);
    courseraSubtitleObserver.mode = mode;

    if (audio_vi) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_vi, '.rc-VideoControlsContainer');

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
        // start Ob server - video subtile
        courseraSubtitleObserver.startObserver(video);

        // init subTileAudio
        subTileAudio.init(video);
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
        audio_vi = resAPI.data.audio_vi ? resAPI.data.audio_vi : '';

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
        return true;
    }
    return false;
}


$(document).ready(function () {
    oldURL = window.location.pathname;
    currentURL = window.location.pathname;
    var timeCountDown = setInterval(function () {
        initComponent();
        if (isShowPopup) {
            clearInterval(timeCountDown);
            checkURLchange(oldURL);
        }
    }, 3000);
});

function checkPopup() {
    let popup = $(".jconfirm-modern"); // check tag video
    if (!popup || popup.length == 0)
        return false;
    else
        return true;
}