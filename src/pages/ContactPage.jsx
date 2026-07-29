import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiCheck, FiMail, FiMapPin, FiClock } from 'react-icons/fi'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  useEffect(() => {
    window.scrollTo(0, 0)
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
      { threshold: 0.1 }
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="page-contact" id="top">
      <div className="contact-progress-bar" id="progress" />
      
      <section className="section contact-hero">
        <div className="contact-bg-grid" aria-hidden="true" />
        <div className="container contact-container">
          
          {/* Left Column: Info */}
          <div className="contact-info reveal">
            <span className="eyebrow">Get in Touch</span>
            <h1 className="contact-title">
              Let&apos;s build <br />
              something <em>amazing.</em>
            </h1>
            
            <p className="contact-lead">
              Whether you&apos;re launching a new website, upgrading an existing platform, or building a React application, I&apos;d love to hear about your project.
            </p>

            <div className="contact-details">
              <a className="contact-detail-link" href="mailto:mk5334485@gmail.com">
                <FiMail className="icon" aria-hidden="true" />
                <span>mk5334485@gmail.com</span>
                <FiArrowUpRight className="arrow" aria-hidden="true" />
              </a>

              <div className="contact-meta-item">
                <FiMapPin className="icon" aria-hidden="true" />
                <span>Indore, Madhya Pradesh, India</span>
              </div>

              <div className="contact-meta-item">
                <FiClock className="icon" aria-hidden="true" />
                <span>IST Timezone — +91 6261909676</span>
              </div>
            </div>

            <div className="contact-socials">
              <span className="social-label">Elsewhere</span>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/mazhar-khan-545b32266/" target="_blank" rel="noreferrer" className="social-link">
                  LinkedIn
                  <FiArrowUpRight className="arrow-small" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="contact-form-container reveal">
            <form onSubmit={handleSubmit} className="contact-page-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="What should I call you?"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Where can I write back?"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectType">Project Type</label>
                <div className="select-wrapper">
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a project type</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="React Development">React Development</option>
                    <option value="WordPress Development">WordPress Development</option>
                    <option value="Shopify Development">Shopify Development</option>
                    <option value="Performance Optimization">Website Performance Optimization</option>
                    <option value="AI Automation & APIs">AI Automation & API Integration</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">The Project</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about the project, the objectives, and the timeline..."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`contact-submit-btn ${status === 'success' ? 'btn-success' : ''}`}
                disabled={status === 'submitting'}
              >
                {status === 'idle' && (
                  <>
                    Send Inquiry
                    <FiArrowUpRight className="icon-right" aria-hidden="true" />
                  </>
                )}
                {status === 'submitting' && 'Sending message...'}
                {status === 'success' && (
                  <>
                    Sent Successfully
                    <FiCheck className="icon-right" aria-hidden="true" />
                  </>
                )}
                {status === 'error' && 'Please fill in all fields'}
              </button>
              
              {status === 'success' && (
                <p className="status-msg success-msg">
                  Thank you! Your message has been sent. I will get back to you shortly.
                </p>
              )}
            </form>
          </div>

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

export default ContactPage
