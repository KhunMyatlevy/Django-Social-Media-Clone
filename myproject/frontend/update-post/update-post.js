document.addEventListener('DOMContentLoaded', async function() {
    const postId = localStorage.getItem('postId');  // Retrieve the post ID from local storage
    const accessToken = localStorage.getItem('token');  // Retrieve the access token from local storage
    const userId = localStorage.getItem('userId');

    if (!postId) {
        document.getElementById('message').textContent = "No post ID found. Please select a post.";
        return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/posts/${postId}/`;
    const updateUrl = `http://127.0.0.1:8000/api/posts/${postId}/update`;

    try {
        // Fetch the existing post details
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const post = await response.json();

            // Populate the input fields with existing post details
            document.getElementById('post-title').value = post.title;
            const contentTextarea = document.getElementById('post-content');
            contentTextarea.value = post.content;
            document.getElementById('post-date').value = new Date(post.created_at).toLocaleDateString();

            // Adjust height of the textarea based on content
            adjustTextareaHeight(contentTextarea);
        } else {
            console.error("Failed to fetch post details:", response.statusText);
            document.getElementById('message').textContent = "Failed to load post details.";
        }
    } catch (error) {
        console.error("Error fetching post details:", error);
        document.getElementById('message').textContent = "An error occurred while fetching post details.";
    }

    // Update post on button click
    document.getElementById('update-post-btn').addEventListener('click', async () => {
        const updatedPost = {
            user: userId,
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value
        };

        try {
            const updateResponse = await fetch(updateUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            });

            if (updateResponse.ok) {
                document.getElementById('message').textContent = "Post updated successfully!";
            } else {
                console.error("Failed to update post:", updateResponse.statusText);
                document.getElementById('message').textContent = "Failed to update post.";
            }
        } catch (error) {
            console.error("Error updating post:", error);
            document.getElementById('message').textContent = "An error occurred while updating post.";
        }
    });

    // Function to adjust the height of the textarea
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; // Reset height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
    }

    // Adjust height whenever the content changes
    document.getElementById('post-content').addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
});
