import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SectionPage } from '@/components/section-page'

const sections = ['areas', 'prices', 'reviews', 'processes', 'services', 'guides', 'about-us', 'contact', 'cart']
const labels: Record<string, string> = { areas: 'Areas', prices: 'Prices', reviews: 'Reviews', processes: 'Our Process', services: 'Services', guides: 'Guides', 'about-us': 'About Us', contact: 'Contact', cart: 'Your Cart' }

export function generateStaticParams() { return sections.map((section) => ({ section })) }
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params
  const label = labels[section]
  if (section === 'about-us') return { title: 'About VSH Tank Cleaning | Delhi NCR', description: 'Meet VSH Tank Cleaning. Our mission, five-step process, service areas, honest pricing and team at work across Delhi NCR.' }
  return label ? { title: `${label} | VSH Tank Cleaning`, description: `${label} for professional water tank cleaning across Delhi NCR.` } : {}
}
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!sections.includes(section)) notFound()
  return <SectionPage slug={section}/>
}
