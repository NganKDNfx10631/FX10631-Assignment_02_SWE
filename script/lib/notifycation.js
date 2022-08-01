/**
 * Notifycation
 */
class Notifycation {
	/**
	 * creat Prompt
	 * @param submit
	 * @returns {{theme: string, title: string, boxWidth: string, useBootstrap: boolean, content: string, buttons: {formSubmit: {text: string, btnClass: string, action: *}, cancel: buttons.cancel}}}
	 */
	static creatPrompt(submit) {
		let html =
			'<div id="reportForm"> <div class="wrapper" > <form> <div class="group"> <input id="name" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Name</label> </div> <div class="group"> <input id="email" type="text" required="required"/><span class="highlight"></span><span class="bar"></span> <label>Email FUNiX</label> </div> <div class="group"> <textarea id="message" type="textarea" rows="5" required="required"></textarea><span class="highlight"></span><span class="bar"></span> <label>Message</label> </div> </form> </div> </div>';
		return {
			theme: 'modern',
			title: 'FUNiX Passport',
			boxWidth: '750px',
			useBootstrap: false,
			content: html,
			buttons: {
				formSubmit: {
					text: 'Submit',
					btnClass: 'btn-blue',
					action: submit,
				},
				cancel: function () {},
			},
		};
	}

	/**
	 * create Loading Ajax
	 * @param action
	 * @returns {{title: string, closeIcon: boolean, boxWidth: string, useBootstrap: boolean, content: *}}
	 */
	static creatLoadingAjax(action) {
		return {
			title: '',
			closeIcon: false,
			boxWidth: '500px',
			useBootstrap: false,
			content: action,
		};
	}

	/**
	 * notify
	 * @param text
	 */
	static notify(text) {
		$.alert({
			title: 'Alert!',
			content: text,
			boxWidth: '500px',
			useBootstrap: false,
			closeIcon: true,
		});
	}

	/**
	 * confirm Subtitle
	 * @param arraySubTitle
	 * @returns {Promise<any>}
	 */
	static confirmSubtitle(arraySubType = []) {
		console.log(arraySubType);
		return new Promise(function (resolve, reject) {
			$.alert({
				icon: '',
				theme: 'modern',
				title: 'FUNiX Passport',
				content:
					'This page already has subtitles support, which language do you want to translate?',
				boxWidth: '500px',
				useBootstrap: false,
				buttons: {
					vi: {
						text: 'Phụ đề',
						btnClass:
							arraySubType.length > 0 && arraySubType.includes('vi')
								? 'btn-vn'
								: 'hidden',
						action: function () {
							resolve(typeSub.vi);
						},
					},

					audio_vi: {
						text: 'Thuyết minh',
						btnClass:
							arraySubType.length > 0 &&
							arraySubType.includes('audio_vi')
								? 'btn-audio-vn'
								: 'hidden',
						action: function () {
							resolve(typeSub.audio_vi);
						},
					},

					eng: {
						text: 'Subtitle',
						btnClass:
							arraySubType.length > 0 && arraySubType.includes('en')
								? 'btn-en'
								: 'hidden',
						action: function () {
							resolve(typeSub.en);
						},
					},

					audio_en: {
						text: 'Audio En',
						btnClass:
							arraySubType.length > 0 &&
							arraySubType.includes('audio_en')
								? 'btn-audio-en'
								: 'hidden',
						action: function () {
							resolve(typeSub.audio_en);
						},
					},

					jp: {
						text: '字幕',
						btnClass:
							arraySubType.length > 0 && arraySubType.includes('jp')
								? 'btn-jp'
								: 'hidden',
						action: function () {
							resolve(typeSub.jp);
						},
					},

					audio_jp: {
						text: 'スピーカー',
						btnClass:
							arraySubType.length > 0 &&
							arraySubType.includes('audio_jp')
								? 'btn-audio-jp'
								: 'hidden',
						action: function () {
							resolve(typeSub.audio_jp);
						},
					},

					off: {
						text: 'Keep original',
						action: function () {
							resolve(typeSub.original);
						},
					},
				},
			});
			const style = document.createElement('style');
			style.innerHTML = `.hidden {
                                display: none !important;
                              }`;
			document.head.appendChild(style);
		});
	}

	/**
	 * confirm Page Translate
	 * @returns {Promise<any>}
	 */
	static confirmPageTranslate() {
		return new Promise(function (resolve, reject) {
			$.alert({
				icon: '',
				theme: 'modern',
				title: 'FUNiX Passport',
				content:
					"<div id='funix-onpage-modal'>This page already has translate support, would you like to enable it?</div>",
				boxWidth: '500px',
				useBootstrap: false,
				buttons: {
					vi: {
						text: 'Vietnamese',
						action: function () {
							resolve(1);
						},
					},
					jp: {
						text: 'Japanese',
						action: function () {
							resolve(2);
						},
					},
					No: {
						text: 'Cancel',
						action: function () {
							resolve(3);
						},
					},
				},
			});
		});
	}
}
