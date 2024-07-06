// 檢查 marked 是否已經載入
if (typeof marked === "undefined") {
    console.error("marked is not defined");
} else {
    console.log("marked is successfully loaded");
}

document.getElementById("screenshot-btn").addEventListener("click", () => {
    // 查詢當前活動的標籤頁
    console.log("Button was clicked!");
    document.body.innerHTML += "<p>Button was clicked!</p>";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.captureVisibleTab(null, {}, async function (image) {
            console.log("Screenshot captured");
            console.log(image);

            try {
                // 使用OpenAI API進行圖片辨識
                const response = await fetch(
                    "https://api.openai.com/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer sk-proj-", // 替換為你的API密鑰
                        },
                        body: JSON.stringify({
                            model: "gpt-4o",
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        {
                                            type: "text",
                                            text: "What's in this image?",
                                        },
                                        {
                                            type: "image_url",
                                            image_url: { url: image },
                                        },
                                    ],
                                },
                            ],
                            temperature: 1,
                            max_tokens: 256,
                            top_p: 1,
                            frequency_penalty: 0,
                            presence_penalty: 0,
                            stream: false, // 如果你想使用stream，將這裡設為true，並需要處理stream的回應
                        }),
                    }
                );

                const result = await response.json();
                console.log(result);

                // 使用 marked 解析 markdown
                const markdownContent = marked.parse(
                    result.choices[0].message.content
                );
                document.getElementById("output").innerHTML = markdownContent;
            } catch (error) {
                console.error("Error:", error);
                document.body.innerHTML += `<p>Error: ${error.message}</p>`;
            }
        });
    });
});
