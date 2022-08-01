let youtubeSubtitle,
	vi,
	bs,
	eng,
	jp,
	iconBtn,
	viBtn,
	engBtn,
	offBtn,
	settingMenu,
	captionNode,
	urlVtt,
	urlVttvi,
	urlVtten,
	urlVttjp,
	arraySubType = [];

$(document).ready(function () {
	//initData();
});

const initSubtible = (video) => {
	const id = $($('#rscpAu-ToolbarTitle')[0]).html();
	console.log('ID: ' + id);
	initData(video, id);
};

const observer = new MutationObserver((mutations) => {
	mutations.forEach((m) => {
		m.addedNodes.forEach((n) => {
			if (n instanceof HTMLElement) {
				if (n.tagName && n.tagName.toLowerCase() === 'video') {
					initSubtible(n);
				}
			}
		});
	});
});

observer.observe(document.querySelector('html'), {
	childList: true,
	subtree: true,
});

function startObserver(video) {
	if (video !== undefined) {
		youtubeSubtitle.startObserver(video);
	} else {
		setTimeout(function () {
			startObserver();
		}, 1000);
	}
}

function initData(video, id) {
	let request = {
		content: 'POST Request',
		requestUrl: 'https://funix-subtitle.firebaseapp.com/get',
		requestBody: {
			cid: 'awsacademy',
			lid: id,
		},
	};
	sendMessagePromise(request).then((res) => {
		if (res.code === 200) {
			getData(res.data).then(() => {
				arraySubType = []; // reset type - show popup confirm

				youtubeSubtitle = new subtitleObserver(
					'#funix-text .ytp-caption-segment'
				);
				youtubeSubtitle.initData(this.vi, eng, jp);
				showConfirm(video);
			});
		}
	});
}

function showConfirm(video) {
	getSettingData().then((res) => {
		let subtitleMode = res.modeSubtitle;
		if (subtitleMode === '0') {
			Notifycation.confirmSubtitle(arraySubType).then((mode) => {
				if (mode !== 0) {
					youtubeSubtitle.mode = mode;
					if (mode == 1) urlVtt = urlVttvi;
					// if (mode == 2)
					//    urlVtt = urlVttvi;
					if (mode == 3) urlVtt = urlVttjp;
					setActiveButton([offBtn, viBtn, engBtn][mode]);
					startObserver(video);
					initVisibleSubtitle();
				}
			});
		}
	});
}

async function getData(data) {
	if (data.vi != undefined && data.vi != '') {
		urlVttvi = data.vi;
	}
	if (data.en != undefined && data.en != '') {
		urlVtten = data.en;
	}
	if (data.jp != undefined && data.jp != '') {
		urlVttjp = data.jp;
	}

	await sendMessagePromise({
		content: 'GET Request',
		requestUrl: data.vi,
	}).then((data) => {
		if (data !== undefined) {
			vi = SubtitleHandling.parseSubByRegex(data);
			arraySubType.push('vi');
		}
	});
	await sendMessagePromise({
		content: 'GET Request',
		requestUrl: data.en,
	}).then((data) => {
		if (data !== undefined) {
			eng = SubtitleHandling.parseSubByRegex(data);
			arraySubType.push('en');
		}
	});
	await sendMessagePromise({
		content: 'GET Request',
		requestUrl: data.jp,
	}).then((data) => {
		if (data !== undefined) {
			jp = SubtitleHandling.parseSubByRegex(data);
			arraySubType.push('jp');
		}
	});
}

function setActiveButton(button) {
	$('#funix-setting .ytp-swatch-color').removeClass('ytp-swatch-color');
	$(button).addClass('ytp-swatch-color');
}

function initVisibleSubtitle() {
	$('#rscpAu-Media').attr('crossorigin', 'anonymous');
	$('video > track').remove();
	let srcUrl = urlVtt;
	$('video').append(
		$(
			'<track src=' +
				srcUrl +
				' label="Vietnam" srclang="vi" kind="SUBTITLES" default="true">'
		)
	);
	var tracks = $('track');

	for (var i = 0; i < tracks.length; i++) {
		loadTrackWithAjax(tracks[i]);
	}
}

function loadTrackWithAjax(track) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200 && this.responseText) {
			// If VTT fetch succeeded, replace the src with a BLOB URL.

			var blob = new Blob([this.responseText], { type: 'text/vtt' });
			track.setAttribute('src', URL.createObjectURL(blob));
		}
	};
	xhttp.open('GET', track.src, true);
	xhttp.send();
}
