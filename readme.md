# Social Media Clone with Django

This project is a social media clone built with Django. It includes basic functionality such as user registration, login, creating posts, commenting on posts, and managing them. Users can only access and modify posts and comments they own.

## Features

- **User Authentication 📝**: Allows users to register and log in.
- **Posts 📰**: Users can create, view, update, and delete their own posts.
- **Comments 💬**: Users can create, view, update, and delete comments on posts they own.
- **Access Control 🔒**: Only the owner of a post or comment can access or modify them.

## Technologies

- **Django**: Web framework for building the application.
- **Django Rest Framework**: For creating API endpoints.
- **Postgres**: Default database for the project.
- **JWT Authentication**: For secure authentication and access control.

## Endpoints

### 📝 User Authentication

- **POST /api/register/**: Registers a new user.
  - **Body**: `{"username": "example", "password": "password"}`

- **POST /api/login/**: Log in a user and return a JWT token.
  - **Body**: `{"username": "example", "password": "password"}`

### 📰 Posts

- **GET /api/posts/**: Get a list of all posts.

- **GET /api/posts/<int:pk>/**: Get details of a specific post.

- **POST /api/posts/create/**: Create a new post.
  - **Body**: `{"title": "Post Title", "content": "Post content"}`

- **PUT /api/posts/<int:pk>/update/**: Update an existing post (only accessible by the owner).

- **DELETE /api/posts/<int:pk>/delete/**: Delete a post (only accessible by the owner).

### 💬 Comments

- **GET /api/posts/<int:post_id>/comments/**: Get a list of comments for a specific post.

- **POST /api/posts/<int:post_id>/comments/create/**: Create a comment on a post.
  - **Body**: `{"content": "This is a comment."}`

- **GET /api/comments/<int:pk>/**: Get details of a specific comment.

- **PUT /api/comments/<int:pk>/update/**: Update an existing comment (only accessible by the owner).

- **DELETE /api/comments/<int:pk>/delete/**: Delete a comment (only accessible by the owner).

## Access Control

- Only the owner of a post or comment can update or delete it.
- All users can view posts and comments, but only authenticated users can create posts and comments.
