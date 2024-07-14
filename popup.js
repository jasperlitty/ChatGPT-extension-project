document.addEventListener("DOMContentLoaded", () => {
    // Check if markdown-it is loaded
    if (typeof window.markdownit === "function") {
        console.log("markdown-it is loaded successfully.");
    } else {
        console.error("markdown-it failed to load.");
        return; // Stop further execution if markdown-it is not loaded
    }
    if (typeof window.katex === "object") {
        console.log("katex is loaded successfully.");
    } else {
        console.error("katex failed to load.");
        return;
    }
    // if (typeof window.markdownitKatex === "function") {
    //     console.log("markdown-it-katex is loaded successfully.");
    // } else {
    //     console.error("markdown-it-katex failed to load.");
    //     return; // Stop further execution if markdown-it-katex is not loaded
    // }

    document.getElementById("screenshot-btn").addEventListener("click", () => {
        // Query the current active tab
        console.log("Button was clicked!");
        document.body.innerHTML += "<p>Button was clicked!</p>";
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.captureVisibleTab(null, {}, async function (image) {
                console.log("Screenshot captured");
                console.log(image);

                try {
                    // Use OpenAI API to recognize image content
                    const response = await fetch(
                        "https://api.openai.com/v1/chat/completions",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization:
                                    "Bearer sk-proj-HTUcuOHxBiHmXIkSaDOfT3BlbkFJ2CsjspDYTA4ts6JwsQwp", // Replace with your API key
                            },
                            body: JSON.stringify({
                                model: "gpt-4o",
                                messages: [
                                    {
                                        role: "user",
                                        content: [
                                            {
                                                type: "text",
                                                text: "From this image, depict the potential math or physics question the user is looking for, only one question. This is the structure of how I want you to answer: First, state what the question is. Give a step by step tutorial on how to solve it. Then one last line is the Answer:. If the picture does not contain any math or physics, just say 'No math or physics in this picture.'",
                                            },
                                            {
                                                type: "image_url",
                                                image_url: { url: image },
                                            },
                                        ],
                                    },
                                ],
                                temperature: 1,
                                max_tokens: 2048,
                                top_p: 1,
                                frequency_penalty: 0,
                                presence_penalty: 0,
                                stream: false, // If you want to use stream, set this to true and handle stream response
                            }),
                        }
                    );

                    const result = await response.json();
                    console.log(result);

                    // Initialize markdown-it
                    const md = window.markdownit();
                    const markdownContent = md.render(
                        result.choices[0].message.content
                    );
                    document.getElementById("output").innerHTML =
                        markdownContent;
                } catch (error) {
                    console.error("Error:", error);
                    document.body.innerHTML += `<p>Error: ${error.message}</p>`;
                }
            });
        });
    });
});
