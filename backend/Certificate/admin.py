from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('get_user_email', 'training', 'file', 'uploaded_at')
    search_fields = ('user__email', 'training__name', 'training__code')  # optional but helpful
    list_filter = ('training', 'uploaded_at')  # optional for filtering

    @admin.display(description='User Email')
    def get_user_email(self, obj):
        return obj.user.email if obj.user else '-'

