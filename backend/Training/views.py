from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.timezone import now
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

from datetime import date, timedelta

from .models import (
    TrainingProgram,
    TeachingStaff,
    TrainingAttendance,
    Nomination
)
from .serializers import (
    TrainingProgramSerializer,
    TeachingStaffSerializer
)


class TrainingProgramListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        programs = TrainingProgram.objects.all()
        serializer = TrainingProgramSerializer(programs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TrainingProgramSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(coordinator=request.user)  # assign coordinator on creation
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TrainingProgramRetrieveUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(TrainingProgram, pk=pk)

    def get(self, request, pk):
        training = self.get_object(pk)
        serializer = TrainingProgramSerializer(training)
        return Response(serializer.data)

    def put(self, request, pk):
        training = self.get_object(pk)
        serializer = TrainingProgramSerializer(training, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@staff_member_required
def admin_weekly_trainings_view(request):
    today = date.today()
    end_of_week = today + timedelta(days=6 - today.weekday())
    upcoming_trainings = TrainingProgram.objects.filter(
        start_date__range=[today, end_of_week]
    ).order_by('start_date')

    return render(request, 'training/admin_weekly_trainings.html', {
        'upcoming_trainings': upcoming_trainings,
        'today': today,
        'end_of_week': end_of_week
    })


class EligibleStaffAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, training_id):
        today = date.today()
        two_months_ago = today - timedelta(days=60)

        # Teaching staff who:
        # - Haven't attended any training in last 2 months
        # - Are not already nominated for this training
        ineligible_by_training = TrainingAttendance.objects.filter(date_attended__gte=two_months_ago).values_list('staff_id', flat=True)
        ineligible_by_nomination = Nomination.objects.filter(training_id=training_id).values_list('staff_id', flat=True)

        eligible_staff = TeachingStaff.objects.exclude(
            id__in=ineligible_by_training
        ).exclude(
            id__in=ineligible_by_nomination
        )

        # Optional filters
        branch = request.query_params.get('branch')
        experience = request.query_params.get('experience')

        if branch:
            eligible_staff = eligible_staff.filter(branch=branch)
        if experience:
            eligible_staff = eligible_staff.filter(experience__gte=experience)

        serializer = TeachingStaffSerializer(eligible_staff, many=True)
        return Response(serializer.data)


class NominateStaffAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        staff_id = request.data.get('staff_id')
        training_id = request.data.get('training_id')

        if not staff_id or not training_id:
            return Response({'error': 'Both staff_id and training_id are required.'}, status=400)

        staff = get_object_or_404(TeachingStaff, id=staff_id)
        training = get_object_or_404(TrainingProgram, id=training_id)

        # Check eligibility (same logic as above)
        two_months_ago = date.today() - timedelta(days=60)
        recent_training = TrainingAttendance.objects.filter(staff=staff, date_attended__gte=two_months_ago).exists()
        already_nominated = Nomination.objects.filter(staff=staff, training=training).exists()

        if recent_training or already_nominated:
            return Response({'error': 'Staff is not eligible for nomination.'}, status=400)

        nomination = Nomination.objects.create(
            staff=staff,
            training=training,
            nominated_by=request.user
        )

        return Response({'success': f"{staff.name} nominated for {training.name}"}, status=201)
