from django.urls import path

from .views import (
    DisputeListCreateView,
    DisputeUpdateView,
    DocumentListView,
    DocumentUploadView,
    DocumentVerifyView,
    FactoryDetailView,
    FactoryListView,
    FactoryProfileView,
    LoginView,
    RegisterView,
    SystemStatusView,
    TrustScoreView,
)


urlpatterns = [
    path("auth/register", RegisterView.as_view()),
    path("auth/login", LoginView.as_view()),
    path("documents/upload", DocumentUploadView.as_view()),
    path("documents/verify", DocumentVerifyView.as_view()),
    path("documents", DocumentListView.as_view()),
    path("factories", FactoryListView.as_view()),
    path("factories/<int:factory_id>", FactoryDetailView.as_view()),
    path("factories/profile", FactoryProfileView.as_view()),
    path("disputes", DisputeListCreateView.as_view()),
    path("disputes/<int:dispute_id>/response", DisputeUpdateView.as_view()),
    path("trust-score/<int:factory_id>", TrustScoreView.as_view()),
    path("system/status", SystemStatusView.as_view()),
]
