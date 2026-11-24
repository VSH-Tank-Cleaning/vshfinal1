'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, MessageCircle, Minus, Plus, Sparkles } from 'lucide-react'
import { useCart } from './tank-cart'
import { isListedServiceArea, isSupportedPincode } from '@/lib/service-areas'

const overheadCapacities = [
  { id: 'up-to-500', label: 'Up to 500 L', price: 499, oldPrice: 599, saving: 100 },
  { id: '501-1000', label: '501–1,000 L', price: 599, oldPrice: 719, saving: 120 },
  { id: '1001-1500', label: '1,001–1,500 L', price: 749, oldPrice: 934, saving: 185 },
  { id: '1501-2000', label: '1,501–2,000 L', price: 849, oldPrice: 1199, saving: 350 },
  { id: '2500-5000', label: '2,500–5,000 L', price: 1499, oldPrice: 2499, saving: 1000 },
]
const undergroundCapacities = [
  { id: 'up-to-1500', label: 'Up to 1,500 L', price: 799, oldPrice: 899, saving: 100 },
  { id: '1501-3000', label: '1,501–3,000 L', price: 1099, oldPrice: 1299, saving: 200 },
  { id: '3001-5000', label: '3,001–5,000 L', price: 1399, oldPrice: 1899, saving: 500 },
  { id: '5001-10000', label: '5,001–10,000 L', price: 2499, oldPrice: 3099, saving: 600 },
  { id: '10001-15000', label: '10,001–15,000 L', price: 2999, oldPrice: 3699, saving: 700 },
  { id: '15001-20000', label: '15,001–20,000 L', price: 3599, oldPrice: 4499, saving: 900 },
  { id: '20001-30000', label: '20,001–30,000 L', price: 3999, oldPrice: 5099, saving: 1100 },
]
const tankTypes = [
  { id: 'overhead', title: 'Overhead tank', caption: 'Rooftop & loft tanks', image: '/overhead-tank.png' },
  { id: 'underground', title: 'Underground tank', caption: 'Sumps below ground', image: '/underground-tank.png' },
] as const

export function PriceCalculator() {
  const [tankType, setTankType] = useState<(typeof tankTypes)[number]['id']>('overhead')
  const [capacityIndex, setCapacityIndex] = useState(1)
  const [area, setArea] = useState('')
  const [areaMessage, setAreaMessage] = useState<{ text: string; supported: boolean } | null>(null)
  const { add, decrement, items } = useCart()
  const capacities = tankType === 'overhead' ? overheadCapacities : undergroundCapacities
  const capacity = capacities[capacityIndex]
  const price = capacity.price
  const id = `${tankType}-${capacity.id}`
  const quantity = items.find((item) => item.id === id)?.qty ?? 0
  const itemName = `${tankType === 'overhead' ? 'Overhead' : 'Underground'} tank · ${capacity.label}`

  return <section className="price-calculator" aria-labelledby="calculator-title">
    <div className="calculator-topline" />
    <div className="calculator-heading"><h2 id="calculator-title">Price your tanks in seconds</h2><span className="live-pill"><span aria-hidden="true">✦</span> Live pricing</span></div>
    <div className="tank-type-grid" role="group" aria-label="Choose tank type">
      {tankTypes.map((tank) => <button type="button" key={tank.id} className={`tank-type-option ${tankType === tank.id ? 'selected' : ''}`} aria-pressed={tankType === tank.id} onClick={() => { setTankType(tank.id); setCapacityIndex(0) }}>
        <Image src={tank.image} alt="" width={62} height={62} className="tank-type-photo" />
        <span className="tank-type-copy"><strong>{tank.title}</strong><small>{tank.caption}</small></span>
      </button>)}
    </div>
    <h3 className="capacity-label">Tank capacity</h3>
    <div className="capacity-grid" role="group" aria-label="Choose tank capacity">
      {capacities.map((option, index) => <button type="button" key={option.label} className={`capacity-option ${capacityIndex === index ? 'selected' : ''}`} aria-pressed={capacityIndex === index} onClick={() => setCapacityIndex(index)}>
        <span className="capacity-name">{option.label}</span>
        <span className="capacity-price"><strong>₹{option.price}</strong><s>₹{option.oldPrice}</s><small>Save ₹{option.saving}</small></span>
      </button>)}
      <a className="custom-size-option" href="https://wa.me/919599057079?text=Hi%2C%20I%20need%20a%20quote%20for%20a%20custom%20tank%20size" target="_blank" rel="noreferrer"><span className="whatsapp-mark" aria-hidden="true"><MessageCircle size={18}/></span><span><strong>Other size?</strong><small>Chat on WhatsApp</small></span></a>
    </div>
    <div className="quantity-row"><span><strong>Tanks of this size</strong> in your booking</span><div className="quantity-control"><button type="button" aria-label="Remove one tank from cart" disabled={quantity === 0} onClick={() => decrement(id)}><Minus size={16}/></button><output aria-live="polite">{quantity}</output><button type="button" aria-label="Add one tank to cart" disabled={quantity >= 20} onClick={() => add({ id, name: itemName, price })}><Plus size={16}/></button></div></div>
    <div className="calculator-actions"><div className="calculator-promo" role="note" aria-label="Pay online to get extra 10 percent off"><Sparkles className="calculator-promo-icon" size={19} aria-hidden="true"/><span className="calculator-promo-copy"><strong>EXTRA 10% OFF</strong><small>Pay Online to get extra 10% off</small></span></div><Link className="calculator-details" href="/cart">View cart <ArrowRight size={15}/></Link></div>
    <form className="area-check" onSubmit={(event) => {
      event.preventDefault()
      const query = area.trim()
      if (!query) {
        setAreaMessage({ text: 'Enter a listed area or a six-digit Delhi/NCR PIN code.', supported: false })
      } else if (/^\d+$/.test(query)) {
        setAreaMessage(isSupportedPincode(query)
          ? { text: `We serve ${query}. We’ll confirm the visit details and any transport charge before booking.`, supported: true }
          : { text: 'We don’t currently serve that PIN code. Use a Delhi/NCR PIN starting with 110, 121, 122, or 201.', supported: false })
      } else if (isListedServiceArea(query)) {
        setAreaMessage({ text: `We serve ${query}. We’ll confirm the exact PIN coverage and any transport charge before booking.`, supported: true })
      } else {
        setAreaMessage({ text: 'Enter a locality listed on our Areas page or a supported six-digit PIN code.', supported: false })
      }
    }}>
      <label htmlFor="area-code">Check your area</label><div className="area-check-field"><input id="area-code" value={area} onChange={(event) => setArea(event.target.value)} placeholder="Enter area or Delhi/NCR PIN code"/><button type="submit">Check availability</button></div>{areaMessage && <p className={areaMessage.supported ? 'area-check-success' : 'area-check-error'} role="status">{areaMessage.text}</p>}
    </form>
    <p className="calculator-note"><Check size={14}/> Final visit details and any transport charge are confirmed before booking.</p>
  </section>
}
