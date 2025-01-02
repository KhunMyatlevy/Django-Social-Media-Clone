# myapp/urls.py
from django.urls import path  # Import path to define URL patterns
from . import views  # Import the views module

urlpatterns = [

    #post end point 
    path('api/register/', views.register_view, name='register'),  # URL path for registration
    path('api/login/', views.login_view, name='login'),  # URL path for login
    path('api/posts/', views.post_list, name='post-list'),          # Endpoint for listing all posts
    path('api/posts/<int:pk>/', views.post_detail, name='post-detail'), # Endpoint for getting a specific post
    path('api/posts/create', views.create_post, name='create-post'),  # Adjust URL as needed
    path('api/posts/<int:pk>/update', views.post_update, name='post-update'),  # Correctly adding the prefix for the API
    path('api/posts/<int:pk>/delete', views.post_delete, name='post-delete'),  # Add this line for delete

    #comment end point 
    path('api/posts/<int:post_id>/comments/', views.comment_list, name='comment-list'),
    path('api/posts/<int:post_id>/comments/create/', views.comment_create, name='comment-create'),
    path('api/comments/<int:pk>/', views.comment_detail, name='comment-detail'),
    path('api/comments/<int:pk>/update/', views.comment_update, name='comment-update'),
    path('api/comments/<int:pk>/delete/', views.comment_delete, name='comment-delete'),

]

