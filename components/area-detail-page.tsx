import Link from 'next/link'
import { ArrowLeft, ArrowRight, Building2, CalendarClock, Check, MapPin, ShieldCheck, Waves } from 'lucide-react'
import { areaSlug, getServiceArea, serviceAreas } from '@/lib/service-areas'
import { AreaStorageGuide } from '@/components/area-storage-guide'

export function AreaDetailPage({ slug }: { slug: string }) {
  const area = getServiceArea(slug)
  if (!area) return null

  const coverage = `${area.coverageDescription} VSH Tank Cleaning is based in Uttam Nagar, West Delhi. Share your PIN code to confirm service availability and any transport charge before booking.`
  const relatedAreas = area.isGroup
    ? area.nearbyAreas.map((name) => ({ name, slug: areaSlug(name) }))
    : [
      { name: area.group, slug: areaSlug(area.group) },
      ...serviceAreas.filter((candidate) => !candidate.isGroup && candidate.group === area.group && candidate.name !== area.name).map(({ name, slug }) => ({ name, slug })),
    ]

  return <section className="area-detail-page">
    <div className="area-detail-shell">
      <Link className="area-back-link" href="/areas"><ArrowLeft size={16}/> All service areas</Link>
      <header className="area-detail-hero">
        <span className="section-kicker"><MapPin size={14}/> LOCAL SERVICE AREA</span>
        <h1>Water tank cleaning in {area.name}</h1>
        <p>{coverage}</p>
      </header>

      <div className="area-detail-grid">
        <article className="area-detail-card">
          <span className="area-detail-icon"><Waves size={20}/></span>
          <h2>Tank cleaning for your property</h2>
          <p>VSH Tank Cleaning serves overhead rooftop and loft tanks, plus underground tanks and sumps. Services cover overhead tanks from 500 to 10,000 litres and underground storage up to 30,000 litres.</p>
        </article>
        <article className="area-detail-card">
          <span className="area-detail-icon"><ShieldCheck size={20}/></span>
          <h2>A careful, documented clean</h2>
          <p>The service sequence drains the tank, vacuums out settled sludge, pressure-washes and scrubs surfaces, disinfects and rinses, then provides before-and-after photos.</p>
        </article>
        <article className="area-detail-card">
          <span className="area-detail-icon"><Building2 size={20}/></span>
          <h2>Homes, societies and workplaces</h2>
          <p>Book a home tank or coordinate several shared tanks for an apartment, shop, office, school or hotel. For group visits, share access requirements and preferred timing so the cleaning plan can be confirmed in advance.</p>
        </article>
        <article className="area-detail-card">
          <span className="area-detail-icon"><CalendarClock size={20}/></span>
          <h2>Choose a useful cleaning interval</h2>
          <p>Many homes schedule a clean about every six months. Tanker or borewell supply, direct sunlight, a loose lid, monsoon exposure or changes in water smell and clarity may call for an earlier visit.</p>
        </article>
      </div>

      <AreaStorageGuide areaName={area.name} description={area.waterStorageDescription} relatedAreas={relatedAreas}/>

      <aside className="area-source-note"><Check size={17}/><p>VSH Tank Cleaning&apos;s office is in Uttam Nagar, West Delhi. Confirm current area availability and any PIN-code transport charge before booking.</p></aside>
      <div className="area-detail-actions"><Link className="reference-primary-button" href="/prices">View prices &amp; book <ArrowRight size={16}/></Link><Link className="area-view-link" href="/contact">Ask about this area <ArrowRight size={15}/></Link></div>
    </div>
  </section>
}

