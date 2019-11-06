var snippets;
function initOld() {
	let agrs = {
			url: "https://pp.funix.edu.vn/funix-passport/get_translation.php",
			//url: "http://localhost:3788/funix-translate/get_translation.php",
			type: "POST",
			cache: false,
			dataType: 'text',
			data: {
				'url': encodeURIComponent(window.location.href)
			}
	};

	$.ajax(agrs).then(response => {
		snippets = JSON.parse(response);
		if(snippets.length > 0)
		{
			gotDataOld(snippets);
		}
	});
}

function initOldTranlate() {
	$("#sequence-list").click(function(event) {
		initOld();
	});
	initOld();
}

function gotDataOld(snippets) {
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
   						renderOld(snippets, res.float);
   					}
   				},
   				No: {
   					action: function() {}
   				}
   			}
   		});
   	} else if(subtitleMode === "0")
   	{
			renderOld(snippets, res.float);
   	}
	});
}

function renderOld(snippets, float) {
	if($(".video-wrapper").length === 0)
	{
		renderHTMLOld(snippets, float);
	}
	else renderTranscriptOld(snippets,float);
}

function renderTranscriptOld(snippets,float) {
	if($("ol.subtitles-menu > li").length > 0) renderHTMLOld(snippets,float)
	else{
		setTimeout(function(){
			renderTranscript(snippets,float);
		}, 500);
	}
}

function renderHTMLOld(snippets, float)
{
	if(float) initMenuComponents();
	// Find all content block that contain a term
	//+	var replaced = $("body").html();
	//replaced = encodeURIComponent(replaced);
	//console.log(replaced);

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
		value = currentNode.nodeValue.replace(/[\n\r]*/g,'').replace(/\t/g, ' ').replace(/&nbsp;/g, " ").replace(/\s+/g, ' ');

		// console.log("cleaned original: [" + value + "]");

        if (value != "") {
	      for (i = 0; i < snippets.length; i++) {
			// console.log("db original: [" + snippets[i].original + "]");
		/*
		var ele = $(document).xpath(decodeURIComponent(snippets[i].xpath));
		ele.html(decodeURIComponent(snippets[i].translated));
		alert(decodeURIComponent(snippets[i].xpath));
		$(ele).attr('xindex', i);
		$(ele).attr('xlang', 'vi');
		*/
		// console.log("|" + value + "|");

			originalValue = snippets[i].original.replace(/[\n\r]*/g,'').replace(/\t/g, ' ').replace(/&nbsp;/g, " ").replace(/\s+/g, ' ');
		    if (value.includes(originalValue) && value.length === originalValue.length) {
			  currentNode.nodeValue = snippets[i].translated;
			  break;
		    }

		/*
			$(currentNode).click(function(){
				var index = $(this).attr('xindex');
				if (typeof index !== typeof undefined && index !== false) {
					if ($(this).attr('xlang') == 'vi') {
						$(this).text(snippets[index].original);
						$(this).attr('xlang', 'en');
					} else {
						$(this).text(snippets[index].translated);
						$(this).attr('xlang', 'vi');
					}
				}
			});
		*/
	      }
	    }
      }
    } while (walker.nextNode());
	//+replaced = decodeURIComponent(replaced);
	//+$("body").html(replaced);
}
