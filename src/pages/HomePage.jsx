import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCheck, FiMail } from 'react-icons/fi'
import profileImg from '../assets/mazhar_profile.png'
import project1 from '../assets/projects/yourdesignguys.png'
import project2 from '../assets/projects/urbanelysian.png'
import project3 from '../assets/projects/sortedscoop.png'
import project4 from '../assets/projects/sanjivcherian.png'
import project5 from '../assets/projects/cornerstonehealth.png'
import project6 from '../assets/projects/cvshealthcare.png'

const capabilities = [
  'React',
  'JavaScript',
  'WordPress',
  'Shopify',
  'WooCommerce',
  'CSS',
  'Website Optimization',
  'AI & Automation',
]

const projects = [
  [
    '01',
    'React · Website',
    'YOUR DESIGN',
    'GUYS',
    project1,
    'https://yourdesignguys.com/',
  ],
  [
    '02',
    'WordPress · Ecommerce',
    'URBAN',
    'ELYSIAN',
    project2,
    'https://urbanelysian.com/',
  ],
  [
    '03',
    'WordPress · Ecommerce',
    'SORTED',
    'SCOOP',
    project3,
    'https://www.sortedscoop.com/',
  ],
  [
    '04',
    'WordPress · Branding',
    'SANJIV',
    'CHERIAN',
    project4,
    'https://sanjivcherian.com/',
  ],
  [
    '05',
    'WordPress · Medical',
    'CORNERSTONE',
    'HEALTH',
    project5,
    'https://cornerstonehealthmd.com/',
  ],
  [
    '06',
    'WordPress · Corporate',
    'CVS',
    'HEALTHCARE',
    project6,
    'https://cvshealthcare.co.in/',
  ],
]

const services = [
  ['01', 'Frontend Development', 'Building responsive, interactive, and modern user interfaces using React, JavaScript, HTML5, CSS3, and CSS.', 'React · JavaScript · HTML5 · CSS3 · CSS'],
  ['02', 'React Development', 'Developing scalable React applications with reusable components, optimized performance, and maintainable architecture.', 'React · Reusable Components · Optimization'],
  ['03', 'WordPress Development', 'Creating custom WordPress websites, Elementor pages, WooCommerce stores, and fully responsive business websites.', 'WordPress · WooCommerce · Elementor'],
  ['04', 'Shopify Development', 'Developing modern Shopify storefronts with optimized user experiences and responsive ecommerce interfaces.', 'Shopify · Liquid · Ecommerce UI'],
  ['05', 'Website Performance Optimization', 'Improving Core Web Vitals, loading speed, SEO performance, accessibility, and overall website efficiency.', 'Lighthouse · Core Web Vitals · SEO'],
  ['06', 'AI Automation & API Integration', 'Building intelligent workflows using AI tools, APIs, and automation platforms to streamline business processes.', 'AI · OpenAI · APIs · Automation · n8n'],
]

const clients = ['React', 'WordPress', 'Shopify', 'WooCommerce', 'Elementor', 'JavaScript', 'GSAP', 'CSS', 'Git', 'Figma', 'n8n', 'OpenAI']

function SectionTitle({ eyebrow, words }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h2>
        {words.map((word) => (
          <strong key={word}>{word}</strong>
        ))}
      </h2>
    </div>
  )
}

