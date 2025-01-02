from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, CommentSerializer
from .models import Post, Comment
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            # Inline token generation logic
            refresh = RefreshToken.for_user(user)
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,  # Adding user ID to the response
                'username': user.username    # Adding username to the response

            }
            return Response(tokens, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Post
from .serializers import PostSerializer

@api_view(['GET'])
def post_list(request):
    """Retrieve all posts."""
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def post_detail(request, pk):
    """Retrieve a specific post by ID."""
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access this view
def create_post(request):
    if request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        
        # Validate the data
        if serializer.is_valid():
            # Save the post with the current authenticated user as the owner
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsOwnerOrReadOnly])  # Apply custom permission
def post_update(request, pk):
    """Update a specific post by ID."""
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Manually check object-level permissions
    permission = IsOwnerOrReadOnly()
    if not permission.has_object_permission(request, None, post):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsOwnerOrReadOnly])  # Apply the custom permission class
def post_delete(request, pk):
    """Delete a specific post by ID."""
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Manually check object-level permissions
    permission = IsOwnerOrReadOnly()
    if not permission.has_object_permission(request, None, post):
        return Response(status=status.HTTP_403_FORBIDDEN)

    if request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

@api_view(['GET'])
def comment_list(request, post_id):
    """List all comments for a specific post"""
    comments = Comment.objects.filter(post_id=post_id)
    serializer = CommentSerializer(comments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can access this view
def comment_create(request, post_id):
    """Create a new comment for a specific post"""
    data = request.data.copy()  # Copy the request data to modify
    data['post'] = post_id       # Set the post ID from the URL parameter
    data['user'] = request.user.id  # Set the authenticated user as the comment author

    serializer = CommentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  # Save the comment with user and post set in data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def comment_detail(request, pk):
    """Retrieve a comment by ID"""
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = CommentSerializer(comment)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsOwnerOrReadOnly])  # Require authentication and ownership
def comment_update(request, pk):
    """Update a comment by ID"""
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user has permission to edit this comment
    self_check = IsOwnerOrReadOnly()
    if not self_check.has_object_permission(request, None, comment):
        return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = CommentSerializer(comment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsOwnerOrReadOnly])
def comment_delete(request, pk):
    """Delete a comment by ID if the user is the owner"""
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Check if the user has permission to delete the comment
    if not IsOwnerOrReadOnly().has_object_permission(request, None, comment):
        return Response({"detail": "You do not have permission to delete this comment."}, status=status.HTTP_403_FORBIDDEN)

    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


{
    "user":"6", 
    "content":"this is comment testing"
}