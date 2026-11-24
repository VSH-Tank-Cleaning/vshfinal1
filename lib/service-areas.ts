export const serviceAreaGroups = [
  { title: 'Delhi NCR', description: 'Residential homes, apartment buildings and workplaces across Delhi and nearby NCR cities. Tell us your PIN code so we can confirm the visit details and any transport charge.', waterStorageDescription: 'Across Delhi NCR, properties range from independent homes and builder floors to apartment societies, PGs and workplaces. Depending on the building, water may be stored in private rooftop tanks, shared overhead tanks or underground reservoirs.', places: ['Delhi', 'North Delhi', 'South Delhi', 'Central Delhi', 'East Delhi', 'West Delhi'] },
  { title: 'West Delhi', description: 'Our Uttam Nagar base serves neighbourhoods across West Delhi, including Janakpuri, Mayapuri, Naraina, Paschim Vihar and nearby communities.', waterStorageDescription: 'West Delhi mixes independent homes and builder floors with apartment societies, rental properties and shops. Some properties use rooftop tanks alone, while shared buildings may also have underground sumps that need access coordinated in advance.', places: ['Janakpuri', 'Kirti Nagar', 'Mayapuri', 'Naraina', 'Paschim Vihar', 'Punjabi Bagh', 'Rajouri Garden', 'Uttam Nagar'] },
  { title: 'Central Delhi', description: 'Book overhead tanks and underground sumps for homes, apartments and commercial properties in Central Delhi.', waterStorageDescription: 'Central Delhi includes residential buildings, apartments and commercial properties. Tank placement and access vary by site: some rely on roof tanks, while others share an underground reservoir or sump.', places: ['Karol Bagh', 'Patel Nagar'] },
  { title: 'South Delhi', description: 'Plan a tank-cleaning visit for homes and shared properties in South Delhi; access and timing are confirmed before the team arrives.', waterStorageDescription: 'Homes, apartment communities and workplaces across South Delhi can have very different tank arrangements. Shared properties may need a block-wise plan, while independent homes can usually arrange access directly with the cleaning team.', places: ['Saket', 'Vasant Kunj'] },
  { title: 'South West Delhi', description: 'Coverage includes residential and commercial properties in Dwarka, Delhi Cantonment and neighbouring areas.', waterStorageDescription: 'South West Delhi includes residential colonies, apartment societies, independent homes and commercial properties. Many larger sites use underground sumps alongside overhead tanks, so it helps to confirm access to both before booking.', places: ['Delhi Cantt', 'Dwarka'] },
  { title: 'North West Delhi', description: 'Local visits are available for homes, apartment blocks and workplaces in Pitampura, Rohini and surrounding neighbourhoods.', waterStorageDescription: 'North West Delhi includes planned residential neighbourhoods such as Rohini and Pitampura, with DDA flats and CGHS societies alongside builder floors, independent homes and rental housing. Shared terraces, reservoirs and block-level tanks often need a coordinated schedule.', places: ['Pitampura', 'Rohini'] },
  { title: 'Uttar Pradesh', description: 'We serve selected NCR cities in Uttar Pradesh, including Noida, Greater Noida and Ghaziabad. Share your PIN code to confirm coverage.', waterStorageDescription: 'Noida, Greater Noida and Ghaziabad include apartment communities, standalone homes and commercial spaces. Larger properties may have a shared underground reservoir feeding several overhead tanks, so facility teams can help coordinate access and timing.', places: ['Ghaziabad', 'Greater Noida', 'Noida'] },
  { title: 'Haryana', description: 'Request a visit for homes, societies and businesses in Faridabad and Gurgaon; we confirm availability and travel details for your location.', waterStorageDescription: 'Faridabad and Gurgaon include independent homes, apartments, societies and workplaces. Shared buildings may use an underground reservoir and several overhead tanks, so a property manager can help organize access and a block-wise visit.', places: ['Faridabad', 'Gurgaon'] },
] as const

export function areaSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const uniqueNames = Array.from(new Set(serviceAreaGroups.flatMap(({ title, places }) => [title, ...places])))

export const serviceAreas = uniqueNames.map((name) => {
  const group = serviceAreaGroups.find(({ title }) => title === name)
    ?? serviceAreaGroups.find(({ places }) => (places as readonly string[]).includes(name))!
  const isGroup = group.title === name
  const list = isGroup ? group.places : []

  return {
    name,
    slug: areaSlug(name),
    group: isGroup ? name : group.title,
    coverageDescription: group.description,
    waterStorageDescription: group.waterStorageDescription,
    nearbyAreas: list,
    isGroup,
  }
})

export function getServiceArea(slug: string) {
  return serviceAreas.find((area) => area.slug === slug)
}

export const SERVICEABLE_PINCODE_PATTERN = '(110|121|122|201)[0-9]{3}'

const serviceablePincodePrefixes = ['110', '121', '122', '201'] as const

export function isSupportedPincode(value: string): boolean {
  return /^\d{6}$/.test(value) && serviceablePincodePrefixes.some((prefix) => value.startsWith(prefix))
}

const listedAreaNames = new Set([
  ...serviceAreaGroups.flatMap(({ title, places }) => [title, ...places]),
  'Gurugram',
  'GGN',
  'FBD',
].filter((name) => name !== 'Uttar Pradesh' && name !== 'Haryana').map((name) => name.toLowerCase()))

export function isListedServiceArea(value: string): boolean {
  return listedAreaNames.has(value.trim().toLowerCase())
}
