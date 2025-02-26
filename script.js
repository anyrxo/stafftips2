// GitHub Gist Raw JSON URL
const apiUrl = 'https://gist.githubusercontent.com/xsirenmedia/77becb9e1951d04dc4fc864320892cdb/raw/';

let tips = [];
let usedIndexes = new Set(); // Keeps track of shown messages
const visibleMessagesCount = 5; // Number of messages visible at once
const messageInterval = 4000; // 4 seconds before moving left

// Fetch Messages from Gist
async function fetchTips() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const text = await response.text();
        tips = JSON.parse(text);

        if (!Array.isArray(tips) || tips.length === 0) {
            throw new Error('No valid tips found.');
        }

        shuffleArray(tips);
        initializeMessages();
        setInterval(scrollMessages, messageInterval);
    } catch (error) {
        console.error('Failed to load tips:', error);
    }
}

// Fisher-Yates Shuffle Algorithm (Ensures a new random order each cycle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Load initial messages
function initializeMessages() {
    const container = document.getElementById('scroll-container');
    container.innerHTML = ''; // Clear existing messages
    usedIndexes.clear(); // Reset history at the start

    for (let i = 0; i < visibleMessagesCount; i++) {
        addNextMessage(container);
    }
}

// Get a truly random tip (No Repeats Until All Tips Are Used)
function getNextUniqueTip() {
    if (usedIndexes.size >= tips.length) {
        usedIndexes.clear(); // Reset when all tips are used
        shuffleArray(tips); // Reshuffle to create a new randomized cycle
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * tips.length);
    } while (usedIndexes.has(randomIndex));

    usedIndexes.add(randomIndex);
    return tips[randomIndex];
}

// Handle scrolling effect (left to right)
function scrollMessages() {
    const container = document.getElementById('scroll-container');
    container.firstChild.classList.add('fade-out'); // Apply fade-out animation

    setTimeout(() => {
        container.firstChild.remove(); // Remove message after fade-out
        addNextMessage(container); // Add new message on the left
    }, 1000); // Match fade-out duration
}

// Add next message in sequence
function addNextMessage(container) {
    const tip = getNextUniqueTip(); // Get a truly unique tip

    const messageDiv = document.createElement('div');
    messageDiv.className = 'scroll-message';
    messageDiv.innerHTML = `
        <div class="tip-title">${tip.title}</div>
        <div class="tip-content">${tip.description}</div>
    `;

    container.appendChild(messageDiv);
}

// Load messages when DOM is ready
document.addEventListener('DOMContentLoaded', fetchTips);
