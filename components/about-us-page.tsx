'use client'

import Link from 'next/link'
import { ArrowRight, Check, MapPin, Phone, ShieldCheck, Star } from 'lucide-react'
import { ContactForm } from './contact-question'
import { ProcessTimeline } from './process-timeline'

const photos = [
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cLA8deVCxI2TDfmGpRgP2w6oCiUFIQ.png', alt: 'VSH technician scrubbing a concrete water tank with professional cleaning equipment', caption: 'Careful cleaning, corner to corner' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7RZuR1x0KqV3lid9JuNjPGEnT5Q9cv.png', alt: 'VSH team member vacuuming a rooftop water tank beside the service equipment', caption: 'The right tools for every tank' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3kUY9pTkCiD8vwVDveQp8DG5JdSSIj.png', alt: 'VSH Tank Cleaning crew working together on rooftop storage tanks', caption: 'A team you can count on' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QEtcxnmqi92GXViwOnOmxHZEB89WlN.png', alt: 'VSH technician cleaning a rooftop water tank using a vacuum hose', caption: 'Professional care on every visit' },
  { src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-on8Iip9CG6AxpjqW5OgZD1jISWdyPv.png', alt: 'Four scenes showing VSH technicians draining, scrubbing and cleaning household water tanks', caption: 'Real work. Real results.' },
]

const serviceTypes = [
  { title: 'Homes', text: 'Rooftop tanks, sumps and loft tanks in independent houses, builder floors and flats.' },
  { title: 'Societies', text: 'Shared sumps, block tanks and large reservoirs for apartment buildings and housing societies.' },
  { title: 'Businesses', text: 'Offices, shops, hotels, schools, hospitals and industrial units.' },
]

const promises = [
  ['Published prices', 'Fixed prices by tank capacity. Multi-tank discounts and transport charges are shown clearly.'],
  ['No guessing', 'If we have not verified your PIN-code distance, we confirm the transport charge before you pay.'],
  ['Proof, not promises', 'We share before-and-after photos on WhatsApp for every tank.'],
  ['Honest advice', 'If a tank is damaged, unsafe to enter or contains chemicals we cannot handle, we will tell you.'],
]

export function AboutUsPage() {
  return <div className="about-page">
    <section className="about-hero" aria-labelledby="about-title">
      <div className="about-hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot"/>OUR STORY · DELHI NCR</span>
        <h1 id="about-title">Making Delhi NCR healthier, <em>one clean tank at a time.</em></h1>
        <p>At VSH Tank Cleaning, our mission is to help every family, society and workplace access clean, hygienic stored water through reliable, professional tank cleaning.</p>
        <div className="about-hero-actions"><Link className="button button-primary" href="/processes">See how we work <ArrowRight size={16}/></Link><a className="about-call-link" href="tel:+919599057079"><Phone size={16}/> +91 95990 57079</a></div>
        <div className="about-trust"><span><ShieldCheck size={17}/> Careful, professional service</span><span><Star size={16} fill="currentColor"/> 4.7-star average on Google</span></div>
      </div>
      <figure className="about-hero-photo"><img src={photos[1].src} alt={photos[1].alt} fetchPriority="high"/><figcaption><span className="about-photo-mark"><ShieldCheck size={18}/></span><span><strong>Clean tanks. Clear communication.</strong><small>Serving homes and businesses across Delhi NCR</small></span></figcaption></figure>
    </section>

    <section className="about-mission section" aria-labelledby="mission-title">
      <div className="about-mission-copy"><span className="eyebrow">WHY CLEAN TANKS MATTER</span><h2 id="mission-title">Clean water is essential to a healthy life.</h2><p>An unclean water storage tank can become a source of contamination and increase the risk of waterborne illness. Regular cleaning and maintenance help keep your household water storage in better condition.</p><p>Our goal is to make professional water tank cleaning accessible throughout Delhi NCR. Wherever you are in the region, our team is ready to reach you with dependable service and a clear, consistent process.</p><Link className="text-link" href="/areas">Explore our service areas <ArrowRight size={15}/></Link></div>
      <aside className="about-service-card"><span className="eyebrow">WHO WE SERVE</span><div className="about-service-list">{serviceTypes.map((item, index) => <article className="about-service-item" key={item.title}><span className="about-service-number">0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></aside>
    </section>

    <section className="reference-section process-reference-section" aria-labelledby="about-process-title"><div className="reference-section-heading"><span className="section-kicker">ONE CONSISTENT METHOD</span><h2 id="about-process-title">Every tank gets the same five-step care.</h2><p>We tailor the visit to the tank and condition we find, without changing the care that goes into every job.</p></div><ProcessTimeline /><div className="process-callout"><span><ShieldCheck size={20}/></span><p>We remove settled sludge before scrubbing, then disinfect and rinse the tank before handover.</p><Link href="/processes">Read the full process <ArrowRight size={15}/></Link></div></section>

    <section className="about-promises section" aria-labelledby="promises-title"><div className="section-heading"><div><span className="eyebrow">HOW WE WORK</span><h2 id="promises-title">Straightforward from first call to finish.</h2></div><p>Good service means knowing what to expect, seeing what was done and getting honest answers.</p></div><div className="about-promise-grid">{promises.map(([title, text]) => <article className="about-promise-card" key={title}><span><Check size={17}/></span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

    <section className="about-locations" aria-labelledby="contact-question-title"><div className="about-location-contact"><ContactForm /></div><div className="about-address-card"><span className="about-address-icon"><MapPin size={19}/></span><span className="eyebrow">VSH WATER TANK CLEANING</span><address>C-194, Bhagwati Vihar,<br/>Uttam Nagar, New Delhi,<br/>Delhi 110059<br/><br/>2387, Faiz Road, Karol Bagh,<br/>New Delhi, Delhi 110005<br/><br/>Sub Branch: Mahipalpur,<br/>Delhi 110037</address><a href="tel:+919599057079"><Phone size={15}/> +91 95990 57079</a><p>Open every day · 9 AM–7 PM</p></div></section>

    <section className="about-gallery section" aria-labelledby="about-gallery-title"><div className="section-heading"><div><span className="eyebrow">ON THE JOB</span><h2 id="about-gallery-title">Our team at work.</h2></div><p>Meet the people and see the care behind every VSH tank cleaning visit.</p></div><div className="about-gallery-grid">{photos.map((photo) => <figure className="about-gallery-photo" key={photo.src}><img src={photo.src} alt={photo.alt} loading="lazy"/><figcaption>{photo.caption}</figcaption></figure>)}</div></section>

    <section className="about-cta"><div><span className="eyebrow">LET’S GET STARTED</span><h2>Ready for a cleaner water tank?</h2><p>Get in touch to check availability and plan your visit.</p></div><div className="about-cta-actions"><Link className="button button-primary" href="/prices">View prices &amp; book <ArrowRight size={16}/></Link><a className="about-call-link" href="tel:+919599057079"><Phone size={16}/> Call our team</a></div></section>
  </div>
}
