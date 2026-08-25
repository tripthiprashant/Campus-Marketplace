from rest_framework.permissions import BasePermission


class IsOwnerOrReadOnly(BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
        ):
        # Anyone can read
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        # Only the owner can modify/delete
        return obj.seller == request.user