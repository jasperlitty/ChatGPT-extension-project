import markdownit from 'markdown-it';
import markdownitKatex from '@vscode/markdown-it-katex';
import 'katex/dist/katex.min.css';
import 'github-markdown-css/github-markdown.css';

// Initialize markdown-it and extend it to support KaTeX
const md = markdownit().use(markdownitKatex);

document.addEventListener('DOMContentLoaded', () => {
	// Check if markdown-it is loaded successfully
	if (md) {
		console.log('markdown-it is loaded successfully.');
	} else {
		console.error('markdown-it failed to load.');
		return;
	}

	// Add click event listener to the screenshot button
	document.getElementById('screenshot-btn').addEventListener('click', () => {
		handleScreenshotClick();
		addButtonClickAnimation('screenshot-btn');
	});

	// Add click event listener to the refresh button
	document.getElementById('refresh-btn').addEventListener('click', () => {
		handleScreenshotClick();
		addButtonClickAnimation('refresh-btn');
		addRotationAnimation('refresh-btn');
	});
});

async function handleScreenshotClick() {
	// Create a message element and append it to the message container
	const messageContainer = document.getElementById('message-container');
	const message = document.createElement('p');
	message.className = 'message text-lg font-semibold';
	message.textContent = 'Button was clicked!';
	messageContainer.appendChild(message);

	// Capture the visible tab and process the image
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.captureVisibleTab(null, {}, async function (image) {
			const requestData = {
				model: 'gpt-4o',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: "From this image, depict the potential math or physics question the user is looking for, only one question. This is the structure of how I want you to answer: First, state what the question is. Give a step by step tutorial on how to solve it. Then one last line is the Answer:. If the picture does not contain any math or physics, just say 'No math or physics in this picture.'",
							},
							{
								type: 'image_url',
								image_url: { url: image },
							},
						],
					},
				],
				temperature: 0.2,
				max_tokens: 2048,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
				stream: false,
			};

			// Send the request to the background script
			chrome.runtime.sendMessage({ action: 'fetchData', data: requestData }, async response => {
				if (response.success) {
					const initialContent = response.data.choices[0].message.content;

					// Second request to format the mathematical expressions
					const formattedRequestData = {
						model: 'gpt-4o-mini',
						messages: [
							{
								role: 'user',
								content: [
									{
										type: 'text',
										text: `
**Prompt:**

Please convert all mathematical expressions in the provided content to Markdown-It-KaTeX syntax. Once the conversion is complete, return only the converted content without any additional commentary.

**Conversion Rules:**

1. Convert expressions like \`\sqrt\` or \`\int\` to use double backslashes, e.g., \`\\sqrt\`, \`\\int\`.
2. For inline formulas, use the \`$\` symbol to enclose them. For example:
    - This is an inline formula $\\sqrt{3x-1}+(1+x)^2$ 
    - Identify the function $\( f(x) $\)
    - Write the integral in its proper form. For example, if $\( a = 0 \)$ and $\( b = 1 \)$
    - Integrate $\( f(x) \)$ with respect to $\( x \)$. For $\( f(x) = 3x^2 \)$
3. For block-level formulas, use \`$$\` symbols to enclose them.starting on a new line.For example:
   - Convert \`\sqrt{3x-1}+(1+x)^2\` to \`$$\\sqrt{3x-1}+(1+x)^2$$\`
   - Convert 
     \`\`\`
     \int_{a}^{b} f(x)\, dx
     \`\`\`
     to 
     \`\`\`
     $$ 
     \\int_{a}^{b} f(x) \\, dx 
     $$ 
     \`\`\`

**Content to Convert:**
\`\`\`
${initialContent}
\`\`\`

**Output Format:**
\`\`\`
[Provide the converted content in a code block for easy verification]
\`\`\`

`,
									},
								],
							},
						],
						temperature: 0.2,
						max_tokens: 2048,
						top_p: 1,
						frequency_penalty: 0,
						presence_penalty: 0,
						stream: false,
					};

					// Send the second request to the background script
					chrome.runtime.sendMessage({ action: 'fetchData', data: formattedRequestData }, response => {
						if (response.success) {
							let contentWithMathDelimiters = response.data.choices[0].message.content;
							// Skip the first line of the prompt
							contentWithMathDelimiters = contentWithMathDelimiters.split('\n').slice(1).join('\n');
							// Render markdown content
							const markdownContent = md.render(contentWithMathDelimiters);
							document.getElementById('output').innerHTML = markdownContent;
						} else {
							console.error('Error:', response.error);
							document.body.innerHTML += `<p>Error: ${response.error}</p>`;
						}
					});
				} else {
					console.error('Error:', response.error);
					document.body.innerHTML += `<p>Error: ${response.error}</p>`;
				}
			});
		});
	});
}

// Add click animation to the button
function addButtonClickAnimation(buttonId) {
	const button = document.getElementById(buttonId);
	button.classList.add('button-clicked');
	setTimeout(() => button.classList.remove('button-clicked'), 300);
}

// Add rotation animation to the button
function addRotationAnimation(buttonId) {
	const button = document.getElementById(buttonId).querySelector('i');
	button.classList.add('rotate-animation');
	setTimeout(() => button.classList.remove('rotate-animation'), 1000);
}
