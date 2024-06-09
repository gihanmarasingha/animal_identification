document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('textInput');
    const sendButton = document.getElementById('buttonInput');
    const textInput = document.getElementById('textInput');
    const updateHeight = () => {
        textInput.style.height = 'auto'; // Reset the height
        textInput.style.height = textInput.scrollHeight + 'px'; // Set height based on content
    };

    textInput.addEventListener('input', updateHeight); // Update height on user input

    // Also update height on page load in case there's initial content
    updateHeight();
      
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent default to avoid a new line
            sendButton.click(); // Trigger send button click programmatically
        }
    });

    sendButton.addEventListener('click', function() {
        let userInput = inputField.value;
        if (userInput.trim() === '') return; // Prevent sending empty messages
        inputField.value = ''; // Clear the input after sending
        updateChat(userInput, 'userText');

        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            updateChat(data.answer, 'botText');
            inputField.focus(); // Set focus back to the text input field
        })
        .catch(error => {
            console.error('Error:', error);
            inputField.focus(); // Ensure focus even if there is an error
        });
    });

    document.getElementById('buttonInput').addEventListener('click', function() {
        let userInput = inputField.value;
        if (userInput.trim() === '') return; // Prevent sending empty messages
        inputField.value = '';
        updateChat(userInput, 'userText');

        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            updateChat(data.answer, 'botText');
        })
        .catch(error => console.error('Error:', error));
    });
});

function updateChat(msg, className) {
    let newP = document.createElement("p");
    newP.className = className;
    let newSpan = document.createElement("span");
    newSpan.textContent = msg;
    newP.appendChild(newSpan);
    document.getElementById("chatbox").appendChild(newP);
    // Keep the chat scrolled to the bottom
    document.getElementById("chatbox").scrollTop = document.getElementById("chatbox").scrollHeight;
}