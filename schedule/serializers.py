from rest_framework import serializers
from .models import TimeWindow

class TimeWindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeWindow
        fields = ['id', 'name', 'description', 'start_time', 'end_time', 'is_fard']