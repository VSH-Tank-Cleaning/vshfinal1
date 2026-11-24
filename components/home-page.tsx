'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Building2, Camera, Check, Droplets, House, MapPin, RotateCw, ShieldCheck, Star, Store } from 'lucide-react'
import { PriceCalculator } from './price-calculator'
import { areaSlug, serviceAreaGroups } from '@/lib/service-areas'
import { BeforeAfterGallery } from './before-after-gallery'
import { ProcessTimeline } from './process-timeline'



export function HomePage() {
  return <>
    <section className="reference-hero">
      <div className="reference-hero-inner">
        <div className="reference-hero-copy">
          <div className="review-pill"><span className="review-google">V</span><strong>VSH</strong><span className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" />)}</span><span>Care that shows</span></div>
          <h1>Professional<br/><span>Water Tank</span><br/><span className="cleaning-word">Cleaning</span><br/>Services in<br/>Delhi NCR</h1>
          <p className="reference-hero-lede">Give your water tank the professional care it deserves. Compare clear prices, choose your tank size and book an easy visit with VSH.</p>
          <div className="reference-hero-actions"><Link href="/prices" className="reference-primary-button">Book tank cleaning <ArrowRight size={17}/></Link><a href="https://wa.me/919599057079?text=Hi%2C%20I%27d%20like%20to%20book%20tank%20cleaning" className="reference-secondary-button" target="_blank" rel="noreferrer">Chat on WhatsApp</a></div>
          <div className="hero-trust-list"><span><Check size={15}/> Clear prices</span><span><Check size={15}/> Careful cleaning</span><span><Check size={15}/> Photo updates</span></div>
        </div>
        <PriceCalculator />
      </div>
    </section>

    <section className="proof-strip" aria-label="Service highlights">
      <div><span className="proof-icon"><span>₹</span></span><div><strong>Prices shown upfront</strong><small>Choose by tank type and size</small></div></div>
      <div><span className="proof-icon"><Camera size={20}/></span><div><strong>Photo updates</strong><small>See the work at handover</small></div></div>
      <div><span className="proof-icon"><ShieldCheck size={20}/></span><div><strong>Careful service</strong><small>For homes and businesses</small></div></div>
      <div><span className="proof-icon"><MapPin size={20}/></span><div><strong>Delhi NCR coverage</strong><small>Check your area before booking</small></div></div>
    </section>


    <section className="reference-section service-intro-section">
      <div className="reference-section-heading"><span className="section-kicker">CLEANING FOR EVERY TANK</span><h2>Water tank cleaning for homes, societies and businesses</h2><p>From a rooftop storage tank to an underground sump, choose the service that fits your property.</p></div>
      <div className="service-feature-grid">
        <article className="service-feature-card"><div className="service-feature-copy"><span className="service-label">ROOFTOP & LOFT</span><h3>Overhead tank cleaning</h3><p>Cleaning for plastic and concrete tanks on rooftops, lofts and builder floors.</p><strong>From ₹499 <small>/ tank</small></strong><Link href="/prices">See sizes & prices <ArrowRight size={16}/></Link></div><div className="service-image-frame"><Image src="/overhead-tank.png" alt="Black rooftop water storage tank" width={320} height={320}/></div></article>
        <article className="service-feature-card"><div className="service-feature-copy"><span className="service-label">SUMPS & BELOW GROUND</span><h3>Underground tank cleaning</h3><p>Deep cleaning for concrete sumps and underground water storage tanks.</p><strong>From ₹799 <small>/ tank</small></strong><Link href="/prices">See sizes & prices <ArrowRight size={16}/></Link></div><div className="service-image-frame"><Image src="/underground-tank.png" alt="Concrete underground water tank" width={320} height={320}/></div></article>
      </div>
      <div className="customer-type-grid">
        <Link className="customer-type-card" href="/services#homes-builder-floors"><span className="customer-type-icon"><House size={21}/></span><h3>Homes &amp; builder floors</h3><p>One-time cleaning for rooftop tanks and sumps.</p></Link>
        <Link className="customer-type-card" href="/services#housing-societies"><span className="customer-type-icon"><Building2 size={21}/></span><h3>Housing societies</h3><p>Coordinated visits for shared tanks and buildings.</p></Link>
        <Link className="customer-type-card" href="/services#shops-workplaces"><span className="customer-type-icon"><Store size={21}/></span><h3>Shops &amp; workplaces</h3><p>Practical scheduling for commercial properties.</p></Link>
        <Link className="customer-type-card" href="/services#regular-maintenance"><span className="customer-type-icon"><RotateCw size={21}/></span><h3>Regular maintenance</h3><p>Plan recurring cleaning around your needs.</p></Link>
      </div>
    </section>

    <section className="reference-section process-reference-section"><div className="reference-section-heading"><span className="section-kicker">OUR CLEANING METHOD</span><h2>What a VSH tank cleaning includes</h2><p>Each visit follows a careful five-step process, tailored to your tank and the condition we find.</p></div><ProcessTimeline /><div className="process-callout"><span><ShieldCheck size={20}/></span><p>We remove settled sludge before scrubbing, then disinfect and rinse the tank before handover.</p><Link href="/processes">See our full process <ArrowRight size={15}/></Link></div></section>

    <BeforeAfterGallery />

    <section className="reference-section area-reference-section"><div className="area-section-top"><div><span className="section-kicker">LOCAL SERVICE, WIDE COVERAGE</span><h2>Browse service areas</h2></div><Link href="/areas" className="area-view-link">All areas <ArrowRight size={16}/></Link></div><div className="area-cards">{serviceAreaGroups.map((area) => <article className="area-card" key={area.title}><Link className="area-card-title" href={`/areas/${areaSlug(area.title)}`}><h3><MapPin size={17}/>{area.title}<ArrowRight size={15}/></h3></Link><div className="area-tags">{area.places.map((place) => <Link href={`/areas/${areaSlug(place)}`} key={place}>{place}</Link>)}</div></article>)}</div></section>

    <section className="reference-section final-reference-cta"><div className="cta-icon"><Droplets size={24}/></div><div><span className="section-kicker">READY WHEN YOU ARE</span><h2>Let’s plan your tank cleaning.</h2><p>Choose your tank type and size to see an upfront estimate.</p></div><Link href="/prices" className="reference-primary-button">View price list <ArrowRight size={16}/></Link></section>
  </>
}
