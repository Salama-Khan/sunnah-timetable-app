from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TimeWindow
from .serializers import TimeWindowSerializer

@api_view(['GET'])  
def get_schedule(request):
    windows = TimeWindow.objects.all()

    serializer = TimeWindowSerializer(windows, many=True)

    return Response(serializer.data)