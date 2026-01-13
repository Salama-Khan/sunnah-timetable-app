from django.db import models

from django.db import models

class TimeWindow(models.Model):
    name = models.CharField(max_length=50) 
    
    description = models.TextField(blank=True)
    
    start_time = models.TimeField()
    
    end_time = models.TimeField()
    
    is_fard = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.start_time} - {self.end_time})"
