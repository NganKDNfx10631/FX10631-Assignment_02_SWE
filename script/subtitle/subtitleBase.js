let arraySubType = [];

class SubtitleBase {
    constructor() {

    }

    async initData() {
        await RequestData.requestSubtitleData(this.cid, this.getId(), this.parseSubtitle)
            .then(res => {
                this.data = res
            });

        if (!this.data)
            return;

        if (this.data.vi)
            arraySubType.push('vi');

        if (this.data.en)
            arraySubType.push('en');


        getSettingData().then(res => {
            let subtitleMode = res.modeSubtitle;
            if (subtitleMode === "0") {
                Notifycation.confirmSubtitle(arraySubType).then(mode => {
                    if (mode !== 0) {
                        this.startSubtitle(mode);
                    }
                });
            }
        });
    }

    run() {
        this.initData();
    }

    getId() {}

    startSubtitle(mode) {
        let selector = this.selector || '#funixSubtitle';
        this.subtitleObserver = new subtitleObserver(selector);
        this.subtitleObserver.initData(this.data.vi, this.data.en);
        this.subtitleObserver.mode = mode;

        this.initElement(parseInt(mode));
        this.subtitleObserver.startObserver($("video").get(0));
    }

    initElement(mode) {

    }
}