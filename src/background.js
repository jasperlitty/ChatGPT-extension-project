// Listen for a click on the browser action icon
chrome.action.onClicked.addListener(tab => {
	// Execute the captureScreenshot function in the context of the current tab
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: captureScreenshot,
	});
});

// Function to capture a screenshot of the visible tab
function captureScreenshot() {
	// Capture the visible tab
	chrome.tabs.captureVisibleTab(null, {}, function (image) {
		// Create a link element
		const link = document.createElement('a');
		// Set the link's href to the captured image
		link.href = image;
		// Set the download attribute to specify the filename
		link.download = 'screenshot.png';
		// Programmatically click the link to trigger the download
		link.click();
	});
}

// API key for accessing the OpenAI API
const API_KEY = 'sk-proj-HTUcuOHxBiHmXIkSaDOfT3BlbkFJ2CsjspDYTA4ts6JwsQwp'; // Replace with your API key

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// Check if the action is 'fetchData'
	if (request.action === 'fetchData') {
		// Make a POST request to the OpenAI API
		fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${API_KEY}`,
			},
			// Send the request data as the body of the POST request
			body: JSON.stringify(request.data),
		})
			// Parse the JSON response
			.then(response => response.json())
			// Send the data back to the sender
			.then(data => sendResponse({ success: true, data }))
			// Handle any errors that occur
			.catch(error => sendResponse({ success: false, error: error.message }));
		// Return true to keep the message channel open for sendResponse
		return true;
	}
});
