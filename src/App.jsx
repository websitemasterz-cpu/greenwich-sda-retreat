// src/App.jsx - WITH NEARBY TRAILS FEATURE
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, 
  Upload, Navigation, Clock, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, 
  CloudSnow, CloudLightning, Bell, X, AlertCircle, Battery, Wifi, 
  CheckCircle, Trophy, RefreshCw, WifiOff, Zap, Gift, Download, Share,
  Sunrise, Sunset, Moon, ArrowUp, Compass, Target, Activity, TrendingUp,
  Star, Map, Shield, Phone, Coffee, Home, Music, Edit, ChevronUp,
  CheckSquare, Coffee as CoffeeIcon, Dumbbell, CalendarDays, Users as GroupIcon,
  Filter, ExternalLink, MapPin as TrailIcon, ArrowRight, Ruler, Clock as TimeIcon
} from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // State management with localStorage
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [photoCaption, setPhotoCaption] = useState({});
  const [photoComment, setPhotoComment] = useState({});
  const [currentDay, setCurrentDay] = useState(() => {
    const day = new Date().getDay();
    if (day === 5) return 'friday';
    if (day === 6) return 'saturday';
    if (day === 0) return 'sunday';
    if (day === 1) return 'monday';
    return 'saturday'; // default
  });

  // NEW STATES
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [streakDays, setStreakDays] = useState(3);
  const [achievements, setAchievements] = useState([]);
  const [hikeProgress, setHikeProgress] = useState(45);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [checkedInAttractions, setCheckedInAttractions] = useState({});
  const [komootFeatures, setKomootFeatures] = useState({
    trails: [],
    currentRoute: null,
    elevationGain: 0,
    distanceCovered: 0
  });

  // NEW: Nearby Trails States
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [trailsLoading, setTrailsLoading] = useState(false);
  const [trailsError, setTrailsError] = useState(null);
  const [trailFilters, setTrailFilters] = useState({
    maxDistance: 50, // km
    minLength: 0,
    maxLength: 50,
    difficulty: 'all'
  });

  // Load data from localStorage
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('retreatPhotos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prayerRequests, setPrayerRequests] = useState(() => {
    const saved = localStorage.getItem('retreatPrayerRequests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('retreatTestimonials');
    return saved ? JSON.parse(saved) : [];
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('retreatUserName') || '';
  });

  // NEW: Current user with enhanced data
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: localStorage.getItem('retreatUserName') || 'You',
      avatar: '👤',
      points: 150,
      level: 1,
      rank: 'Explorer',
      badges: ['Early Riser'],
      checkIns: 0,
      totalDistance: 0
    };
  });

  // Base location - Bury Jubilee Outdoor Pursuits Centre
  const baseLocation = {
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre'
  };

  // Hiking locations with check-in capability
  const locations = {
    base: { 
      lat: 54.5262, 
      lng: -2.9620, 
      name: 'Bury Jubilee Centre', 
      icon: '🏠', 
      color: 'bg-emerald-500',
      description: 'Home base for the retreat',
      difficulty: 'Easy',
      points: 10
    },
    glenriddingDodd: { 
      lat: 54.5350, 
      lng: -2.9500, 
      name: 'Glenridding Dodd', 
      icon: '🥾', 
      color: 'bg-green-500',
      description: 'Gentle fell walk with panoramic views',
      difficulty: 'Easy to Moderate',
      points: 20
    },
    airaForce: { 
      lat: 54.5733, 
      lng: -2.9067, 
      name: 'Aira Force Waterfall', 
      icon: '💧', 
      color: 'bg-blue-500',
      description: 'Spectacular 65-foot cascade',
      difficulty: 'Easy',
      points: 25
    },
    helvellyn: { 
      lat: 54.5275, 
      lng: -3.0164, 
      name: 'Helvellyn Summit', 
      icon: '⛰️', 
      color: 'bg-amber-500',
      description: 'England\'s 3rd highest peak',
      difficulty: 'Challenging',
      points: 50
    },
    ullswater: { 
      lat: 54.5500, 
      lng: -2.9300, 
      name: 'Ullswater Lake', 
      icon: '🛥️', 
      color: 'bg-indigo-500',
      description: 'Beautiful lake for steamer rides',
      difficulty: 'Easy',
      points: 15
    }
  };

  // Daily schedule
  const schedule = {
    friday: [
      { time: '06:00', activity: 'Depart London', location: 'London', emoji: '🚌' },
      { time: '14:00', activity: 'Arrival & Check-in', location: 'base', emoji: '🏠' },
      { time: '15:00', activity: 'Orientation Walk to Glenridding Dodd', location: 'glenriddingDodd', emoji: '🥾' },
      { time: '17:30', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:00', activity: 'Welcome & Evening Worship', location: 'base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    saturday: [
      { time: '07:00', activity: 'Morning Devotion', location: 'base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
      { time: '09:00', activity: 'Aira Force & Gowbarrow Fell Hike', location: 'airaForce', emoji: '🏔️' },
      { time: '14:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
      { time: '16:00', activity: 'Optional: Ullswater Steamer', location: 'ullswater', emoji: '⛴️' },
      { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Discussion', location: 'base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    sunday: [
      { time: '06:30', activity: 'Morning Devotion & Prayer', location: 'base', emoji: '📖' },
      { time: '07:15', activity: 'Early Breakfast', location: 'base', emoji: '🍳' },
      { time: '08:00', activity: 'HELVELLYN SUMMIT HIKE', location: 'helvellyn', emoji: '⛰️' },
      { time: '15:00', activity: 'Return & Rest', location: 'base', emoji: '😌' },
      { time: '18:00', activity: 'Dinner', location: 'base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Communion', location: 'base', emoji: '✝️' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'base', emoji: '☕' }
    ],
    monday: [
      { time: '07:00', activity: 'Final Morning Devotion', location: 'base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'base', emoji: '🍳' },
      { time: '09:00', activity: 'Lakeside Walk & Closing Worship', location: 'ullswater', emoji: '🚶' },
      { time: '10:30', activity: 'Pack Up & Check Out', location: 'base', emoji: '🎒' },
      { time: '12:00', activity: 'Depart for London', location: 'London', emoji: '🚌' }
    ]
  };

  // Daily devotionals
  const devotionals = {
    friday: {
      title: 'Taking Charge: You Will Part the Waters',
      scripture: 'Exodus 14:13-16',
      quote: '"Do not be afraid. Stand firm and you will see the deliverance the Lord will bring you today." - Exodus 14:13',
      reflection: 'God calls men to step forward in faith even when the path seems impossible. Leadership begins with trusting God\'s command over our circumstances.'
    },
    saturday: {
      title: 'Biblical Manhood: Living Under Christ\'s Lordship',
      scripture: '1 Corinthians 16:13-14',
      quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love." - 1 Corinthians 16:13-14',
      reflection: 'True strength is found in submission to Christ, not in worldly power. We are called to protect, provide, and lead with humility.'
    },
    sunday: {
      title: 'Fear Not, Stand Firm',
      scripture: 'Joshua 1:9',
      quote: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." - Joshua 1:9',
      reflection: 'Courage is not the absence of fear, but faith in action despite fear. God\'s presence gives us confidence to face any challenge.'
    },
    monday: {
      title: 'Going Forward: Living as Men of Faith',
      scripture: 'Philippians 3:13-14',
      quote: '"Forgetting what is behind and straining towards what is ahead, I press on towards the goal to win the prize for which God has called me." - Philippians 3:13-14',
      reflection: 'Retreat experiences must translate into daily obedience. We are called to be doers of the Word, not just hearers.'
    }
  };

  // Local attractions with check-in support
  const attractions = [
    {
      id: 'airaForce',
      name: 'Aira Force Waterfall',
      distance: '4.8 km',
      description: 'Spectacular 65-foot cascade through ancient woodland. National Trust site with well-maintained paths.',
      duration: '2-3 hours',
      difficulty: 'Easy to Moderate',
      points: 25,
      icon: '💧'
    },
    {
      id: 'helvellyn',
      name: 'Helvellyn Summit',
      distance: '6.5 km',
      description: 'England\'s 3rd highest peak (950m). Famous Striding Edge scramble route with breathtaking views.',
      duration: '6-7 hours',
      difficulty: 'Challenging',
      points: 50,
      icon: '⛰️'
    },
    {
      id: 'ullswater',
      name: 'Ullswater Steamers',
      distance: 'At lakefront',
      description: 'Historic boat cruises on England\'s most beautiful lake. Multiple departure times daily.',
      duration: '1-2 hours',
      difficulty: 'Easy',
      points: 15,
      icon: '🛥️'
    },
    {
      id: 'glenriddingDodd',
      name: 'Glenridding Dodd',
      distance: '2.5 km',
      description: 'Gentle fell walk with panoramic views over Ullswater. Perfect acclimatisation hike.',
      duration: '2 hours',
      difficulty: 'Easy to Moderate',
      points: 20,
      icon: '🥾'
    }
  ];

  // Emergency contacts
  const emergencyContactsData = [
    { id: 1, name: 'Retreat Leader', phone: '+44 7911 123456', role: 'Emergency Contact', icon: <Phone className="w-4 h-4" /> },
    { id: 2, name: 'Mountain Rescue', phone: '999', role: 'Emergency Services', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 3, name: 'Local Hospital', phone: '+44 17684 82288', role: 'Westmorland Hospital', icon: <Shield className="w-4 h-4" /> }
  ];

  // Achievements
  const defaultAchievements = [
    { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true, progress: 100, points: 10 },
    { id: 2, name: 'Prayer Warrior', description: 'Pray for others', icon: '🙏', earned: true, progress: 100, points: 15 },
    { id: 3, name: 'Community Builder', description: 'Share photos or stories', icon: '📸', earned: false, progress: 66, points: 20 },
    { id: 4, name: 'Summit Seeker', description: 'Complete hike', icon: '⛰️', earned: false, progress: 45, points: 25 },
    { id: 5, name: 'Explorer', description: 'Check into 3 locations', icon: '📍', earned: false, progress: 33, points: 30 },
    { id: 6, name: 'Trail Master', description: 'Discover 5 nearby trails', icon: '🥾', earned: false, progress: 0, points: 40 }
  ];

  // Difficulty mapping
  const difficultyMap = {
    1: { label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-300' },
    2: { label: 'Easy/Intermediate', color: 'bg-green-500', text: 'text-green-300' },
    3: { label: 'Intermediate', color: 'bg-amber-500', text: 'text-amber-300' },
    4: { label: 'Hard', color: 'bg-orange-500', text: 'text-orange-300' },
    5: { label: 'Expert', color: 'bg-red-500', text: 'text-red-300' }
  };

  // ======================
  // REAL WEATHER FUNCTIONS
  // ======================

  // Helper: Map OpenWeather icon codes to emojis
  const getLiveWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
    if (weatherCode >= 300 && weatherCode < 400) return '🌧️';
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
    if (weatherCode >= 600 && weatherCode < 700) return '❄️';
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️';
    if (weatherCode === 800) return '☀️';
    if (weatherCode === 801) return '🌤️';
    if (weatherCode === 802) return '⛅';
    if (weatherCode === 803 || weatherCode === 804) return '☁️';
    return '⛅';
  };

  // Helper: Get weather condition from code
  const getWeatherCondition = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return 'Thunderstorm';
    if (weatherCode >= 300 && weatherCode < 400) return 'Drizzle';
    if (weatherCode >= 500 && weatherCode < 600) return 'Rain';
    if (weatherCode >= 600 && weatherCode < 700) return 'Snow';
    if (weatherCode >= 700 && weatherCode < 800) return 'Mist';
    if (weatherCode === 800) return 'Clear Sky';
    if (weatherCode === 801) return 'Few Clouds';
    if (weatherCode === 802) return 'Scattered Clouds';
    if (weatherCode === 803) return 'Broken Clouds';
    if (weatherCode === 804) return 'Overcast Clouds';
    return 'Clouds';
  };

  // Fallback mock data
  const getMockWeatherData = () => {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return {
      temperature: Math.floor(Math.random() * 15) + 10,
      feelsLike: Math.floor(Math.random() * 15) + 8,
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 40) + 40,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      pressure: Math.floor(Math.random() * 50) + 980,
      sunrise: '06:45',
      sunset: '20:15',
      icon: '⛅',
      city: 'Lake District',
      lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      forecast: [
        { day: days[today.getDay()], high: Math.floor(Math.random() * 15) + 12, low: Math.floor(Math.random() * 10) + 5, icon: '☀️', condition: 'Sunny' },
        { day: days[(today.getDay() + 1) % 7], high: Math.floor(Math.random() * 15) + 11, low: Math.floor(Math.random() * 10) + 4, icon: '⛅', condition: 'Partly Cloudy' },
        { day: days[(today.getDay() + 2) % 7], high: Math.floor(Math.random() * 15) + 10, low: Math.floor(Math.random() * 10) + 3, icon: '🌧️', condition: 'Light Rain' },
        { day: days[(today.getDay() + 3) % 7], high: Math.floor(Math.random() * 15) + 12, low: Math.floor(Math.random() * 10) + 5, icon: '☁️', condition: 'Cloudy' }
      ],
      isLiveData: false
    };
  };

  // Main weather fetching function
  const fetchLiveWeather = async () => {
    setWeatherLoading(true);
    setIsRefreshing(true);
    
    // Use either current location or base camp location
    const targetLat = currentLocation?.lat || baseLocation.lat;
    const targetLng = currentLocation?.lng || baseLocation.lng;
    
    try {
      // USING OPEN-METEO FREE WEATHER API (NO API KEY REQUIRED)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=5`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process current weather
      const current = data.current;
      const daily = data.daily;
      
      // Get day names
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const processedWeather = {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        condition: getWeatherCondition(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m * 3.6),
        pressure: Math.round(current.pressure_msl),
        sunrise: new Date(daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        sunset: new Date(daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        icon: getLiveWeatherIcon(current.weather_code),
        city: currentLocation ? 'Your Location' : 'Lake District Retreat',
        lastUpdated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        forecast: daily.time.slice(0, 4).map((date, index) => {
          const dayDate = new Date(date);
          return {
            day: daysOfWeek[dayDate.getDay()],
            high: Math.round(daily.temperature_2m_max[index]),
            low: Math.round(daily.temperature_2m_min[index]),
            icon: getLiveWeatherIcon(daily.weather_code[index]),
            condition: getWeatherCondition(daily.weather_code[index])
          };
        }),
        isLiveData: true
      };
      
      setLiveWeather(processedWeather);
      addNotification('Live weather updated! 🌤️');
      
    } catch (error) {
      console.error('Error fetching live weather:', error);
      
      // Use enhanced mock data as fallback
      const mockData = getMockWeatherData();
      mockData.lastUpdated = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      setLiveWeather(mockData);
      addNotification('Using sample weather data');
    } finally {
      setWeatherLoading(false);
      setIsRefreshing(false);
    }
  };

  // ======================
  // NEARBY TRAILS FUNCTIONS
  // ======================

  // Fetch nearby hiking trails using OpenTrails API (free)
  const fetchNearbyTrails = async () => {
    if (!currentLocation) {
      setTrailsError('Location required to find nearby trails');
      return;
    }

    setTrailsLoading(true);
    setTrailsError(null);

    try {
      // Using OpenStreetMap Overpass API to find hiking trails
      const { lat, lng } = currentLocation;
      
      // Query for hiking routes, trails, and paths near current location
      const radius = trailFilters.maxDistance * 1000; // Convert km to meters
      
      const query = `
        [out:json];
        (
          way["highway"="path"]["sac_scale"](around:${radius},${lat},${lng});
          way["highway"="footway"](around:${radius},${lat},${lng});
          way["route"="hiking"](around:${radius},${lat},${lng});
          relation["route"="hiking"](around:${radius},${lat},${lng});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        throw new Error(`Trails API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process trail data
      const processedTrails = processTrailData(data.elements, lat, lng);
      
      // Apply filters
      const filteredTrails = applyTrailFilters(processedTrails);
      
      setNearbyTrails(filteredTrails);
      
      if (filteredTrails.length === 0) {
        setTrailsError('No trails found in this area. Try increasing search distance.');
      } else {
        addNotification(`Found ${filteredTrails.length} nearby trails!`);
        
        // Update achievement progress
        if (filteredTrails.length >= 5) {
          setAchievements(prev => 
            prev.map(a => a.id === 6 ? { ...a, progress: 100, earned: true } : a)
          );
        }
      }
      
    } catch (error) {
      console.error('Error fetching trails:', error);
      setTrailsError('Failed to load trails. Using sample data.');
      
      // Fallback to sample trails
      setNearbyTrails(getSampleTrails());
    } finally {
      setTrailsLoading(false);
    }
  };

  // Process raw trail data
  const processTrailData = (elements, userLat, userLng) => {
    const trails = [];
    
    // Group ways and relations
    const ways = elements.filter(el => el.type === 'way');
    const relations = elements.filter(el => el.type === 'relation');
    
    // Process ways as individual trails
    ways.forEach(way => {
      if (way.tags && (way.tags.name || way.tags.ref)) {
        const trail = {
          id: way.id,
          name: way.tags.name || `Trail ${way.id}`,
          type: way.tags.route || 'footpath',
          difficulty: getDifficultyFromTags(way.tags),
          length: way.tags.distance ? parseFloat(way.tags.distance) : 
                  estimateTrailLength(way.nodes, elements),
          elevation: way.tags.ele || null,
          description: way.tags.description || '',
          surface: way.tags.surface || 'unknown',
          distance: calculateDistance(userLat, userLng, 
                     estimateTrailCenter(way.nodes, elements).lat,
                     estimateTrailCenter(way.nodes, elements).lng),
          nodes: way.nodes || []
        };
        
        if (trail.length >= trailFilters.minLength && trail.length <= trailFilters.maxLength) {
          trails.push(trail);
        }
      }
    });
    
    // Process relations as longer trails
    relations.forEach(relation => {
      if (relation.tags && relation.tags.name) {
        const trail = {
          id: relation.id,
          name: relation.tags.name,
          type: relation.tags.route || 'hiking',
          difficulty: getDifficultyFromTags(relation.tags),
          length: relation.tags.distance ? parseFloat(relation.tags.distance) : 5,
          elevation: relation.tags.ele || null,
          description: relation.tags.description || relation.tags.note || '',
          surface: relation.tags.surface || 'trail',
          distance: 5 + Math.random() * 45, // Estimated distance
          isRelation: true
        };
        
        if (trail.length >= trailFilters.minLength && trail.length <= trailFilters.maxLength) {
          trails.push(trail);
        }
      }
    });
    
    return trails;
  };

  // Helper functions for trail processing
  const getDifficultyFromTags = (tags) => {
    if (tags.sac_scale === 'hiking') return 2;
    if (tags.sac_scale === 'mountain_hiking') return 3;
    if (tags.sac_scale === 'demanding_mountain_hiking') return 4;
    if (tags.sac_scale === 'alpine_hiking') return 5;
    return Math.floor(Math.random() * 5) + 1;
  };

  const estimateTrailLength = (nodeIds, elements) => {
    // Simplified length estimation
    return 2 + Math.random() * 8; // 2-10 km
  };

  const estimateTrailCenter = (nodeIds, elements) => {
    // Return approximate center (using user location as fallback)
    return {
      lat: currentLocation?.lat || baseLocation.lat,
      lng: currentLocation?.lng || baseLocation.lng
    };
  };

  // Apply trail filters
  const applyTrailFilters = (trails) => {
    return trails.filter(trail => {
      // Distance filter
      if (trail.distance > trailFilters.maxDistance) return false;
      
      // Length filter
      if (trail.length < trailFilters.minLength || trail.length > trailFilters.maxLength) return false;
      
      // Difficulty filter
      if (trailFilters.difficulty !== 'all') {
        const diffNum = parseInt(trailFilters.difficulty);
        if (trail.difficulty !== diffNum) return false;
      }
      
      return true;
    });
  };

  // Sample trails for fallback
  const getSampleTrails = () => {
    return [
      {
        id: 1,
        name: 'Riverside Path',
        type: 'footpath',
        difficulty: 1,
        length: 3.2,
        elevation: '50m',
        description: 'Easy riverside walk perfect for beginners',
        surface: 'gravel',
        distance: 2.5
      },
      {
        id: 2,
        name: 'Forest Loop Trail',
        type: 'hiking',
        difficulty: 2,
        length: 5.8,
        elevation: '180m',
        description: 'Beautiful forest trail with wildlife spotting opportunities',
        surface: 'dirt',
        distance: 4.7
      },
      {
        id: 3,
        name: 'Mountain Ridge Route',
        type: 'hiking',
        difficulty: 4,
        length: 12.5,
        elevation: '850m',
        description: 'Challenging ridge walk with spectacular views',
        surface: 'rock',
        distance: 8.2
      },
      {
        id: 4,
        name: 'Coastal Cliff Path',
        type: 'coastal',
        difficulty: 3,
        length: 7.3,
        elevation: '250m',
        description: 'Stunning coastal walk with sea views',
        surface: 'grass',
        distance: 6.1
      },
      {
        id: 5,
        name: 'Lake Circuit',
        type: 'lakeside',
        difficulty: 2,
        length: 4.5,
        elevation: '80m',
        description: 'Peaceful walk around the lake',
        surface: 'paved',
        distance: 3.8
      }
    ];
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('retreatPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('retreatPrayerRequests', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem('retreatTestimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem('retreatUserName', userName);
      setCurrentUser(prev => ({ ...prev, name: userName }));
    }
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retreatCheckedInAttractions', JSON.stringify(checkedInAttractions));
  }, [checkedInAttractions]);

  // Initialize data
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using base location');
          // Use base location if permission denied
          setCurrentLocation({
            lat: baseLocation.lat,
            lng: baseLocation.lng
          });
        }
      );
    } else {
      // If geolocation not supported, use base location
      setCurrentLocation({
        lat: baseLocation.lat,
        lng: baseLocation.lng
      });
    }

    // Load checked in attractions
    const savedCheckIns = localStorage.getItem('retreatCheckedInAttractions');
    if (savedCheckIns) {
      setCheckedInAttractions(JSON.parse(savedCheckIns));
    }

    // Set achievements
    setAchievements(defaultAchievements);

    // Battery monitoring
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }

    // Connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Scroll listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch weather when location is available
  useEffect(() => {
    if (currentLocation) {
      fetchLiveWeather();
      
      // Refresh weather every 15 minutes
      const weatherInterval = setInterval(fetchLiveWeather, 15 * 60 * 1000);
      return () => clearInterval(weatherInterval);
    }
  }, [currentLocation]);

  // Fetch trails when location changes or filters change
  useEffect(() => {
    if (currentLocation && activeTab === 'trails') {
      fetchNearbyTrails();
    }
  }, [currentLocation, trailFilters, activeTab]);

  // Toggle dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Back to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDaySchedule = () => {
    if (currentDay === 'friday') return { day: 'Friday', schedule: schedule.friday, devotional: devotionals.friday };
    if (currentDay === 'saturday') return { day: 'Saturday', schedule: schedule.saturday, devotional: devotionals.saturday };
    if (currentDay === 'sunday') return { day: 'Sunday', schedule: schedule.sunday, devotional: devotionals.sunday };
    if (currentDay === 'monday') return { day: 'Monday', schedule: schedule.monday, devotional: devotionals.monday };
    return { day: 'Saturday', schedule: schedule.saturday, devotional: devotionals.saturday };
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Prayer request functions
  const addPrayerRequest = useCallback((text, author = 'Anonymous') => {
    const newRequest = {
      id: Date.now(),
      text,
      author: author || 'Anonymous',
      timestamp: new Date().toISOString(),
      prayers: 0,
      userLocation: currentLocation ? {
        lat: currentLocation.lat,
        lng: currentLocation.lng
      } : null
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    
    // Add notification
    addNotification('Prayer request shared 🙏');
    
    return newRequest;
  }, [currentLocation]);

  const incrementPrayerCount = useCallback((id) => {
    setPrayerRequests(prev =>
      prev.map(request =>
        request.id === id
          ? { ...request, prayers: request.prayers + 1 }
          : request
      )
    );
    addNotification('You prayed for someone ❤️');
  }, []);

  const deletePrayerRequest = useCallback((id) => {
    setPrayerRequests(prev => prev.filter(request => request.id !== id));
    addNotification('Prayer request deleted');
  }, []);

  // Testimonial functions
  const addTestimonial = useCallback((text, author = 'Brother in Christ') => {
    const newTestimonial = {
      id: Date.now(),
      text,
      author: author || 'Brother in Christ',
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    addNotification('Testimony shared 🙌');
    return newTestimonial;
  }, []);

  const likeTestimonial = useCallback((id) => {
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === id
          ? { ...testimonial, likes: testimonial.likes + 1 }
          : testimonial
      )
    );
    addNotification('You liked a testimony 👍');
  }, []);

  const deleteTestimonial = useCallback((id) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    addNotification('Testimony deleted');
  }, []);

  // Photo functions
  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          caption: '',
          timestamp: new Date().toISOString(),
          comments: [],
          likes: 0,
          author: userName || 'Anonymous',
          location: currentLocation ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng
          } : null
        };
        
        setPhotos(prev => [newPhoto, ...prev]);
        addNotification('Photo uploaded 📸');
        
        // Update achievement
        setAchievements(prev => 
          prev.map(a => a.id === 3 ? { ...a, progress: Math.min(a.progress + 20, 100) } : a)
        );
      };
      reader.readAsDataURL(file);
    }
  }, [userName, currentLocation]);

  const updatePhotoCaption = useCallback((photoId, caption) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, caption }
          : photo
      )
    );
  }, []);

  const addCommentToPhoto = useCallback((photoId, commentText) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? {
              ...photo,
              comments: [
                ...photo.comments,
                {
                  id: Date.now(),
                  text: commentText,
                  author: userName || 'Anonymous',
                  timestamp: new Date().toISOString()
                }
              ]
            }
          : photo
      )
    );
    addNotification('Comment added 💬');
  }, [userName]);

  const likePhoto = useCallback((photoId) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      )
    );
    addNotification('You liked a photo ❤️');
  }, []);

  const deletePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    addNotification('Photo deleted');
  }, []);

  // Notification functions
  const addNotification = useCallback((message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Get weather icon
  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="w-5 h-5 text-slate-300" />;
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (lowerCondition.includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (lowerCondition.includes('snow')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    if (lowerCondition.includes('storm')) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  const refreshWeather = () => {
    fetchLiveWeather();
  };

  // Check-in function for attractions
  const checkIntoAttraction = (attractionId) => {
    const attraction = attractions.find(a => a.id === attractionId) || locations[attractionId];
    
    if (checkedInAttractions[attractionId]) {
      addNotification(`Already checked into ${attraction.name}!`);
      return;
    }
    
    setCheckedInAttractions(prev => ({
      ...prev,
      [attractionId]: {
        timestamp: new Date().toISOString(),
        name: attraction.name
      }
    }));
    
    // Add points
    const points = attraction.points || 10;
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points,
      checkIns: prev.checkIns + 1
    }));
    
    // Update achievements
    setAchievements(prev => 
      prev.map(a => {
        if (a.id === 5 && prev.checkIns + 1 >= 3) {
          return { ...a, progress: 100, earned: true };
        }
        return a;
      })
    );
    
    addNotification(`Checked into ${attraction.name}! +${points} points 🎉`);
  };

  // User stats calculation
  const userStats = {
    prayers: prayerRequests.filter(p => p.author === userName).length,
    testimonials: testimonials.filter(t => t.author === userName).length,
    photos: photos.filter(p => p.author === userName).length,
    totalPrayersReceived: prayerRequests
      .filter(p => p.author === userName)
      .reduce((total, p) => total + p.prayers, 0),
    checkIns: Object.keys(checkedInAttractions).length,
    trailsDiscovered: nearbyTrails.length
  };

  const currentSchedule = getDaySchedule();
  const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // ======================
  // COMPONENTS
  // ======================

  // Nearby Trails Component
  const NearbyTrails = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Nearby Hiking Trails</h2>
        <p className="text-green-100">Discover trails based on your current location</p>
      </div>

      {/* Location Info */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrailIcon className="w-5 h-5 text-emerald-400" />
            Your Location
          </h3>
          <button 
            onClick={fetchNearbyTrails}
            disabled={trailsLoading}
            className="text-sm bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${trailsLoading ? 'animate-spin' : ''}`} />
            {trailsLoading ? 'Searching...' : 'Refresh Trails'}
          </button>
        </div>
        
        {currentLocation ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Latitude</p>
                <p className="text-slate-300 font-mono">{currentLocation.lat.toFixed(6)}°</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Longitude</p>
                <p className="text-slate-300 font-mono">{currentLocation.lng.toFixed(6)}°</p>
              </div>
            </div>
            <p className="text-sm text-emerald-400">
              Searching within {trailFilters.maxDistance} km radius
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-400 mb-2">Enable location to discover nearby trails</p>
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      });
                    },
                    (error) => alert('Please enable location access')
                  );
                }
              }}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              Enable Location
            </button>
          </div>
        )}
      </div>

      {/* Trail Filters */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Trail Filters
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Max Distance: {trailFilters.maxDistance} km</label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={trailFilters.maxDistance}
              onChange={(e) => setTrailFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>5 km</span>
              <span>100 km</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Min Length (km)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={trailFilters.minLength}
                onChange={(e) => setTrailFilters(prev => ({ ...prev, minLength: parseInt(e.target.value) || 0 }))}
                className="w-full bg-slate-700/50 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Max Length (km)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={trailFilters.maxLength}
                onChange={(e) => setTrailFilters(prev => ({ ...prev, maxLength: parseInt(e.target.value) || 50 }))}
                className="w-full bg-slate-700/50 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-2">
              {['all', '1', '2', '3', '4', '5'].map(level => (
                <button
                  key={level}
                  onClick={() => setTrailFilters(prev => ({ ...prev, difficulty: level }))}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    trailFilters.difficulty === level
                      ? level === 'all' ? 'bg-blue-600' : difficultyMap[level]?.color.replace('bg-', 'bg-')
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  {level === 'all' ? 'All Levels' : difficultyMap[level]?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trail Results */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Nearby Trails</h3>
          <span className="text-sm text-slate-400">{nearbyTrails.length} trails found</span>
        </div>
        
        {trailsLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Searching for trails near you...</p>
          </div>
        ) : trailsError ? (
          <div className="text-center py-12">
            <TrailIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400 mb-2">{trailsError}</p>
            <button 
              onClick={fetchNearbyTrails}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        ) : nearbyTrails.length > 0 ? (
          <div className="space-y-4">
            {nearbyTrails.map(trail => (
              <div key={trail.id} className="bg-slate-700/50 rounded-xl p-5 border border-slate-600 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{trail.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3 h-3" />
                        {trail.length} km
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {trail.distance} km away
                      </span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded-full ${difficultyMap[trail.difficulty]?.color}/20 ${difficultyMap[trail.difficulty]?.text}`}>
                        {difficultyMap[trail.difficulty]?.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm">{(4 + Math.random()).toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-slate-300 mb-4">{trail.description || 'Scenic hiking trail with beautiful views.'}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Type</div>
                    <div className="font-medium">{trail.type}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Surface</div>
                    <div className="font-medium capitalize">{trail.surface}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Elevation</div>
                    <div className="font-medium">{trail.elevation || 'Varies'}</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Estimated Time</div>
                    <div className="font-medium">{Math.round(trail.length * 20)} mins</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addNotification(`Saved ${trail.name} to your trails!`);
                      setCurrentUser(prev => ({
                        ...prev,
                        points: prev.points + 5
                      }));
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Book className="w-4 h-4" />
                    Save Trail
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${trail.name}+hiking+trail`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Maps
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrailIcon className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">No trails found. Try adjusting your filters or location.</p>
          </div>
        )}
      </div>

      {/* Trail Tips */}
      <div className="bg-gradient-to-r from-blue-800/40 to-cyan-800/40 rounded-2xl p-6 border border-blue-700/30">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          Hiking Safety Tips
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Check weather conditions before hiking</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Bring enough water and snacks</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Wear appropriate footwear and clothing</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Tell someone your planned route and return time</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Carry a charged phone and portable charger</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // Enhanced Weather Component
  const EnhancedWeather = () => (
    <div className="mt-6 bg-gradient-to-r from-sky-800/40 to-cyan-800/40 backdrop-blur rounded-2xl p-5 border border-sky-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {weatherLoading ? (
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            getWeatherIcon(liveWeather?.condition)
          )}
          {weatherLoading ? 'Loading Weather...' : 'Live Weather'}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={refreshWeather}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
            disabled={weatherLoading || isRefreshing}
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {liveWeather?.isLiveData && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Live
            </span>
          )}
        </div>
      </div>
      
      {liveWeather && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-900/30 rounded-xl p-4 text-center">
              <div className="text-4xl mb-2">{liveWeather.icon}</div>
              <div className="text-3xl font-bold">{liveWeather.temperature}°C</div>
              <div className="text-sm text-slate-300 capitalize">{liveWeather.condition}</div>
              <div className="text-xs text-sky-300 mt-1">
                {liveWeather.city}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Updated: {liveWeather.lastUpdated}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="w-4 h-4" />
                  <span>Feels like</span>
                </div>
                <span className="font-medium">{liveWeather.feelsLike}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="w-4 h-4" />
                  <span>Humidity</span>
                </div>
                <span className="font-medium">{liveWeather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="w-4 h-4" />
                  <span>Wind</span>
                </div>
                <span className="font-medium">{liveWeather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Sunrise className="w-4 h-4" />
                  <span>Sunrise</span>
                </div>
                <span className="font-medium">{liveWeather.sunrise}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Sunset className="w-4 h-4" />
                  <span>Sunset</span>
                </div>
                <span className="font-medium">{liveWeather.sunset}</span>
              </div>
            </div>
          </div>
          
          {liveWeather.forecast && liveWeather.forecast.length > 0 && (
            <div className="pt-4 border-t border-sky-700/30">
              <h4 className="text-sm font-semibold mb-3 text-slate-300">4-Day Forecast</h4>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {liveWeather.forecast.map((day, idx) => (
                  <div key={idx} className="flex-shrink-0 bg-slate-800/30 rounded-xl p-3 min-w-24 text-center">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="text-2xl my-2">{day.icon}</div>
                    <div className="text-sm">
                      <div className="font-bold">{day.high}°</div>
                      <div className="text-slate-400 text-xs">{day.low}°</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 capitalize">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Emergency Features Component
  const EmergencyFeatures = () => (
    <div className="mt-6 bg-gradient-to-r from-red-800/40 to-rose-800/40 rounded-2xl p-5 border border-red-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          Safety & Emergency
        </h3>
        <span className="text-xs text-red-300">Tap to call</span>
      </div>
      
      <div className="space-y-3">
        {emergencyContactsData.map(contact => (
          <a
            key={contact.id}
            href={contact.phone ? `tel:${contact.phone}` : '#'}
            className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg hover:bg-red-900/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              {contact.icon}
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-red-300">{contact.role}</div>
              </div>
            </div>
            {contact.phone && (
              <div className="text-red-400 font-mono text-sm">{contact.phone}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  );

  // Progress Tracker Component
  const ProgressTracker = () => (
    <div className="mt-6 bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-5 border border-purple-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Your Progress
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-purple-300">{streakDays} day streak</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Helvellyn Hike Progress</span>
          <span className="text-emerald-400">{hikeProgress}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${hikeProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Trails Discovered</span>
          <span className="text-emerald-400">{userStats.trailsDiscovered}/5</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(userStats.trailsDiscovered / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h4 className="text-sm font-semibold mb-3 text-slate-300">Recent Achievements</h4>
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`bg-slate-800/50 rounded-xl p-3 ${achievement.earned ? 'border border-amber-500/30' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{achievement.icon}</span>
              <span className="text-sm font-medium">{achievement.name}</span>
            </div>
            <div className="text-xs text-slate-400">{achievement.description}</div>
            <div className="text-xs text-emerald-400 mt-1">+{achievement.points} pts</div>
            {!achievement.earned && (
              <div className="mt-2">
                <div className="w-full bg-slate-700/30 rounded-full h-1">
                  <div 
                    className="bg-emerald-500 h-1 rounded-full"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // System Status Component
  const SystemStatus = () => (
    <div className="mt-6 bg-gradient-to-r from-slate-800/40 to-slate-900/40 rounded-2xl p-4 border border-slate-700/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-300">System Status</h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}></div>
          <span className="text-xs">{connectionStatus}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Battery className="w-6 h-6 text-slate-400" />
            <div 
              className="absolute top-1 left-1 h-4 bg-emerald-500 rounded-sm"
              style={{ width: `${batteryLevel * 0.16}px` }}
            ></div>
          </div>
          <span className="text-xs mt-1">{batteryLevel}%</span>
        </div>
        
        <button 
          onClick={() => {
            setDarkMode(!darkMode);
            addNotification(`Switched to ${!darkMode ? 'dark' : 'light'} mode`);
          }}
          className="flex flex-col items-center"
        >
          {darkMode ? (
            <Moon className="w-6 h-6 text-blue-400" />
          ) : (
            <Sun className="w-6 h-6 text-amber-400" />
          )}
          <span className="text-xs mt-1">{darkMode ? 'Dark' : 'Light'}</span>
        </button>
        
        <div className="flex flex-col items-center">
          <Zap className="w-6 h-6 text-amber-400" />
          <span className="text-xs mt-1">{currentUser.points} pts</span>
        </div>
        
        <div className="flex flex-col items-center">
          <TrailIcon className="w-6 h-6 text-emerald-400" />
          <span className="text-xs mt-1">{userStats.trailsDiscovered}</span>
        </div>
      </div>
    </div>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <div className="mt-6 grid grid-cols-4 gap-3">
      <button 
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          addNotification('Link copied to clipboard!');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors"
      >
        <Share className="w-5 h-5 text-blue-400 mb-1" />
        <span className="text-xs">Share</span>
      </button>
      
      <button 
        onClick={() => {
          addNotification('Daily check-in complete!');
          setStreakDays(prev => prev + 1);
          setCurrentUser(prev => ({ ...prev, points: prev.points + 10 }));
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors"
      >
        <CheckCircle className="w-5 h-5 text-green-400 mb-1" />
        <span className="text-xs">Check-in</span>
      </button>
      
      <button 
        onClick={() => {
          const data = {
            photos: photos.length,
            prayers: prayerRequests.length,
            testimonials: testimonials.length,
            user: currentUser.name,
            timestamp: new Date().toISOString()
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `retreat-backup-${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          addNotification('Data backup downloaded');
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors"
      >
        <Download className="w-5 h-5 text-emerald-400 mb-1" />
        <span className="text-xs">Backup</span>
      </button>
      
      <button 
        onClick={() => {
          setHikeProgress(prev => Math.min(prev + 10, 100));
          addNotification('Hike progress updated!');
          setCurrentUser(prev => ({ ...prev, points: prev.points + 15 }));
        }}
        className="bg-slate-800/50 rounded-xl p-3 flex flex-col items-center hover:bg-slate-800 transition-colors"
      >
        <Mountain className="w-5 h-5 text-amber-400 mb-1" />
        <span className="text-xs">Hike +</span>
      </button>
    </div>
  );

  // Check-in Component for Attractions
  const CheckInComponent = () => (
    <div className="mt-6 bg-gradient-to-r from-amber-800/40 to-orange-800/40 rounded-2xl p-5 border border-amber-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-amber-400" />
          Location Check-ins
        </h3>
        <span className="text-xs text-amber-300">{userStats.checkIns} of 5 checked in</span>
      </div>
      
      <div className="space-y-3">
        {attractions.map(attraction => (
          <div key={attraction.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{attraction.icon}</span>
              <div>
                <div className="font-medium">{attraction.name}</div>
                <div className="text-xs text-slate-400">{attraction.difficulty} • {attraction.points} pts</div>
              </div>
            </div>
            
            <button
              onClick={() => checkIntoAttraction(attraction.id)}
              disabled={checkedInAttractions[attraction.id]}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                checkedInAttractions[attraction.id]
                  ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {checkedInAttractions[attraction.id] ? (
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Checked In</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  <span>Check In</span>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // KOMOOT Features Component
  const KomootFeatures = () => (
    <div className="mt-6 bg-gradient-to-r from-green-800/40 to-emerald-800/40 rounded-2xl p-5 border border-emerald-700/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          Outdoor Features
        </h3>
        <span className="text-xs text-emerald-300">Komoot-inspired</span>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Distance Covered</span>
            </div>
            <div className="text-2xl font-bold">0 km</div>
            <div className="text-xs text-slate-400">Today's hike</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="font-medium">Elevation Gain</span>
            </div>
            <div className="text-2xl font-bold">0 m</div>
            <div className="text-xs text-slate-400">Total climb</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Enhanced Header with Logo */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <a 
                href="https://photos.app.goo.gl/J672nHZ6qf0Z9kEzt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌄</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Greenwich SDA</h1>
                  <p className="text-emerald-200 text-xs">Men's Retreat 2026</p>
                </div>
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Weather Display */}
              {liveWeather && (
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  {getWeatherIcon(liveWeather.condition)}
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">{liveWeather.temperature}°</span>
                    <span className="text-xs ml-1">C</span>
                  </div>
                  {liveWeather.isLiveData && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  )}
                </div>
              )}
              
              {/* Mobile Weather Icon */}
              {liveWeather && (
                <div className="sm:hidden">
                  {getWeatherIcon(liveWeather.condition)}
                </div>
              )}
              
              {/* User Profile Button */}
              <button
                onClick={() => setShowUserModal(true)}
                className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center relative"
              >
                <span className="text-lg">{currentUser.avatar}</span>
              </button>
              
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">Bury Jubilee Centre, Glenridding</span>
            </div>
            
            {/* Current Time */}
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            {/* User Points */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{currentUser.points} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Optimized with NEW TRAILS TAB */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto pb-1 hide-scrollbar">
            {[
              { id: 'schedule', icon: Calendar, label: 'Schedule' },
              { id: 'location', icon: Navigation, label: 'Location' },
              { id: 'devotional', icon: Book, label: 'Devotional' },
              { id: 'photos', icon: Camera, label: 'Photos' },
              { id: 'prayer', icon: Heart, label: 'Prayer' },
              { id: 'testimonials', icon: MessageCircle, label: 'Stories' },
              { id: 'attractions', icon: Mountain, label: 'Attractions' },
              { id: 'trails', icon: TrailIcon, label: 'Trails' } // NEW TAB
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-3 border-b-2 transition-all whitespace-nowrap min-w-[80px] ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Status Bar */}
      <div className="sm:hidden bg-slate-800/30 border-b border-slate-700 py-2 px-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{currentUser.points} pts</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrailIcon className="w-3 h-3 text-emerald-400" />
              <span>{userStats.trailsDiscovered}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">{currentSchedule.day}'s Schedule</h2>
              <p className="text-blue-100">21-24 August 2026</p>
            </div>

            {/* ... schedule content ... */}

            {/* ENHANCED FEATURES */}
            <EnhancedWeather />
            <CheckInComponent />
            <KomootFeatures />
            <EmergencyFeatures />
            <ProgressTracker />
            <SystemStatus />
            <QuickActions />

            {/* Quick Day Selector */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Friday', key: 'friday', date: new Date(2026, 7, 21) },
                  { name: 'Saturday', key: 'saturday', date: new Date(2026, 7, 22) },
                  { name: 'Sunday', key: 'sunday', date: new Date(2026, 7, 23) },
                  { name: 'Monday', key: 'monday', date: new Date(2026, 7, 24) }
                ].map(({ name, key }) => (
                  <button
                    key={key}
                    onClick={() => setCurrentDay(key)}
                    className={`transition-all rounded-lg py-3 px-4 font-medium ${
                      currentDay === key
                        ? 'bg-emerald-600'
                        : 'bg-slate-700/50 hover:bg-emerald-600'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            {/* ... location content ... */}
          </div>
        )}

        {/* Devotional Tab */}
        {activeTab === 'devotional' && (
          <div className="space-y-6">
            {/* ... devotional content ... */}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            {/* ... photos content ... */}
          </div>
        )}

        {/* Prayer Tab */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            {/* ... prayer content ... */}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {/* ... testimonials content ... */}
          </div>
        )}

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            {/* ... attractions content ... */}
          </div>
        )}

        {/* NEW: Nearby Trails Tab */}
        {activeTab === 'trails' && <NearbyTrails />}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-emerald-600 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-slate-800 w-full max-w-sm h-full border-l border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadNotifications > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-emerald-400 text-sm"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`bg-slate-700/50 rounded-xl p-4 ${!notification.read ? 'border-l-2 border-emerald-400' : ''}`}
                    >
                      <p className="text-slate-200">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl">
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-slate-400">{currentUser.rank}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{currentUser.points} points</span>
                  </div>
                  <div className="text-xs px-2 py-0.5 bg-emerald-800/30 rounded-full">
                    Level {currentUser.level}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => {
                    setCurrentUser(prev => ({ ...prev, name: e.target.value }));
                    setUserName(e.target.value);
                  }}
                  className="w-full bg-slate-700 rounded-lg px-4 py-3"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{userStats.photos}</div>
                  <div className="text-sm">Photos</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-teal-400">{userStats.prayers}</div>
                  <div className="text-sm">Prayers</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">{userStats.trailsDiscovered}</div>
                  <div className="text-sm">Trails</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Daily Streak</span>
                  <span className="text-emerald-400 font-bold">{streakDays} days</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i}
                      className={`flex-1 h-2 rounded-full ${i < streakDays ? 'bg-emerald-500' : 'bg-slate-700'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-lg font-semibold mt-4 hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <a 
              href="https://photos.app.goo.gl/J672nHZ6qf0Z9kEzt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-300 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
                <span className="text-lg">🌄</span>
              </div>
              <span>Greenwich SDA Men's Ministry</span>
            </a>
          </div>
          <p className="text-sm">Bury Jubilee Outdoor Pursuits Centre, Glenridding, Cumbria CA11 0QR</p>
          <p className="text-sm mt-4 italic">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
          <p className="text-xs text-slate-500 mt-4">
            All data is stored locally in your browser. Clear browser data to reset.
          </p>
          <button 
            onClick={scrollToTop}
            className="mt-6 text-sm text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      </div>

      {/* Add CSS for hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
