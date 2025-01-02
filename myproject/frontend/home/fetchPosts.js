document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');

    // Function to fetch posts from the API
    async function fetchPosts() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts/'); // Replace with your API endpoint URL
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const posts = await response.json();

            // Check if posts are available
            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts available.</p>';
                return;
            }

            // Display each post and make it clickable
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <p><strong>Author:</strong> ${post.author_name}</p>
                    <hr>
                `;

                // Make the post clickable
                postElement.style.cursor = 'pointer';
                postElement.addEventListener('click', () => {
                    localStorage.setItem('postId', post.id); // Store post ID in localStorage
                    localStorage.setItem('postUserId', post.user); // Store the post owner's user ID
                    window.location.href = '../post-details/post-details.html'; // Redirect to the post details page
                });

                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error:', error);
            postsContainer.innerHTML = '<p>Could not load posts.</p>';
        }
    }

    // Call the fetchPosts function when the page loads
    fetchPosts();
});
