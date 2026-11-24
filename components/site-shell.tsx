'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, MapPin, Menu, MessageCircle, Phone, ShoppingCart, X } from 'lucide-react'
import { CartProvider, useCart } from './tank-cart'
import { PriceCalculator } from './price-calculator'
import { ContactQuestion } from './contact-question'

const nav = [
  ['Services', '/services'], ['Prices', '/prices'], ['Areas', '/areas'], ['Process', '/processes'],
  ['Reviews', '/reviews'], ['Guides', '/guides'], ['About us', '/about-us'],
] as const

function Header() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  return <header className="reference-header">
    <div className="reference-header-inner">
      <Link className="reference-brand" href="/" aria-label="VSH Tank Cleaning home"><Image className="reference-brand-logo" src="/vsh-logo.jpg" alt="" width={50} height={50} priority sizes="(max-width: 600px) 45px, 50px" /><span className="reference-brand-copy" aria-hidden="true">VSH TANK CLEANING</span></Link>
      <nav className="reference-nav" aria-label="Main navigation">{nav.map(([label, href]) => <Link className={path === href ? 'reference-nav-link active' : 'reference-nav-link'} href={href} key={href}>{label}</Link>)}</nav>
      <div className="reference-header-actions"><a className="header-phone" href="tel:9599057079"><Phone size={15}/><span>+91 95990 57079</span></a><Link className="reference-cart" href="/cart" aria-label={`Cart, ${count} items`}><ShoppingCart size={19}/>{count > 0 && <b>{count}</b>}</Link><Link className="header-book" href="/prices">Book cleaning <ArrowRight size={15}/></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button></div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}<ArrowRight size={15}/></Link>)}<Link href="/cart" onClick={() => setOpen(false)}>Cart<ShoppingCart size={16}/></Link><a href="tel:9599057079">Call +91 95990 57079<Phone size={16}/></a></nav>}
    </div>
  </header>
}

function FloatingActions() {
  const pathname = usePathname()
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false)

  useEffect(() => {
    const section = document.getElementById('contact-form')
    if (!section) {
      setIsContactVisible(false)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsContactVisible(entry.isIntersecting)
    }, { threshold: 0.01 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    const calculator = document.querySelector('.price-calculator')
    if (!calculator) {
      setIsCalculatorVisible(false)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsCalculatorVisible(entry.isIntersecting)
    }, { threshold: 0.01 })
    observer.observe(calculator)
    return () => observer.disconnect()
  }, [pathname])

  if (pathname === '/cart' || isContactVisible || isCalculatorVisible) return null
  return <>
    <nav className="floating-contact-actions" aria-label="Quick contact">
      <Link className="floating-contact-action floating-contact-book" href="/prices"><ArrowRight size={17} aria-hidden="true"/><span>Book now</span></Link>
      <a className="floating-contact-action floating-contact-call" href="tel:9599057079"><Phone size={17} aria-hidden="true"/><span>Call us</span></a>
      <a className="floating-contact-action floating-contact-whatsapp" aria-label="Chat with VSH on WhatsApp" href="https://wa.me/919599057079?text=Hi%2C%20I%27d%20like%20to%20book%20tank%20cleaning" target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true"/><span>WhatsApp</span></a>
    </nav>
    <ContactQuestion />
  </>
}

function Footer() {
  return <footer className="reference-footer"><div className="reference-footer-inner"><div className="footer-about"><Link className="reference-brand footer-brand" href="/" aria-label="VSH Tank Cleaning home"><Image className="reference-brand-logo" src="/vsh-logo.jpg" alt="" width={50} height={50} sizes="(max-width: 600px) 45px, 50px" /><span className="reference-brand-copy" aria-hidden="true">VSH TANK CLEANING</span></Link><p>Overhead and underground water tank cleaning for homes, societies and businesses across Delhi NCR.</p><address className="footer-address"><MapPin size={16} aria-hidden="true"/><span><strong>VSH Water Tank Cleaning</strong>C-194, Bhagwati Vihar, Uttam Nagar, New Delhi, Delhi 110059<br/>2387, Faiz Road, Karol Bagh, New Delhi, Delhi 110005<br/>Sub Branch: Mahipalpur, Delhi 110037</span></address><div className="footer-contact-row"><Phone size={16}/><a href="tel:+919599057079">+91 95990 57079</a></div><p className="footer-hours">Open every day · 9 AM–7 PM</p><p className="footer-offer">Pay Online to get extra 10% off</p><a className="footer-whatsapp" href="https://wa.me/919599057079?text=Hi%2C%20I%27d%20like%20to%20book%20tank%20cleaning" target="_blank" rel="noreferrer">WhatsApp our team <ArrowRight size={15}/></a></div><div className="footer-link-column"><strong>Services</strong><Link href="/services">Water tank cleaning</Link><Link href="/services">Overhead tank cleaning</Link><Link href="/services">Underground tank cleaning</Link><Link href="/services">Residential & commercial</Link></div><div className="footer-link-column"><strong>Service areas</strong><Link href="/areas">Delhi</Link><Link href="/areas">Noida, Greater Noida &amp; Ghaziabad</Link><Link href="/areas">Gurgaon &amp; Faridabad</Link></div><div className="footer-link-column"><strong>Help & information</strong><Link href="/prices">Price list</Link><Link href="/prices">Book cleaning</Link><Link href="/processes">Our cleaning process</Link><Link href="/guides">Tank care guides</Link><Link href="/about-us">About VSH</Link><Link href="/contact">Contact</Link></div></div><div className="reference-footer-bottom"><span>© {new Date().getFullYear()} VSH Tank Cleaning</span><span>Clean water starts with a clean tank.</span></div></footer>
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return <CartProvider><Header/><main>{pathname !== '/' && <div className="sitewide-price-calculator"><PriceCalculator /></div>}{children}</main><Footer/><FloatingActions/></CartProvider>
}
