// script.js

document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent form from submitting normally

    // Capture input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password_confirm').value;
    const email = document.getElementById('email').value;

    try {
        // Send POST request to signup API
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Indicate JSON format
            },
            body: JSON.stringify({ username, password, email, password_confirm })  // Convert data to JSON string
        });

        // Parse the JSON response once
        const data = await response.json();

        // Check if registration was successful
        if (response.ok) {
            document.getElementById('response-message').textContent = 'Registration successful!';
            document.getElementById('response-message').style.color = 'green';
        } else {
            // If registration failed, display the error message
            document.getElementById('response-message').textContent = data.detail || 'Registration failed.';
            console.error('Error response:', data); // Log error details
        }
    } catch (error) {
        // Log any unexpected errors
        document.getElementById('response-message').textContent = 'An error occurred: ' + error;
        console.error('An unexpected error occurred:', error); // Log the error for debugging
    }
});

