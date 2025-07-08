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
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from datetime import date, timedelta
from .models import TrainingProgram

@staff_member_required
def admin_weekly_trainings_view(request):
    today = date.today()
    end_of_week = today + timedelta(days=6 - today.weekday())
    trainings = TrainingProgram.objects.filter(start_date__range=[today, end_of_week])

    return render(request, 'training/admin_weekly_trainings.html', {
        'upcoming_trainings': trainings,
        'today': today,
        'end_of_week': end_of_week
    })

