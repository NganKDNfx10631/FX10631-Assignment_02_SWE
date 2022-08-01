let edugoogleSubtitleObserver, vi, eng, jp, oldURL, currentURL;

function initComponent() {
	initData().then((status) => {
		if (status) {
			getSettingData().then((res) => {
				let subtitleMode = res.modeSubtitle;
				if (subtitleMode === '0') {
					Notifycation.confirmSubtitle().then((mode) => {
						if (mode !== 0) {
							createElement(mode);
						}
					});
				}
				// else if (subtitleMode === "0") {
				//    createElement(1);
				// } else if (subtitleMode === "2") {}
			});
		}
	});
}

function checkURLchange(currentURL) {
	if (currentURL != oldURL) {
		oldURL = currentURL;
		initComponent();
	}

	oldURL = $('video.show > source').attr('src');
	setTimeout(function () {
		checkURLchange($('video.show > source').attr('src'));
	}, 1000);
}

function createElement(mode) {
	let container = $(
		'<div id="funix-text-bound" style ="bottom: 4em;left: 0;right: 0;z-index: 1;display: flex;justify-content: center;-webkit-transition: bottom .2s;-moz-transition: bottom .2s;-ms-transition: bottom .2s;-o-transition: bottom .2s; transition: bottom .2s;cursor: inherit; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;-o-user-select: none;user-select: none;"> <div style = "position: relative;display: inline;height: auto;max-width: 30em;color: #fff;background-color: #14171c;font-family: sans-serif;line-height: 1.4;text-align: center;margin: 0 .5em 1em; padding: 2px 8px;white-space: pre-line;writing-mode: horizontal-tb;unicode-bidi: plaintext;direction: ltr;-webkit-box-decoration-break: clone;font-size: 2vw; opacity: 0.75;" id="funix-text"></div> </div>'
	);
	//setTimeout(() => {
	//courseraSubtitleObserver = new subtitleObserver("#funix-text .ytp-caption-segment");
	edugoogleSubtitleObserver = new subtitleObserver('#funix-text');
	// alert(JSON.stringify(vi));
	edugoogleSubtitleObserver.initData(vi, eng, jp);
	edugoogleSubtitleObserver.mode = mode;

	$('#funix-text-bound').remove();
	startObserver();

	$('.gallery-content').append(container);
	//$("video.show > sourcediv").append(container);

	// setTimeout(() => {
	//    $("#player > div")
	//    .append(container);
	// }, 1000);

	let funixSubtitle = document.getElementById('funix-text');

	if (funixSubtitle === undefined || funixSubtitle === null) {
		setTimeout(function () {
			createElement(mode);
		}, 1000);
	}
}

function startObserver() {
	//let video = $("video").get(0);
	let video = $('video.show').get(0);
	if (video !== undefined) {
		//alert("add subtitle mode " + mode);
		edugoogleSubtitleObserver.startObserver(video);
	} else {
		setTimeout(function () {
			startObserver();
		}, 1000);
	}
}

async function initData() {
	let urlSrc = $('video.show > source').attr('src');
	let id = urlSrc.split('/').splice(-1)[0].replace('.mp4', '');
	let request = {
		content: 'POST Request',
		requestUrl: 'https://funix-subtitle.firebaseapp.com/get',
		requestBody: {
			cid: 'edugoogle',
			lid: id,
		},
	};
	let resAPI = {};
	await sendMessagePromise(request).then((res) => {
		resAPI = res;
	});
	if (resAPI.code === 200) {
		await sendMessagePromise({
			content: 'GET Request',
			requestUrl: resAPI.data.vi,
		}).then((data) => {
			vi = SubtitleHandling.parseSub(data);
			alert('data vi: ' + JSON.stringify(data));
		});
		await sendMessagePromise({
			content: 'GET Request',
			requestUrl: resAPI.data.jp,
		}).then((data) => {
			jp = SubtitleHandling.parseSub(data);
		});
		return true;
	}
	return false;
}

$(document).ready(function () {
	//(new CourseraSubtitle()).run();
	oldURL = $('video.show > source').attr('src');
	currentURL = $('video.show > source').attr('src');
	checkURLchange(oldURL);
	initComponent();
});
