var originalText = "";
var translatedText = ""
var url = window.location.href;
var elementXpath = "";

function getXPath( element )
{
var val=element.value;
    //alert("val="+val);
    var xpath = '';
    for ( ; element && element.nodeType == 1; element = element.parentNode )
    {
        //alert(element);
        var id = $(element.parentNode).children(element.tagName).index(element) + 1;
        //id > 1 ? (id = '[' + id + ']') : (id = '');
		id = '[' + id + ']';
        xpath = '/' + element.tagName.toLowerCase() + id + xpath;
    }
	
    return xpath;
}

// hide right column of facebook for display flms
$(document).ready(function(){
	if (window.location == "https://apps.facebook.com/lmsfunix/") 
		$("#rightCol").css('display', 'none');
});
