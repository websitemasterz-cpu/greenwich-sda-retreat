// src/components/ScheduleTab.jsx
import React from 'react';
import { MapPin, ArrowRight, Zap } from 'lucide-react';
import EnhancedWeather from './EnhancedWeather';
import CheckInComponent from './CheckInComponent';
import EmergencyFeatures from './EmergencyFeatures';
import ProgressTracker from './ProgressTracker';
import QuickActions from './QuickActions';

export default function ScheduleTab({
  currentSchedule,
  currentHour,
  currentDay,
  setCurrentDay,
  devotionals,
  liveWeather,
  weatherLoading,
  isRefreshing,
  fetchLiveWeather,
  attractions,
  checkedInAttractions,
  checkIntoAttraction,
  progressMetrics,
  hikedTrails,
  photos,
  prayerRequests,
  userName,
  streakDays,
  setStreakDays,
  currentUser,
  setCurrentUser,
  addNotification
}) {
  const openDevotionalDetails = (day) => {
    const devotional = devotionals[day];
    const modalContent = `
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full border border-purple-700/50 max-h-[80vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">${devotional.title}</h2>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" class="text-slate-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="bg-purple-900/30 p-4 rounded-lg">
              <h3 class="font-semibold mb-2">Scripture</h3>
              <p class="text-purple-300">${devotional.scripture}</p>
            </div>
            
            <div class="bg-white/5 p-4 rounded-lg italic">
              "${devotional.quote}"
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">Full Reflection</h3>
              <p class="text-slate-300 leading-relaxed">${devotional.content}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalContent;
    document.body.appendChild(modalDiv.firstElementChild);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">{currentSchedule.day}'s Schedule</h2>
        <p className="text-blue-100">21-24 August 2026</p>
      </div>

      {/* Quick Day Selector */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">View Other Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Friday', key: 'friday' },
            { name: 'Saturday', key: 'saturday' },
            { name: 'Sunday', key: 'sunday' },
            { name: 'Monday', key: 'monday' }
          ].map(({ name, key }) => (
            <button
              key={key}
              onClick={() => setCurrentDay(key)}
              className={`transition-all rounded-lg py-3 px-4 font-medium ${
                currentDay === key ? 'bg-emerald-600' : 'bg-slate-700/50 hover:bg-emerald-600'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Activities */}
      <div className="bg-slate-800/70 backdrop-blur rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold mb-4">Today's Activities</h3>
        <div className="space-y-3">
          {currentSchedule.schedule.map((item, index) => {
            const itemTime = parseFloat(item.time.replace(':', '.'));
            const isPast = itemTime < currentHour;
            const isCurrent = itemTime <= currentHour && currentHour < itemTime + 0.5;
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg transition-all ${
                  isCurrent 
                    ? 'bg-emerald-900/30 border-l-4 border-emerald-400' 
                    : isPast 
                      ? 'bg-slate-700/30' 
                      : 'bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{item.time}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {isCurrent ? 'NOW' : isPast ? 'Done' : 'Upcoming'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{item.emoji}</span>
                      <h4 className="font-semibold">{item.activity}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location === 'base' ? 'Bury Jubilee Centre' : item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Devotional Section */}
      <div className="bg-gradient-to-r from-purple-800/40 to-indigo-800/40 rounded-2xl p-6 border border-purple-700/30">
        <h3 className="text-lg font-semibold mb-4">Today's Devotional</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold mb-2">{currentSchedule.devotional.title}</h4>
            <p className="text-sm text-purple-300">{currentSchedule.devotional.scripture}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg italic">
            "{currentSchedule.devotional.quote}"
          </div>
          <div className="text-slate-300">
            <p className="mb-2">Reflection:</p>
            <p>{currentSchedule.devotional.reflection}</p>
          </div>
          <button
            onClick={() => openDevotionalDetails(currentDay)}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
          >
            Read Full Devotional
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Enhanced Features */}
      <EnhancedWeather 
        liveWeather={liveWeather}
        weatherLoading={weatherLoading}
        isRefreshing={isRefreshing}
        fetchLiveWeather={fetchLiveWeather}
      />
      
      <CheckInComponent
        attractions={attractions}
        checkedInAttractions={checkedInAttractions}
        checkIntoAttraction={checkIntoAttraction}
        progressMetrics={progressMetrics}
      />
      
      <EmergencyFeatures />
      
      <ProgressTracker
        hikedTrails={hikedTrails}
        progressMetrics={progressMetrics}
        photos={photos}
        prayerRequests={prayerRequests}
        checkedInAttractions={checkedInAttractions}
        userName={userName}
        streakDays={streakDays}
      />
      
      <QuickActions
        addNotification={addNotification}
        setStreakDays={setStreakDays}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
    </div>
  );
}
