var subTileAudio = {
	idTagAudio: 'audio-speech',
	isLoading: false,
	isPlay: false,
	isPause: false,
	audio: null,
	video: null,
	init: function (video) {
		this.video = video;
		this.autoloadEvent();
	},

	/**
	 * auto load Event
	 */
	autoloadEvent: function () {
		var self = this;
		var video = self.video;

		// event pause
		video.onpause = function () {
			console.log('onpause');
			subTileAudio.setCurrentTimeAudio(video);
		};

		// event play
		video.onplay = function () {
			console.log('onplay');
			subTileAudio.setCurrentTimeAudio(video);
		};

		video.onseeked = function () {
			console.log('seeked');
			subTileAudio.setCurrentTimeAudio(video);
		};

		// on change volume
		video.onvolumechange = function () {
			console.log('onvolumechange');
			subTileAudio.setCurrentTimeAudio(video);
		};

		video.onmute = function () {
			console.log('onmute');
			subTileAudio.setCurrentTimeAudio(video);
		};

		// on change speed
		video.onratechange = function () {
			console.log('onratechange');
			subTileAudio.setCurrentTimeAudio(video);
		};
	},

	/**
	 * set Current Time Audio
	 * @param video
	 */
	setCurrentTimeAudio: function (video) {
		var self = this;
		if (!self.audio || self.audio.length == 0 || !video) return false;

		self.audio.currentTime = video.currentTime; // set time current
		self.audio.playbackRate = video.playbackRate; // set speed audio

		if (video.muted || self.getCookie('mute')) {
			//  check mute = true => mute audio off , false => mute audio on
			self.audio.muted = false;
		} else {
			self.audio.muted = true;
		}

		if (video.paused) {
			// check status play or pause
			self.audio.pause();
		} else {
			self.audio.play();
		}
	},

	// function that stores the name of the visitor in a cookie variable
	setCookie: function (cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
		var expires = 'expires=' + d.toUTCString();
		document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
	},

	/*
	 * function that returns the value of a specified cookie
	 */
	getCookie: function (cname) {
		var name = cname + '=';
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}

			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return false;
	},

	/**
	 * build Tag Html Audio
	 * @param linkAudio
	 * @param type
	 * @param idAppend
	 * @returns {boolean}
	 */
	buildTagHtmlAudio: function (linkAudio, idAppend = 'body') {
		var self = this;
		if (!linkAudio || !idAppend) return false;

		var idTagAudio = $('#' + self.idTagAudio);
		if (idTagAudio.length > 0) {
			// check tag audio
			idTagAudio.remove(); // remove tag audio old
		}

		var tagAudio =
			'<audio id="' +
			self.idTagAudio +
			'" src="' +
			linkAudio +
			'" controls="controls" style="width: 100%;display: none"></audio>';
		console.log(idAppend);
		console.log(tagAudio);
		$(idAppend).append(tagAudio);

		self.audio = document.getElementById(self.idTagAudio);
		console.log('buildTagHtmlAudio');
	},

	/**
	 * remove Tag - reset Event Audio , video
	 */
	removeTagEventAudio: function () {
		var self = this;
		$('#' + self.idTagAudio).remove();
		self.audio = self.video = null;
	},

	removeTagAudio: function () {
		var self = this;
		$('#' + self.idTagAudio).remove();
	},

	resetAudioAndVideo: function () {
		self.audio = self.video = null;
	},
};
