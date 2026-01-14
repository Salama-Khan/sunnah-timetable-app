from rest_framework.decorators import api_view
from rest_framework.response import Response
from .engine import calculate_sunnah_times 

@api_view(['GET'])
def get_schedule(request):
    lat = float(request.GET.get('lat', 51.5074)) 
    lng = float(request.GET.get('lng', -0.1278))
    madhab = request.GET.get('madhab', 'STANDARD')

    data = calculate_sunnah_times(lat, lng, madhab)

    return Response(data)