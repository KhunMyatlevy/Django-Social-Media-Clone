from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=200)  # Title of the post
    content = models.TextField()               # Content of the post
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when post is created
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Relationship with User model
    updated_at = models.DateTimeField(auto_now=True)      # Timestamp when post is updated
    deleted_at = models.DateTimeField(null=True, blank=True)  # Timestamp when post is deleted
    

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')  # Link to Post
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')  # Link to User
    content = models.TextField()  # Content of the comment
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of when the comment was created
    updated_at = models.DateTimeField(auto_now=True)      # Timestamp when post is updated
    deleted_at = models.DateTimeField(null=True, blank=True)  # Timestamp when post is deleted

    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'