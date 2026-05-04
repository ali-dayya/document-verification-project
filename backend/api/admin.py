from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import BlockchainRecord, Dispute, Document, Factory, FraudAnalysis, TrustScore, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Project fields", {"fields": ("role", "phone_number")}),
    )
    list_display = ("email", "full_name", "role", "is_staff")


admin.site.register(Factory)
admin.site.register(Document)
admin.site.register(BlockchainRecord)
admin.site.register(FraudAnalysis)
admin.site.register(TrustScore)
admin.site.register(Dispute)
