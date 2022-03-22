let videoObserver, udemySubtitleObserver,
    button, iconBtn, viBtn, engBtn, offBtn,
    enable, // Check if Extension is enable
    pathname = window.location.pathname;
let vi,
    eng,
    jp,
    base, audio_vi, audio_jp, audio_en, audio = [], arraySubTitle = [];
const caption = '[class^="captions-display--captions-container"]', direct_sub_node = '#funixSubtitle';

async function initData() {
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

    if (resAPI.code === 200) {
        if (resAPI.data.audio_vi) {
            audio_vi = resAPI.data.audio_vi;
            arraySubTitle.push('audio_vi');
        }

        if (resAPI.data.audio_jp) {
            audio_vi = resAPI.data.audio_jp;
            arraySubTitle.push('audio_jp');
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
            arraySubTitle.push('en');

        if (vi.length)
            arraySubTitle.push('vi');

        if (jp.length)
            arraySubTitle.push('jp');

        udemySubtitleObserver.initData(vi, eng, jp);
    }
    return resAPI.code;
}

$(document).ready(function () {
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
    startObserver();
    if (code === 200) {
        getSettingData().then(res => {
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
                Notifycation.confirmSubtitle(arraySubTitle).then(mode => {
                    if (mode !== 0) {
                        start(mode, res.float);
                    }
                });
            }
        });
    }
}

function start(type, float) {
    udemySubtitleObserver.mode = type;
    // Add Subtitle Button
    //button.insertAfter("div[data-purpose=\"captions-menu-button\"]");----remove
    $("#captions-menu").hide();
    initSubnode();

    // turnSubtitleOn();
    if (float) initMenuComponents();
}

function startObserver() {
    let video = $("video").get(0);
    if (video === undefined) {
        setTimeout(() => {
            startObserver();
        }, 500);
    } else {
        udemySubtitleObserver.startObserver(video);
        // init subTile Audio
        if (audio_vi) // add tag audio
            video.muted = true;

        subTileAudio.init(video);

        videoObserver.observe(video, {
            attributes: true
        });
    }
}

function initSubnode() {
    const subtitleObject = $('<div class="captions-display--captions-container--1-aQJ"> <div class="captions-display--captions-cue-text--ECkJu" data-purpose="captions-cue-text" style="font-size: 26.36px; opacity: 0.75;justify-content: center;text-align: center;" id="funixSubtitle"></div> </div>');
    $(caption).hide();
    $('[class^="video-player--video-wrapper"]').append(subtitleObject);

    if (audio_vi) // add tag audio
        subTileAudio.buildTagHtmlAudio(audio_vi);
}

function initButton() {
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
    viBtn.removeClass("active");
    engBtn.removeClass("active");
    offBtn.removeClass("active");

    buttonActive.addClass("active");
    button.removeClass("open");
}