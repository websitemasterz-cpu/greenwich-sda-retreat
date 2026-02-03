// src/components/LocationsTab.jsx
import React from 'react';
import { Home, Navigation, MapPin, Ruler, Clock as TimeIcon } from 'lucide-react';
import EnhancedWeather from './EnhancedWeather';
import CheckInComponent from './SharedComponents';
import { EmergencyFeatures } from './SharedComponents';

export default function LocationsTab({
  baseLocation,
  locations,
  attractions,
  checkedInAttractions,
  checkIntoAttraction,
  progressMetrics,
  liveWeather,
  weatherLoading,
  isRefreshing,
  fetchLiveWeather
}) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Locations & Attractions</h2>
        <p className="text-blue-100">Explore the Lake District's beauty and key locations</p>
      </div>

      {/* Base Location */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Base Location</h3>
        <div className="space-y-4">
          <div className="bg-emerald-900/30 p-4 rounded-lg">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              <Home className="w-5 h-5" />
              {baseLocation.name}
            </h4>
            <p className="text-slate-300 mb-3">{baseLocation.address}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 mb-1">Latitude</div>
                <div className="font-mono">54.5262° N</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Longitude</div>
                <div className="font-mono">2.9620° W</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(baseLocation.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <h4 className="font-semibold">Get Directions</h4>
              </div>
              <p className="text-sm text-slate-400">Open in Google Maps</p>
            </a>
            
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold">Coordinates</h4>
              </div>
              <p className="text-sm text-slate-400">GPS: 54.5262, -2.9620</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hiking Locations */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Key Hiking Locations</h3>
        <div className="space-y-4">
          {Object.entries(locations).map(([key, location]) => (
            <div key={key} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{location.icon}</span>
                <div>
                  <h4 className="font-semibold">{location.name}</h4>
                  <div className="text-xs text-slate-400">{location.difficulty}</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3">{location.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                  Distance: <span className="text-blue-400">{location.distanceFromBase} miles</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.name)}+Lake+District`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  Navigate
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attractions */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Local Attractions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attractions.map(attraction => (
            <div key={attraction.id} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{attraction.icon}</span>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-2">{attraction.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {attraction.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <TimeIcon className="w-3 h-3" />
                      {attraction.duration}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">{attraction.description}</p>
              
              <button
                onClick={() => checkIntoAttraction(attraction.id)}
                disabled={checkedInAttractions[attraction.id]}
                className={`w-full px-4 py-2 rounded-lg font-medium ${
                  checkedInAttractions[attraction.id]
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {checkedInAttractions[attraction.id] ? 'Checked In ✓' : 'Check In'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <CheckInComponent
        attractions={attractions}
        checkedInAttractions={checkedInAttractions}
        checkIntoAttraction={checkIntoAttraction}
        progressMetrics={progressMetrics}
      />
      
      <EnhancedWeather 
        liveWeather={liveWeather}
        weatherLoading={weatherLoading}
        isRefreshing={isRefreshing}
        fetchLiveWeather={fetchLiveWeather}
      />
      
      <EmergencyFeatures />
    </div>
  );
}

// src/components/KitchenTab.jsx - TRUNCATED FOR SPACE
export function KitchenTab({ currentDay, setCurrentDay, kitchenData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Kitchen & Dining</h2>
        <p className="text-orange-100">Meal schedules and kitchen duties</p>
      </div>
      {/* Kitchen content */}
    </div>
  );
}

// src/components/DevotionalTab.jsx - TRUNCATED FOR SPACE
export function DevotionalTab({ devotionals }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Daily Devotionals</h2>
        <p className="text-purple-100">Spiritual nourishment for the retreat</p>
      </div>
      {/* Devotional content */}
    </div>
  );
}

// src/components/PhotosTab.jsx
export function PhotosTab({ photos, handlePhotoUpload, likePhoto, userName }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Photo Gallery</h2>
        <p className="text-pink-100">Share and view retreat memories</p>
      </div>
      {/* Photos content */}
    </div>
  );
}

// src/components/PrayerTab.jsx
export function PrayerTab({ prayerRequests, prayerText, setPrayerText, addPrayerRequest, incrementPrayerCount, userName }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Prayer Requests</h2>
        <p className="text-teal-100">Share and pray for one another</p>
      </div>
      {/* Prayer content */}
    </div>
  );
}

// src/components/TestimonialsTab.jsx
export function TestimonialsTab({ testimonials, testimonialText, setTestimonialText, addTestimonial, likeTestimonial, userName }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Shared Stories</h2>
        <p className="text-amber-100">Testimonies from the retreat</p>
      </div>
      {/* Testimonials content */}
    </div>
  );
}

// src/components/TrailsTab.jsx
export function TrailsTab({ nearbyTrails, trailsLoading, trailsError, currentLocation, addNotification }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Trail Finder</h2>
        <p className="text-green-100">Discover hiking trails</p>
      </div>
      {/* Trails content */}
    </div>
  );
}
