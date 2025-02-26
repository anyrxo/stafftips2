// GitHub Gist Raw URL
const jsonUrl = "https://gist.githubusercontent.com/xsirenmedia/77becb9e1951d04dc4fc864320892cdb/raw/";

// Fetch JSON data from Gist
async function fetchMessages() {
    try {
        const response = await fetch(jsonUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Display a random message
async function showRandomMessage() {
    const messages = await fetchMessages();
    if (messages && messages.length > 0) {
        const randomIndex = Math.floor(Math.random() * messages.length);
        document.getElementById("message-title").innerText = messages[randomIndex].title;
        document.getElementById("message-description").innerText = messages[randomIndex].description;
    }
}

// Event Listener for Button Click
document.getElementById("newMessage").addEventListener("click", showRandomMessage);

// Load a random message on page load
window.onload = showRandomMessage;
