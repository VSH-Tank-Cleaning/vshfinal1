'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Plus, ShieldCheck } from 'lucide-react'
import { useCart } from './tank-cart'
import { BeforeAfterGallery } from './before-after-gallery'
import { TransportChargesTable } from './transport-charges-table'

const overheadTanks = [
  { id: 'up-to-500', size: 'Up to 500 L', regular: 599, price: 499, saving: 100 },
  { id: '501-1000', size: '501–1,000 L', regular: 719, price: 599, saving: 120 },
  { id: '1001-1500', size: '1,001–1,500 L', regular: 934, price: 749, saving: 185 },
  { id: '1501-2000', size: '1,501–2,000 L', regular: 1199, price: 849, saving: 350 },
  { id: '2500-5000', size: '2,500–5,000 L', regular: 2499, price: 1499, saving: 1000 },
]
const undergroundTanks = [
  { id: 'up-to-1500', size: 'Up to 1,500 L', regular: 899, price: 799, saving: 100 },
  { id: '1501-3000', size: '1,501–3,000 L', regular: 1299, price: 1099, saving: 200 },
  { id: '3001-5000', size: '3,001–5,000 L', regular: 1899, price: 1399, saving: 500 },
  { id: '5001-10000', size: '5,001–10,000 L', regular: 3099, price: 2499, saving: 600 },
  { id: '10001-15000', size: '10,001–15,000 L', regular: 3699, price: 2999, saving: 700 },
  { id: '15001-20000', size: '15,001–20,000 L', regular: 4499, price: 3599, saving: 900 },
  { id: '20001-30000', size: '20,001–30,000 L', regular: 5099, price: 3999, saving: 1100 },
]
const methodSteps = [
  ['Drain the tank', 'Remaining water is pumped out so the floor and walls are exposed. Tell us beforehand if you want water saved in buckets.'],
  ['Vacuum the sludge', 'Settled mud, silt and slime are lifted out with a vacuum machine instead of being stirred back into the water.'],
  ['Pressure-wash & scrub', 'Walls, floor, corners, lid and inlet area are scrubbed and jet-washed to loosen biofilm and algae.'],
  ['Disinfect and rinse', 'An anti-bacterial disinfectant is applied to cleaned surfaces, then the tank is rinsed before refilling.'],
  ['Photo proof & handover', 'You receive before-and-after photos on WhatsApp. The lid is closed properly and the tank is ready to refill.'],
]

