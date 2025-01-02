document.addEventListener('DOMContentLoaded', async function() {
    const postId = localStorage.getItem('postId');  // Retrieve the post ID from local storage
    const accessToken = localStorage.getItem('token');  // Retrieve the access token from local storage
    

    // Define the API endpoint for getting a specific post
    const apiUrl = `http://127.0.0.1:8000/api/posts/${postId}/`;

    try {
        // Make the fetch request to the API endpoint
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`  // Include the access token in the request header
            }
        });

        // Check if the response is successful
        if (response.ok) {
            const post = await response.json();

        // Display the post details in the HTML
        document.getElementById('post-title').textContent = `${post.title}`;
        document.getElementById('post-content').textContent = `${post.content}`;
        document.getElementById('post-date').textContent = `${new Date(post.created_at).toLocaleDateString()}`;
        document.getElementById('post-author').textContent = `Author: ${post.author_name}`;  // Add this line

        } else {
            console.error("Failed to fetch post details:", response.statusText);
            document.getElementById('post-details').textContent = "Failed to load post details.";
        }
    } catch (error) {
        console.error("Error fetching post details:", error);
        document.getElementById('post-details').textContent = "An error occurred while fetching post details.";
    }
});
