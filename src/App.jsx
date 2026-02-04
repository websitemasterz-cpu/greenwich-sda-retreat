// src/App.jsx - FULLY OPTIMIZED VERSION
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { 
  Calendar, MapPin, Camera, Heart, Book, Navigation, Clock, Bell, X, 
  Mountain, ChevronUp, Coffee as CoffeeIcon, MapPin as TrailIcon
} from 'lucide-react';

// ============================================================================
// STATIC DATA - Moved outside component to prevent recreation
// ============================================================================

const BASE_LOCATION = {
  lat: 54.5262,
  lng: -2.9620,
  name: 'Bury Jubilee Outdoor Pursuits Centre',
  address: 'Glenridding, Penrith CA11 0QR, UK'
};

const LOCATIONS = {
  base: { 
    lat: 54.5262, lng: -2.9620, name: 'Bury Jubilee Centre', icon: '🏠', 
    color: 'bg-emerald-500', description: 'Home base for the retreat',
    difficulty: 'Easy', points: 10, distanceFromBase: 0
  },
  glenriddingDodd: { 
    lat: 54.5350, lng: -2.9500, name: 'Glenridding Dodd', icon: '🥾', 
    color: 'bg-green-500', description: 'Gentle fell walk with panoramic views',
    difficulty: 'Easy to Moderate', points: 20, distanceFromBase: 1.5
  },
  airaForce: { 
    lat: 54.5733, lng: -2.9067, name: 'Aira Force Waterfall', icon: '💧', 
    color: 'bg-blue-500', description: 'Spectacular 65-foot cascade',
    difficulty: 'Easy', points: 25, distanceFromBase: 3
  },
  helvellyn: { 
    lat: 54.5275, lng: -3.0164, name: 'Helvellyn Summit', icon: '⛰️', 
    color: 'bg-amber-500', description: 'England\'s 3rd highest peak',
    difficulty: 'Challenging', points: 50, distanceFromBase: 4
  },
  ullswater: { 
    lat: 54.5500, lng: -2.9300, name: 'Ullswater Lake', icon: '🛥️', 
    color: 'bg-indigo-500', description: 'Beautiful lake for steamer rides',
    difficulty: 'Easy', points: 15, distanceFromBase: 2
  }
};

