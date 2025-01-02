document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('post-form').addEventListener('submit', async function(event) {
        event.preventDefault();  // Prevent default form submission

        // Capture input values
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        // Clear previous response message
        const responseMessageElement = document.getElementById('response-message');
        responseMessageElement.textContent = '';

           // Access local storage
           const accessToken = localStorage.getItem('token');
           const refreshToken = localStorage.getItem('refreshToken');
           const userId = localStorage.getItem('userId');
   

  
        // Check if access token exists before making the request
        if (!accessToken) {
            responseMessageElement.textContent = 'No access token found. Please log in.';
            responseMessageElement.style.color = 'red';
            return;  // Exit if no access token is found
        }

        // Validate input fields
        if (!userId || !title || !content) {
            responseMessageElement.textContent = 'User ID, title, and content cannot be empty.';
            responseMessageElement.style.color = 'red';
            return;  // Exit if fields are empty
        }

        try {
            // Attempt to create the post
            let response = await fetch('http://127.0.0.1:8000/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Specify JSON format
                    'Authorization': `Bearer ${accessToken}`  // Use the retrieved access token
                },
                body: JSON.stringify({ user: userId, title, content})  // Include user ID in the request body
            });

            // If the access token has expired (assumed status code 401), use the refresh token
            if (response.status === 401 && refreshToken) {
                // Attempt to refresh the access token
                const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'  // Specify JSON format
                    },
                    body: JSON.stringify({ refresh: refreshToken })  // Send the refresh token
                });

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    localStorage.setItem('token', refreshData.access);  // Update the access token
                    return this.submit();  // Retry the original post request with the new token
                } else {
                    responseMessageElement.textContent = 'Failed to refresh token. Please log in again.';
                    responseMessageElement.style.color = 'red';
                    return;  // Exit if refresh fails
                }
            }

            // Parse the response
            const data = await response.json();

            // Check if the post was created successfully
            if (response.ok) {
                responseMessageElement.textContent = 'Post created successfully!';
                responseMessageElement.style.color = 'green';

                // Optionally, clear the form fields
                document.getElementById('title').value = '';
                document.getElementById('content').value = '';
            } else {
                // Handle errors
                console.error('Error response:', data); // Log the response for debugging
                responseMessageElement.textContent = data.detail || 'Failed to create post.';
                responseMessageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Network error:', error);
            responseMessageElement.textContent = 'An error occurred: ' + error.message;
            responseMessageElement.style.color = 'red';
        }
    });
});
