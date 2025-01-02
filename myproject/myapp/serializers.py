from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirm')


    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='user.username', read_only=True)  # Add this line

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'user', 'author_name', 'updated_at', 'created_at', 'deleted_at']  # Include author_name here

    def update(self, instance, validated_data):
        # Remove the 'user' field from validated_data to prevent it from being updated
        validated_data.pop('user', None)  # This prevents overwriting the user field with the authenticated user

        # Proceed with the default update process
        return super().update(instance, validated_data)


from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='user.username', read_only=True)  # Add this line

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author_name', 'updated_at', 'created_at', 'deleted_at', 'post', 'user']  # Include author_name here





