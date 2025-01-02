document.addEventListener('DOMContentLoaded', () => {
    // Retrieve necessary data from local storage
    const userId = localStorage.getItem('userId');
    const postId = localStorage.getItem('postId');
    const postUserId = localStorage.getItem('postUserId'); // Assuming you also store the post owner ID in local storage
    

    // If userId and postUserId are not the same, hide the edit and delete buttons
    if (userId !== postUserId) {
        // Hide the Edit and Delete links if the user is not the owner of the post
        const editPostLink = document.getElementById('edit-post-link');
        const deletePostLink = document.getElementById('delete-post-link');

        if (editPostLink) editPostLink.style.display = 'none';
        if (deletePostLink) deletePostLink.style.display = 'none';
    }
});
