# from rest_framework.permissions import BasePermission

# class IsCoordinator(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.groups.filter(name='Coordinator').exists()




from rest_framework.permissions import BasePermission

class IsCoordinator(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and getattr(request.user, 'is_coordinator', False))
