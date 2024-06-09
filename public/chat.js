document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.getElementById('textInput');
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Prevent default to avoid actually creating a new line
            e.preventDefault();
            // Trigger the send button click
            document.getElementById('buttonInput').click();
        } else if (e.key === 'Enter' && e.shiftKey) {
            // Allow shift+Enter to create a new line in the input
            // No need to prevent default, let the new line be created
        }
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