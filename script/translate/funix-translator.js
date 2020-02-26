class OnpageTranslator {
	constructor() {
		this.addEventReload = false; // Check if add click event to reload
	}
	checkDomain(){
		let hostname = window.location.hostname;
		let self = this;
		getDomainList().then(res => {
			if(res[hostname] !== undefined) self.init();
			else (new OldTranslator()).init();
		});
	}
	getIndex(domSelector, activeClass) {
	   let list = $(domSelector);
	   for(let i = 0; i < list.length; i++)
	   {
	      if($(list[i]).hasClass(activeClass)) return i;
	   }
	   return -1;
	}
	init() {
		let request = {
	      content: "POST Request",
	      requestUrl: "https://translation.funix.edu.vn/get-data",
	      requestBody: {
	         id: encodeURIComponent(window.location.href)
	      }
	   };
		if(window.location.href.match("courses.edx.org/*"))
		{
			let index = this.getIndex("#sequence-list > li > button", "active");
			let url = "courses.edx.org%2F" + window.location.pathname.split("/")[5] + "?page=" + index;
			request.requestBody.id = url;
		}
		let self = this;
	   chrome.runtime.sendMessage(request, res => {
			if(res === null)
			{
				(new OldTranslator()).init();
			}
			else if(res.code === 200)
			{
				self.gotData(res.data);
				if(res.data.selector.reload && !addEventReload)
				{
					$(res.data.selector.reloadSelector).click(function(event) {
						self.init();
					});
					addEventReload = true;
				}
			} else{
				(new OldTranslator()).init();
			}
	   });
	}
	gotData(data) {
		let self = this;
		getSettingData().then(res => {
			let subtitleMode = res.modeSubtitle;
	      if(subtitleMode === "1")
	   	{
				Notifycation.confirmPageTranslate().then(res => {
					if(res) self.render(data, res.float);
				});
	   	} else if(subtitleMode === "0")
	   	{
	   		self.render(data, res.float);
	   	}
		});
	}
	render(data, float) {
		let request = {
	      content: "GET Request",
	      requestUrl: data.link
	   };
		let self = this;
		const non_replace = data.selector.nonReplace || [];
		let elements = [];
		// Get non_replace element
		for(let selector of non_replace)
		{
			elements.push($(data.selector.selector + " " + selector));
		}

	   chrome.runtime.sendMessage(request, res => {
			// For cousera
			if(window.location.href.match("courses.edx.org/*"))
			{
				let video = null;
				let videoList = $(".tc-wrapper");
				if(videoList.length > 0) video = videoList[0];
				$(data.selector.selector).html(res);
				self.renderTranscriptEdx(res, video);
			} else {
				$(data.selector.selector).html(res);
			}

			// replace old elements
			for(let i = 0; i < non_replace.length; i++)
			{
				let selector  = data.selector.selector + " " + non_replace[i];
				let oldElement = elements[i];
				$(selector).each(function(index, el) {
					$(el).replaceWith(oldElement[index]);
				});
			}

	   });
		if(float) initMenuComponents();
	}
	renderTranscriptEdx(res, video) {

		if(video !== null)
		{
			let dom = $($.parseHTML(res));
			let element = null;
			for(let i = 0; i < dom.length; i++)
			{
				if($(dom[i]).find(".tc-wrapper").length > 0)
				{
					element = dom[i];
					break;
				}
			}
			let subtitle = $($(element).find("ol.subtitles-menu"));
			$(".tc-wrapper").html("");
			$($(".tc-wrapper").parent()).html(video);
			$("ol.subtitles-menu").html(subtitle.html());
		}
	}
}

$(document).ready(function() {
	(new OnpageTranslator()).checkDomain();
});