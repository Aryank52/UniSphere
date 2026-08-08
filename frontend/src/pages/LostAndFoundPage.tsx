import React, { useState } from 'react'
import { Search, MapPin, Plus, CheckCircle2, HelpCircle } from 'lucide-react'
import { Dialog } from '../components/ui/Dialog'

interface LostItem {
  id: number
  title: string
  locationFound: string
  dateFound: string
  category: 'ID_CARD' | 'ELECTRONICS' | 'LAB_EQUIPMENT' | 'PERSONAL_BELONGINGS'
  image: string
  finderName: string
  status: 'UNCLAIMED' | 'CLAIM_PENDING' | 'RECOVERED'
  description: string
}

export const LostAndFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [reportOpen, setReportOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null)
  const [claimSubmitted, setClaimSubmitted] = useState(false)

  // Report form states
  const [newTitle, setNewTitle] = useState('')
  const [newLoc, setNewLoc] = useState('Bidholi Campus - Energy Acres Quad')
  const [newDesc, setNewDesc] = useState('')

  const items: LostItem[] = [
    {
      id: 1,
      title: 'UPES Student ID Card (Kartik - SAP ID 5000948)',
      locationFound: 'Bidholi Library (2nd Floor Quiet Zone)',
      dateFound: 'June 8, 2026',
      category: 'ID_CARD',
      image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=600',
      finderName: 'Security Desk (Bidholi Main Gate)',
      status: 'UNCLAIMED',
      description: 'Found on table near reference books section. Handed over to library reception.'
    },
    {
      id: 2,
      title: 'Apple iPad Air (Space Gray) with Apple Pencil',
      locationFound: 'CS Block A Auditorium (Room 101)',
      dateFound: 'June 7, 2026',
      category: 'ELECTRONICS',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600',
      finderName: 'Ayush (Year 3 CS)',
      status: 'UNCLAIMED',
      description: 'Left behind after AI Symposium lecture. Display is locked with passcode.'
    },
    {
      id: 3,
      title: 'Multimeter & Digital Oscilloscope Probe Kit',
      locationFound: 'Kandoli Electrical Engineering Lab 3',
      dateFound: 'June 6, 2026',
      category: 'LAB_EQUIPMENT',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
      finderName: 'Lab Assistant Mr. Rawat',
      status: 'UNCLAIMED',
      description: 'Black zip pouch containing digital multimeter probes and soldering wick.'
    },
    {
      id: 4,
      title: 'Black HP Laptop Charger (65W USB-C)',
      locationFound: 'Bidholi Food Court (Nescafé Booth)',
      dateFound: 'June 5, 2026',
      category: 'ELECTRONICS',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
      finderName: 'Aryan (Year 2 Data Sci)',
      status: 'UNCLAIMED',
      description: 'Found plugged into power socket near Nescafé outdoor seating.'
    }
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationFound.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-800/80 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>UPES Official Campus Lost & Found</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Campus Lost & Found Recovery Hub
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Report items found across Bidholi & Kandoli campuses, search lost student IDs, devices, and submit verified ownership claims.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="lost-search"
            placeholder="Search Student ID, iPad, Charger, Keys, Lab gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-rose-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          <button
            onClick={() => setReportOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition cursor-pointer shrink-0 shadow-md flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Report Found Item</span>
          </button>

          {['ALL', 'ID_CARD', 'ELECTRONICS', 'LAB_EQUIPMENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 hover:border-rose-300 rounded-3xl overflow-hidden shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-rose-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                {item.status}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">{item.locationFound}</span>
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1.5 line-clamp-2">{item.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-slate-400 block">Found By</span>
                  <span className="text-[11px] font-bold text-slate-700 truncate block max-w-[120px]">{item.finderName}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(item)
                    setClaimSubmitted(false)
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Claim Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Item Modal */}
      <Dialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Submit Item Ownership Claim"
      >
        {selectedItem && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs">
            <div className="flex items-center space-x-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-900">{selectedItem.title}</h4>
                <p className="text-xs text-rose-600 font-extrabold">{selectedItem.locationFound}</p>
              </div>
            </div>

            {!claimSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setClaimSubmitted(true)
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ownership Verification Details (e.g. Serial #, SAP ID, Lock screen wallpaper)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide specific identifying details to verify your ownership..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Submit Claim Verification
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Claim request submitted! Verification code sent to UPES Security Desk. Present your Student SAP ID at Bidholi Main Gate to collect your item.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>

      {/* Report Item Modal */}
      <Dialog
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report Found Campus Item"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            alert('Item report registered! Listed on campus Lost & Found board.')
            setReportOpen(false)
            setNewTitle('')
            setNewDesc('')
          }}
          className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs"
        >
          <div>
            <label className="font-bold text-slate-700 block mb-1">Item Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Blue Water Bottle, Calculator, Student ID"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Location Found</label>
            <input
              type="text"
              required
              value={newLoc}
              onChange={(e) => setNewLoc(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Description / Condition</label>
            <textarea
              rows={3}
              required
              placeholder="Where was it left? Handed over to security desk?"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
          >
            Post to Campus Board
          </button>
        </form>
      </Dialog>
    </div>
  )
}