export function ServicesContent() {
  const [tankType, setTankType] = useState<'overhead' | 'underground'>('overhead')
  const { add } = useCart()
  const tanks = tankType === 'overhead' ? overheadTanks : undergroundTanks

  return <div className="services-content">
    <section className="services-intro" aria-labelledby="services-overview-title">
      <div className="services-section-heading"><span className="eyebrow">A PROFESSIONAL CLEAN, EVERY TIME</span><h2 id="services-overview-title">What professional water tank cleaning actually involves</h2></div>
      <p>“Tank cleaning” can mean very different things. At one end, someone climbs in with a brush, scrubs the walls and drains dirty water through your outlet pipe — straight into your plumbing. At the other, the tank is emptied, settled sludge is physically removed, every surface is scrubbed and washed, the tank is disinfected and rinsed, and you get photographic proof of the result. VSH Tank Cleaning does the second, every time, regardless of tank size.</p>
      <p>A professional service matters because the problem inside a storage tank isn’t just visible dirt. Fine sediment settles into a soft layer on the floor, bacteria colonise the walls in a slimy film called biofilm, and light entering through a translucent wall or gap in the lid feeds algae. Each layer protects the next from chlorine in the supply water. Removing them needs the right sequence and equipment, not just effort.</p>
    </section>

    <section className="services-signs" aria-labelledby="signs-title"><div><span className="eyebrow">WHEN TO BOOK A CLEAN</span><h2 id="signs-title">Signs your tank needs cleaning now</h2></div><ul><li>The water smells musty, earthy or like rotten eggs.</li><li>You see particles, a yellow or brown tint, or green specks in a white bucket.</li><li>Your RO pre-filter or tap aerators clog much faster than usual.</li><li>The tank hasn’t been cleaned in the last six months, or you don’t know when it was last cleaned.</li><li>Water entered the tank during the monsoon, or the lid was left open.</li><li>You’ve moved into a new home or office.</li></ul></section>

    <BeforeAfterGallery />

    <section className="services-section" aria-labelledby="service-types-title">
      <div className="services-section-heading"><span className="eyebrow">OUR WATER TANK CLEANING SERVICES</span><h2 id="service-types-title">A service for every tank and property</h2></div>
      <div className="service-type-grid">
        <article className="service-type-card"><img src="/overhead-tank.png" alt="Black rooftop overhead water tank"/><div><h3>Overhead water tank cleaning</h3><p>Rooftop and loft tanks — plastic (including Sintex-type rotomoulded tanks), PVC and concrete — from 500 litres up to 10,000 litres. These tanks take the most heat and light, so algae and biofilm are common.</p><Link href="/prices">Explore overhead tank cleaning <ArrowRight size={15}/></Link></div></article>
        <article className="service-type-card"><img src="/underground-tank.png" alt="Open underground water tank sump viewed from above"/><div><h3>Underground tank and sump cleaning</h3><p>Concrete and brick sumps, usually under a driveway, stairwell or parking slab, from compact 1,500-litre sumps to 30,000-litre reservoirs. Underground tanks collect the heaviest sludge because they receive water first.</p><Link href="/prices">View underground tank options <ArrowRight size={15}/></Link></div></article>
        <article className="service-type-card"><span className="service-type-icon"><ShieldCheck aria-hidden="true"/></span><div><h3>Cleaning with disinfection</h3><p>If stored water is used for cooking, drinking (even after RO), or by children and elderly family members, disinfection is the step that matters most.</p><Link href="/processes">Read about our process <ArrowRight size={15}/></Link></div></article>
        <article className="service-type-card"><span className="service-type-icon"><Check aria-hidden="true"/></span><div><h3>Plastic and Sintex tank cleaning</h3><p>Plastic tanks need a gentler touch: no wire brushes or abrasive scrubbing that scratches the inner layer and gives biofilm somewhere to grip.</p><Link href="/guides">See tank care guidance <ArrowRight size={15}/></Link></div></article>
      </div>
      <div className="service-audience"><div><span className="eyebrow">RESIDENTIAL, SOCIETY & COMMERCIAL</span><p>We clean for independent homes and builder floors, apartments, housing societies, shops, offices, hotels and industrial premises — with annual maintenance contracts for buildings that want a fixed schedule.</p></div><Link className="button button-primary" href="/contact">Plan a service <ArrowRight size={15}/></Link></div>
    </section>

    <section className="services-section service-audience-details" aria-labelledby="property-service-details-title">
      <div className="services-section-heading"><span className="eyebrow">SERVICE FOR YOUR PROPERTY</span><h2 id="property-service-details-title">A practical plan for every kind of property</h2><p>Whether you are booking for one home or coordinating several buildings, we confirm the tanks, access and visit plan with you before the team arrives.</p></div>
      <div className="service-audience-detail-grid">
        <article className="service-audience-detail" id="homes-builder-floors"><span className="eyebrow">HOMES & BUILDER FLOORS</span><h3>One visit for your rooftop tank and sump</h3><p>Book overhead and underground tanks together for a thorough clean from storage to supply. Share the tank sizes you know, roof or parking access details, and any water-saving needs; our team will confirm the visit plan with you.</p><Link href="/prices">Compare tank sizes and prices <ArrowRight size={15}/></Link></article>
        <article className="service-audience-detail" id="housing-societies"><span className="eyebrow">HOUSING SOCIETIES</span><h3>Coordinated cleaning for shared tanks</h3><p>Plan a visit around common sumps, overhead tanks and building access. A designated coordinator can help arrange keys, parking and resident notices; we confirm the scope and schedule before work begins and share photo updates after the clean.</p><Link href="/contact">Discuss a society visit <ArrowRight size={15}/></Link></article>
        <article className="service-audience-detail" id="shops-workplaces"><span className="eyebrow">SHOPS & WORKPLACES</span><h3>Commercial cleaning planned around your day</h3><p>For offices, shops, hotels and other workplaces, share your operating hours, tank locations and access restrictions. We will coordinate a suitable visit window and confirm the cleaning scope in advance to help minimize disruption.</p><Link href="/contact">Plan a workplace visit <ArrowRight size={15}/></Link></article>
        <article className="service-audience-detail" id="regular-maintenance"><span className="eyebrow">REGULAR MAINTENANCE</span><h3>Keep tank care on a schedule</h3><p>Set recurring visits around your property’s use, water source and access needs. Homes can plan routine cleaning, while larger buildings can ask about annual maintenance contracts and a coordinated schedule for multiple tanks.</p><Link href="/contact">Ask about maintenance plans <ArrowRight size={15}/></Link></article>
      </div>
    </section>

    <section className="services-section" aria-labelledby="method-title">
      <div className="services-section-heading"><span className="eyebrow">THE VSH TANK CLEANING METHOD</span><h2 id="method-title">A thorough clean, in five steps</h2></div>
      <div className="method-grid">{methodSteps.map(([title, description], index) => <article className="method-card" key={title}><span className="method-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="services-detail-grid">
        <article><span className="eyebrow">WHY SLUDGE REMOVAL COMES FIRST</span><h3>Lift it out, don’t stir it up.</h3><p>The most common shortcut is skipping proper sludge removal. Scrubbing with sludge on the floor churns it into suspension: some drains out, much settles again after refilling. We vacuum the sludge before scrubbing, so water stays clear instead of clouding the next day.</p></article>
        <article><span className="eyebrow">DETAILS THAT MATTER</span><h3>Walls, corners, fittings and a proper rinse.</h3><p>We pay particular attention to the underside of the lid, inlet, float valve, overflow, and the joints where walls meet the floor. Disinfectant is applied only after surfaces are clean, allowed its contact time, then rinsed before refilling. You receive before-and-after photos on WhatsApp — especially useful for tanks on roofs or beneath slabs.</p></article>
      </div>
    </section>

    <section className="services-section services-pricing" aria-labelledby="services-pricing-title">
      <div className="services-section-heading"><span className="eyebrow">PRICING AT A GLANCE</span><h2 id="services-pricing-title">Choose a tank size to get started</h2><p>Prices are per tank, by maximum capacity. Choose your tank type, then add one or more sizes to your booking.</p></div>
      <div className="catalog-type-switch" role="group" aria-label="Select tank type">{(['overhead', 'underground'] as const).map((type) => <button type="button" className={tankType === type ? 'active' : ''} key={type} onClick={() => setTankType(type)}>{type === 'overhead' ? 'Overhead tank' : 'Underground tank'}<small>{type === 'overhead' ? 'Rooftop & loft tanks' : 'Sumps below ground'}</small></button>)}</div>
      <div className="price-table-wrap"><table className="price-table price-table-products"><thead><tr><th scope="col">Tank capacity</th><th scope="col">Regular</th><th scope="col">Price / tank</th><th scope="col"><span className="sr-only">Add to booking</span></th></tr></thead><tbody>{tanks.map((tank) => <tr key={tank.id}><th scope="row">{tank.size}</th><td className="price-table-regular">₹{tank.regular}</td><td><strong>₹{tank.price}</strong><span className="catalog-saving">Save ₹{tank.saving}</span></td><td><button className="catalog-add" type="button" onClick={() => add({ id: `${tankType}-${tank.id}`, name: `${tankType === 'overhead' ? 'Overhead' : 'Underground'} tank · ${tank.size}`, price: tank.price })}>Add <Plus size={15}/></button></td></tr>)}</tbody></table></div>
      <div className="services-pricing-note"><p>Other tank size? <a href="https://wa.me/919599057079?text=Hi%2C%20I%20need%20a%20quote%20for%20a%20custom%20tank%20size" target="_blank" rel="noreferrer">Chat with us on WhatsApp</a>.</p><p>Book several tanks in one visit and the cleaning subtotal is discounted automatically. Mixed tank types count together for the quantity discount.</p><Link href="/prices">See full price list <ArrowRight size={15}/></Link></div>
    </section>

    <section className="services-section services-pricing" aria-labelledby="transport-charges-title">
      <div className="services-section-heading"><span className="eyebrow">CLEAR, UPFRONT PRICING</span><h2 id="transport-charges-title">Transport charges</h2><p>A single transport charge applies per booking, based on the road distance from the nearest of our offices in Uttam Nagar and Karol Bagh. The applicable office and charge are confirmed using your PIN code.</p></div>
      <TransportChargesTable/>
      <p className="services-pricing-note">The exact charge is confirmed for your PIN code before booking and is applied once per visit, not per tank.</p>
    </section>

  </div>
}
