import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type RelatedArea = { name: string; slug: string }

type AreaStorageGuideProps = {
  areaName: string
  description: string
  relatedAreas: RelatedArea[]
}

const storageTypes = [
  { type: 'Apartments and DDA flats', tanks: 'Shared terrace or rooftop tanks', notes: 'Confirm roof access and the building contact.' },
  { type: 'CGHS and housing societies', tanks: 'Underground reservoir with block tanks', notes: 'Coordinate a society booking and block-wise schedule.' },
  { type: 'Independent homes and builder floors', tanks: 'A sump and rooftop tank per home or floor', notes: 'Clean accessible tanks together when practical.' },
  { type: 'PGs, hostels and rental housing', tanks: 'Several rooftop tanks with frequent use', notes: 'High-use buildings may need checks every 3–4 months.' },
  { type: 'Shops and workplaces', tanks: 'Overhead tanks or commercial sumps', notes: 'Plan around operating hours and site access.' },
]

export function AreaStorageGuide({ areaName, description, relatedAreas }: AreaStorageGuideProps) {
  return (
    <section className="area-storage-guide" aria-labelledby="area-storage-title">
      <header className="area-storage-heading">
        <span className="section-kicker">LOCAL WATER STORAGE</span>
        <h2 id="area-storage-title">How {areaName} stores its water</h2>
        <p>{description}</p>
      </header>

      <p className="area-storage-lead">That variety means very different tank set-ups:</p>
      <div className="area-storage-table-wrap">
        <table className="area-storage-table">
          <thead>
            <tr><th scope="col">Area type</th><th scope="col">Typical tanks</th><th scope="col">Notes</th></tr>
          </thead>
          <tbody>
            {storageTypes.map((row) => (
              <tr key={row.type}>
                <th scope="row">{row.type}</th>
                <td data-label="Typical tanks">{row.tanks}</td>
                <td data-label="Notes">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="area-local-content-grid">
        <article className="area-local-content-card">
          <span className="section-kicker">RENTAL &amp; STUDENT HOUSING</span>
          <h3>PGs and student housing</h3>
          <p>PGs, hostels and rental buildings in {areaName} can have many residents and frequent water use, so sediment may build up faster. For high-use properties, consider checks every 3–4 months and keep a simple record of cleaning dates and photos.</p>
          <Link href="/contact">Plan a multi-tank visit <ArrowRight size={14}/></Link>
        </article>
        <article className="area-local-content-card">
          <span className="section-kicker">SHARED WATER STORAGE</span>
          <h3>Societies in {areaName}</h3>
          <p>Shared reservoirs and overhead tanks often serve several blocks. A society coordinator can arrange keys, notify residents and group tanks into a block-wise schedule before the visit.</p>
          <Link href="/services#housing-societies">Society cleaning details <ArrowRight size={14}/></Link>
        </article>
      </div>

      {relatedAreas.length > 0 && (
        <nav className="area-related-nav" aria-label={`Nearby service areas related to ${areaName}`}>
          <h3>Nearby service areas</h3>
          <div className="area-nearby-links">
            {relatedAreas.map((area) => <Link href={`/areas/${area.slug}`} key={area.slug}>{area.name}<ArrowRight size={14}/></Link>)}
          </div>
        </nav>
      )}
    </section>
  )
}
