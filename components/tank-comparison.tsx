'use client'

import { useState } from 'react'
import { ArrowLeftRight, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { BeforeAfterGallery } from './before-after-gallery'
import { cleaningProcessSteps } from './process-timeline'
import { TankCleaningSigns } from './tank-cleaning-signs'

const visitRequirements = [
  'Access to the tank (roof key, manhole cleared of vehicles).',
  'The location of the motor switch.',
  'A power point within reach.',
  'Someone to confirm the result at the end.',
]

function CleaningProcessSteps() {
  return <section className="process-step-section" aria-labelledby="process-steps-heading">
    <div className="process-section-heading">
      <span className="eyebrow">CLEANING PROCESS</span>
      <h2 id="process-steps-heading">Our cleaning, step by step</h2>
      <p>Every visit follows a careful sequence, from draining and sludge removal to a clean handover.</p>
    </div>
    <ol className="process-step-list">
      {cleaningProcessSteps.map((step, index) => <li className="process-step-card" key={step.title}>
        <span className="process-step-number" aria-hidden="true">{index + 1}</span>
        <div className="process-step-body">
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          {step.treatments && <ul className="process-step-treatments">{step.treatments.map((treatment) => <li key={treatment}>{treatment}</li>)}</ul>}
          <p className="process-step-note"><strong>Why it matters:</strong> {step.why}</p>
          {step.before && <p className="process-step-note"><strong>Before we arrive:</strong> {step.before}</p>}
        </div>
      </li>)}
    </ol>
  </section>
}

function DurationAndPreparation() {
  return <section className="process-duration" aria-labelledby="duration-heading">
    <div className="process-duration-heading">
      <span className="eyebrow">A THOROUGH, TIDY VISIT</span>
      <h2 id="duration-heading">How long does the process take?</h2>
      <p>Timing depends on tank size, access and condition. Your crew confirms the visit plan before work begins.</p>
    </div>
    <div className="process-duration-table-wrap">
      <table className="process-duration-table">
        <thead><tr><th scope="col">Tank</th><th scope="col">Typical time</th></tr></thead>
        <tbody>
          <tr><td>Overhead, 500–2,000 L</td><td>About 45–60 minutes</td></tr>
          <tr><td>Overhead, 2,500–10,000 L</td><td>Longer, depending on size and condition</td></tr>
          <tr><td>Underground sump</td><td>Longer than an overhead tank of the same size, because of sludge</td></tr>
          <tr><td>Several tanks</td><td>Planned as one visit; we&apos;ll estimate when confirming</td></tr>
        </tbody>
      </table>
    </div>
  </section>
}

function PreparationRequirements() {
  return <section className="process-preparation" aria-labelledby="process-preparation-heading">
    <h2 id="process-preparation-heading">What we need from you</h2>
    <ul className="process-preparation-list">
      {visitRequirements.map((requirement) => <li key={requirement}><Check size={17} aria-hidden="true"/><span>{requirement}</span></li>)}
    </ul>
  </section>
}

export function TankComparison() {
  const [split, setSplit] = useState(50)

  return <section className="process-visual-page" aria-labelledby="process-visual-title">
    <PreparationRequirements />
    <TankCleaningSigns />
    <CleaningProcessSteps />
    <BeforeAfterGallery />
    <div className="process-visual-heading">
      <span className="eyebrow">A CLEAN YOU CAN SEE</span>
      <h1 id="process-visual-title">What builds up inside a water tank?</h1>
      <p>See why a careful clean matters. This illustration shows the difference between a tank between cleans and one that has been professionally washed.</p>
    </div>
    <figure className="tank-comparison-figure">
      <div className="tank-comparison-card">
        <div className="tank-comparison-labels"><span>Before cleaning</span><span>After cleaning</span></div>
        <div className="tank-comparison-frame" aria-hidden="true">
          <div className="tank-comparison-lid" />
          <div className="tank-comparison-body">
            <div className="tank-state tank-state-before">
              <div className="tank-biofilm" />
              <div className="tank-sludge" />
              <span className="tank-label tank-label-biofilm">Biofilm</span>
              <span className="tank-label tank-label-sludge">Sludge</span>
            </div>
            <div className="tank-state tank-state-after" style={{ clipPath: `inset(0 0 0 ${split}%)` }}>
              <span className="tank-label tank-label-floor">Clean floor</span>
            </div>
            <div className="tank-comparison-divider" style={{ left: `${split}%` }}><span><ArrowLeftRight size={17}/></span></div>
          </div>
        </div>
        <label className="tank-comparison-control">
          <span className="sr-only">Drag to compare before and after cleaning</span>
          <input type="range" min="25" max="75" value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="Compare tank before and after cleaning" />
        </label>
        <div className="tank-comparison-legend" aria-hidden="true"><span><i className="legend-dirty"/>Typical buildup</span><span><i className="legend-clean"/>Cleaned surface</span></div>
      </div>
      <figcaption>Illustration: what typically builds up inside a storage tank between cleanings. Drag the slider to compare.</figcaption>
    </figure>
    <p className="process-visual-note">We share genuine before-and-after photos from your own service directly with you. This illustration is a simple guide to the buildup that can collect over time.</p>
    <DurationAndPreparation />
    <div className="process-visual-cta"><div><span className="eyebrow">READY FOR A PROPERLY CLEAN TANK?</span><h2>Book a careful clean with VSH.</h2><p>Choose your tank type and size, then request a visit.</p></div><Link className="button button-primary" href="/prices">Book tank cleaning <ArrowRight size={16}/></Link></div>
  </section>
}
