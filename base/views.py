from django.contrib.auth.models import User
from rest_framework import permissions, viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone


from .models import Workspace, List, Task
from .serializers import (
    WorkspaceSerializer,
    ListSerializer,
    TaskSerializer,
    RegisterSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class WorkspaceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return Workspace.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


    @action(detail=True, methods=["get", "post"], url_path="lists")
    def lists(self, request, pk=None):
        workspace = self.get_object()  # مالکیت با get_queryset کنترل می‌شود

        if request.method.lower() == "get":
            qs = List.objects.filter(workspace=workspace).order_by("-created_at")
            serializer = ListSerializer(qs, many=True)
            return Response(serializer.data)

        # POST
        data = request.data.copy()
        data["workspace"] = workspace.id  # enforce workspace از URL
        serializer = ListSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListViewSet(viewsets.ModelViewSet):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):

        return List.objects.filter(workspace__owner=self.request.user).order_by("-created_at")


    @action(detail=True, methods=["get", "post"], url_path="tasks")
    def tasks(self, request, pk=None):
        list_obj = self.get_object()

        if request.method.lower() == "get":
            qs = Task.objects.filter(list=list_obj).order_by("order", "-created_at")
            serializer = TaskSerializer(qs, many=True)
            return Response(serializer.data)

        # POST
        data = request.data.copy()
        data["list"] = list_obj.id  # enforce list از URL
        serializer = TaskSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(
            list__workspace__owner=self.request.user
        ).order_by("order", "-created_at")

    @action(detail=True, methods=['post'])
    def start_timer(self, request, pk=None):
        task = self.get_object()
        task.started_at = timezone.now()
        task.finished_at = None
        task.duration = None
        task.save()

        return Response({"message": "Timer started"})

    @action(detail=True, methods=['post'])
    def stop_timer(self, request, pk=None):
        task = self.get_object()

        if task.started_at:
            task.finished_at = timezone.now()
            task.duration = task.finished_at - task.started_at
            task.save()

        return Response({
            "message": "Timer stopped",
            "duration": task.duration
        })
