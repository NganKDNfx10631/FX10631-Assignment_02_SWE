class OnpageTranslator {
    constructor() {
        this.addEventReload = false; // Check if add click event to reload
    }

    checkDomain() {
        console.log(1 + '-OnpageTranslator');

        let hostname = window.location.hostname;
        let self = this;
        getDomainList().then(res => {
            let selector = res[hostname];
            if (selector) {
                if (selector.reload && !self.addEventReload) {
                    $(selector.reloadSelector).click(function (event) {
                        self.init();
                    });
                    self.addEventReload = true;
                }
                self.init();
            }
            else (new OldTranslator()).init();
        });
    }

    /**
     * get Index
     * @param domSelector
     * @param activeClass
     * @returns {number}
     */
    getIndex(domSelector, activeClass) {
        console.log(2 + '-OnpageTranslator');
        let list = $(domSelector);
        for (let i = 0; i < list.length; i++) {
            if ($(list[i]).hasClass(activeClass)) return i;
        }
        return -1;
    }

    init() {
        console.log(3 + '-OnpageTranslator');

        let request = {
            content: "POST Request",
            requestUrl: "https://translation.funix.edu.vn/get-data",
            requestBody: {
                id: encodeURIComponent(window.location.href)
            }
        };
        if (window.location.href.match("courses.edx.org/*")) {
            let id = window.location.pathname.split("/")[2].split("@")[2];
            let url = "courses.edx.org%2F" + id;
            request.requestBody.id = url;
        }

        let urlId = request.requestBody.id + "_JP";
        let requestJP = {
            content: "POST Request",
            requestUrl: "https://translation.funix.edu.vn/get-data",
            requestBody: {
                id: urlId
            }
        };

        let self = this;
        let dataVN, dataJP;
        let isVN = new Boolean(false);
        let isJP = new Boolean(false);

        chrome.runtime.sendMessage(request, res => {
            if (res === null) {
                (new OldTranslator()).init();
            }
            else if (res.code === 200) {
                isVN = true;
                dataVN = res.data;
                //self.gotData(res.data);
                // if(res.data.selector.reload && !this.addEventReload)
                // {
                // 	$(res.data.selector.reloadSelector).click(function(event) {
                // 		self.init();
                // 	});
                // 	this.addEventReload = true;
                // }
            } else {
                (new OldTranslator()).init();
            }

            chrome.runtime.sendMessage(requestJP, res2 => {
                if (res2 === null) {
                    (new OldTranslator()).init();
                }
                else if (res2.code === 200) {
                    isJP = true;
                    dataJP = res2.data;
                } else {
                    (new OldTranslator()).init();
                }
                if ((isVN === true) || (isJP === true)) {
                    self.gotData(dataVN, dataJP, isVN, isJP);
                }
            });
        });
    }

    gotData(dataVN, dataJP, isVN, isJP) {
        let self = this;

        console.log(4 + '-OnpageTranslator');

        getSettingData().then(res => {
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
                Notifycation.confirmPageTranslate().then(result => {
                    if (result === 1) {
                        self.waitContentLoad(dataVN, res.float);
                    } else if (result === 2) {
                        self.waitContentLoad(dataJP, res.float);
                    }
                });
            }
            // else if(subtitleMode === "0")
            // {
            // 	if (isVN){
            // 		self.waitContentLoad(dataVN, res.float);
            // 	} else {
            // 		self.waitContentLoad(dataJP, res.float);
            // 	}
            // }
        });
    }

    /**
     * render
     * @param data
     * @param float
     */
    render(data, float) {
        console.log(5 + '-OnpageTranslator');

        let request = {
            content: "GET Request",
            requestUrl: data.link
        };

        let self = this;
        const non_replace = data.selector.nonReplace || [];
        let elements = [];
        // Get non_replace element
        for (let selector of non_replace) {
            elements.push($(data.selector.selector + " " + selector));
        }

        chrome.runtime.sendMessage(request, res => {
            // For freecodecamp page, get width and height of .reflex-size-aware:first and resize.
            // Check it is freeocde camp page
            let width, height;
            if(window.location.href.match("freecodecamp.org/*"))
            {
                width = $(".reflex-size-aware > div:first").width();
                height = $(".reflex-size-aware > div:first").height();
            }

            let html_ = res.replace(/color: red;/gi, "");
            // For cousera
            if (window.location.href.match("courses.edx.org/*")) {
                let video = null;
                let videoList = $(".tc-wrapper");
                if (videoList.length > 0)
                    video = videoList[0];

                $(data.selector.selector).html(html_);
                self.renderTranscriptEdx(html_, video);
            } else {
                $(data.selector.selector).html(html_);
            }

            // replace old elements
            for (let i = 0; i < non_replace.length; i++) {
                let selector = data.selector.selector + " " + non_replace[i];
                let oldElement = elements[i];
                $(selector).each(function (index, el) {
                    $(el).replaceWith(oldElement[index]);
                });
            }

            // Resize for freecodecamp
            if(window.location.href.match("freecodecamp.org/*"))
            {
                // Resize by css
                $(".reflex-size-aware > div").css("width", width);
                $(".reflex-size-aware > div").css("height", height);
            }

        });

        if (float)
            initMenuComponents();
    }

    /**
     * wait Content Load
     * @param data
     * @param float
     */
    waitContentLoad(data, float) {
        console.log(7 + '-OnpageTranslator');

        const LOAD_TIME = 2000;
        const self = this;
        setTimeout(function () {
            let dom = $(data.selector.selector);
            let content = dom.length != 0 ? $(dom[0]).text() : "";
            if (content && content != "") {
                self.render(data, float);
            } else {
                self.waitContentLoad(data, float);
            }
        }, LOAD_TIME);
    }

    /**
     * render Transcript Edx
     * @param res
     * @param video
     */
    renderTranscriptEdx(res, video) {
        console.log(8 + '-OnpageTranslator');

        if (video !== null) {
            let dom = $($.parseHTML(res));
            let element = null;
            for (let i = 0; i < dom.length; i++) {
                if ($(dom[i]).find(".tc-wrapper").length > 0) {
                    element = dom[i];
                    break;
                }
            }

            let subtitle = $($(element).find("ol.subtitles-menu"));
            $(".tc-wrapper").html("");
            $($(".tc-wrapper").parent()).html(video);
            $("ol.subtitles-menu").html(subtitle.html());

            (new EdxSubtitle()).run();
        }
    }
}

$(document).ready(function () {
    (new OnpageTranslator()).checkDomain();
});
