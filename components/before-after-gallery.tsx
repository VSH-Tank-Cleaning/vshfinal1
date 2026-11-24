import Image from 'next/image'

const beforePhotos = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173153-lKkTJt89DFtjVoaXNE9JvQ8m2AwyS8.png',
    alt: 'Murky grey water inside a round water storage tank before cleaning',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173143-GaD5UUi8T13uz2uNI0GRzqmzgDG5Xx.png',
    alt: 'Brown sludge and dirty water being washed from a tank before cleaning',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173158-VCD0dK7ZRZYNO5Czud9toVDhePWLkY.png',
    alt: 'Sediment and residue coating the inside of a water tank before cleaning',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173219-YbCVMYGKlzl6M5nxNj4I2HHEzbVb2C.png',
    alt: 'Dark underground tank with murky water before cleaning',
  },
]

const afterPhotos = [
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173248-Zimv824KxGGubtsHMrojNszqJcYlLy.png',
    alt: 'Rinsed white tank interior after cleaning',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173324-Muf9sY8AmQIOLmQaCvr5ESii1Xi85L.png',
    alt: 'Clean blue-grey tank interior after washing',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173303-RmeOGgKzL1qA6krUenydnNepy7OH1D.png',
    alt: 'Washed dark plastic water tank interior after cleaning',
  },
  {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-11-19%20173254-fnx44bF8KiYOzxTsZHS3pxbysl6wTv.png',
    alt: 'Rinsed blue water tank interior after cleaning',
  },
]

const photoGroups = [
  { label: 'Before cleaning', note: 'Sludge, sediment & buildup', photos: beforePhotos, tone: 'before' },
  { label: 'After cleaning', note: 'Washed tank interiors', photos: afterPhotos, tone: 'after' },
]

export function BeforeAfterGallery() {
  return (
    <section className="before-after-gallery" aria-labelledby="before-after-title">
      <div className="before-after-heading">
        <span className="before-after-kicker">REAL CLEANING RESULTS</span>
        <h2 id="before-after-title">A clean you can see.</h2>
        <p>Real tank interiors before and after a professional clean. The first four photos show before; the next four show after.</p>
      </div>
      <div className="before-after-groups">
        {photoGroups.map((group) => (
          <article className={`before-after-group before-after-${group.tone}`} key={group.tone}>
            <div className="before-after-group-heading">
              <div>
                <h3>{group.label}</h3>
                <p>{group.note}</p>
              </div>
              <span className="before-after-count">04 photos</span>
            </div>
            <div className="before-after-photo-grid">
              {group.photos.map((photo, index) => (
                <figure className="before-after-photo" key={photo.src}>
                  <Image src={photo.src} alt={photo.alt} width={400} height={520} sizes="(max-width: 600px) 44vw, (max-width: 1000px) 22vw, 20vw" />
                  <figcaption><span>{group.tone === 'before' ? 'BEFORE' : 'AFTER'}</span><span>{String(index + 1).padStart(2, '0')}</span></figcaption>
                </figure>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
