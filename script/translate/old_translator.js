class OldTranslator {
	constructor() {}
	initData(){
		let url;
		if(window.location.hostname == "courses.edx.org")
		{
				url = "courses.edx.org%2F" + window.location.pathname.split("/")[5];
		} else {
			url = encodeURIComponent(window.location.href);
		}
		let agrs = {
				url: "https://pp.funix.edu.vn/funix-passport/get_translation.php",
				type: "POST",
				cache: false,
				dataType: 'text',
				data: {
					'url': url
				}
		};
		let self = this;
		$.ajax(agrs).then(response => {
			let snippets = JSON.parse(response);
			if(snippets.length > 0)
			{
				self.gotData(snippets);
			}
		});
	}
	init() {
		let self = this;
		$("#sequence-list").click(function(event) {
			self.initData();
		});
		self.initData();
	}
	gotData(snippets) {
		let self = this;
		getSettingData().then(res => {
			let subtitleMode = res.modeSubtitle;
	      if(subtitleMode === "1")
	   	{
				Notifycation.confirmPageTranslate().then(res => {
					if(res) self.render(snippets, res.float);
				});
	   	} else if(subtitleMode === "0")
	   	{
				self.render(snippets, res.float);
	   	}
		});
	}
	render(snippets, float) {
		this.renderHTML(snippets, float);
		if($(".video-wrapper").length === 0)
		{
			this.renderHTML(snippets, float);
		}
		else this.renderTranscript(snippets,float);
	}
	renderTranscript(snippets,float) {
		let self = this;
		if($("ol.subtitles-menu > li").length > 0) this.renderHTML(snippets,float)
		else{
			setTimeout(function(){
				self.renderTranscript(snippets,float);
			}, 500);
		}
	}
	renderHTML(snippets, float){
		if(float) initMenuComponents();
		let i = 0;
		// Decode text
		for (i = 0; i < snippets.length; i++) {
		  // Eliminate carriage return characters for mismatch between these chars in HTML and in DB
		  snippets[i].original = snippets[i].original.replace(/[\r\n]/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
		  snippets[i].translated = snippets[i].translated.replace(/[\r\n]/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
		}

		// sort elements in snippets by text length, descding order
		snippets.sort(function(a, b){return b.original.length-a.original.length;});


		var rootnode=document.body;
		var walker=document.createTreeWalker(rootnode, NodeFilter.SHOW_FRAGMENT, null, false)
		do {
		  // only get only text nodes, not get script nodes
	      var currentNode = walker.currentNode;
	      if (currentNode.nodeType == 3 & currentNode.parentNode.nodeName !== 'SCRIPT') {
	        // clean empty spaces including carriage return
			let value = currentNode.nodeValue.replace(/[\n\r]*/g,'').replace(/\t/g, ' ').replace(/&nbsp;/g, " ").replace(/\s+/g, ' ');

	        if (value != "") {
		      for (i = 0; i < snippets.length; i++) {

				let originalValue = snippets[i].original.replace(/[\n\r]*/g,'').replace(/\t/g, ' ').replace(/&nbsp;/g, " ").replace(/\s+/g, ' ');
			    if (value.includes(originalValue) && value.length === originalValue.length) {
				  currentNode.nodeValue = snippets[i].translated;
				  break;
			    }
		      }
		    }
	      }
	    } while (walker.nextNode());
	}
}