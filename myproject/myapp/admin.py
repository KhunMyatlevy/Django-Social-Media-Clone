from django.contrib import admin
from .models import Post  # Adjust the import based on your app name

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at', 'updated_at', 'deleted_at', 'user','id')  # Display these fields in the list view
    list_filter = ('created_at', 'updated_at', 'deleted_at', 'user')  # Allow filtering by these fields
    search_fields = ('title', 'content')  # Enable search by title and content
    ordering = ('-created_at',)  # Order posts by creation date descending

# If you prefer to register without using the decorator, you can also do this:
# admin.site.register(Post, PostAdmin)
from django.contrib import admin
from .models import Comment  # Make sure to import your Comment model

class CommentAdmin(admin.ModelAdmin):
    # Fields you want to display in the list view
    list_display = ('id', 'user', 'content', 'post', 'created_at', 'updated_at')
    # Optional: add filters, search fields, etc.
    search_fields = ('content', 'user__username', 'post__title')  # Searching based on content, user, or post title
    list_filter = ('created_at', 'updated_at')  # Filter by creation and update dates

# Register the Comment model with the custom admin configuration
admin.site.register(Comment, CommentAdmin)


from django.contrib import admin
from django.contrib.auth.models import User

# Customize the user display in the admin interface
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff')  # Add 'id' to show the user ID

# Register the customized User admin view
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


