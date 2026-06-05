from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Workspace, List, Task


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )
        return user


class WorkspaceSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Workspace
        fields = (
            "id",
            "name",
            "description",
            "owner",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "owner", "created_at", "updated_at")


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = (
            "id",
            "workspace",
            "name",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            "id",
            "list",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "start_date",
            "started_at",
            "finished_at",
            "duration",
            "order",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
