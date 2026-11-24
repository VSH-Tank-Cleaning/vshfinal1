import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AreaDetailPage } from '@/components/area-detail-page'
import { getServiceArea, serviceAreas } from '@/lib/service-areas'

export function generateStaticParams() {
  return serviceAreas.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const area = getServiceArea(slug)
  if (!area) return {}
  return {
    title: `Water Tank Cleaning in ${area.name} | VSH Tank Cleaning`,
    description: `VSH Tank Cleaning serves ${area.name} across Delhi NCR from Uttam Nagar. Check local coverage, PIN-code charges and prices before booking.`,
  }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getServiceArea(slug)) notFound()
  return <AreaDetailPage slug={slug}/>
}
