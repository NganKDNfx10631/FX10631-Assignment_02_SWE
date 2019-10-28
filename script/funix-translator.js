var addEventReload = false; // Check if add click event to reload

$(document).ready(function() {
	init();
});

function getIndex(domSelector, activeClass) {
   let list = $(domSelector);
   for(let i = 0; i < list.length; i++)
   {
      if($(list[i]).hasClass(activeClass)) return i;
   }
   return -1;
}

function init() {
	let request = {
      content: "POST Request",
      requestUrl: "https://funix-onpage-translator.firebaseapp.com/get-data",
      requestBody: {
         id: encodeURIComponent(window.location.href)
      }
   };
	if(window.location.href.match("courses.edx.org/*"))
	{
		let index = getIndex("#sequence-list > li > button", "active");
		request.requestBody.id = encodeURIComponent(window.location.href + "?page=" + index);
	}
   chrome.runtime.sendMessage(request, res => {
		if(res.code === 200)
		{
			gotData(res.data);
			if(res.data.selector.reload && !addEventReload)
			{
				$(res.data.selector.reloadSelector).click(function(event) {
					init();
				});
				addEventReload = true;
			}
		}
   });
}

function gotData(data) {
	getSettingData().then(res => {
		let subtitleMode = res.modeSubtitle;
      if(subtitleMode === "1")
   	{
   		$.alert({
				icon: '',
				theme: 'modern',
   			title: 'FUNiX Passport',
   			content: "This page already has translate support, would you like to enable it?",
   			boxWidth: '500px',
   			useBootstrap: false,
   			buttons: {
   				Yes: {
   					action: function() {
   						render(data, res.float);
   					}
   				},
   				No: {
   					action: function() {}
   				}
   			}
   		});
   	} else if(subtitleMode === "0")
   	{
   		render(data, res.float);
   	}
	});
}

function render(data, float) {
	let request = {
      content: "GET Request",
      requestUrl: data.link
   };
   chrome.runtime.sendMessage(request, res => {
		// For cousera
		if(window.location.href.match("courses.edx.org/*"))
		{
			let video = null;
			let videoList = $(".tc-wrapper");
			if(videoList.length > 0) video = videoList[0];
			$(data.selector.selector).html(res);
			renderTranscriptEdx(res, video);
		} else {
			$(data.selector.selector).html(res);
		}
   });
	if(float) initMenuComponents();
}

function renderTranscriptEdx(res, video) {

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
