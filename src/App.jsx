// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Navigation, Clock, Sun, Cloud, CloudRain, Bell, X, Upload, Send } from 'lucide-react';

export default function GreenwichSDARetreatApp() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserModal, setShowUserModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [prayerText, setPrayerText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Current user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('retreatCurrentUser');
    return saved ? JSON.parse(saved) : {
      id: Date.now(),
      name: 'You',
      avatar: '👤',
      bg: 'bg-emerald-500',
    };
  });

  // Mock data
  const [allUsers] = useState([
    { id: 1, name: 'David M.', avatar: '👨‍🦰', bg: 'bg-blue-500' },
    { id: 2, name: 'Samuel P.', avatar: '👨‍🦱', bg: 'bg-emerald-500' },
    { id: 3, name: 'Michael B.', avatar: '👨‍🦳', bg: 'bg-amber-500' },
  ]);

  // Weather
  const [weather] = useState({
    temperature: 18,
    condition: 'Partly Cloudy',
    forecast: [
      { day: 'Today', high: 18, low: 12, icon: '⛅' },
      { day: 'Sat', high: 16, low: 11, icon: '🌦️' },
      { day: 'Sun', high: 14, low: 9, icon: '☁️' },
    ]
  });

  // Daily schedule
  const schedule = {
    saturday: [
      { time: '07:00', activity: 'Morning Devotion', location: 'Base', emoji: '📖' },
      { time: '08:00', activity: 'Breakfast', location: 'Base', emoji: '🍳' },
      { time: '09:00', activity: 'Aira Force & Gowbarrow Fell Hike', location: 'Aira Force', emoji: '🏔️' },
      { time: '14:00', activity: 'Return & Rest', location: 'Base', emoji: '😌' },
      { time: '16:00', activity: 'Optional: Ullswater Steamer', location: 'Ullswater', emoji: '⛴️' },
      { time: '18:00', activity: 'Dinner', location: 'Base', emoji: '🍽️' },
      { time: '19:30', activity: 'Evening Worship & Discussion', location: 'Base', emoji: '🙏' },
      { time: '21:00', activity: 'Free Time / Fellowship', location: 'Base', emoji: '☕' }
    ]
  };

  // Devotional content
  const devotionals = {
    saturday: {
      title: 'Biblical Manhood: Living Under Christ\'s Lordship',
      scripture: '1 Corinthians 16:13-14',
      quote: '"Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love."',
    }
  };

  // Effects
  useEffect(() => {
    localStorage.setItem('retreatCurrentUser', JSON.stringify(currentUser));
    const savedPhotos = localStorage.getItem('retreatCommunityPhotos');
    if (savedPhotos) setPhotos(JSON.parse(savedPhotos));
    
    const savedPrayers = localStorage.getItem('retreatCommunityPrayers');
    if (savedPrayers) setPrayerRequests(JSON.parse(savedPrayers));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('retreatCommunityPrayers', JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny') || condition.includes('Clear')) return <Sun className="w-6 h-6 text-amber-400" />;
    if (condition.includes('Rain')) return <CloudRain className="w-6 h-6 text-blue-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          id: Date.now(),
          src: reader.result,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          timestamp: new Date().toISOString(),
          likes: 0
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPrayerRequest = () => {
    if (!prayerText.trim()) return;
    
    const newRequest = {
      id: Date.now(),
      text: prayerText,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      timestamp: new Date().toISOString(),
      prayers: 0
    };
    
    setPrayerRequests(prev => [newRequest, ...prev]);
    setPrayerText('');
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const currentSchedule = { day: 'Saturday', schedule: schedule.saturday, devotional: devotionals.saturday };
  const latestPhoto = photos[0];
  const latestPrayer = prayerRequests[0];
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div className="px-4 py-6">
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

            <div className="space-y-4">
              {currentSchedule.schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 rounded-2xl p-4 border-l-4 border-emerald-500 hover:border-emerald-400 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                      {item.emoji}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-emerald-400">
                          {item.time}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                      
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-slate-800/50 rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Friday', 'Saturday', 'Sunday', 'Monday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => addNotification(`Switched to ${day}'s schedule`)}
                    className={`rounded-xl p-4 text-center transition-all ${
                      day === 'Saturday'
                        ? 'bg-emerald-600'
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-bold">{day}</div>
                    <div className="text-sm opacity-80">
                      {day === 'Friday' ? '21 Aug' : 
                       day === 'Saturday' ? '22 Aug' :
                       day === 'Sunday' ? '23 Aug' : '24 Aug'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Location</h2>
              <p className="text-blue-100">Bury Jubilee Outdoor Pursuits Centre</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6 text-center">
              <Navigation className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
              <h3 className="text-xl font-bold mb-2">Lake District Map</h3>
              <p className="text-slate-400">Interactive map coming soon</p>
            </div>
          </div>
        );

      case 'devotional':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Daily Devotional</h2>
              <p className="text-purple-100">{currentSchedule.day}'s Word</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <Book className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">{currentSchedule.devotional.title}</h3>
              <p className="text-purple-300 mb-4">{currentSchedule.devotional.scripture}</p>
              <div className="bg-purple-900/30 rounded-xl p-4 mb-4">
                <p className="italic">{currentSchedule.devotional.quote}</p>
              </div>
            </div>
          </div>
        );

      case 'photos':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Community Photos</h2>
              <p className="text-pink-100">{photos.length} photos shared</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 border-2 border-dashed border-slate-600 text-center mb-6">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Camera className="w-12 h-12 mx-auto mb-3 text-pink-400" />
                <p className="font-medium">Upload Photo</p>
                <p className="text-slate-400 text-sm mt-1">Tap to select from your device</p>
              </label>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-slate-800/50 rounded-xl overflow-hidden">
                    <img 
                      src={photo.src} 
                      alt="Retreat" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full ${photo.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                          <span className="text-xs">{photo.userAvatar}</span>
                        </div>
                        <span className="text-sm font-medium">{photo.userName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No photos yet</p>
                <p className="text-sm text-slate-500 mt-2">Be the first to share!</p>
              </div>
            )}
          </div>
        );

      case 'prayer':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Prayer Wall</h2>
              <p className="text-amber-100">{prayerRequests.length} prayer requests</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Share a Prayer Request</h3>
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Share what's on your heart..."
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 mb-4"
              />
              <button
                onClick={addPrayerRequest}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 py-3 rounded-lg font-semibold"
              >
                Share Prayer
              </button>
            </div>

            {prayerRequests.length > 0 ? (
              <div className="space-y-4">
                {prayerRequests.map(request => (
                  <div key={request.id} className="bg-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${request.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-lg">{request.userAvatar}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{request.userName}</h3>
                        <p className="text-xs text-slate-400">
                          {new Date(request.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-300 mb-4">{request.text}</p>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => {
                          setPrayerRequests(prev => 
                            prev.map(p => p.id === request.id 
                              ? { ...p, prayers: p.prayers + 1 } 
                              : p
                            )
                          );
                          addNotification(`Prayed for ${request.userName}'s request`);
                        }}
                        className="flex items-center gap-2 text-amber-400"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{request.prayers} prayers</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No prayer requests yet</p>
              </div>
            )}
          </div>
        );

      case 'testimonials':
        return (
          <div className="px-4 py-6">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-bold">Testimonies</h2>
              <p className="text-teal-100">Share how God is working</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-teal-400" />
              <p className="text-slate-400">Share your testimony to encourage others</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Greenwich SDA</h1>
            <p className="text-emerald-100 text-sm">Men's Retreat 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              {getWeatherIcon(weather.condition)}
              <span className="text-xl font-bold">{weather.temperature}°</span>
            </div>
            <button
              onClick={() => setShowUserModal(true)}
              className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center"
            >
              <span className="text-lg">{currentUser.avatar}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Bury Jubilee Centre</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
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

      {/* Community Preview (only on schedule tab) */}
      {activeTab === 'schedule' && (latestPhoto || latestPrayer) && (
        <div className="px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Community Activity</h2>
              <button 
                onClick={() => setActiveTab(photos.length ? 'photos' : 'prayer')}
                className="text-emerald-400 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="flex overflow-x-auto gap-3 pb-2">
              {latestPhoto && (
                <div 
                  onClick={() => setActiveTab('photos')}
                  className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Camera className="w-5 h-5 text-pink-400" />
                    <span className="font-medium">Latest Photo</span>
                  </div>
                  <div className="aspect-video bg-slate-700/50 rounded-lg mb-3 overflow-hidden">
                    <img src={latestPhoto.src} alt="Latest" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${latestPhoto.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-xs">{latestPhoto.userAvatar}</span>
                      </div>
                      <span className="text-sm">{latestPhoto.userName}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {latestPrayer && (
                <div 
                  onClick={() => setActiveTab('prayer')}
                  className="flex-shrink-0 w-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Heart className="w-5 h-5 text-amber-400" />
                    <span className="font-medium">Prayer Request</span>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 mb-3">{latestPrayer.text}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full ${latestPrayer.bg || 'bg-emerald-500'} flex items-center justify-center`}>
                        <span className="text-xs">{latestPrayer.userAvatar}</span>
                      </div>
                      <span className="text-sm">{latestPrayer.userName}</span>
                    </div>
                    <span className="text-xs text-slate-400">{latestPrayer.prayers} prayers</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 z-40">
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
              className={`flex flex-col items-center justify-center w-16 active:scale-95 transition-transform ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-slate-400'
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
        <div className="fixed inset-0 bg-black/70 flex justify-end z-50">
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

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
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
                  className="w-full bg-slate-700 rounded-lg px-4 py-3"
                  placeholder="Enter your name"
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
    </div>
  );
}
