# ChatGPT Math and Physics Solver Extension

This is an extension designed for the Chrome browser, aimed at helping users solve math and physics problems using ChatGPT technology. By taking screenshots or directly inputting questions, users can quickly obtain solutions.

## Features

- **Screenshot Solving**: Users can take screenshots of the current page. The extension will automatically recognize the math problems in the screenshot and provide steps, processes, and answers.

## Installation

1. Download and extract the extension package.
2. Open the Chrome browser and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the folder of this extension.

## Usage

1. After installing and enabling the extension, click the extension icon in the browser toolbar.
2. Select the "Take Screenshot" button to take a screenshot or directly input your question in the pop-up dialog.
3. After submitting the question, wait for a moment, and the solution will be displayed in the pop-up window.

## Development

This extension is developed using the following technologies:

- HTML/CSS/JavaScript
- [marked.js](libs/marked.min.js) - for Markdown parsing
- Chrome Extension API
- OpenAI API - for connecting to the ChatGPT service
