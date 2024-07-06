chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: captureScreenshot,
    });
});

function captureScreenshot() {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        const link = document.createElement("a");
        link.href = image;
        link.download = "screenshot.png";
        link.click();
    });
}
