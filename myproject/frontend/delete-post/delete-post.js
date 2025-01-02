document.addEventListener('DOMContentLoaded', async function() {
    const postId = localStorage.getItem('postId');  // Retrieve the post ID from local storage
    const accessToken = localStorage.getItem('token');  // Retrieve the access token from local storage

    if (!postId) {
        document.getElementById('message').textContent = "No post ID found. Please select a post.";
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/posts/${postId}/`;  // API URL to get the specific post
    const DelapiUrl = `http://127.0.0.1:8000/api/posts/${postId}/delete`;  // API URL for deleting the specific post

    function autoAdjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';  // Reset height to auto first
        textarea.style.height = `${textarea.scrollHeight}px`;  // Set height based on content
    }

    try {
        // Fetch the post details
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`  // Include the access token for authentication
            }
        });

        if (response.ok) {
            const post = await response.json();
            // Populate the input fields with existing post details
            document.getElementById('post-title').value = post.title;
            const contentTextarea = document.getElementById('post-content');
            contentTextarea.value = post.content;
            autoAdjustTextareaHeight(contentTextarea);  // Adjust height based on content
            document.getElementById('post-date').value = new Date(post.created_at).toLocaleDateString();
        } else {
            console.error("Failed to fetch post details:", response.statusText);
            document.getElementById('message').textContent = "Failed to load post details.";
        }
    } catch (error) {
        console.error("Error fetching post details:", error);
        document.getElementById('message').textContent = "An error occurred while fetching post details.";
    }

    // Delete post on button click
    document.getElementById('delete-post-btn').addEventListener('click', async () => {
        try {
            const deleteResponse = await fetch(DelapiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,  // Include the access token for authentication
                    'Content-Type': 'application/json'
                }
            });

            if (deleteResponse.ok) {
                document.getElementById('message').textContent = "Post deleted successfully!";
                // Optionally redirect or clear the form after deletion
                setTimeout(() => {
                    window.location.href = '../home/home.html';  // Redirect to a list of posts or another page
                }, 1500);  // Wait 1.5 seconds before redirecting
            } else {
                console.error("Failed to delete post:", deleteResponse.statusText);
                document.getElementById('message').textContent = "Failed to delete post.";
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            document.getElementById('message').textContent = "An error occurred while deleting post.";
        }
    });
});
