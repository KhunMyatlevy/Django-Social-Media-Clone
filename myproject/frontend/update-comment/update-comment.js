document.addEventListener('DOMContentLoaded', async function() {
    const commentId = localStorage.getItem('commentId');  // Retrieve the comment ID from local storage
    const postId = localStorage.getItem('postId');  // Retrieve the post ID from local storage
    const accessToken = localStorage.getItem('token');  // Retrieve the access token from local storage
    const userId = localStorage.getItem('userId');  // Retrieve the user ID from local storage

    if (!commentId || !postId || !userId || !accessToken) {
        document.getElementById('message').textContent = "Required data not found. Please ensure you're logged in and the comment is selected.";
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/comments/${commentId}/`;  // Endpoint to fetch the comment details

    try {
        // Fetch the existing comment details
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const comment = await response.json();
            // Populate the textarea with the existing comment content
            document.getElementById('comment-id').value = comment.id;
            document.getElementById('comment-content').value = comment.content;

            // Adjust the height of the textarea to fit the content
            adjustTextareaHeight();
        } else {
            console.error("Failed to fetch comment details:", response.statusText);
            document.getElementById('message').textContent = "Failed to load comment details.";
        }
    } catch (error) {
        console.error("Error fetching comment details:", error);
        document.getElementById('message').textContent = "An error occurred while fetching comment details.";
    }

    // Update comment on form submission
    document.getElementById('update-comment-form').addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent the default form submission

        const updatedContent = document.getElementById('comment-content').value;

        const updatedComment = {
            user: userId,  // Add user ID to the request body
            post: postId,  // Add post ID to the request body
            content: updatedContent  // Updated content
        };

        const updateUrl = `http://127.0.0.1:8000/api/comments/${commentId}/update/`;  // Endpoint to update the comment

        try {
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',  // Use PUT to update the comment
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedComment)
            });

            if (updateResponse.ok) {
                document.getElementById('message').textContent = "Comment updated successfully!";
            } else {
                console.error("Failed to update comment:", updateResponse.statusText);
                document.getElementById('message').textContent = "Failed to update comment.";
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            document.getElementById('message').textContent = "An error occurred while updating comment.";
        }
    });

    // Function to adjust the height of the textarea based on its content
    function adjustTextareaHeight() {
        const textarea = document.getElementById('comment-content');
        textarea.style.height = 'auto';  // Reset height to auto to allow resizing
        textarea.style.height = textarea.scrollHeight + 'px';  // Set the height to scrollHeight
    }

    // Adjust the textarea height when the user types in it
    document.getElementById('comment-content').addEventListener('input', adjustTextareaHeight);
});
