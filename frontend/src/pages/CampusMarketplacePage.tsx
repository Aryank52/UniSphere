import React, { useState } from 'react'
import { ShoppingBag, Search, CheckCircle2 } from 'lucide-react'
import { Dialog } from '../components/ui/Dialog'

interface ListingItem {
  id: number
  title: string
  category: 'TEXTBOOK' | 'EQUIPMENT' | 'ELECTRONICS' | 'LAB_GEAR'
  price: string
  seller: string
  campus: string
  image: string
  condition: string
  description: string
}

export const CampusMarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null)
  const [requestSubmitted, setRequestSubmitted] = useState(false)

  const items: ListingItem[] = [
    {
      id: 1,
      title: 'Arduino Uno R3 Starter Development Kit',
      category: 'ELECTRONICS',
      price: '₹ 850 (or Free Lab Loan)',
      seller: 'Kartik (Year 4 CS)',
      campus: 'Bidholi Campus',
      image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600',
      condition: 'Like New (Includes Sensors)',
      description: 'Complete Arduino kit with breadboard, ultrasonic sensors, jumper wires, and LCD screen. Ideal for IoT lab projects.'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms in Java (4th Ed)',
      category: 'TEXTBOOK',
      price: '₹ 400',
      seller: 'Aryan (Year 3 CS)',
      campus: 'Bidholi Campus',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      condition: 'Good (No Highlights)',
      description: 'Standard prescribed reference textbook for Dr. Khushboo Jain’s Data Structures course.'
    },
    {
      id: 3,
      title: 'Raspberry Pi 4 Model B (4GB RAM)',
      category: 'ELECTRONICS',
      price: '₹ 2,200',
      seller: 'Vansh (Year 3 Cyber)',
      campus: 'Kandoli Campus',
      image: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?w=600',
      condition: 'Excellent',
      description: 'Used for 1 semester in Edge Computing lab. Comes with official case and 32GB SD card.'
    },
    {
      id: 4,
      title: 'Official UPES Blue Lab Coat (Size L)',
      category: 'LAB_GEAR',
      price: '₹ 250',
      seller: 'Shaurya (Year 2 Data Sci)',
      campus: 'Bidholi Campus',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
      condition: 'Washed & Clean',
      description: 'Required lab coat for physics and chemistry lab practicals. Clean condition.'
    }
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans select-none pb-20 text-slate-800">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 border border-emerald-800 rounded-3xl p-6 md:p-10 shadow-2xl text-white relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>UPES Verified Campus Marketplace</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Peer-to-Peer Lab Equipment & Textbook Exchange
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Buy, sell, or borrow lab coats, Arduino kits, Raspberry Pi boards, and reference books verified by UPES student credentials (`@upes.ac.in`).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input
            id="marketplace-search"
            placeholder="Search Arduino, Raspberry Pi, Lab coat, Books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs font-bold">
          {['ALL', 'ELECTRONICS', 'TEXTBOOK', 'LAB_GEAR'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-md'
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
            className="bg-white border border-slate-200 hover:border-emerald-300 rounded-3xl overflow-hidden shadow-travel transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                {item.price}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  {item.category} • {item.campus}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-2">{item.title}</h3>
                <p className="text-[10px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-black text-slate-400 block">Seller</span>
                  <span className="text-xs font-bold text-slate-700">{item.seller}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(item)
                    setRequestSubmitted(false)
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Contact / Borrow
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Borrow/Buy Modal */}
      <Dialog
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Campus Marketplace Request"
      >
        {selectedItem && (
          <div className="space-y-4 text-left bg-white p-2 rounded-2xl text-xs">
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-900">{selectedItem.title}</h4>
                <p className="text-xs text-emerald-600 font-extrabold">{selectedItem.price}</p>
              </div>
            </div>

            {!requestSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setRequestSubmitted(true)
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Message to Seller ({selectedItem.seller})</label>
                  <textarea
                    rows={3}
                    required
                    defaultValue={`Hi ${selectedItem.seller.split(' ')[0]}, I'm interested in borrowing/buying your ${selectedItem.title}. Can we meet near Energy Acres Quad?`}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Send Peer Request
                </button>
              </form>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Trade request sent to {selectedItem.seller}! You can chat directly via UniSphere campus messages.</span>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}
