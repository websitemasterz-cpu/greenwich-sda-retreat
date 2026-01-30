'use client'

import { useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('schedule')
  const [prayerRequests, setPrayerRequests] = useState<any[]>([])

  const addPrayerRequest = (text: string) => {
    if (!text.trim()) return
    setPrayerRequests([
      ...prayerRequests,
      { id: Date.now(), text, prayers: 0 }
    ])
  }

  const updatePrayers = (id: number) => {
    setPrayerRequests(
      prayerRequests.map(req =>
        req.id === id ? { ...req, prayers: req.prayers + 1 } : req
      )
    )
  }

  const devotionalQuotes = [
    { quote: 'Be still and know that I am God.', author: 'Psalm 46:10' },
    { quote: 'I can do all things through Christ.', author: 'Phil 4:13' },
    { quote: 'The mountains are calling and I must go.', author: 'John Muir' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 shadow-xl p-6">
        <h1 className="text-3xl font-bold">Greenwich SDA Retreat</h1>
      </div>

      {/* NAV */}
      <div className="flex gap-3 p-4 flex-wrap">
        {['schedule','location','devotional','photos','prayer','testimonials','attractions']
          .map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 bg-slate-700 rounded-lg"
            >
              {tab}
            </button>
          ))}
      </div>

      <div className="p-6 space-y-6">

        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold">Schedule</h2>
            <p>Details coming soon...</p>
          </div>
        )}

        {/* LOCATION */}
        {activeTab === 'location' && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold">Location</h2>
            <p>Retreat venue info...</p>
          </div>
        )}

        {/* DEVOTIONAL */}
        {activeTab === 'devotional' && (
          <div className="space-y-4">
            {devotionalQuotes.map((item, idx) => (
              <div key={idx} className="bg-slate-800 p-6 rounded-xl">
                <p className="italic">"{item.quote}"</p>
                <p className="text-sm mt-2 text-emerald-400">{item.author}</p>
              </div>
            ))}
          </div>
        )}

        {/* PHOTOS */}
        {activeTab === 'photos' && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold">Photos</h2>
            <p>Gallery coming soon...</p>
          </div>
        )}

        {/* PRAYER */}
        {activeTab === 'prayer' && (
          <div className="space-y-6">
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
                <div key={req.id} className="bg-slate-800 p-4 rounded-xl">
                  <p>{req.text}</p>
                  <button
                    onClick={() => updatePrayers(req.id)}
                    className="text-emerald-400 mt-2"
                  >
                    🙏 Pray ({req.prayers})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold">Testimonials</h2>
            <p>Stories coming soon...</p>
          </div>
        )}

        {/* ATTRACTIONS */}
        {activeTab === 'attractions' && (
          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-2xl font-bold">Local Attractions</h2>
            <p>Explore nearby places...</p>
          </div>
        )}

      </div>
    </div>
  )
}
