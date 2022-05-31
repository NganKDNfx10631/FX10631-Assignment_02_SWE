let videoObserver, udemySubtitleObserver,
    button, iconBtn, viBtn, engBtn, offBtn,
    enable, // Check if Extension is enable
    pathname = window.location.pathname;
let vi,
    eng,
    jp,
    base, audio_vi, audio_jp, audio_en, audio = [], arraySubType = [];
const caption = '[class^="captions-display--captions-container"]', direct_sub_node = '#funixSubtitle';

async function initData() {
    console.log(9 + '-udemy-subtitle');

    vi = [];
    eng = [];
    jp = [];
    // Get data
    let params = window.location.pathname.split("/");
    let body = {};
    if (params.length === 6) {
        body = {
            cid: params[2],
            lid: params[5]
        }
    } else if (params.length === 5) {
        body = {
            cid: params[1],
            lid: params[4]
        }
    }

    let request = {
        content: "POST Request",
        requestUrl: "https://funix-subtitle.firebaseapp.com/get",
        requestBody: body
    };

    let resAPI = {};
    await sendMessagePromise(request).then(res => {
        resAPI = res;
    });

    arraySubType = []; // reset

    if (resAPI.code === 200) {
        if (resAPI.data.audio_vi) {
            audio_vi = resAPI.data.audio_vi;
            arraySubType.push('audio_vi');
        } else {
            audio_vi = '';
        }

        if (resAPI.data.audio_en) {
            audio_en = resAPI.data.audio_en;
            arraySubType.push('audio_en');
        } else {
            audio_en = '';
        }

        if (resAPI.data.audio_jp) {
            audio_jp = resAPI.data.audio_jp;
            arraySubType.push('audio_jp');
        } else {
            audio_jp = '';
        }

        // get Eng sub
        await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.en,
        }).then(data => {
            eng = SubtitleHandling.parseSubByRegex(data);
            if (eng.length == 0)
                eng = SubtitleHandling.parseSub(data);
        });

        // Get Viet sub
        await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.vi,
        }).then(data => {
            vi = SubtitleHandling.parseSubByRegex(data);
            if (vi.length == 0)
                vi = SubtitleHandling.parseSub(data);
        });

        // Get Jp sub
        await sendMessagePromise({
            content: "GET Request",
            requestUrl: resAPI.data.jp,
        }).then(data => {
            if (data !== undefined) {
                jp = SubtitleHandling.parseSubByRegex(data);
                if (jp.length == 0)
                    jp = SubtitleHandling.parseSub(data);
            }
        });

        if (eng.length)
            arraySubType.push('en');

        if (vi.length)
            arraySubType.push('vi');

        if (jp.length)
            arraySubType.push('jp');

        udemySubtitleObserver.initData(vi, eng, jp);
    }
    return resAPI.code;
}

$(document).ready(function () {
    console.log(1 + '-udemy-subtitle');

    enable = false;
    udemySubtitleObserver = new subtitleObserver(direct_sub_node); //Observe the paragraph
    initComponents(); // Check if user change lesson.
    startObserver(); // startObserver

    // load - check initData start
    initData().then(data => {
        pageLoad(data);
    });
});

function initComponents() {
    console.log(2 + '-udemy-subtitle');
    // Setup Subtitle button
    //initButton();----remove

    // reload subtitle when user change lesson.
    videoObserver = new MutationObserver(function (mutations) {
        // Check if user change lesson.
        if (window.location.pathname !== pathname) {
            pathname = window.location.pathname;
            udemySubtitleObserver.mode = 0;
            initData().then(code => {
                pageLoad(code);
            });
        }
    });
}

function pageLoad(code) {
    console.log(3 + '-udemy-subtitle');
    startObserver();
    if (code === 200) {
        getSettingData().then(res => {
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
                subTileAudio.removeTagAudio();
                Notifycation.confirmSubtitle(arraySubType).then(mode => {
                    if (mode !== 0) {
                        start(mode, res.float);
                    }
                });
            }
        });
    }
}

function start(type, float) {
    console.log(4 + '-udemy-subtitle');

    udemySubtitleObserver.mode = type;

    $("#captions-menu").hide();
    initSubnode(type);

    // turnSubtitleOn();
    if (float) initMenuComponents();
}

