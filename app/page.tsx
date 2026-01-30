'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Camera, Heart, Book, Users, Mountain, MessageCircle, Upload, Navigation, Clock, Cloud } from 'lucide-react'

interface Location {
  lat: number
  lng: number
  name: string
}

interface ScheduleItem {
  time: string
  activity: string
  location: string
  emoji: string
}

interface Devotional {
  title: string
  scripture: string
  quote: string
  reflection: string
}

interface Photo {
  id: number
  src: string
  caption: string
  timestamp: Date
  comments: string[]
}

interface PrayerRequest {
  id: number
  text: string
  author: string
  timestamp: Date
  prayers: number
}

interface Testimonial {
  id: number
  text: string
  author: string
  timestamp: Date
}

interface Attraction {
  name: string
  distance: string
  description: string
  duration: string
  difficulty: string
}

export default function GreenwichSDARetreatApp() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [photos, setPhotos] = useState<Photo[]>([])
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const baseLocation: Location = {
    lat: 54.5262,
    lng: -2.9620,
    name: 'Bury Jubilee Outdoor Pursuits Centre'
  }

  const locations: Record<string, Location> = {
    base: { lat: 54.5262, lng: -2.9620, name: 'Bury Jubilee Centre, Glenridding' },
    glenriddingDodd: { lat: 54.5350, lng: -2.9500, name: 'Glenridding Dodd' },
    airaForce: { lat: 54.5733, lng: -2.9067, name: 'Aira Force Waterfall' },
    helvellyn: { lat: 54.5275, lng: -3.0164, name: 'Helvellyn Summit' },
    ullswater: { lat: 54.5500, lng: -2.9300, name: 'Ullswater Lake' }
  }

  const schedule: Record<string, ScheduleItem[]> = {
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
  }

  const devotionals: Record<string, Devotional> = {
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
  }

  const attractions: Attraction[] = [
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
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Location'
          })
        },
        (error) => console.log('Location access denied')
      )
    }

    return () => clearInterval(timer)
  }, [])

  const getDaySchedule = () => {
    const day = currentTime.getDay()
    if (day === 5) return { day: 'Friday', schedule: schedule.friday, devotional: devotionals.friday }
    if (day === 6) return { day: 'Saturday', schedule: schedule.saturday, devotional: devotionals.saturday }
    if (day === 0) return { day: 'Sunday', schedule: schedule.sunday, devotional: devotionals.sunday }
    if (day === 1) return { day: 'Monday', schedule: schedule.monday, devotional: devotionals.monday }
    return { day: 'Friday', schedule: schedule.friday, devotional: devotionals.friday }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return (R * c).toFixed(1)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos([...photos, {
          id: Date.now(),
          src: reader.result as string,
          caption: '',
          timestamp: new Date(),
          comments: []
        }])
      }
      reader.readAsDataURL(file)
    }
  }

  const addPrayerRequest = (text: string) => {
    if (!text.trim()) return
    setPrayerRequests([...prayerRequests, {
      id: Date.now(),
      text,
      author: 'Anonymous',
      timestamp: new Date(),
      prayers: 0
    }])
  }

  const addTestimonial = (text: string) => {
    if (!text.trim()) return
    setTestimonials([...testimonials, {
      id: Date.now(),
      text,
      author: 'Brother in Christ',
      timestamp: new Date()
    }])
  }

  const updatePrayers = (id: number) => {
    setPrayerRequests(prayerRequests.map(r =>
      r.id === id ? { ...r, prayers: r.prayers + 1 } : r
    ))
  }

  const currentSchedule = getDaySchedule()
  const currentHour = currentTime.getHours() + (currentTime.getMinutes() / 60)

  const tabs = [
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'location', icon: Navigation, label: 'Location' },
    { id: 'devotional', icon: Book, label: 'Devotional' },
    { id: 'photos', icon: Camera, label: 'Photos' },
    { id: 'prayer', icon: Heart, label: 'Prayer' },
    { id: 'testimonials', icon: MessageCircle, label: 'Testimonials' },
    { id: 'attractions', icon: Mountain, label: 'Attractions' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Greenwich SDA</h1>
              <p className="text-emerald-200 text-sm mt-1">Men&apos;s Ministry - Lake District Retreat 2026</p>
            </div>
            <Mountain className="w-12 h-12 text-emerald-200" />
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2 bg-emerald-900/40 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>Bury Jubilee Centre, Glenridding</span>
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
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
        
        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">{currentSchedule.day}&apos;s Schedule</h2>
              <p className="text-blue-100">21-24 August 2026</p>
            </div>

            <div className="space-y-4">
              {currentSchedule.schedule.map((item, idx) => {
                const itemHour = parseInt(item.time.split(':')[0]) + (parseInt(item.time.split(':')[1]) / 60)
                const nextItemTime = idx < currentSchedule.schedule.length - 1 
                  ? parseInt(currentSchedule.schedule[idx + 1].time.split(':')[0])
                  : 24
                const isCurrent = currentHour >= itemHour && currentHour < nextItemTime
                
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
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-emerald-400 font-bold text-lg">{item.time}</span>
                          {isCurrent && (
                            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{item.activity}</h3>
                        {item.location !== 'London' && locations[item.location] && (
                          <div className="flex items-center gap-2 text-slate-400 text-sm flex-wrap">
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
                )
              })}
            </div>

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
                    onClick={() => setCurrentTime(date)}
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

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Location Tracking</h2>
              <p className="text-blue-100">Real-time position and navigation</p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl border border-slate-700 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-teal-900/30 to-blue-900/30 flex items-center justify-center relative">
                <div className="text-center z-10">
                  <Navigation className="w-16 h-16 mx-auto mb-4 text-emerald-400 animate-pulse" />
                  <p className="text-lg font-semibold mb-2">Interactive Map</p>
                  <p className="text-slate-400 max-w-md px-4">
                    Map functionality would integrate with a mapping service like Google Maps or Mapbox
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Your Current Position
              </h3>
              {currentLocation ? (
                <div className="space-y-3">
                  <p className="text-slate-300">
                    Latitude: {currentLocation.lat.toFixed(4)}°, Longitude: {currentLocation.lng.toFixed(4)}°
                  </p>
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
                <p className="text-slate-400">Enable location services to track your position</p>
              )}
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Key Locations</h3>
              <div className="space-y-3">
                {Object.entries(locations).map(([key, loc]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-medium">{loc.name}</p>
                      <p className="text-xs text-slate-400">
                        {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                      </p>
                    </div>
                    {currentLocation && (
                      <span className="text-emerald-400 text-sm">
                        {calculateDistance(currentLocation.lat, currentLocation.lng, loc.lat, loc.lng)} km
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Devotional Tab */}
        {activeTab === 'devotional' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Word for Today</h2>
              <p className="text-purple-100">Daily spiritual nourishment</p>
            </div>

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
                    <p className="italic text-slate-200">&quot;{item.quote}&quot;</p>
                    <p className="text-sm text-purple-300 mt-2">— {item.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Retreat Photos</h2>
              <p className="text-pink-100">Capture and share memories</p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border-2 border-dashed border-slate-600 text-center">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <p className="text-lg font-semibold mb-2">Upload a Photo</p>
                <p className="text-slate-400 text-sm">Click to select a photo from your device</p>
              </label>
            </div>

            {photos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <div key={photo.id} className="bg-slate-800/70 backdrop-blur rounded-xl overflow-hidden border border-slate-700">
                    <img src={photo.src} alt="Retreat" className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <p className="text-sm text-slate-400">
                        {photo.timestamp.toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800/70 backdrop-blur rounded-xl p-12 border border-slate-700 text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No photos uploaded yet. Start capturing memories!</p>
              </div>
            )}
          </div>
        )}

        {/* Prayer Tab */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Prayer Requests</h2>
              <p className="text-amber-100">Lift each other up in prayer</p>
            </div>

            <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">Submit a Prayer Request</h3>
              <textarea
                id="prayer-textarea"
                placeholder="Share what's on your heart..."
                className="w-full bg-slate-700/50 rounded-lg px-4 py-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
              />
              <button
                onClick={() => {
                  const textarea
                                    { quote: 'The mountains are calling and I must go.', author: 'John Muir' },
                  { quote: 'In every walk with nature, one receives far more than he seeks.', author: 'John Muir' },
                  { quote: 'Faith is taking the first step even when you don\'t see the whole staircase.', author: 'Martin Luther King Jr.' },
                  { quote: 'Be strong and courageous. Do not be afraid; do not be discouraged.', author: 'Joshua 1:9' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded-lg p-4 border-l-2 border-purple-400">
                    <p className="italic text-slate-200">&quot;{item.quote}&quot;</p>
                    <p className="text-sm text-purple-300 mt-2">— {item.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Retreat Photos</h2>
              <p className="text-pink-100">Capture and share memories</p>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-6 border-2 border-dashed border-slate-600 text-center">
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <Upload className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <p className="font-semibold">Upload Photo</p>
              </label>
            </div>

            {photos.length === 0 ? (
              <div className="bg-slate-800/70 rounded-xl p-10 border border-slate-700 text-center text-slate-400">
                No photos yet
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                    <img src={photo.src} className="w-full h-56 object-cover" />
                    <div className="p-4 text-sm text-slate-400">
                      {photo.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Prayer Tab */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Prayer Requests</h2>
            </div>

            <textarea
              placeholder="Enter prayer request..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addPrayerRequest((e.target as HTMLTextAreaElement).value)
                  ;(e.target as HTMLTextAreaElement).value = ''
                }
              }}
            />

            <div className="space-y-3">
              {prayerRequests.map(req => (
                <div key={req.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <p>{req.text}</p>
                  <button
                    onClick={() => updatePrayers(req.id)}
                    className="mt-2 text-emerald-400 text-sm"
                  >
                    🙏 Pray ({req.prayers})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold">Testimonials</h2>
            </div>

            <textarea
              placeholder="Share a testimony..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTestimonial((e.target as HTMLTextAreaElement).value)
                  ;(e.target as HTMLTextAreaElement).value = ''
                }
              }}
            />

            {testimonials.map(t => (
              <div key={t.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <p>{t.text}</p>
                <p className="text-sm text-slate-400 mt-2">{t.timestamp.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Attractions Tab */}
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold">Nearby Attractions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {attractions.map((a, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-lg font-semibold">{a.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{a.description}</p>
                  <div className="text-sm text-emerald-400 mt-2">
                    {a.distance} • {a.duration} • {a.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
