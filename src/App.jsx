// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Upload, Navigation, Clock, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, CloudSnow, CloudLightning, ThumbsUp, Share2, Bell, Send, MoreVertical, Edit, Trash2, Check, X, RefreshCw, Home, ChevronRight, Compass } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // State management
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [photoCaption, setPhotoCaption] = useState({});
  const [photoComment, setPhotoComment] = useState({});
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editText, setEditText] = useState('');

  // Mock users
  const mockUsers = [
    { id: 1, name: 'David M.', avatar: '👨‍🦰', color: 'text-blue-400', bg: 'bg-blue-500' },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', color: 'text-amber-400', bg: 'bg-amber-500' },
    { id: 4, name: 'John W.', avatar: '👨‍💼', color: 'text-purple-400', bg: 'bg-purple-500' },
    { id: 5, name: 'Thomas R.', avatar: '👨‍🔧', color: 'text-rose-400', bg: 'bg-rose-500' },
    { id: 6, name: 'James K.', avatar: '👨‍🏫', color: 'text-cyan-400', bg: 'bg-cyan-500' },
  ];

  // Current user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      isOnline: true,
      lastSeen: new Date().toISOString()
    };
  });

  // Data states
  const [allUsers, setAllUsers] = useState([...mockUsers, currentUser]);
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityPhotos');
    return saved ? JSON.parse(saved) : [];
  });
  const [prayerRequests, setPrayerRequests] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityPrayers');
    return saved ? JSON.parse(saved) : [];
  });
  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('retreatCommunityTestimonials');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('retreatNotifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        type: 'welcome',
        message: 'Welcome to the retreat community!',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  });

  // Weather
  const [weather, setWeather] = useState({
    temperature: 18,
    condition: 'Partly Cloudy',
    feelsLike: 16,
    humidity: 65,
    windSpeed: 12,
    precipitation: 20,
    icon: '⛅',
    forecast: [
      { day: 'Today', high: 18, low: 12, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Sat', high: 16, low: 11, condition: 'Light Rain', icon: '🌦️' },
      { day: 'Sun', high: 14, low: 9, condition: 'Cloudy', icon: '☁️' },
      { day: 'Mon', high: 17, low: 12, condition: 'Sunny', icon: '☀️' }
    ]
  });

  // Base location
  const baseLocation = {
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre'
  };

  // Hiking locations
  const locations = {
    base: { lat: 54.5262, lng: -2.9620, name: 'Bury Jubilee Centre, Glenridding' },
    glenriddingDodd: { lat: 54.5350, lng: -2.9500, name: 'Glenridding Dodd' },
    airaForce: { lat: 54.5733, lng: -2.9067, name: 'Aira Force Waterfall' },
    helvellyn: { lat: 54.5275, lng: -3.0164, name: 'Helvellyn Summit' },
    ullswater: { lat: 54.5500, lng: -2.9300, name: 'Ullswater Lake' }
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
      reflection: 'God calls men to step forward in faith even when the path seems impossible.'
    },
    saturday: {
      title: 'Biblical Manhood: Living Under Christ\'s Lordship',
      scripture: '1 Corinthians 16:13-14',
      quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love." - 1 Corinthians 16:13-14',
      reflection: 'True strength is found in submission to Christ, not in worldly power.'
    },
    sunday: {
      title: 'Fear Not, Stand Firm',
      scripture: 'Joshua 1:9',
      quote: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go." - Joshua 1:9',
      reflection: 'Courage is not the absence of fear, but faith in action despite fear.'
    },
    monday: {
      title: 'Going Forward: Living as Men of Faith',
      scripture: 'Philippians 3:13-14',
      quote: '"Forgetting what is behind and straining towards what is ahead, I press on towards the goal to win the prize for which God has called me." - Philippians 3:13-14',
      reflection: 'Retreat experiences must translate into daily obedience.'
    }
  };

  // Local attractions
  const attractions = [
    {
      name: 'Aira Force Waterfall',
      distance: '4.8 km',
      description: 'Spectacular 65-foot cascade through ancient woodland.',
      duration: '2-3 hours',
      difficulty: 'Easy to Moderate'
    },
    {
      name: 'Helvellyn Summit',
      distance: '6.5 km',
      description: 'England\'s 3rd highest peak (950m).',
      duration: '6-7 hours',
      difficulty: 'Challenging'
    },
    {
      name: 'Ullswater Steamers',
      distance: 'At lakefront',
      description: 'Historic boat cruises on England\'s most beautiful lake.',
      duration: '1-2 hours',
      difficulty: 'Easy'
    }
  ];

  // Effects
  useEffect(() => {
    localStorage.setItem('retreatCommunityPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityPrayers', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityTestimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('retreatNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log('Location access denied')
      );
    }

    return () => clearInterval(timer);
  }, []);

  // Helper functions
  const getDaySchedule = () => {
    const day = currentTime.getDay();
    if (day === 5) return { day: 'Friday', schedule: schedule.friday, devotional: devotionals.friday };
    if (day === 6) return { day: 'Saturday', schedule: schedule.saturday, devotional: devotionals.saturday };
    if (day === 0) return { day: 'Sunday', schedule: schedule.sunday, devotional: devotionals.sunday };
    if (day === 1) return { day: 'Monday', schedule: schedule.monday, devotional: devotionals.monday };
    return { day: 'Friday', schedule: schedule.friday, devotional: devotionals.friday };
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

  const addNotification = useCallback((type, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const addPrayerRequest = useCallback((text) => {
    const newRequest = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      prayers: 0,
      comments: []
    };
    setPrayerRequests(prev => [newRequest, ...prev]);
    addNotification('new_prayer', `${currentUser.name} shared a prayer request`);
  }, [currentUser, addNotification]);

  const addTestimonial = useCallback((text) => {
    const newTestimonial = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    setTestimonials(prev => [newTestimonial, ...prev]);
    addNotification('new_testimonial', `${currentUser.name} shared a testimony`);
  }, [currentUser, addNotification]);

  const handlePhotoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          caption: '',
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userColor: currentUser.color,
          timestamp: new Date().toISOString(),
          comments: [],
          likes: 0
        };
        setPhotos(prev => [newPhoto, ...prev]);
        addNotification('new_photo', `${currentUser.name} shared a photo`);
      };
      reader.readAsDataURL(file);
    }
  }, [currentUser, addNotification]);

  const likePhoto = useCallback((photoId) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      )
    );
  }, []);

  const likeTestimonial = useCallback((testimonialId) => {
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === testimonialId
          ? { ...testimonial, likes: testimonial.likes + 1 }
          : testimonial
      )
    );
  }, []);

  const incrementPrayerCount = useCallback((prayerId) => {
    setPrayerRequests(prev =>
      prev.map(prayer =>
        prayer.id === prayerId
          ? { ...prayer, prayers: prayer.prayers + 1 }
          : prayer
      )
    );
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny') || condition.includes('Clear')) return <Sun className="w-6 h-6 text-amber-400" />;
    if (condition.includes('Cloud')) return <Cloud className="w-6 h-6 text-slate-300" />;
    if (condition.includes('Rain')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  const currentSchedule = getDaySchedule();
  const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Community preview data
  const latestPhoto = photos[0];
  const latestPrayer = prayerRequests[0];
  const latestTestimonial = testimonials[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Enhanced Header */}
<div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-700 shadow-lg relative overflow-hidden">
  {/* Remove or fix the problematic background pattern */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-30"></div>
  
  <div className="relative px-4 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Greenwich SDA</h1>
        <p className="text-emerald-100 text-sm mt-1">Men's Ministry • Lake District Retreat 2026</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {getWeatherIcon(weather.condition)}
          <div className="flex items-baseline">
            <span className="text-xl font-bold">{weather.temperature}°</span>
            <span className="text-xs ml-1">C</span>
          </div>
        </div>
        <button
          onClick={() => setShowUserModal(true)}
          className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md"
        >
          <span className="text-lg">{currentUser.avatar}</span>
        </button>
      </div>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-200" />
          <span className="text-sm">Bury Jubilee Centre</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-200" />
          <span className="text-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
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
</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Greenwich SDA</h1>
              <p className="text-emerald-100 text-sm mt-1">Men's Ministry • Lake District Retreat 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {getWeatherIcon(weather.condition)}
                <div className="flex items-baseline">
                  <span className="text-xl font-bold">{weather.temperature}°</span>
                  <span className="text-xs ml-1">C</span>
                </div>
              </div>
              <button
                onClick={() => setShowUserModal(true)}
                className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shadow-md"
              >
                <span className="text-lg">{currentUser.avatar}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-200" />
                <span className="text-sm">Bury Jubilee Centre</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-200" />
                <span className="text-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            
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
      </div>

      {/* Main Content */}
      <div className="pb-20"> {/* Padding for bottom navigation */}
        <div className="px-4 py-6">
          {/* Community Preview Section */}
          {(latestPhoto || latestPrayer || latestTestimonial) && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Community Activity</h2>
                <button className="text-emerald-400 text-sm font-medium">View All</button>
              </div>
              
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4">
                {latestPhoto && (
                  <div className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="w-5 h-5 text-pink-400" />
                      <span className="font-medium">Latest Photo</span>
                    </div>
                    <div className="aspect-video bg-slate-700/50 rounded-lg mb-3 overflow-hidden">
                      <img src={latestPhoto.src} alt="Latest" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${latestPhoto.userColor.replace('text', 'bg')} flex items-center justify-center`}>
                          <span className="text-xs">{latestPhoto.userAvatar}</span>
                        </div>
                        <span className="text-sm">{latestPhoto.userName}</span>
                      </div>
                      <span className="text-xs text-slate-400">{latestPhoto.likes} likes</span>
                    </div>
                  </div>
                )}
                
                {latestPrayer && (
                  <div className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-5 h-5 text-amber-400" />
                      <span className="font-medium">Prayer Request</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2 mb-3">{latestPrayer.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${latestPrayer.userColor.replace('text', 'bg')} flex items-center justify-center`}>
                          <span className="text-xs">{latestPrayer.userAvatar}</span>
                        </div>
                        <span className="text-sm">{latestPrayer.userName}</span>
                      </div>
                      <span className="text-xs text-slate-400">{latestPrayer.prayers} prayers</span>
                    </div>
                  </div>
                )}
                
                {latestTestimonial && (
                  <div className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageCircle className="w-5 h-5 text-teal-400" />
                      <span className="font-medium">Testimony</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2 mb-3 italic">"{latestTestimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${latestTestimonial.userColor.replace('text', 'bg')} flex items-center justify-center`}>
                          <span className="text-xs">{latestTestimonial.userAvatar}</span>
                        </div>
                        <span className="text-sm">{latestTestimonial.userName}</span>
                      </div>
                      <span className="text-xs text-slate-400">{latestTestimonial.likes} likes</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold">{currentSchedule.day}'s Schedule</h2>
                <p className="text-slate-400">21-24 August 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">{allUsers.length} members</span>
              </div>
            </div>
          </div>

          {/* Enhanced Schedule Cards */}
          <div className="space-y-4">
            {currentSchedule.schedule.map((item, idx) => {
              const itemHour = parseInt(item.time.split(':')[0]) + (parseInt(item.time.split(':')[1]) / 60);
              const isCurrent = currentHour >= itemHour && 
                               (idx === currentSchedule.schedule.length - 1 || 
                                currentHour < parseInt(currentSchedule.schedule[idx + 1].time.split(':')[0]));
              
              return (
                <div
                  key={idx}
                  className={`bg-gradient-to-r from-slate-800 to-slate-800/90 backdrop-blur rounded-2xl p-4 border-l-4 shadow-lg transition-all duration-200 ${
                    isCurrent
                      ? 'border-emerald-500 scale-[1.02] shadow-emerald-500/20'
                      : 'border-slate-600 hover:border-slate-500 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isCurrent ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                      }`}>
                        {item.emoji}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg font-bold ${
                            isCurrent ? 'text-emerald-400' : 'text-slate-300'
                          }`}>
                            {item.time}
                          </span>
                          {isCurrent && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                              <span className="text-xs font-semibold text-emerald-400">NOW</span>
                            </div>
                          )}
                        </div>
                        
                        {item.location !== 'London' && locations[item.location] && currentLocation && (
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                            {calculateDistance(
                              currentLocation.lat,
                              currentLocation.lng,
                              locations[item.location].lat,
                              locations[item.location].lng
                            )} km
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                      
                      {item.location !== 'London' && locations[item.location] && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{locations[item.location].name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Day Selector Cards */}
          <div className="mt-8 bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Friday', date: '21 Aug', active: currentSchedule.day === 'Friday' },
                { name: 'Saturday', date: '22 Aug', active: currentSchedule.day === 'Saturday' },
                { name: 'Sunday', date: '23 Aug', active: currentSchedule.day === 'Sunday' },
                { name: 'Monday', date: '24 Aug', active: currentSchedule.day === 'Monday' }
              ].map(({ name, date, active }) => (
                <button
                  key={name}
                  onClick={() => {
                    // In a real app, you would update the current day
                  }}
                  className={`transition-all rounded-xl p-4 text-center ${
                    active
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold">{name}</div>
                  <div className="text-sm opacity-80">{date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weather Forecast */}
          <div className="mt-6 bg-gradient-to-r from-sky-800/40 to-cyan-800/40 backdrop-blur rounded-2xl p-5 border border-sky-700/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Weather Forecast
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="flex-shrink-0 bg-slate-800/30 rounded-xl p-3 min-w-20 text-center">
                  <div className="text-sm font-medium">{day.day}</div>
                  <div className="text-2xl my-2">{day.icon}</div>
                  <div className="text-sm">
                    <div className="font-bold">{day.high}°</div>
                    <div className="text-slate-400 text-xs">{day.low}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab-specific content would go here */}
        {activeTab !== 'schedule' && (
          <div className="px-4 py-6">
            <div className="text-center py-12">
              <div className="text-4xl mb-4">
                {activeTab === 'location' && <Navigation className="inline-block" />}
                {activeTab === 'devotional' && <Book className="inline-block" />}
                {activeTab === 'photos' && <Camera className="inline-block" />}
                {activeTab === 'prayer' && <Heart className="inline-block" />}
                {activeTab === 'testimonials' && <MessageCircle className="inline-block" />}
                {activeTab === 'attractions' && <Mountain className="inline-block" />}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab === 'location' && 'Location'}
                {activeTab === 'devotional' && 'Daily Devotional'}
                {activeTab === 'photos' && 'Community Photos'}
                {activeTab === 'prayer' && 'Prayer Wall'}
                {activeTab === 'testimonials' && 'Testimonies'}
                {activeTab === 'attractions' && 'Local Attractions'}
              </h3>
              <p className="text-slate-400">Content for this section</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 z-40">
        <div className="flex justify-around items-center h-16">
          {[
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'location', icon: Navigation, label: 'Map' },
            { id: 'photos', icon: Camera, label: 'Photos' },
            { id: 'prayer', icon: Heart, label: 'Prayer' },
            { id: 'testimonials', icon: MessageCircle, label: 'Stories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <div className={`p-2 rounded-full ${
                activeTab === tab.id ? 'bg-emerald-400/10' : ''
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 w-full max-w-sm h-full border-l border-slate-700 animate-slideIn">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold">Notifications</h2>
              <button onClick={() => setShowNotifications(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map(notification => (
                    <div key={notification.id} className="bg-slate-800/50 rounded-xl p-4">
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

      {/* User Profile Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Profile</h2>
              <button onClick={() => setShowUserModal(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full ${currentUser.bg} flex items-center justify-center text-2xl`}>
                {currentUser.avatar}
              </div>
              <div>
                <h3 className="text-xl font-bold">{currentUser.name}</h3>
                <p className="text-slate-400">Retreat Participant</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-700/50 rounded-lg px-4 py-3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{photos.filter(p => p.userId === currentUser.id).length}</div>
                  <div className="text-sm">Photos</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-teal-400">{prayerRequests.filter(p => p.userId === currentUser.id).length}</div>
                  <div className="text-sm">Prayers</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 py-3 rounded-lg font-semibold mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 py-6 mt-8">
        <div className="px-4 text-center">
          <p className="mb-2">Greenwich SDA Men's Ministry Retreat</p>
          <p className="text-sm text-slate-400 mb-4">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
          
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{allUsers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{prayerRequests.reduce((sum, p) => sum + p.prayers, 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>{photos.length}</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500">
            Data stored locally • Share with others to build community
          </p>
        </div>
      </div>
    </div>
  );
}
