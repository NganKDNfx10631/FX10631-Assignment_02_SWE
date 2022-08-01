chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
	if (changeInfo.url) {
		// Emit event to current tab
		chrome.tabs.sendMessage(tabId, {
			type: 'tab-url-updated',
			url: changeInfo.url,
		});
	}
});
