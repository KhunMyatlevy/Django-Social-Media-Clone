document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevent form from submitting normally

        // Capture input values
        const username = document.getElementById('username').value.trim(); // Trim whitespace
        const password = document.getElementById('password').value.trim();
        const responseMessage = document.getElementById('response-message');
        const submitButton = document.querySelector('button[type="submit"]');
        
        // Check for empty fields
        if (!username || !password) {
            responseMessage.textContent = 'Please enter both username and password.';
            responseMessage.style.color = 'red';
            return;  // Exit early if validation fails
        }

        try {
            // Show loading state
            submitButton.textContent = 'Logging in...';
            submitButton.disabled = true;

            // Send POST request to login API
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'  // Indicate JSON format
                },
                body: JSON.stringify({ username, password })  // Convert data to JSON string
            });

            // Check if response is valid before parsing
            if (!response.ok) {
                const errorData = await response.json();  // Parse error response
                throw new Error(errorData.detail || 'Login failed.');  // Throw custom error
            }

            // Parse the JSON response for successful login
            const data = await response.json();
            localStorage.setItem('token', data.access);  // Store access token for authorization
            localStorage.setItem('refreshToken', data.refresh);  // Optionally store refresh token
            localStorage.setItem('userId', data.user_id);  // Store user ID
            localStorage.setItem('username', data.username)
            console.log('Tokens, username and user ID stored:', data.access, data.refresh, data.user_id, data.username);


            responseMessage.textContent = 'Login successful!';
            responseMessage.style.color = 'green';

            // Clear fields after successful login
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';

            // Redirect to another page
            window.location.href = '../home/home.html';  // Ensure this path is correct

        } catch (error) {
            console.error('Network error:', error);
            responseMessage.textContent = 'An error occurred: ' + error.message;
            responseMessage.style.color = 'red';
        } finally {
            // Reset button state
            submitButton.textContent = 'Login';
            submitButton.disabled = false;
        }
    });
});
