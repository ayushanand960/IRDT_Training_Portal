# IRDT Training Management Portal – API Documentation (Reference)

This document lists major endpoints used by the portal.  
**Note:** Implementation details are intentionally omitted.

## Auth
- POST /api/login/
- POST /api/logout/

## Users
- GET /api/users/profile/
- PUT /api/users/profile/update/

## Trainings
- GET /api/trainings/
- GET /api/trainings/{id}/
- POST /api/trainings/enroll/
- GET /api/trainings/my-enrollments/

## Nominations
- GET /api/nominations/
- POST /api/nominations/{id}/approve/
- POST /api/nominations/{id}/reject/

## Certificates
- GET /api/certificates/
- GET /api/certificates/{id}/

## Notifications
- GET /api/notifications/
- POST /api/notifications/mark-read/

For deployment/support, contact the development team.