function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '028a6fcf-6d75-430c-99d7-84f938c538cb',
          subject: `New Portfolio Inquiry from ${formData.name}`,
          from_name: 'Mazhar Khan Portfolio',
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          message: formData.message,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setStatus('success')
        setFormData({ name: '', email: '', projectType: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  }, [])

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timeline = document.querySelector('.process-timeline')
    if (!timeline) return undefined

    const steps = Array.from(timeline.querySelectorAll('.process-step'))
    let rafId = 0

    const updateTimeline = () => {
      const rect = timeline.getBoundingClientRect()
      // Start animating when section top enters bottom of viewport
      // Finish when section bottom reaches top of viewport
      const start = window.innerHeight * 1.0
      const end = -rect.height * 0.1
      const rawProgress = (start - rect.top) / (start - end)
      const progress = Math.min(1, Math.max(0, rawProgress))

      timeline.style.setProperty('--process-progress', `${progress * 100}%`)
      steps.forEach((step, index) => {
        const threshold = index / steps.length
        step.classList.toggle('is-active', progress >= threshold)
      })
    }

    const requestUpdate = () => {
      window.cancelAnimationFrame(rafId)
      rafId = window.requestAnimationFrame(updateTimeline)
    }

    updateTimeline()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <main id="top" className="page-home">
      <section className="hero-section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <p className="hero-eyebrow">Frontend Developer • React Developer • WordPress Specialist</p>
          <h1 className="hero-hl">
            <span className="line"><span>BUILD.</span></span>
            <span className="line"><span><em>MODERN.</em></span></span>
            <span className="line"><span>WEB EXPERIENCES.</span></span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-desc">
              I build fast, scalable, and user-friendly websites that combine clean design with high-performance development. My expertise spans React, WordPress, Shopify, and modern web technologies to create digital experiences that deliver real business value.
            </p>
            <div className="hero-stats" aria-label="Experience statistics">
              {[
                ['2+', 'Years Experience'],
                ['20+', 'Projects Delivered'],
                ['React + WP', 'Development Focus'],
                ['100%', 'Responsive Websites'],
                ['100%', 'Skill Mastery'],
              ].map(([value, label]) => (
                <div className="hero-stat" key={label}>
                  <div className="hsn">{value}</div>
                  <div className="hsl">{label}</div>
                </div>
              ))}
            </div>
            <div className="cta-row" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <a className="final-cta" href="#work" style={{ background: 'var(--acid, #e8ff47)', color: '#000', padding: '12px 28px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.1em', fontSize: '13px', display: 'inline-flex', alignItems: 'center', transition: 'all 0.3s ease' }}>
                View My Work
              </a>
              <a className="final-cta" href="#contact" style={{ border: '1px solid var(--line-strong, rgba(242,242,237,0.25))', color: '#fff', padding: '12px 28px', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.1em', fontSize: '13px', display: 'inline-flex', alignItems: 'center', transition: 'all 0.3s ease' }}>
                Let's Connect
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee reveal" aria-hidden="true">
        <div className="marquee__track">
          {[...capabilities, ...capabilities].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section id="work" className="section section--work">
        <div className="container">
          <div className="section-head">
            <div className="reveal">
              <SectionTitle eyebrow="Selected Work" words={['Recent', 'Projects']} />
            </div>
            <a className="text-link reveal" href="#work">
              View All Work
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <div className="project-grid">
            {projects.map(([number, meta, lineOne, lineTwo, image, url]) => (
              <article className="project-card reveal" key={number}>
                <div className="project-card__visual">
                  <img src={image} alt={`${lineOne} ${lineTwo}`} loading="lazy" />
                  <span>{number}</span>
                </div>
                <div className="project-card__body">
                  <p>{meta}</p>
                  <h3>
                    <span>{lineOne}</span>
                    <span>{lineTwo}</span>
                  </h3>
                  <a href={url} target="_blank" rel="noreferrer">
                    Visit Website
                    <FiArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section section--about">
        <div className="container about-grid">
          <div className="portrait-panel reveal">
            <img src={profileImg} alt="Mazhar Khan" />
            <p>Frontend Developer & WordPress Developer. 2+ Years Experience.</p>
          </div>
          <div className="reveal">
            <SectionTitle eyebrow="About" words={['Turning', 'Ideas', 'Into', 'Digital', 'Experiences.']} />
            <div className="rich-copy">
              <p>
                Hi, I&apos;m Mazhar Khan, a Frontend Developer and WordPress Specialist based in Indore, India.
              </p>
              <p>
                For the past two years, I&apos;ve been helping businesses, startups, and agencies build modern websites that are fast, responsive, and easy to maintain. I specialize in React, WordPress, Shopify, website optimization, API integrations, and AI-powered workflows.
              </p>
            </div>
            <a className="text-link" href="/about">
              View Full About Page
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container">
          <div className="section-head section-head--stacked reveal">
            <SectionTitle eyebrow="What I Do" words={['My', 'Services']} />
            <p>I build modern web applications and optimize content management systems for maximum performance and growth.</p>
          </div>
          <div className="service-list">
            {services.map(([number, title, copy, tags]) => (
              <article className="service-row reveal" key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <small>{tags}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="clients" className="section section--clients">
        <div className="container">
          <div className="reveal">
            <SectionTitle eyebrow="Tech Stack" words={['Skills', '& Tools']} />
            <p className="section-kicker">Modern technologies, frameworks, and workflows I use daily.</p>
          </div>
          <div className="client-grid">
            {clients.map((client) => (
              <div className="client-logo reveal" key={client}>{client}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--process">
        <div className="container process-block">
          <div className="process-heading reveal">
            <SectionTitle eyebrow="How I Work" words={['Development', 'Process']} />
          </div>
          <div className="process-timeline reveal" style={{ '--process-progress': '0%' }}>
            <div className="process-timeline__line" aria-hidden="true" />
            {['Discover', 'Plan', 'Develop', 'Launch'].map((item, index) => (
              <article className="process-step" key={item}>
                <span className="process-step__dot" aria-hidden="true" />
                <strong className="process-step__number">{String(index + 1).padStart(2, '0')}</strong>
                <h3>{item}</h3>
                <p>
                  {[
                    'Understanding business requirements, project goals, target audience, and technical needs before development begins.',
                    'Creating scalable architecture, selecting the right technologies, and planning an efficient development workflow.',
                    'Building responsive, optimized, and maintainable applications with clean code and reusable components.',
                    'Testing, optimization, deployment, and post-launch support to ensure reliable performance.',
                  ][index]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container contact-grid">
          <div className="reveal">
            <SectionTitle eyebrow="Get in Touch" words={["Let's", 'Build', 'Something', 'Amazing.']} />
            <p>
              Whether you're launching a new website, upgrading an existing platform, or building a React application, I'd love to hear about your project.
            </p>
            <a className="mail-link" href="mailto:mk5334485@gmail.com">
              <FiMail aria-hidden="true" />
              mk5334485@gmail.com
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <form onSubmit={handleSubmit} className="contact-form reveal">
            <input 
              name="name"
              aria-label="Your Name" 
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input 
              name="email"
              type="email" 
              aria-label="Email" 
              placeholder="Email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select 
              name="projectType"
              aria-label="Project Type" 
              value={formData.projectType}
              onChange={handleChange}
            >
              <option value="" disabled>Project Type</option>
              <option value="Frontend Development">Frontend Development</option>
              <option value="React Development">React Development</option>
              <option value="WordPress Development">WordPress Development</option>
              <option value="Shopify Development">Shopify Development</option>
              <option value="Website Optimization">Website Optimization</option>
              <option value="AI Automation & APIs">AI Automation & APIs</option>
            </select>
            <textarea 
              name="message"
              aria-label="Message" 
              placeholder="Tell me about the project" 
              rows="5" 
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'idle' && 'Send Inquiry'}
              {status === 'submitting' && 'Sending...'}
              {status === 'success' && 'Sent Successfully!'}
              {status === 'error' && 'Error! Try Again'}
              <FiCheck aria-hidden="true" />
            </button>
            {status === 'success' && (
              <p style={{ gridColumn: 'span 2', color: 'var(--acid)', fontSize: '13px', marginTop: '10px', fontFamily: 'Barlow' }}>
                Thank you! Your inquiry has been forwarded directly to Mazhar's email.
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <a href="#top" className="site-footer__brand" aria-label="Back to top">
            <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.05em', color: 'var(--acid, #e8ff47)', fontFamily: "'Barlow Condensed', sans-serif" }}>MK</span>
          </a>
          <div className="site-footer__links">
            <a href="https://www.linkedin.com/in/mazhar-khan-545b32266/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:mk5334485@gmail.com">Email</a>
          </div>
          <p>© 2026 Mazhar Khan</p>
        </div>
      </footer>
    </main>
  )
}

export default HomePage
