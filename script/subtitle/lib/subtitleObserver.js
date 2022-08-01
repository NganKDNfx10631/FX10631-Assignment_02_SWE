const typeSub = {
	vi: 1,
	audio_vi: 4,
	en: 2,
	audio_en: 6,
	jp: 3,
	audio_jp: 5,
	original: 0,
};

class subtitleObserver {
	/**
	 * constructor
	 * @param direct_sub_node
	 */
	constructor(direct_sub_node) {
		this.direct_sub_node = direct_sub_node;
		// this.subtitleObserver = new MutationObserver((function() {
		//    this.changeSubtitle();
		// }).bind(this));
	}

	/**
	 * initData
	 * @param vi
	 * @param eng
	 * @param jp
	 */
	initData(vi, eng, jp) {
		this.dictEng = eng;
		this.dictVi = vi;
		this.dictJp = jp;
	}

	/**
	 * change Subtitle
	 */
	changeSubtitle() {
		let $captionNode = $(this.direct_sub_node);
		let time = this.videoElement.currentTime * 1000;
		let translatedOb;

		switch (this.mode) {
			case typeSub.original:
				return;
			case typeSub.vi: // sub vi
				if (this.dictVi !== undefined) {
					translatedOb = this.dictVi.find(
						(el) => el.start <= time && el.end >= time
					);
				}
				break;
			case typeSub.en: // sub en
				if (this.dictEng !== undefined) {
					translatedOb = this.dictEng.find(
						(el) => el.start <= time && el.end >= time
					);
				}
				break;
			case typeSub.jp: // sub jp
				if (this.dictJp !== undefined) {
					translatedOb = this.dictJp.find(
						(el) => el.start <= time && el.end >= time
					);
				}
				break;
			default:
				return;
		}

		if (translatedOb !== undefined) {
			// set text sub current time
			$captionNode.text(translatedOb.text);
		} else {
			// reset null caption
			$captionNode.text('');
		}
	}

	/**
	 * start Ob server
	 * @param element
	 */
	startObserver(element) {
		this.videoElement = element;
		let self = this;
		// set Current Time Audio
		$(element).on('timeupdate', function (event) {
			self.changeSubtitle();
		});
	}
}
