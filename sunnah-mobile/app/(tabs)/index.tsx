import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Alert, Switch, StatusBar, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isHanafi, setIsHanafi] = useState(true);

  // Replace with your machine's local IP address (e.g., 192.168.1.66)
  const BASE_URL = 'http://YOUR_LOCAL_IP:8000';

  useEffect(() => {
    loadSettingsAndFetch();
  }, []);

  const loadSettingsAndFetch = async () => {
    try {
      const savedMadhab = await AsyncStorage.getItem('madhab');
      const hanafiSetting = savedMadhab === 'SHAFI' ? false : true;
      setIsHanafi(hanafiSetting);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      fetchSchedule(userLocation.coords.latitude, userLocation.coords.longitude, hanafiSetting);

    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const fetchSchedule = (lat, lng, hanafiStatus) => {
    const madhabParam = hanafiStatus ? 'HANAFI' : 'SHAFI';
    const url = `${BASE_URL}/api/times/?lat=${lat}&lng=${lng}&madhab=${madhabParam}`;
    
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const toggleMadhab = async () => {
    const newValue = !isHanafi;
    setIsHanafi(newValue);
    await AsyncStorage.setItem('madhab', newValue ? 'HANAFI' : 'SHAFI');
    if (location) {
      fetchSchedule(location.coords.latitude, location.coords.longitude, newValue);
    }
  };

  const isNextPrayer = (endTime) => {
    const now = new Date();
    const [hours, minutes] = endTime.split(':');
    const prayerEnd = new Date();
    prayerEnd.setHours(parseInt(hours), parseInt(minutes), 0);
    
    return prayerEnd > now;
  };

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Sunnah Timetable</Text>
            <Text style={styles.locationText}>
              {location ? "GPS Active" : "Finding Location..."}
            </Text>
          </View>

          <View style={styles.toggleWrapper}>
            <Text style={styles.toggleText}>{isHanafi ? "Hanafi" : "Shafi"}</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#D4AF37" }} 
              thumbColor={isHanafi ? "#fff" : "#f4f3f4"}
              onValueChange={toggleMadhab}
              value={isHanafi}
            />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{marginTop: 100}} />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={[styles.card, item.name === 'Asr' && isHanafi ? styles.hanafiCard : null]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.prayerName}>{item.name}</Text>
                  <Text style={styles.prayerTime}>{item.start_time}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.cardFooter}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.endTime}>Ends: {item.end_time}</Text>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 40, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  locationText: {
    color: '#aab6c2',
    fontSize: 12,
    marginTop: 4,
  },
  toggleWrapper: {
    alignItems: 'center',
  },
  toggleText: {
    color: '#D4AF37', // Gold
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  hanafiCard: {
    borderColor: 'rgba(212, 175, 55, 0.5)', 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  prayerTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    color: '#aab6c2',
    fontSize: 13,
  },
  endTime: {
    color: '#aab6c2',
    fontSize: 12,
    fontStyle: 'italic',
  },
});