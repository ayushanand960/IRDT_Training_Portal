import django_filters
from .models import Training
from django.utils.timezone import now
from datetime import timedelta


class TrainingFilter(django_filters.FilterSet):
    date = django_filters.DateFilter(method='filter_by_single_date')
    faculty_name = django_filters.CharFilter(field_name='faculty_name', lookup_expr='icontains')

    class Meta:
        model = Training
        fields = {
            'venue': ['exact'],
            'target_group': ['exact'],
            'mode': ['exact'],
            # faculty_name and date are handled manually or separately
        }

    def filter_by_single_date(self, queryset, name, value):
        """
        Returns trainings where start_date is within ±7 days of the selected date.
        """
        week_before = value - timedelta(days=7)
        week_after = value + timedelta(days=7)
        return queryset.filter(start_date__range=(week_before, week_after))
