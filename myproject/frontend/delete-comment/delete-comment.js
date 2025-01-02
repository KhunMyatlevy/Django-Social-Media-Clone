document.addEventListener('DOMContentLoaded', async function() {
    const commentId = localStorage.getItem('commentId');  // Retrieve the comment ID from local storage
    const accessToken = localStorage.getItem('token');    // Retrieve the access token from local storage

    if (!commentId || !accessToken) {
        document.getElementById('message').textContent = "Required data not found. Please ensure you're logged in and the comment is selected.";
        return;
    }

    const detailsUrl = `http://127.0.0.1:8000/api/comments/${commentId}/`;  // Endpoint to fetch comment details
    const deleteUrl = `http://127.0.0.1:8000/api/comments/${commentId}/delete/`;  // Endpoint to delete the comment

    // Fetch and display comment details
    try {
        const response = await fetch(detailsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const comment = await response.json();
            document.getElementById('comment-user').textContent = comment.author_name;
            document.getElementById('comment-content').textContent = comment.content;
            document.getElementById('comment-date').textContent = new Date(comment.created_at).toLocaleString();
        } else {
            console.error("Failed to fetch comment details:", response.statusText);
            document.getElementById('message').textContent = "Failed to load comment details.";
            return;
        }
    } catch (error) {
        console.error("Error fetching comment details:", error);
        document.getElementById('message').textContent = "An error occurred while fetching comment details.";
        return;
    }

    // Delete comment when button is clicked
    document.getElementById('delete-comment-btn').addEventListener('click', async () => {
        try {
            const deleteResponse = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (deleteResponse.ok) {
                document.getElementById('message').textContent = "Comment deleted successfully!";
                setTimeout(() => {
                    window.location.href = 'post-details.html';  // Redirect to post details page
                }, 1500);
            } else {
                console.error("Failed to delete comment:", deleteResponse.statusText);
                document.getElementById('message').textContent = "Failed to delete comment.";
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            document.getElementById('message').textContent = "An error occurred while deleting the comment.";
        }
    });
});