function startObserver() {
    console.log(5 + '-udemy-subtitle');

    let video = $("video").get(0);
    if (video === undefined) {
        setTimeout(() => {
            startObserver();
        }, 500);
    } else {
        udemySubtitleObserver.startObserver(video);
        video.muted = false; // turn on mute

        if (audio_vi || audio_jp || audio_en) {
            video.muted = true; // off mute video current
            // init subTileAudio
            subTileAudio.init(video); // load audio
        } // add tag audio

        videoObserver.observe(video, {
            attributes: true
        });
    }
}

function initSubnode(mode) {
    console.log(6 + '-udemy-subtitle');

    const subtitleObject = $('<div class="captions-display--captions-container--1-aQJ"> <div class="captions-display--captions-cue-text--ECkJu" data-purpose="captions-cue-text" style="font-size: 26.36px; opacity: 0.75;justify-content: center;text-align: center;" id="funixSubtitle"></div> </div>');
    $(caption).hide();
    $('[class^="video-player--video-wrapper"]').append(subtitleObject);

    subTileAudio.removeTagEventAudio(); // on change url video => reset tag + event audio
    if (audio_vi && mode == typeSub.audio_vi) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_vi);

    if (audio_en && mode == typeSub.audio_en) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_en);

    if (audio_jp && mode == typeSub.audio_jp) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_jp);
}

function initButton() {
    console.log(7 + '-udemy-subtitle');

    // Init elements
    button = $("<div data-purpose=\"captions-menu-button\" class=\"menu--dropdown--3Vksr dropup btn-group\"></div>");
    iconBtn = $("<button aria-label=\"FUNiX\" data-purpose=\"theatre-mode-toggle-button\" aria-labelledby=\"popper10\" aria-describedby=\"popper10\" tabindex=\"0\" type=\"button\" class=\"control-bar-button--button--20ibv btn btn-text\"> <span class=\"control-bar-button--icon--28inh udi\"> <img src=\"https://firebasestorage.googleapis.com/v0/b/funix-subtitle.appspot.com/o/funix-icon.png?alt=media&token=d87f1917-86c3-4359-b771-6c8768627e1c\"></span></button>");
    viBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a role=\"menuitem\" tabindex=\"-1\">Vietnamese [FUNiX]</a></li>");
    engBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a role=\"menuitem\" tabindex=\"-1\">English [FUNiX]</a></li>");
    offBtn = $("<li role=\"presentation\" class=\"menu--menu--2Pw42 menu--item--2IgLt menu--menu--2Pw42 menu--item--2IgLt\"><a data-purpose=\"go-to-settings\" role=\"menuitem\" tabindex=\"-1\">Keep original</a></li>");

    let list = $("<ul role=\"menu\" class=\"menu--menu--2Pw42 menu--captions-menu--beS8H dropdown-menu dropdown-menu-right\" aria-labelledby=\"captions-menu\" style=\"max-height: 418.6px;\"></ul>");

    // Add click Envents
    iconBtn.click(function (event) {
        if (enable) {
            button.removeClass("open");
            enable = false;
        } else {
            button.addClass("open");
            enable = true;
        }
    });

    viBtn.click(function (event) {
        // turnSubtitleOn();
        setActiveButton(viBtn);
        $(direct_sub_node).text(udemySubtitleObserver.oldSubtitle);
        udemySubtitleObserver.mode = 1;
    });

    engBtn.click(function (event) {
        // turnSubtitleOn();
        setActiveButton(engBtn);
        $(direct_sub_node).text(udemySubtitleObserver.oldSubtitle);
        udemySubtitleObserver.mode = 2;
    });

    offBtn.click(function (event) {
        setActiveButton(offBtn);
        udemySubtitleObserver.mode = 0;
    });

    // Add elements
    list.append(viBtn);
    list.append(engBtn);
    list.append($("<li role=\"separator\" class=\" menu--menu--2Pw42 menu--item--2IgLt divider\"></li>"));
    // list.append(offBtn);
    button.append(iconBtn);
    button.append(list);
}

function setActiveButton(buttonActive) {
    console.log(8 + '-udemy-subtitle');

    viBtn.removeClass("active");
    engBtn.removeClass("active");
    offBtn.removeClass("active");

    buttonActive.addClass("active");
    button.removeClass("open");
}