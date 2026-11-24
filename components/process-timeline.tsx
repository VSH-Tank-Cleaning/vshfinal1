import { Camera, Droplets, ShieldCheck, Sparkles } from 'lucide-react'

const steps = [
  { number: '01', title: 'Drain & inspect', copy: 'We remove remaining water and check the tank before cleaning begins.', icon: Droplets },
  { number: '02', title: 'Lift out the sludge', copy: 'Settled dirt is vacuumed away instead of being stirred back into the water.', icon: Sparkles },
  { number: '03', title: 'Wash every surface', copy: 'Walls, floors, corners and the inlet area are scrubbed and rinsed.', icon: Droplets },
  { number: '04', title: 'Disinfect & rinse', copy: 'We disinfect cleaned surfaces and rinse the tank before handover.', icon: ShieldCheck },
  { number: '05', title: 'Photo proof', copy: 'Get before-and-after photos and a clear update when the work is done.', icon: Camera },
]

export function ProcessTimeline() {
  return (
    <div className="steps-timeline">
      {steps.map((step) => {
        const Icon = step.icon
        return (
          <article className="timeline-step" key={step.number}>
            <span className="timeline-icon"><Icon size={20} /><b>{step.number}</b></span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </article>
        )
      })}
    </div>
  )
}
