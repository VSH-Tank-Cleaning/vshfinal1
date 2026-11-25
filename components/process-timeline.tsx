import { Camera, Droplets, ShieldCheck, Sparkles } from 'lucide-react'

export const cleaningProcessSteps = [
  { number: '01', title: 'Drain the tank', description: 'We switch off the pump that fills the tank, close the inlet, and drain the water so the floor, walls and corners are exposed.', why: 'With the tank empty, our team can clean its surfaces and inspect the sludge, fittings, lid and overall condition.', before: 'Fill a few buckets if you will need water while the cleaning is underway.', icon: Droplets },
  { number: '02', title: 'Vacuum out settled sludge', description: 'A vacuum machine lifts settled silt, organic matter and dead biofilm from the tank.', why: 'Removing sludge first keeps it from being stirred back into the water or flushed into pipes, taps, the geyser or RO filter.', icon: Sparkles },
  { number: '03', title: 'Apply suitable tank treatments', description: 'We apply treatment to the tank walls, floor, corners and ceiling, as appropriate for the tank and the service.', treatments: ['Hard-water stain remover', 'Antibacterial treatment'], why: 'The treatments help remove hard-water deposits and target bacteria on tank surfaces.', icon: Droplets },
  { number: '04', title: 'Scrub and wash', description: 'We scrub and wash the walls, floor, corners and ceiling, paying close attention to the underside of the lid, inlet, float valve and floor joints.', why: 'Scrubbing breaks up biofilm that clings to tank surfaces. For plastic tanks, we use soft brushes and controlled pressure to avoid scratching the inner surface.', icon: ShieldCheck },
  { number: '05', title: 'Share photo proof and hand over', description: 'We send before-and-after photos on WhatsApp, secure the lid or manhole cover, reopen the inlet and leave the tank ready to refill.', why: 'Photos let you confirm the work, compare future cleanings and keep a service record for your home, RWA or business.', icon: Camera },
]

export function ProcessTimeline() {
  return (
    <div className="steps-timeline">
      {cleaningProcessSteps.map((step) => {
        const Icon = step.icon
        return (
          <article className="timeline-step" key={step.number}>
            <span className="timeline-icon"><Icon size={20} /><b>{step.number}</b></span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        )
      })}
    </div>
  )
}
