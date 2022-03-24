class Applieddigitalskills {
    constructor() {
    }

    run() {
        this.initComponent();
    }

    initComponent() {
        this.initData().then((status) => {
            if (status) {
                getSettingData().then(res => {
                    let subtitleMode = res.modeSubtitle;
                    if (subtitleMode === "0") {
                        Notifycation.confirmSubtitle().then(mode => {
                            if (mode !== 0) {
                                this.createElement(mode);
                            }
                        });
                    }
                    // else if (subtitleMode === "0") {
                    //    this.createElement(1);
                    // } else if (subtitleMode === "2") {}
                })
            }
        });
    }

    createElement(mode) {
        // Add subtitle
        const html = '<div id="funix-subtitle" style=" position: absolute; bottom: 12%; left: 10%; background-color: rgba(0, 0, 0, 0.75); height: 7%; width: 80%; text-align: center; "> <p style=" color:white; font-size: 1vw; left: 50%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); "></p> </div>';
        let container = $(html);
        let subtitle = container.find("p")[0];
        this.subtitleObserver = new subtitleObserver("#funix-subtitle > p");
        this.subtitleObserver.initData(this.vi, this.en);
        this.subtitleObserver.mode = mode;

        $(".student-video").append(container);
        $("video > track").remove();

        this.startObserver();
    }

    startObserver() {
        let video = $("video").get(0);
        if (video !== undefined) {
            this.subtitleObserver.startObserver(video);
        } else {
            setTimeout(function () {
                startObserver();
            }, 1000);
        }
    }

    async initData() {
        // Get id video
        let id = window.location.pathname.split("/").splice(-1)[0].replace(".html", "");
        let request = {
            content: "POST Request",
            requestUrl: "https://funix-subtitle.firebaseapp.com/get",
            requestBody: {
                cid: "applieddigitalskills",
                lid: id
            }
        };
        let resAPI = {};
        await sendMessagePromise(request).then(res => {
            resAPI = res;
        });
        if (resAPI.code === 200) {
            let self = this;
            await sendMessagePromise({
                content: "GET Request",
                requestUrl: resAPI.data.vi,
            }).then(data => {
                self.vi = SubtitleHandling.parseSub(data);
            });
            await sendMessagePromise({
                content: "GET Request",
                requestUrl: resAPI.data.en,
            }).then(data => {
                self.en = SubtitleHandling.parseSub(data);
            });
            return true;
        }
        return false;
    }
}

$(document).ready(function () {
    (new Applieddigitalskills()).run();
});
