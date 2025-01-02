// Function to fetch comments for a specific post and display them
async function fetchAndDisplayComments() {
    // Retrieve the post ID from local storage
    const postId = localStorage.getItem('postId');
    if (!postId) {
        console.error('Post ID not found in local storage.');
        return;
    }

    // Define the endpoint URL
    const url = `http://127.0.0.1:8000/api/posts/${postId}/comments/`;

    try {
        // Fetch comments from the API
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error fetching comments: ${response.statusText}`);
        }

        // Parse the response JSON
        const comments = await response.json();

        // Call a function to display the comments in HTML
        displayComments(comments);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display comments in HTML
function displayComments(comments) {
    // Assuming you have a container element in your HTML to hold the comments
    const commentsContainer = document.getElementById('comments-container');

    // Clear any existing comments in the container
    commentsContainer.innerHTML = '';

    // Iterate over the comments and create HTML elements for each comment
    comments.forEach(comment => {
        // Create a div element for each comment
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment'); // Add a class for styling

        // Create the Update and Delete buttons
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('update-btn');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        // Add event listener for the Update button
        updateButton.addEventListener('click', () => {
            // Store the comment ID in localStorage and redirect to update-comment.html
            localStorage.setItem('commentId', comment.id);
            window.location.href = "../update-comment/update-comment.html";  // Change URL as needed
        });

        // Add event listener for the Delete button
        deleteButton.addEventListener('click', () => {
            // Store the comment ID in localStorage and redirect to delete-comment.html
            localStorage.setItem('commentId', comment.id);
            window.location.href = "../delete-comment/delete-comment.html";  // Change URL as needed
        });

        // Populate the comment details
        commentElement.innerHTML = `
            <p><strong>Author:</strong> ${comment.author_name}</p> <!-- Display author_name here -->
            <p>${comment.content}</p>
            <p class="comment-date">${new Date(comment.created_at).toLocaleString()}</p>
        `;

        // Append the buttons to the comment element
        commentElement.appendChild(updateButton);
        commentElement.appendChild(deleteButton);

        // Append the comment element to the container
        commentsContainer.appendChild(commentElement);
    });
}

// Call the function to fetch and display comments when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayComments);
