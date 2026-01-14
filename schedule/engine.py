from prayer_times_calculator import PrayerTimesCalculator
import datetime
from datetime import timedelta

def get_middle_of_night(maghrib_str, fajr_str):
    """Calculates Islamic Midnight (Halfway between Maghrib and Fajr)"""
    fmt = "%H:%M"
    maghrib_dt = datetime.datetime.strptime(maghrib_str, fmt)
    fajr_dt = datetime.datetime.strptime(fajr_str, fmt)
    
    if fajr_dt < maghrib_dt:
        fajr_dt += timedelta(days=1)
        
    total_night = fajr_dt - maghrib_dt
    half_night = total_night / 2
    midnight_dt = maghrib_dt + half_night
    
    return midnight_dt.strftime(fmt)

def apply_corrections(times, corrections):
    """Adds/Subtracts minutes from the calculated times"""
    fmt = "%H:%M"
    for prayer, minutes in corrections.items():
        if minutes == 0: continue
        try:
            dt = datetime.datetime.strptime(times[prayer], fmt)
            dt += timedelta(minutes=minutes)
            times[prayer] = dt.strftime(fmt)
        except ValueError:
            pass
    return times

def calculate_sunnah_times(lat, lng, madhab=0):
    
    today = datetime.date.today()
    date_str = today.strftime("%Y-%m-%d")

    method = 'isna' 

    madhab_str = str(madhab).upper().strip()
    
    if madhab_str == '1' or madhab_str == 'HANAFI' or madhab_str == 'TRUE':
        school = 'hanafi'
    else:
        school = 'shafi'


    calc = PrayerTimesCalculator(
        latitude=float(lat),
        longitude=float(lng),
        calculation_method=method,
        date=date_str,
        school=school
    )
    times = calc.fetch_prayer_times()

    
    corrections = {
        "Fajr": 0,
        "Sunrise": 0,
        "Dhuhr": 2, 
        "Asr": 0,
        "Maghrib": 2,
        "Isha": 0
    }
    times = apply_corrections(times, corrections)

    islamic_midnight = get_middle_of_night(times['Maghrib'], times['Fajr'])

    return [
        { "id": 1, "name": "Fajr", "start_time": times['Fajr'], "end_time": times['Sunrise'], "description": "Dawn Prayer", "is_fard": True },
        { "id": 2, "name": "Dhuhr", "start_time": times['Dhuhr'], "end_time": times['Asr'], "description": "Noon Prayer", "is_fard": True },
        { "id": 3, "name": "Asr", "start_time": times['Asr'], "end_time": times['Maghrib'], "description": "Afternoon Prayer", "is_fard": True },
        { "id": 4, "name": "Maghrib", "start_time": times['Maghrib'], "end_time": times['Isha'], "description": "Sunset Prayer", "is_fard": True },
        { "id": 5, "name": "Isha", "start_time": times['Isha'], "end_time": islamic_midnight, "description": "Night Prayer", "is_fard": True },
    ]