from rest_framework.permissions import BasePermission

class IsTrainingCoordinator(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Coordinator").exists()
