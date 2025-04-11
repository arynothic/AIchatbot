document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value.trim();

    if (!userInput) return;

    // Display the user's message in the chat
    addMessageToChat("User", userInput);

    // Clear the input field
    document.getElementById("user-input").value = "";

    // Send the input to the backend API
    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input: userInput }),
        });

        const data = await response.json();

        if (response.ok) {
            // Display the AI's response in the chat
            addMessageToChat("AI", data.response);
        } else {
            addMessageToChat("AI", "Sorry, I couldn't generate a response.");
        }
    } catch (error) {
        console.error("Error:", error);
        addMessageToChat("AI", "An error occurred. Please try again.");
    }
});

// Function to display messages in the chat
function addMessageToChat(sender, message) {
    const chatContainer = document.getElementById("chat-container");

    const messageElement = document.createElement("div");
    messageElement.classList.add("p-3", "rounded-xl", "shadow-lg", "max-w-xs", "space-y-2");

    if (sender === "User") {
        messageElement.classList.add("bg-blue-100", "text-left", "self-end");
        messageElement.innerHTML = `<strong class="text-blue-600">User:</strong> ${message}`;
    } else {
        messageElement.classList.add("bg-gray-100", "text-right", "self-start");
        messageElement.innerHTML = `<strong class="text-gray-600">AI:</strong> ${message}`;
    }

    chatContainer.appendChild(messageElement);

    // Scroll to the bottom of the chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
const chatContainer = document.getElementById("chat-container");

function addMessage(message, sender = "bot") {
    const msg = document.createElement("div");

    if (sender === "user") {
        msg.className = "self-end bg-indigo-500 text-white p-3 rounded-xl max-w-xs";
    } else if (sender === "bot") {
        msg.className = "self-center bg-gray-200 text-gray-900 p-3 rounded-xl max-w-xs text-center";
    }

    msg.innerText = message;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
