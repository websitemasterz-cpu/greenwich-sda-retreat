// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Upload, Navigation, Clock, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, CloudSnow, CloudLightning, ThumbsUp, Share2, Bell, Send, MoreVertical, Edit, Trash2, Check, X, RefreshCw } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  // State management with enhanced user system
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

  // Mock users database
  const mockUsers = [
    { id: 1, name: 'David M.', avatar: '👨‍🦰', color: 'text-blue-400', bg: 'bg-blue-500' },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', color: 'text-emerald-400', bg: 'bg-emerald-500' },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', color: 'text-amber-400', bg: 'bg-amber-500' },
    { id: 4, name: 'John W.', avatar: '👨‍💼', color: 'text-purple-400', bg: 'bg-purple-500' },
    { id: 5, name: 'Thomas R.', avatar: '👨‍🔧', color: 'text-rose-400', bg: 'bg-rose-500' },
    { id: 6, name: 'James K.', avatar: '👨‍🏫', color: 'text-cyan-400', bg: 'bg-cyan-500' },
  ];

  // Current user state with localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default to first user or create new
    return {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      isOnline: true,
      lastSeen: new Date().toISOString()
    };
  });

  // All users (current user + mock users)
  const [allUsers, setAllUsers] = useState([...mockUsers, currentUser]);

  // Load community data from localStorage
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
        message: 'Welcome to the retreat community! Start by sharing a prayer request.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];
  });

  const [weather, setWeather] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock weather data
  const mockWeatherData = {
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
  };

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

  // Daily schedule (same as before)
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

  // Daily devotionals (same as before)
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

  // Local attractions (same as before)
  const attractions = [
    {
      name: 'Aira Force Waterfall',
      distance: '4.8 km',
      description: 'Spectacular 65-foot cascade through ancient woodland. National Trust site with well-maintained paths.',
      duration: '2-3 hours',
      difficulty: 'Easy to Moderate'
    },
    {
      name: 'Helvellyn Summit',
      distance: '6.5 km',
      description: 'England\'s 3rd highest peak (950m). Famous Striding Edge scramble route with breathtaking views.',
      duration: '6-7 hours',
      difficulty: 'Challenging'
    },
    {
      name: 'Ullswater Steamers',
      distance: 'At lakefront',
      description: 'Historic boat cruises on England\'s most beautiful lake. Multiple departure times daily.',
      duration: '1-2 hours',
      difficulty: 'Easy'
    },
    {
      name: 'Glenridding Dodd',
      distance: '2.5 km',
      description: 'Gentle fell walk with panoramic views over Ullswater. Perfect acclimatisation hike.',
      duration: '2 hours',
      difficulty: 'Easy to Moderate'
    },
    {
      name: 'Patterdale',
      distance: '3 km',
      description: 'Charming village with St. Patrick\'s Church. Beautiful valley setting with tea rooms.',
      duration: '1 hour',
      difficulty: 'Easy'
    },
    {
      name: 'Brotherswater',
      distance: '5 km',
      description: 'Tranquil lake with easy circular walk. Stunning mountain backdrop.',
      duration: '1.5 hours',
      difficulty: 'Easy'
    }
  ];

  // Save to localStorage whenever data changes
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

  // Simulate community activity
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
        (error) => console.log('Location access denied')
      );
    }

    // Set mock weather data
    setWeather(mockWeatherData);

    // Simulate occasional community activity
    const simulateActivity = () => {
      if (Math.random() > 0.7 && prayerRequests.length > 0) {
        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
        const randomPrayer = prayerRequests[Math.floor(Math.random() * prayerRequests.length)];
        
        if (randomPrayer.userId !== randomUser.id) {
          const newNotification = {
            id: Date.now(),
            type: 'prayer',
            message: `${randomUser.name} prayed for your request`,
            userId: randomUser.id,
            itemId: randomPrayer.id,
            timestamp: new Date().toISOString(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          
          // Increment prayer count
          setPrayerRequests(prev =>
            prev.map(prayer =>
              prayer.id === randomPrayer.id
                ? { ...prayer, prayers: prayer.prayers + 1 }
                : prayer
            )
          );
        }
      }
    };

    const activityInterval = setInterval(simulateActivity, 30000); // Every 30 seconds

    return () => {
      clearInterval(timer);
      clearInterval(activityInterval);
    };
  }, [prayerRequests]);

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

  // Add notification helper
  const addNotification = useCallback((type, message, userId = null, itemId = null) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      userId,
      itemId,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Prayer request functions with notifications
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
      comments: [],
      userLocation: currentLocation ? {
        lat: currentLocation.lat,
        lng: currentLocation.lng
      } : null
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    
    // Notify other users
    addNotification('new_prayer', `${currentUser.name} shared a prayer request`, currentUser.id, newRequest.id);
    
    return newRequest;
  }, [currentUser, currentLocation, addNotification]);

  const incrementPrayerCount = useCallback((prayerId) => {
    setPrayerRequests(prev =>
      prev.map(prayer =>
        prayer.id === prayerId
          ? { 
              ...prayer, 
              prayers: prayer.prayers + 1,
              prayedBy: [...(prayer.prayedBy || []), currentUser.id]
            }
          : prayer
      )
    );
    
    // Find prayer owner
    const prayer = prayerRequests.find(p => p.id === prayerId);
    if (prayer && prayer.userId !== currentUser.id) {
      addNotification('prayer', `${currentUser.name} prayed for your request`, currentUser.id, prayerId);
    }
  }, [prayerRequests, currentUser, addNotification]);

  const addPrayerComment = useCallback((prayerId, text) => {
    const newComment = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setPrayerRequests(prev =>
      prev.map(prayer =>
        prayer.id === prayerId
          ? { ...prayer, comments: [...prayer.comments, newComment] }
          : prayer
      )
    );
    
    // Notify prayer owner
    const prayer = prayerRequests.find(p => p.id === prayerId);
    if (prayer && prayer.userId !== currentUser.id) {
      addNotification('comment', `${currentUser.name} commented on your prayer`, currentUser.id, prayerId);
    }
  }, [prayerRequests, currentUser, addNotification]);

  const deletePrayerRequest = useCallback((id) => {
    setPrayerRequests(prev => prev.filter(request => request.id !== id));
  }, []);

  // Testimonial functions with notifications
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
      likedBy: [],
      comments: []
    };
    
    setTestimonials(prev => [newTestimonial, ...prev]);
    
    // Notify community
    addNotification('new_testimonial', `${currentUser.name} shared a testimony`, currentUser.id, newTestimonial.id);
    
    return newTestimonial;
  }, [currentUser, addNotification]);

  const likeTestimonial = useCallback((testimonialId) => {
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === testimonialId
          ? { 
              ...testimonial, 
              likes: testimonial.likes + 1,
              likedBy: [...testimonial.likedBy, currentUser.id]
            }
          : testimonial
      )
    );
    
    // Find testimonial owner
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (testimonial && testimonial.userId !== currentUser.id) {
      addNotification('like', `${currentUser.name} liked your testimony`, currentUser.id, testimonialId);
    }
  }, [testimonials, currentUser, addNotification]);

  const addTestimonialComment = useCallback((testimonialId, text) => {
    const newComment = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setTestimonials(prev =>
      prev.map(testimonial =>
        testimonial.id === testimonialId
          ? { ...testimonial, comments: [...testimonial.comments, newComment] }
          : testimonial
      )
    );
    
    // Notify testimonial owner
    const testimonial = testimonials.find(t => t.id === testimonialId);
    if (testimonial && testimonial.userId !== currentUser.id) {
      addNotification('comment', `${currentUser.name} commented on your testimony`, currentUser.id, testimonialId);
    }
  }, [testimonials, currentUser, addNotification]);

  const deleteTestimonial = useCallback((id) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
  }, []);

  // Photo functions with notifications
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
          likes: 0,
          likedBy: [],
          location: currentLocation ? {
            lat: currentLocation.lat,
            lng: currentLocation.lng
          } : null
        };
        
        setPhotos(prev => [newPhoto, ...prev]);
        
        // Notify community
        addNotification('new_photo', `${currentUser.name} shared a photo`, currentUser.id, newPhoto.id);
      };
      reader.readAsDataURL(file);
    }
  }, [currentUser, currentLocation, addNotification]);

  const updatePhotoCaption = useCallback((photoId, caption) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, caption }
          : photo
      )
    );
  }, []);

  const likePhoto = useCallback((photoId) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { 
              ...photo, 
              likes: photo.likes + 1,
              likedBy: [...photo.likedBy, currentUser.id]
            }
          : photo
      )
    );
    
    // Find photo owner
    const photo = photos.find(p => p.id === photoId);
    if (photo && photo.userId !== currentUser.id) {
      addNotification('like', `${currentUser.name} liked your photo`, currentUser.id, photoId);
    }
  }, [photos, currentUser, addNotification]);

  const addPhotoComment = useCallback((photoId, text) => {
    const newComment = {
      id: Date.now(),
      text,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userColor: currentUser.color,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, comments: [...photo.comments, newComment] }
          : photo
      )
    );
    
    // Notify photo owner
    const photo = photos.find(p => p.id === photoId);
    if (photo && photo.userId !== currentUser.id) {
      addNotification('comment', `${currentUser.name} commented on your photo`, currentUser.id, photoId);
    }
  }, [photos, currentUser, addNotification]);

  const deletePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  }, []);

  // Edit functions
  const startEditing = useCallback((itemId, type, currentText) => {
    setEditingItem({ id: itemId, type });
    setEditText(currentText);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingItem || !editText.trim()) return;

    if (editingItem.type === 'prayer') {
      setPrayerRequests(prev =>
        prev.map(prayer =>
          prayer.id === editingItem.id
            ? { ...prayer, text: editText }
            : prayer
        )
      );
    } else if (editingItem.type === 'testimonial') {
      setTestimonials(prev =>
        prev.map(testimonial =>
          testimonial.id === editingItem.id
            ? { ...testimonial, text: editText }
            : testimonial
        )
      );
    }

    setEditingItem(null);
    setEditText('');
  }, [editingItem, editText]);

  // Mark notifications as read
  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Refresh community data
  const refreshCommunityData = useCallback(() => {
    setIsRefreshing(true);
    // Simulate network delay
    setTimeout(() => {
      // In a real app, you would fetch new data here
      setIsRefreshing(false);
      addNotification('refresh', 'Community data refreshed');
    }, 1000);
  }, [addNotification]);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny') || condition.includes('Clear')) return <Sun className="w-5 h-5 text-amber-400" />;
    if (condition.includes('Cloud')) return <Cloud className="w-5 h-5 text-slate-300" />;
    if (condition.includes('Rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (condition.includes('Snow')) return <CloudSnow className="w-5 h-5 text-blue-200" />;
    if (condition.includes('Storm')) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  // User stats calculation
  const userStats = {
    prayers: prayerRequests.filter(p => p.userId === currentUser.id).length,
    testimonials: testimonials.filter(t => t.userId === currentUser.id).length,
    photos: photos.filter(p => p.userId === currentUser.id).length,
    totalPrayersReceived: prayerRequests
      .filter(p => p.userId === currentUser.id)
      .reduce((total, p) => total + p.prayers, 0),
    totalLikesReceived: [
      ...testimonials.filter(t => t.userId === currentUser.id),
      ...photos.filter(p => p.userId === currentUser.id)
    ].reduce((total, item) => total + item.likes, 0)
  };

  const currentSchedule = getDaySchedule();
  const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Reset all data function
  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all community data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Greenwich SDA</h1>
              <p className="text-emerald-200 text-sm mt-1">Men's Ministry - Lake District Retreat 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={refreshCommunityData}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
              <Mountain className="w-12 h-12 text-emerald-200" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>Bury Jubilee Centre, Glenridding</span>
            </div>
            
            {/* Current Time */}
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            {/* Weather Display */}
            {weather && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-sky-800/60 to-cyan-800/60 px-3 py-1.5 rounded-full border border-sky-700/50 shadow-lg">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(weather.condition)}
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{weather.temperature}°</span>
                    <span className="text-xs text-sky-200">C</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* User Profile Button */}
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/50 px-3 py-1.5 rounded-full transition-colors"
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                <span className="text-sm">{currentUser.avatar}</span>
              </div>
              <span>{currentUser.name}</span>
            </button>
            
            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/50 px-3 py-1.5 rounded-full transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end pt-16">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 w-full max-w-md h-full border-l border-slate-700 shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-emerald-300">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadNotifications > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-sm text-emerald-400 hover:text-emerald-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-8rem)]">
              {notifications.length > 0 ? (
                <div className="divide-y divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-slate-800/30' : ''}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          {notification.type === 'prayer' && <Heart className="w-4 h-4 text-emerald-400" />}
                          {notification.type === 'like' && <ThumbsUp className="w-4 h-4 text-amber-400" />}
                          {notification.type === 'comment' && <MessageCircle className="w-4 h-4 text-blue-400" />}
                          {notification.type === 'new_photo' && <Camera className="w-4 h-4 text-rose-400" />}
                          {notification.type === 'new_testimonial' && <Users className="w-4 h-4 text-teal-400" />}
                          {notification.type === 'refresh' && <RefreshCw className="w-4 h-4 text-cyan-400" />}
                          {notification.type === 'welcome' && <Users className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-200">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(notification.timestamp).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-emerald-700/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-300">Your Profile</h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${currentUser.bg}`}>
                  {currentUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <p className="text-sm text-slate-400">Retreat Participant</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-xs text-emerald-400">Online</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-slate-300 mb-2">Change Your Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold mb-3">Your Retreat Contributions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{userStats.prayers}</div>
                    <div className="text-sm text-slate-300">Prayers Shared</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-teal-400">{userStats.testimonials}</div>
                    <div className="text-sm text-slate-300">Testimonials</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{userStats.photos}</div>
                    <div className="text-sm text-slate-300">Photos</div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">{userStats.totalLikesReceived}</div>
                    <div className="text-sm text-slate-300">Likes Received</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold mb-3">Community Members</h3>
                <div className="flex flex-wrap gap-2">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        user.id === currentUser.id
                          ? 'bg-emerald-500/20 border border-emerald-500/30'
                          : 'bg-slate-700/30'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.bg}`}>
                        <span className="text-xs">{user.avatar}</span>
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-700">
                <button
                  onClick={resetAllData}
                  className="w-full bg-gradient-to-r from-red-700/30 to-red-800/30 hover:from-red-600/40 hover:to-red-700/40 py-3 rounded-lg font-semibold transition-all border border-red-700/30 mb-2"
                >
                  Reset All Community Data
                </button>
                <p className="text-xs text-slate-400 text-center">This will clear all shared content</p>
              </div>
              
              <button
                onClick={() => setShowUserModal(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 rounded-lg font-semibold transition-all mt-2"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'schedule', icon: Calendar, label: 'Schedule' },
              { id: 'location', icon: Navigation, label: 'Location' },
              { id: 'devotional', icon: Book, label: 'Devotional' },
              { id: 'photos', icon: Camera, label: 'Photos' },
              { id: 'prayer', icon: Heart, label: 'Prayer' },
              { id: 'testimonials', icon: MessageCircle, label: 'Testimonials' },
              { id: 'attractions', icon: Mountain, label: 'Attractions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Schedule Tab (unchanged) */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">{currentSchedule.day}'s Schedule</h2>
              <p className="text-blue-100">21-24 August 2026</p>
            </div>

            <div className="space-y-4">
              {currentSchedule.schedule.map((item, idx) => {
                const itemHour = parseInt(item.time.split(':')[0]) + (parseInt(item.time.split(':')[1]) / 60);
                const isCurrent = currentHour >= itemHour && 
                                 (idx === currentSchedule.schedule.length - 1 || 
                                  currentHour < parseInt(currentSchedule.schedule[idx + 1].time.split(':')[0]));
                
                return (
                  <div
                    key={idx}
                    className={`bg-slate-800/70 backdrop-blur rounded-xl p-5 border-2 transition-all ${
                      isCurrent
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{item.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-emerald-400 font-bold text-lg">{item.time}</span>
                          {isCurrent && (
                            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{item.activity}</h3>
                        {item.location !== 'London' && locations[item.location] && (
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{locations[item.location].name}</span>
                            {currentLocation && (
                              <span className="ml-2 text-emerald-400">
                                ~{calculateDistance(
                                  currentLocation.lat,
                                  currentLocation.lng,
                                  locations[item.location].lat,
                                  locations[item.location].lng
                                )} km away
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Day Selector */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Friday', date: new Date(2026, 7, 21) },
                  { name: 'Saturday', date: new Date(2026, 7, 22) },
                  { name: 'Sunday', date: new Date(2026, 7, 23) },
                  { name: 'Monday', date: new Date(2026, 7, 24) }
                ].map(({ name, date }) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCurrentTime(date);
                    }}
                    className={`transition-all rounded-lg py-3 px-4 font-medium ${
                      currentSchedule.day === name
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

        {/* Location Tab (unchanged) */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Location Tracking</h2>
              <p className="text-blue-100">Real-time position and navigation</p>
            </div>

            {/* Simple Map Visualization */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-slate-900 to-blue-900/50 flex items-center justify-center relative">
                {/* Location Dots */}
                <div className="absolute inset-0">
                  {/* Base Camp */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse">
                      <span className="text-white text-lg">🏠</span>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-white font-bold text-sm">Base Camp</p>
                      <p className="text-emerald-300 text-xs">Bury Jubilee Centre</p>
                    </div>
                  </div>
                  
                  {/* Helvellyn */}
                  <div className="absolute left-1/4 top-1/4">
                    <div className="w-10 h-10 bg-amber-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white">⛰️</span>
                    </div>
                  </div>
                  
                  {/* Aira Force */}
                  <div className="absolute left-3/4 top-1/3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white">💧</span>
                    </div>
                  </div>
                  
                  {/* Ullswater */}
                  <div className="absolute left-2/3 top-2/3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white">🛥️</span>
                    </div>
                  </div>
                  
                  {/* Current Location if available */}
                  {currentLocation && (
                    <div className="absolute" style={{ 
                      left: `${50 + (currentLocation.lng - (-2.9620)) * 100}%`,
                      top: `${50 - (currentLocation.lat - 54.5262) * 100}%`
                    }}>
                      <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center animate-bounce">
                        <span className="text-white text-xs">📍</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="75%" y2="33%" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="67%" y2="67%" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur rounded-lg p-3 border border-slate-700">
                  <p className="text-sm font-semibold mb-2">Legend</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Base Camp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span>Helvellyn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Aira Force</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span>Ullswater</span>
                    </div>
                    {currentLocation && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Your Location</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location Info */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Your Current Position
              </h3>
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
                    Distance to base: ~{calculateDistance(
                      currentLocation.lat,
                      currentLocation.lng,
                      baseLocation.lat,
                      baseLocation.lng
                    )} km
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400 mb-2">Enable location services to track your position</p>
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
                          (error) => alert('Please enable location access in your browser settings')
                        );
                      }
                    }}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                  >
                    Enable Location Tracking
                  </button>
                </div>
              )}
            </div>

            {/* Key Locations with Distances */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Distance to Key Locations</h3>
              <div className="space-y-3">
                {Object.entries(locations).map(([key, loc]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        key === 'base' ? 'bg-emerald-500' :
                        key === 'helvellyn' ? 'bg-amber-500' :
                        key === 'airaForce' ? 'bg-blue-500' :
                        key === 'ullswater' ? 'bg-indigo-500' :
                        'bg-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium">{loc.name}</p>
                        <p className="text-xs text-slate-400">
                          {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                        </p>
                      </div>
                    </div>
                    {currentLocation ? (
                      <div className="text-right">
                        <span className="text-emerald-400 text-sm font-medium">
                          {calculateDistance(currentLocation.lat, currentLocation.lng, loc.lat, loc.lng)} km
                        </span>
                        <p className="text-xs text-slate-500">straight line</p>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">-- km</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Devotional Tab (unchanged) */}
        {activeTab === 'devotional' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Word for Today</h2>
              <p className="text-purple-100">Daily spiritual nourishment</p>
            </div>

            {/* Today's Devotional */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Book className="w-8 h-8 text-purple-400" />
                <div>
                  <h3 className="text-2xl font-bold">{currentSchedule.devotional.title}</h3>
                  <p className="text-purple-300 text-sm mt-1">{currentSchedule.devotional.scripture}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-xl p-6 mb-6 border-l-4 border-purple-400">
                <p className="text-lg italic leading-relaxed">{currentSchedule.devotional.quote}</p>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {currentSchedule.devotional.reflection}
                </p>
              </div>
            </div>

            {/* Additional Inspirational Quotes */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">More Inspiration</h3>
              <div className="space-y-4">
                {[
                  { quote: 'The mountains are calling and I must go.', author: 'John Muir' },
                  { quote: 'In every walk with nature, one receives far more than he seeks.', author: 'John Muir' },
                  { quote: 'Faith is taking the first step even when you don\'t see the whole staircase.', author: 'Martin Luther King Jr.' },
                  { quote: 'Be strong and courageous. Do not be afraid; do not be discouraged.', author: 'Joshua 1:9' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border-l-2 border-purple-400">
                    <p className="italic text-slate-200">"{item.quote}"</p>
                    <p className="text-sm text-purple-300 mt-2">— {item.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab - Enhanced with Community */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Community Photos</h2>
                  <p className="text-pink-100">Share and interact with retreat memories</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-pink-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{photos.length} photos</span>
                  </div>
                  <div className="bg-rose-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{allUsers.length} members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border-2 border-dashed border-slate-600 text-center hover:border-pink-500 transition-colors">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <p className="text-lg font-semibold mb-2">Upload a Photo to Share</p>
                <p className="text-slate-400 text-sm">Share your retreat moments with the community</p>
              </label>
            </div>

            {/* Photo Grid with Community Interactions */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="bg-slate-800/70 backdrop-blur rounded-xl overflow-hidden border border-slate-700 hover:border-pink-500 transition-all group">
                    <div className="relative">
                      <img src={photo.src} alt="Retreat" className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => likePhoto(photo.id)}
                              className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full"
                            >
                              <Heart className={`w-4 h-4 ${photo.likedBy?.includes(currentUser.id) ? 'fill-pink-400 text-pink-400' : 'text-white'}`} />
                              <span className="text-sm">{photo.likes}</span>
                            </button>
                            <button className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${photo.userColor.replace('text', 'bg')}`}>
                            <span className="text-sm">{photo.userAvatar}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-pink-300">{photo.userName}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(photo.timestamp).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {photo.userId === currentUser.id && (
                          <div className="relative">
                            <button
                              onClick={() => startEditing(photo.id, 'photo', photo.caption)}
                              className="text-slate-500 hover:text-white p-1"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingItem?.id === photo.id && editingItem.type === 'photo' ? (
                        <div className="mb-3">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full bg-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            placeholder="Add a caption..."
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={saveEdit}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded-lg text-sm"
                            >
                              <Check className="w-4 h-4 mx-auto" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="flex-1 bg-red-600/50 hover:bg-red-500/50 py-1.5 rounded-lg text-sm"
                            >
                              <X className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-300 mb-3">{photo.caption || "No caption"}</p>
                      )}
                      
                      {/* Comments Section */}
                      <div className="space-y-3">
                        {photo.comments.slice(0, 2).map((comment) => (
                          <div key={comment.id} className="text-sm bg-slate-700/30 rounded p-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.userColor.replace('text', 'bg')}`}>
                                  <span className="text-xs">{comment.userAvatar}</span>
                                </div>
                                <span className="font-medium text-pink-200">{comment.userName}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {new Date(comment.timestamp).toLocaleTimeString('en-GB', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            <p className="text-slate-300 mt-1 ml-8">{comment.text}</p>
                          </div>
                        ))}
                        
                        {photo.comments.length > 2 && (
                          <p className="text-xs text-slate-500 text-center">
                            +{photo.comments.length - 2} more comments
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                            <span className="text-xs">{currentUser.avatar}</span>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={photoComment[photo.id] || ''}
                              onChange={(e) => setPhotoComment({...photoComment, [photo.id]: e.target.value})}
                              placeholder="Add a comment..."
                              className="flex-1 bg-slate-700/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                            <button
                              onClick={() => {
                                if (photoComment[photo.id]?.trim()) {
                                  addPhotoComment(photo.id, photoComment[photo.id]);
                                  setPhotoComment({...photoComment, [photo.id]: ''});
                                }
                              }}
                              className="text-pink-400 hover:text-pink-300 text-sm px-3"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/70 backdrop-blur rounded-xl p-12 border border-slate-700 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No photos shared yet. Be the first to share a memory!</p>
              </div>
            )}
          </div>
        )}

        {/* Prayer Tab - Enhanced Community Interaction */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Community Prayer Wall</h2>
                  <p className="text-amber-100">Lift each other up in prayer together</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-amber-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{prayerRequests.length} prayers</span>
                  </div>
                  <div className="bg-orange-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{prayerRequests.reduce((sum, p) => sum + p.prayers, 0)} prayers received</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Prayer Request */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Share a Prayer Request</h3>
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share what's on your heart with the community..."
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (prayerText.trim()) {
                      addPrayerRequest(prayerText);
                      setPrayerText('');
                    }
                  }}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Share Prayer Request
                </button>
                <div className="text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                      <span className="text-xs">{currentUser.avatar}</span>
                    </div>
                    <span>Posting as: {currentUser.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prayer List with Community Interactions */}
            <div className="space-y-4">
              {prayerRequests.length > 0 ? (
                prayerRequests.map((request) => (
                  <div key={request.id} className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${request.userColor.replace('text', 'bg')}`}>
                          <span className="text-lg">{request.userAvatar}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-amber-300">{request.userName}</h3>
                            <p className="text-xs text-slate-400">
                              {new Date(request.timestamp).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {request.userLocation && (
                                <span className="ml-2">
                                  • {calculateDistance(
                                    request.userLocation.lat,
                                    request.userLocation.lng,
                                    baseLocation.lat,
                                    baseLocation.lng
                                  )} km from base
                                </span>
                              )}
                            </p>
                          </div>
                          
                          {request.userId === currentUser.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditing(request.id, 'prayer', request.text)}
                                className="text-slate-500 hover:text-amber-400"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePrayerRequest(request.id)}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingItem?.id === request.id && editingItem.type === 'prayer' ? (
                          <div className="mb-4">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-slate-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              rows="3"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={saveEdit}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded-lg text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 bg-red-600/50 hover:bg-red-500/50 py-1.5 rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-300 leading-relaxed mb-4">{request.text}</p>
                        )}
                        
                        {/* Interaction Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => incrementPrayerCount(request.id)}
                              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                            >
                              <Heart className={`w-5 h-5 ${request.prayedBy?.includes(currentUser.id) ? 'fill-amber-400' : ''}`} />
                              <span className="font-medium">{request.prayers} prayed</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                const commentText = commentText[request.id] || '';
                                if (commentText.trim()) {
                                  addPrayerComment(request.id, commentText);
                                  setCommentText({...commentText, [request.id]: ''});
                                }
                              }}
                              className="flex items-center gap-2 text-slate-400 hover:text-white"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Comment</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {request.prayedBy?.slice(0, 3).map((userId, idx) => {
                              const user = allUsers.find(u => u.id === userId);
                              return user ? (
                                <div
                                  key={idx}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${user.bg}`}
                                  title={`Prayed by ${user.name}`}
                                >
                                  <span className="text-xs">{user.avatar}</span>
                                </div>
                              ) : null;
                            })}
                            {request.prayedBy && request.prayedBy.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                +{request.prayedBy.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Comments Section */}
                        {request.comments.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <p className="text-sm font-medium text-slate-400">Comments ({request.comments.length})</p>
                            {request.comments.slice(0, 2).map((comment) => (
                              <div key={comment.id} className="bg-slate-700/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.userColor.replace('text', 'bg')}`}>
                                    <span className="text-xs">{comment.userAvatar}</span>
                                  </div>
                                  <span className="font-medium text-amber-200">{comment.userName}</span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(comment.timestamp).toLocaleTimeString('en-GB', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-sm">{comment.text}</p>
                              </div>
                            ))}
                            
                            {request.comments.length > 2 && (
                              <p className="text-xs text-slate-500 text-center">
                                +{request.comments.length - 2} more comments
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Add Comment */}
                        <div className="mt-4 flex gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                            <span className="text-sm">{currentUser.avatar}</span>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentText[request.id] || ''}
                              onChange={(e) => setCommentText({...commentText, [request.id]: e.target.value})}
                              placeholder="Add a comment of support..."
                              className="flex-1 bg-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button
                              onClick={() => {
                                const text = commentText[request.id] || '';
                                if (text.trim()) {
                                  addPrayerComment(request.id, text);
                                  setCommentText({...commentText, [request.id]: ''});
                                }
                              }}
                              className="bg-amber-600 hover:bg-amber-500 px-4 rounded-lg text-sm"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-800/70 backdrop-blur rounded-xl p-12 border border-slate-700 text-center">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No prayer requests yet. Be the first to share!</p>
                  <p className="text-sm text-slate-500 mt-2">Your prayer could be exactly what someone needs to hear.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Testimonials Tab - Enhanced Community Interaction */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Community Testimonies</h2>
                  <p className="text-teal-100">Share how God is working in your lives together</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-teal-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{testimonials.length} testimonies</span>
                  </div>
                  <div className="bg-cyan-500/20 px-3 py-1 rounded-full">
                    <span className="text-sm">{testimonials.reduce((sum, t) => sum + t.likes, 0)} encouragements</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Testimonial */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Share Your Testimony</h3>
              <textarea
                value={testimonialText}
                onChange={(e) => setTestimonialText(e.target.value)}
                placeholder="How has God moved in your life during this retreat? Share to encourage others..."
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
              />
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (testimonialText.trim()) {
                      addTestimonial(testimonialText);
                      setTestimonialText('');
                    }
                  }}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Share Testimony
                </button>
                <div className="text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                      <span className="text-xs">{currentUser.avatar}</span>
                    </div>
                    <span>Posting as: {currentUser.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial List with Community Interactions */}
            <div className="space-y-4">
              {testimonials.length > 0 ? (
                testimonials.map((testimony) => (
                  <div key={testimony.id} className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-teal-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${testimony.userColor.replace('text', 'bg')}`}>
                          <span className="text-lg">{testimony.userAvatar}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-teal-300">{testimony.userName}</h3>
                            <p className="text-xs text-slate-400">
                              {new Date(testimony.timestamp).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          {testimony.userId === currentUser.id && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => startEditing(testimony.id, 'testimonial', testimony.text)}
                                className="text-slate-500 hover:text-teal-400"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTestimonial(testimony.id)}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {editingItem?.id === testimony.id && editingItem.type === 'testimonial' ? (
                          <div className="mb-4">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full bg-slate-700/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                              rows="3"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={saveEdit}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded-lg text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 bg-red-600/50 hover:bg-red-500/50 py-1.5 rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-300 leading-relaxed mb-4 italic">"{testimony.text}"</p>
                        )}
                        
                        {/* Interaction Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => likeTestimonial(testimony.id)}
                              className="flex items-center gap-2 text-teal-400 hover:text-teal-300"
                            >
                              <ThumbsUp className={`w-5 h-5 ${testimony.likedBy?.includes(currentUser.id) ? 'fill-teal-400' : ''}`} />
                              <span className="font-medium">{testimony.likes} encouragements</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                const commentText = commentText[testimony.id] || '';
                                if (commentText.trim()) {
                                  addTestimonialComment(testimony.id, commentText);
                                  setCommentText({...commentText, [testimony.id]: ''});
                                }
                              }}
                              className="flex items-center gap-2 text-slate-400 hover:text-white"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Comment</span>
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {testimony.likedBy?.slice(0, 3).map((userId, idx) => {
                              const user = allUsers.find(u => u.id === userId);
                              return user ? (
                                <div
                                  key={idx}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${user.bg}`}
                                  title={`Encouraged by ${user.name}`}
                                >
                                  <span className="text-xs">{user.avatar}</span>
                                </div>
                              ) : null;
                            })}
                            {testimony.likedBy && testimony.likedBy.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                +{testimony.likedBy.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Comments Section */}
                        {testimony.comments.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <p className="text-sm font-medium text-slate-400">Comments ({testimony.comments.length})</p>
                            {testimony.comments.slice(0, 2).map((comment) => (
                              <div key={comment.id} className="bg-slate-700/30 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.userColor.replace('text', 'bg')}`}>
                                    <span className="text-xs">{comment.userAvatar}</span>
                                  </div>
                                  <span className="font-medium text-teal-200">{comment.userName}</span>
                                  <span className="text-xs text-slate-500">
                                    {new Date(comment.timestamp).toLocaleTimeString('en-GB', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-sm">{comment.text}</p>
                              </div>
                            ))}
                            
                            {testimony.comments.length > 2 && (
                              <p className="text-xs text-slate-500 text-center">
                                +{testimony.comments.length - 2} more comments
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Add Comment */}
                        <div className="mt-4 flex gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser.bg}`}>
                            <span className="text-sm">{currentUser.avatar}</span>
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentText[testimony.id] || ''}
                              onChange={(e) => setCommentText({...commentText, [testimony.id]: e.target.value})}
                              placeholder="Add a comment of encouragement..."
                              className="flex-1 bg-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            />
                            <button
                              onClick={() => {
                                const text = commentText[testimony.id] || '';
                                if (text.trim()) {
                                  addTestimonialComment(testimony.id, text);
                                  setCommentText({...commentText, [testimony.id]: ''});
                                }
                              }}
                              className="bg-teal-600 hover:bg-teal-500 px-4 rounded-lg text-sm"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-slate-800/70 backdrop-blur rounded-xl p-12 border border-slate-700 text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400">No testimonies yet. Share how God is working!</p>
                  <p className="text-sm text-slate-500 mt-2">Your story could inspire someone else's faith journey.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Attractions Tab (unchanged) */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Local Attractions</h2>
              <p className="text-indigo-100">Explore the beauty of the Lake District</p>
            </div>

            <div className="grid gap-6">
              {attractions.map((attraction, idx) => (
                <div key={idx} className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-indigo-500 transition-all">
                  <div className="flex items-start gap-4">
                    <Mountain className="w-8 h-8 text-indigo-400 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                      <p className="text-slate-300 mb-4">{attraction.description}</p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Distance</p>
                          <p className="text-indigo-400 font-semibold">{attraction.distance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Duration</p>
                          <p className="text-indigo-400 font-semibold">{attraction.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Difficulty</p>
                          <p className="text-indigo-400 font-semibold">{attraction.difficulty}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weather Info */}
            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-indigo-400" />
                Weather Considerations
              </h3>
              <div className="space-y-2 text-slate-300">
                <p>• August weather in the Lake District is variable - be prepared for all conditions</p>
                <p>• Average temperature: 15-20°C (59-68°F) in the valleys</p>
                <p>• Summit temperatures can be 5-10°C cooler with wind chill</p>
                <p>• Rain is common - waterproof gear essential</p>
                <p>• Check weather forecasts daily, especially before Helvellyn</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 border-t border-slate-800 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p className="mb-2">Greenwich SDA Men's Ministry Retreat Community</p>
          <p className="text-sm">Bury Jubilee Outdoor Pursuits Centre, Glenridding, Cumbria CA11 0QR</p>
          <p className="text-sm mt-4 italic">"Be strong and courageous. Do not be afraid." - Joshua 1:9</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{allUsers.length} Members</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{prayerRequests.reduce((sum, p) => sum + p.prayers, 0)} Prayers</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>{photos.length} Photos</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            All community data is stored locally in your browser. Share the app link with others to build the community!
          </p>
        </div>
      </div>
    </div>
  );
}
