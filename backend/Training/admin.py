from django.contrib import admin
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
        'faculty',
        'number_of_participants',
    )
    list_filter = ('venue', 'mode', 'training_type', 'start_date')
    search_fields = ('code', 'name', 'faculty', 'target_group', 'remark')
    date_hierarchy = 'start_date'

