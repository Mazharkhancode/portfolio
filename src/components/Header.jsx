import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '#services' },
  { label: 'Skills', href: '#clients' },
  { label: 'Contact', href: '/contact' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const close = () => setIsOpen(false)

  const renderLink = (label, href, onClick) => {
    const isHome = location.pathname === '/'

    if (href.startsWith('/')) {
      return (
        <Link to={href} className={location.pathname === href ? 'active' : ''} onClick={onClick}>
          {label}
        </Link>
      )
    }

    if (!isHome) {
      return (
        <Link to={`/${href}`} onClick={onClick}>
          {label}
        </Link>
      )
    }

    return (
      <a href={href} onClick={onClick}>
        {label}
      </a>
    )
  }

  const renderCta = (onClick) => {
    return (
      <Link className="nav-cta" to="/contact" onClick={onClick}>
        Start a Project
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    )
  }

  return (
    <>
      {/* ── Desktop / Main Nav ── */}
      <nav className={`site-nav${isScrolled ? ' site-nav--scrolled' : ''}`} id="nav" aria-label="Primary navigation">
        <Link 
          className="nav-logo" 
          to="/" 
          aria-label="Mazhar Khan home"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            }
          }}
        >
          <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.05em', color: 'var(--acid, #e8ff47)', fontFamily: "'Barlow Condensed', sans-serif" }}>MK</span>
        </Link>

        <ul className="nav-links" role="list">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              {renderLink(label, href)}
            </li>
          ))}
        </ul>

        {renderCta()}

        {/* Hamburger (3-bar) */}
        <button
          className={`nav-hamburger${isOpen ? ' is-active' : ''}`}
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`nav-drawer${isOpen ? ' is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="nav-drawer__header">
          <Link 
            className="nav-logo" 
            to="/" 
            onClick={() => {
              close();
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }
            }}
          >
            <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.05em', color: 'var(--acid, #e8ff47)', fontFamily: "'Barlow Condensed', sans-serif" }}>MK</span>
          </Link>
          <button
            className="nav-drawer__close"
            type="button"
            aria-label="Close menu"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <ul className="nav-drawer__links" role="list">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              {renderLink(label, href, close)}
            </li>
          ))}
        </ul>

        <div className="nav-drawer__footer">
          {['X', 'Instagram', 'LinkedIn', 'Behance'].map((s) => {
            const isAboutRoute = location.pathname === '/about'
            if (isAboutRoute) {
              return (
                <Link key={s} to="/#contact" onClick={close}>{s}</Link>
              )
            }
            return (
              <a key={s} href="#contact" onClick={close}>{s}</a>
            )
          })}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div className="nav-backdrop" aria-hidden="true" onClick={close} />
      )}
    </>
  )
}

export default Header

