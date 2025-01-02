# permissions.py
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow the owner of a post to edit or delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Allow safe methods (GET, HEAD, OPTIONS) for any user
        if request.method in permissions.SAFE_METHODS:
            return True

        # For update or delete, only allow if the user is the owner of the post
        return obj.user == request.user  # Assumes 'user' field on Post model is a ForeignKey to User
