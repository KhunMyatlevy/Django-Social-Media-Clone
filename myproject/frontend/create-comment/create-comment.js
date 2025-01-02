document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('token'); // Retrieve token if you have authentication
    const userId = localStorage.getItem('userId'); // Assuming the user ID is stored in local storage
    const postId = localStorage.getItem('postId');  // Retrieve the post ID from local storage


    // Comment creation endpoint
    const commentUrl = `http://127.0.0.1:8000/api/posts/${postId}/comments/create/`;

    // Handle form submission
    document.getElementById('submit-comment-btn').addEventListener('click', async function() {
        const content = document.getElementById('comment-content').value;

        // Payload to be sent
        const commentData = {
            user: userId, // Assuming userId is required
            content: content
        };

        try {
            const response = await fetch(commentUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Include access token if needed
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                document.getElementById('message').textContent = "Comment submitted successfully!";
                document.getElementById('comment-content').value = ''; // Clear the textarea
            } else {
                console.error("Failed to submit comment:", response.statusText);
                document.getElementById('message').textContent = "Failed to submit comment.";
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            document.getElementById('message').textContent = "An error occurred while submitting the comment.";
        }
    });
});
