# from django.contrib import admin
# from django.contrib import admin
# from .models import TrainingProgram

# @admin.register(TrainingProgram)
# class TrainingProgramAdmin(admin.ModelAdmin):
#     list_display = (
#         'code',
#         'name',
#         'venue',
#         'mode',
#         'training_type',
#         'start_date',
#         'end_date',
#         'faculty',
#         'number_of_participants',
#     )
#     list_filter = ('venue', 'mode', 'training_type', 'start_date')
#     search_fields = ('code', 'name', 'faculty', 'target_group', 'remark')
#     date_hierarchy = 'start_date'

#     def get_queryset(self, request):
#         return super().get_queryset(request).select_related('faculty')

from django.contrib import admin
from .models import TrainingProgram

@admin.register(TrainingProgram)
class TrainingProgramAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'name',
        'venue',
        'mode',
        'training_type',
        'start_date',
        'end_date',
        'faculty_name',  # custom method here
        'number_of_participants',
    )
    list_filter = ('venue', 'mode', 'training_type', 'start_date')
    search_fields = ('code', 'name', 'faculty__first_name', 'faculty__last_name', 'target_group', 'remark')
    date_hierarchy = 'start_date'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('faculty')

    def get_faculty_full_name(self, obj):
        if obj.faculty:
            return " ".join(filter(None, [obj.faculty.first_name, obj.faculty.middle_name, obj.faculty.last_name]))
        return "-"
    get_faculty_full_name.short_description = 'Faculty'
    get_faculty_full_name.admin_order_field = 'faculty__first_name'