const SCHEDULE = {
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

const DEVOTIONALS = {
  friday: {
    title: 'Taking Charge: You Will Part the Waters',
    scripture: 'Exodus 14:13-16',
    quote: '"Do not be afraid. Stand firm and you will see the deliverance the Lord will bring you today." - Exodus 14:13',
    reflection: 'God calls men to step forward in faith even when the path seems impossible. Leadership begins with trusting God\'s command over our circumstances.',
    content: 'Moses stood before the Israelites as they faced the Red Sea, with Pharaoh\'s army closing in from behind. In that moment of absolute despair, God gave Moses a command that defied all logic: "Tell the Israelites to move forward." This wasn\'t just about physical movement; it was about moving forward in faith when everything seemed impossible. As men, we often face "Red Sea moments" - situations where there seems to be no way forward. God\'s instruction remains the same: "Move forward." He doesn\'t show us the entire path, just the next step. Our leadership is tested not in calm waters but in stormy seas. When we step forward in faith, God makes a way where there seems to be no way.'
  },
  saturday: {
    title: 'Biblical Manhood: Living Under Christ\'s Lordship',
    scripture: '1 Corinthians 16:13-14',
    quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love." - 1 Corinthians 16:13-14',
    reflection: 'True strength is found in submission to Christ, not in worldly power. We are called to protect, provide, and lead with humility.',
    content: 'Biblical manhood is often misunderstood in our culture. Society tells us to be strong, independent, and in control. But Paul gives us a different picture: "Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love." Notice the progression: vigilance, faith, courage, strength - all culminating in love. Real strength isn\'t about dominating others; it\'s about being strong enough to be gentle, courageous enough to be vulnerable, and firm enough to be compassionate.'
  },
  sunday: {
    title: 'Fear Not, Stand Firm',
    scripture: 'Joshua 1:9',
    quote: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." - Joshua 1:9',
    reflection: 'Courage is not the absence of fear, but faith in action despite fear. God\'s presence gives us confidence to face any challenge.',
    content: 'God spoke these words to Joshua as he was about to lead Israel into the Promised Land - a land filled with giants, fortified cities, and experienced warriors. Joshua had every reason to be afraid. But God didn\'t say, "Don\'t feel afraid." He said, "Don\'t be afraid." There\'s a difference. Fear is an emotion; being afraid is a choice. God acknowledges that we will feel fear, but He commands us not to let that fear control us.'
  },
  monday: {
    title: 'Going Forward: Living as Men of Faith',
    scripture: 'Philippians 3:13-14',
    quote: '"Forgetting what is behind and straining towards what is ahead, I press on towards the goal to win the prize for which God has called me." - Philippians 3:13-14',
    reflection: 'Retreat experiences must translate into daily obedience. We are called to be doers of the Word, not just hearers.',
    content: 'As our retreat comes to an end, we face the challenge of translating mountaintop experiences into daily life. Paul gives us the key: "Forgetting what is behind and straining toward what is ahead." The Christian life is one of constant forward motion. The Greek word for "press on" implies intense effort, like a runner straining toward the finish line.'
  }
};

const ATTRACTIONS = [
  {
    id: 'airaForce', name: 'Aira Force Waterfall', distance: '3 miles',
    description: 'Spectacular 65-foot cascade through ancient woodland. National Trust site with well-maintained paths.',
    duration: '2-3 hours', difficulty: 'Easy to Moderate', points: 25, icon: '💧', trailLength: 2.5
  },
  {
    id: 'helvellyn', name: 'Helvellyn Summit', distance: '4 miles',
    description: 'England\'s 3rd highest peak (950m). Famous Striding Edge scramble route with breathtaking views.',
    duration: '6-7 hours', difficulty: 'Challenging', points: 50, icon: '⛰️', trailLength: 8
  },
  {
    id: 'ullswater', name: 'Ullswater Steamers', distance: 'At lakefront',
    description: 'Historic boat cruises on England\'s most beautiful lake. Multiple departure times daily.',
    duration: '1-2 hours', difficulty: 'Easy', points: 15, icon: '🛥️', trailLength: 1
  },
  {
    id: 'glenriddingDodd', name: 'Glenridding Dodd', distance: '1.5 miles',
    description: 'Gentle fell walk with panoramic views over Ullswater. Perfect acclimatisation hike.',
    duration: '2 hours', difficulty: 'Easy to Moderate', points: 20, icon: '🥾', trailLength: 2
  }
];

const KITCHEN_DATA = {
  friday: {
    breakfast: { menu: 'On the road', team: ['Travel Day'] },
    lunch: { menu: 'On the road', team: ['Travel Day'] },
    dinner: { menu: 'Welcome Dinner: Roast Chicken with Vegetables, Mashed Potatoes, Gravy', team: ['Kitchen Staff', 'Volunteers'] }
  },
  saturday: {
    breakfast: { menu: 'Full English Breakfast: Eggs, Bacon, Sausages, Beans, Toast, Coffee/Tea', team: ['Team A: John, Mike, David'] },
    lunch: { menu: 'Packed Lunch: Sandwiches, Crisps, Fruit, Chocolate Bar, Water', team: ['Team A: John, Mike, David'] },
    dinner: { menu: 'Spaghetti Bolognese with Garlic Bread, Salad', team: ['Team B: Peter, James, Andrew'] }
  },
  sunday: {
    breakfast: { menu: 'Continental Breakfast: Cereal, Pastries, Fruit, Yogurt, Coffee/Tea', team: ['Team B: Peter, James, Andrew'] },
    lunch: { menu: 'Trail Snacks Provided', team: ['Team B: Peter, James, Andrew'] },
    dinner: { menu: 'Sunday Roast: Beef, Yorkshire Puddings, Roast Potatoes, Vegetables', team: ['Team C: Thomas, Matthew, Simon'] }
  },
  monday: {
    breakfast: { menu: 'Breakfast Buffet: Scrambled Eggs, Toast, Cereal, Fruit, Coffee/Tea', team: ['Team C: Thomas, Matthew, Simon'] },
    lunch: { menu: 'Sandwiches and Soup (before departure)', team: ['Team C: Thomas, Matthew, Simon'] },
    dinner: { menu: 'On the road', team: ['Travel Day'] }
  }
};

const DEFAULT_ACHIEVEMENTS = [
  { id: 1, name: 'Early Riser', description: 'Complete morning devotion', icon: '☀️', earned: true, progress: 100, points: 10, type: 'spiritual' },
  { id: 2, name: 'Prayer Warrior', description: 'Pray for 5 requests', icon: '🙏', earned: false, progress: 60, points: 15, type: 'spiritual' },
  { id: 3, name: 'Community Builder', description: 'Share 3 photos', icon: '📸', earned: false, progress: 66, points: 20, type: 'social' },
  { id: 4, name: 'Summit Seeker', description: 'Complete 3 hikes', icon: '⛰️', earned: false, progress: 45, points: 25, type: 'fitness' },
  { id: 5, name: 'Explorer', description: 'Check into 3 locations', icon: '📍', earned: false, progress: 33, points: 30, type: 'exploration' },
  { id: 6, name: 'Trail Master', description: 'Navigate 2 trails', icon: '🥾', earned: false, progress: 0, points: 40, type: 'fitness' }
];

const DIFFICULTY_MAP = {
  1: { label: 'Easy', color: 'bg-emerald-500', text: 'text-emerald-300' },
  2: { label: 'Easy/Intermediate', color: 'bg-green-500', text: 'text-green-300' },
  3: { label: 'Intermediate', color: 'bg-amber-500', text: 'text-amber-300' },
  4: { label: 'Hard', color: 'bg-orange-500', text: 'text-orange-300' },
  5: { label: 'Expert', color: 'bg-red-500', text: 'text-red-300' }
};

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

const ScheduleTab = lazy(() => import('./components/ScheduleTab'));
const LocationsTab = lazy(() => import('./components/LocationsTab'));
const KitchenTab = lazy(() => import('./components/KitchenTab'));
const DevotionalTab = lazy(() => import('./components/DevotionalTab'));
const PhotosTab = lazy(() => import('./components/PhotosTab'));
const PrayerTab = lazy(() => import('./components/PrayerTab'));
const TestimonialsTab = lazy(() => import('./components/TestimonialsTab'));
const TrailsTab = lazy(() => import('./components/TrailsTab'));

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const kmToMiles = (km) => (km * 0.621371).toFixed(1);
const milesToKm = (miles) => (miles * 1.60934).toFixed(1);

const getInitialDay = () => {
  const day = new Date().getDay();
  if (day === 5) return 'friday';
  if (day === 6) return 'saturday';
  if (day === 0) return 'sunday';
  if (day === 1) return 'monday';
  return 'saturday';
};

// ============================================================================
// LOCALSTORAGE UTILITIES
// ============================================================================

const getFromLocalStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GreenwichSDARetreatApp() {
  // ========== STATE MANAGEMENT ==========
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDay, setCurrentDay] = useState(getInitialDay);
  
  // Form states
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  
  // App states
  const [liveWeather, setLiveWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [streakDays, setStreakDays] = useState(3);
  const [achievements, setAchievements] = useState(DEFAULT_ACHIEVEMENTS);
  const [connectionStatus, setConnectionStatus] = useState('online');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Data from localStorage
  const [photos, setPhotos] = useState(() => getFromLocalStorage('retreatPhotos', []));
  const [prayerRequests, setPrayerRequests] = useState(() => getFromLocalStorage('retreatPrayerRequests', []));
  const [testimonials, setTestimonials] = useState(() => getFromLocalStorage('retreatTestimonials', []));
  const [userName, setUserName] = useState(() => localStorage.getItem('retreatUserName') || '');
  const [checkedInAttractions, setCheckedInAttractions] = useState(() => getFromLocalStorage('retreatCheckedInAttractions', {}));
  const [hikedTrails, setHikedTrails] = useState(() => getFromLocalStorage('retreatHikedTrails', []));
  const [progressMetrics, setProgressMetrics] = useState(() => getFromLocalStorage('retreatProgressMetrics', {
    totalMilesHiked: 0,
    trailsCompleted: 0,
    prayerCount: 0,
    photosShared: 0,
    checkIns: 0,
    lastUpdated: new Date().toISOString()
  }));
  const [currentUser, setCurrentUser] = useState(() => getFromLocalStorage('retreatCurrentUser', {
    id: Date.now(),
    name: localStorage.getItem('retreatUserName') || 'You',
    avatar: '👤',
    avatarUrl: '',
    points: 150,
    level: 1,
    rank: 'Explorer',
    badges: ['Early Riser'],
    checkIns: 0,
    totalDistance: 0
  }));

  // Trails states
  const [nearbyTrails, setNearbyTrails] = useState([]);
  const [trailsLoading, setTrailsLoading] = useState(false);
  const [trailsError, setTrailsError] = useState(null);
  const [trailFilters, setTrailFilters] = useState({
    maxDistance: 30,
    minLength: 0,
    maxLength: 30,
    difficulty: 'all'
  });

  // ========== MEMOIZED VALUES ==========
  
  const currentSchedule = useMemo(() => {
    const scheduleData = SCHEDULE[currentDay] || SCHEDULE.saturday;
    const devotionalData = DEVOTIONALS[currentDay] || DEVOTIONALS.saturday;
    return { day: currentDay.charAt(0).toUpperCase() + currentDay.slice(1), schedule: scheduleData, devotional: devotionalData };
  }, [currentDay]);

  const currentHour = useMemo(() => {
    return currentTime.getHours() + (currentTime.getMinutes() / 60);
  }, [currentTime]);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // ========== CONSOLIDATED LOCALSTORAGE EFFECT ==========
  
  useEffect(() => {
    const dataToSave = {
      retreatPhotos: photos,
      retreatPrayerRequests: prayerRequests,
      retreatTestimonials: testimonials,
      retreatCurrentUser: currentUser,
      retreatCheckedInAttractions: checkedInAttractions,
      retreatHikedTrails: hikedTrails,
      retreatProgressMetrics: progressMetrics
    };
    
    Object.entries(dataToSave).forEach(([key, value]) => {
      saveToLocalStorage(key, value);
    });
  }, [photos, prayerRequests, testimonials, currentUser, checkedInAttractions, hikedTrails, progressMetrics]);

  // Username effect
  useEffect(() => {
    if (userName) {
      localStorage.setItem('retreatUserName', userName);
      setCurrentUser(prev => ({ ...prev, name: userName }));
    }
  }, [userName]);

  // ========== CALLBACKS ==========

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

  const addPrayerRequest = useCallback((text, author = 'Anonymous') => {
    const newRequest = {
      id: Date.now(),
      text,
      author: author || 'Anonymous',
      timestamp: new Date().toISOString(),
      prayers: 0,
      userLocation: currentLocation
    };
    setPrayerRequests(prev => [newRequest, ...prev]);
    addNotification('Prayer request shared 🙏');
    return newRequest;
  }, [currentLocation, addNotification]);

  const incrementPrayerCount = useCallback((id) => {
    setPrayerRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, prayers: request.prayers + 1 } : request
      )
    );
    addNotification('You prayed for someone ❤️');
  }, [addNotification]);

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
  }, [addNotification]);

  const likeTestimonial = useCallback((id) => {
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === id ? { ...testimonial, likes: testimonial.likes + 1 } : testimonial
      )
    );
    addNotification('You liked a testimony 👍');
  }, [addNotification]);

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
          location: currentLocation
        };
        setPhotos(prev => [newPhoto, ...prev]);
        addNotification('Photo uploaded 📸');
        setAchievements(prev => 
          prev.map(a => a.id === 3 ? { ...a, progress: Math.min(a.progress + 20, 100) } : a)
        );
      };
      reader.readAsDataURL(file);
    }
  }, [userName, currentLocation, addNotification]);

  const likePhoto = useCallback((photoId) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
      )
    );
    addNotification('You liked a photo ❤️');
  }, [addNotification]);

  const checkIntoAttraction = useCallback((attractionId) => {
    const attraction = ATTRACTIONS.find(a => a.id === attractionId) || LOCATIONS[attractionId];
    
    if (checkedInAttractions[attractionId]) {
      addNotification(`Already checked into ${attraction.name}!`);
      return;
    }
    
    setCheckedInAttractions(prev => ({
      ...prev,
      [attractionId]: {
        timestamp: new Date().toISOString(),
        name: attraction.name,
        trailLength: attraction.trailLength || 0
      }
    }));
    
    const points = attraction.points || 10;
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points,
      checkIns: prev.checkIns + 1
    }));
    
    setAchievements(prev => 
      prev.map(a => {
        if (a.id === 5 && Object.keys(checkedInAttractions).length + 1 >= 3) {
          return { ...a, progress: 100, earned: true };
        }
        return a;
      })
    );
    
    addNotification(`Checked into ${attraction.name}! +${points} points 🎉`);
  }, [checkedInAttractions, addNotification]);

  // Weather fetch with caching
  const fetchLiveWeather = useCallback(async () => {
    // Check cache first
    const cached = getFromLocalStorage('weatherCache', null);
    if (cached && cached.timestamp) {
      const age = Date.now() - cached.timestamp;
      if (age < 15 * 60 * 1000) { // 15 minutes
        setLiveWeather(cached.data);
        return;
      }
    }

    setWeatherLoading(true);
    setIsRefreshing(true);
    
    const targetLat = currentLocation?.lat || BASE_LOCATION.lat;
    const targetLng = currentLocation?.lng || BASE_LOCATION.lng;
    
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=5`
      );
      
      if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
      
      const data = await response.json();
      const current = data.current;
      const daily = data.daily;
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      const weatherData = {
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
      
      setLiveWeather(weatherData);
      saveToLocalStorage('weatherCache', { data: weatherData, timestamp: Date.now() });
      addNotification('Live weather updated! 🌤️');
      
    } catch (error) {
      console.error('Error fetching live weather:', error);
      addNotification('Using sample weather data');
    } finally {
      setWeatherLoading(false);
      setIsRefreshing(false);
    }
  }, [currentLocation, addNotification]);

  // Debounced scroll handler
  const debouncedScrollHandler = useMemo(
    () => debounce(() => setShowBackToTop(window.scrollY > 400), 100),
    []
  );

  // ========== EFFECTS ==========

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
        () => {
          setCurrentLocation(BASE_LOCATION);
        }
      );
    } else {
      setCurrentLocation(BASE_LOCATION);
    }

    // Connection status
    const updateConnectionStatus = () => setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Scroll listener
    window.addEventListener('scroll', debouncedScrollHandler);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
      window.removeEventListener('scroll', debouncedScrollHandler);
    };
  }, [debouncedScrollHandler]);

  // Fetch weather when location is available
  useEffect(() => {
    if (currentLocation) {
      fetchLiveWeather();
      const weatherInterval = setInterval(fetchLiveWeather, 15 * 60 * 1000);
      return () => clearInterval(weatherInterval);
    }
  }, [currentLocation, fetchLiveWeather]);

  // Update progress metrics
  useEffect(() => {
    const newMetrics = {
      totalMilesHiked: hikedTrails.reduce((sum, trail) => sum + parseFloat(trail.length), 0),
      trailsCompleted: hikedTrails.length,
      prayerCount: prayerRequests.filter(p => p.author === userName).length,
      photosShared: photos.filter(p => p.author === userName).length,
      checkIns: Object.keys(checkedInAttractions).length,
      lastUpdated: new Date().toISOString()
    };
    setProgressMetrics(newMetrics);
  }, [hikedTrails, prayerRequests, photos, checkedInAttractions, userName]);

  // ========== HELPER FUNCTIONS ==========

  const getLiveWeatherIcon = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
    if (weatherCode >= 300 && weatherCode < 600) return '🌧️';
    if (weatherCode >= 600 && weatherCode < 700) return '❄️';
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️';
    if (weatherCode === 800) return '☀️';
    if (weatherCode === 801) return '🌤️';
    if (weatherCode === 802) return '⛅';
    return '☁️';
  };

  const getWeatherCondition = (weatherCode) => {
    if (weatherCode >= 200 && weatherCode < 300) return 'Thunderstorm';
    if (weatherCode >= 300 && weatherCode < 400) return 'Drizzle';
    if (weatherCode >= 500 && weatherCode < 600) return 'Rain';
    if (weatherCode >= 600 && weatherCode < 700) return 'Snow';
    if (weatherCode >= 700 && weatherCode < 800) return 'Mist';
    if (weatherCode === 800) return 'Clear Sky';
    if (weatherCode === 801) return 'Few Clouds';
    if (weatherCode === 802) return 'Scattered Clouds';
    return 'Clouds';
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========== SHARED PROPS ==========

  const sharedProps = useMemo(() => ({
    currentUser,
    setCurrentUser,
    userName,
    setUserName,
    currentLocation,
    currentDay,
    setCurrentDay,
    currentSchedule,
    currentHour,
    liveWeather,
    weatherLoading,
    isRefreshing,
    fetchLiveWeather,
    photos,
    setPhotos,
    prayerRequests,
    setPrayerRequests,
    testimonials,
    setTestimonials,
    achievements,
    setAchievements,
    checkedInAttractions,
    hikedTrails,
    setHikedTrails,
    progressMetrics,
    nearbyTrails,
    setNearbyTrails,
    trailsLoading,
    setTrailsLoading,
    trailsError,
    setTrailsError,
    trailFilters,
    setTrailFilters,
    prayerText,
    setPrayerText,
    testimonialText,
    setTestimonialText,
    streakDays,
    setStreakDays,
    addNotification,
    addPrayerRequest,
    incrementPrayerCount,
    addTestimonial,
    likeTestimonial,
    handlePhotoUpload,
    likePhoto,
    checkIntoAttraction,
    baseLocation: BASE_LOCATION,
    locations: LOCATIONS,
    schedule: SCHEDULE,
    devotionals: DEVOTIONALS,
    attractions: ATTRACTIONS,
    kitchenData: KITCHEN_DATA,
    difficultyMap: DIFFICULTY_MAP
  }), [currentUser, userName, currentLocation, currentDay, currentSchedule, currentHour, liveWeather, 
      weatherLoading, isRefreshing, photos, prayerRequests, testimonials, achievements, 
      checkedInAttractions, hikedTrails, progressMetrics, nearbyTrails, trailsLoading, trailsError, 
      trailFilters, prayerText, testimonialText, streakDays, fetchLiveWeather]);

  // ========== RENDER ==========

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a 
                href="https://photos.app.goo.gl/J672nHZ6qf0Z9kEzt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity group"
              >
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mountain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Greenwich SDA</h1>
                  <p className="text-emerald-200 text-xs">Men's Retreat 2026</p>
                </div>
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              {liveWeather && (
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-xl">{liveWeather.icon}</span>
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold">{liveWeather.temperature}°</span>
                    <span className="text-xs ml-1">C</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowUserModal(true)}
                className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center overflow-hidden relative border-2 border-emerald-400"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">{currentUser.avatar}</span>
                )}
              </button>
              
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
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
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex overflow-x-auto pb-1 hide-scrollbar scroll-smooth snap-x snap-mandatory">
            {[
              { id: 'schedule', icon: Calendar, label: 'Schedule' },
              { id: 'locations', icon: Navigation, label: 'Locations' },
              { id: 'kitchen', icon: CoffeeIcon, label: 'Kitchen' },
              { id: 'devotional', icon: Book, label: 'Devotional' },
              { id: 'photos', icon: Camera, label: 'Photos' },
              { id: 'prayer', icon: Heart, label: 'Prayer' },
              { id: 'testimonials', icon: MessageCircle, label: 'Stories' },
              { id: 'trails', icon: TrailIcon, label: 'Trails' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 border-b-2 transition-all whitespace-nowrap min-w-[90px] snap-start ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400 bg-slate-800/20'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content with Lazy Loading */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          {activeTab === 'schedule' && <ScheduleTab {...sharedProps} />}
          {activeTab === 'locations' && <LocationsTab {...sharedProps} />}
          {activeTab === 'kitchen' && <KitchenTab {...sharedProps} />}
          {activeTab === 'devotional' && <DevotionalTab {...sharedProps} />}
          {activeTab === 'photos' && <PhotosTab {...sharedProps} />}
          {activeTab === 'prayer' && <PrayerTab {...sharedProps} />}
          {activeTab === 'testimonials' && <TestimonialsTab {...sharedProps} />}
          {activeTab === 'trails' && <TrailsTab {...sharedProps} />}
        </Suspense>
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
                  <button onClick={markAllNotificationsAsRead} className="text-emerald-400 text-sm">
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
                        {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      {/* User Modal - Simplified */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mb-3 overflow-hidden border-2 border-emerald-500/30">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUser.avatar}</span>
                )}
              </div>
              <h3 className="text-xl font-bold">{currentUser.name}</h3>
              <p className="text-slate-400">{currentUser.rank}</p>
              <div className="text-xs px-3 py-1 bg-emerald-800/30 rounded-full mt-2">
                Level {currentUser.level} • {currentUser.points} points
              </div>
            </div>
            
            <div className="mb-6">
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
            
            <button
              onClick={() => {
                setShowUserModal(false);
                addNotification('Profile saved! ✅');
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
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
