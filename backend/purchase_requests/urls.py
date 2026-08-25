from django.urls import path

from .views import (
    PurchaseRequestListCreateView,
    AcceptPurchaseRequestView,
    RejectPurchaseRequestView,
    CancelPurchaseRequestView,
    CompletePurchaseRequestView,
)


urlpatterns = [

    path(
        '',
        PurchaseRequestListCreateView.as_view(),
        name='purchase-request-list-create'
    ),

    path(
        '<int:pk>/accept/',
        AcceptPurchaseRequestView.as_view(),
        name='purchase-request-accept'
    ),

    path(
        '<int:pk>/reject/',
        RejectPurchaseRequestView.as_view(),
        name='purchase-request-reject'
    ),

    path(
        '<int:pk>/cancel/',
        CancelPurchaseRequestView.as_view(),
        name='purchase-request-cancel'
    ),

    path(
        '<int:pk>/complete/',
        CompletePurchaseRequestView.as_view(),
        name='purchase-request-complete'
    ),
]