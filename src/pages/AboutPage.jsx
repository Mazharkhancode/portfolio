import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import profileImg from '../assets/mazhar_profile.png'

gsap.registerPlugin(ScrollTrigger)

// Outer disciplines list for system map
const systemNodes = [
  { id: 'fd', label: 'Frontend Dev', orbit: 1, desc: 'Building responsive, interactive, and modern user interfaces using React, JavaScript, HTML5, CSS3, and SCSS.' },
  { id: 'rd', label: 'React Developer', orbit: 1, desc: 'Developing scalable React applications with reusable components and optimized performance.' },
  { id: 'wp', label: 'WordPress Spec.', orbit: 1, desc: 'Creating custom WordPress websites, Elementor pages, WooCommerce stores, and responsive layouts.' },

  { id: 'sd', label: 'Shopify Dev', orbit: 2, desc: 'Developing storefronts with optimized user experiences and responsive ecommerce interfaces.' },
  { id: 'po', label: 'Performance Opt.', orbit: 2, desc: 'Improving Core Web Vitals, loading speed, SEO, accessibility, and efficiency.' },
  { id: 'ai', label: 'AI Automation', orbit: 2, desc: 'Building workflows using AI tools, APIs, and automation platforms to streamline business.' },

  { id: 'api', label: 'API Integration', orbit: 3, desc: 'Connecting backend REST APIs, services, and automating systems.' },
  { id: 'wd', label: 'Web Design', orbit: 3, desc: 'Creating modern, clean layouts and interactive user interfaces.' },
]

function AboutPage() {
  const containerRef = useRef(null)
  const constellationRef = useRef(null)
  const sysmapRef = useRef(null)

  // System map interaction states
  const [activeNode, setActiveNode] = useState(null)
  const [lineCoords, setLineCoords] = useState(null)
  const [nodeStory, setNodeStory] = useState({
    title: 'Hover a node',
    desc: 'Each node is a discipline. Together they behave as one system.',
  })

  // Cities switching states (Origin Pinned)
  const [cityIndex, setCityIndex] = useState(1)

  // Ref pointer to avoid stale closure scopes inside the animation loop
  const activeNodeRef = useRef(null)
  useEffect(() => {
    activeNodeRef.current = activeNode
  }, [activeNode])

  // System nodes orbit animation loop
  useEffect(() => {
    // Symmetrical, well-distributed initial angles with uniform speed to maintain relative distance
    const config = [
      { id: 'fd', orbit: 1, angle: 0, speed: 0.0012 },
      { id: 'rd', orbit: 1, angle: (2 * Math.PI) / 3, speed: 0.0012 },
      { id: 'wp', orbit: 1, angle: (4 * Math.PI) / 3, speed: 0.0012 },

      { id: 'sd', orbit: 2, angle: Math.PI / 6, speed: 0.0012 },
      { id: 'po', orbit: 2, angle: Math.PI / 6 + (2 * Math.PI) / 3, speed: 0.0012 },
      { id: 'ai', orbit: 2, angle: Math.PI / 6 + (4 * Math.PI) / 3, speed: 0.0012 },

      { id: 'api', orbit: 3, angle: Math.PI / 3, speed: 0.0012 },
      { id: 'wd', orbit: 3, angle: Math.PI / 3 + Math.PI, speed: 0.0012 },
    ]

    const radii = {
      1: { rx: 24, ry: 22 },
      2: { rx: 38, ry: 34 },
      3: { rx: 50, ry: 44 },
    }

    let angles = config.map(c => c.angle)
    let rafId

    const loop = () => {
      // If ANY node is active/hovered, pause ALL rotation
      const isAnyHovered = !!activeNodeRef.current

      config.forEach((node, idx) => {
        if (!isAnyHovered) {
          angles[idx] = (angles[idx] + node.speed) % (2 * Math.PI)
        }

        const r = radii[node.orbit]
        const x = 50 + r.rx * Math.cos(angles[idx])
        const y = 50 + r.ry * Math.sin(angles[idx])

        const el = document.getElementById(`node-${node.id}`)
        if (el) {
          el.style.left = `${x}%`
          el.style.top = `${y}%`
        }
      })

      rafId = requestAnimationFrame(loop)
    }

    loop()

    return () => cancelAnimationFrame(rafId)
  }, [])

  // Character splitter helper
  const splitText = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="char"
        style={{
          display: 'inline-block',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}
      >
        {char}
      </span>
    ))
  }

  // Dynamic SVG connection line positioning
  const handleMouseEnterNode = (node, e) => {
    setActiveNode(node.id)
    setNodeStory({ title: node.label, desc: node.desc })

    const mapEl = sysmapRef.current
    const coreEl = document.getElementById('coreNode')
    const nodeEl = e.currentTarget

    if (mapEl && coreEl && nodeEl) {
      const mapRect = mapEl.getBoundingClientRect()
      const coreRect = coreEl.getBoundingClientRect()
      const nodeRect = nodeEl.getBoundingClientRect()

      const x1 = (coreRect.left + coreRect.width / 2) - mapRect.left
      const y1 = (coreRect.top + coreRect.height / 2) - mapRect.top
      const x2 = (nodeRect.left + nodeRect.width / 2) - mapRect.left
      const y2 = (nodeRect.top + nodeRect.height / 2) - mapRect.top

      setLineCoords({ x1, y1, x2, y2 })
    }
  }

  const handleMouseLeaveNode = () => {
    setActiveNode(null)
    setLineCoords(null)
    setNodeStory({
      title: 'Hover a node',
      desc: 'Each node is a discipline. Together they behave as one system.',
    })
  }

  // Decode text loading hook
  useEffect(() => {
    const el = document.getElementById('arrival-h')
    if (!el) return undefined

    const line1El = el.querySelector('.line-1')
    const line2El = el.querySelector('.line-2')
    if (!line1El || !line2El) return undefined

    const originalLine1 = "Turning Ideas Into"
    const originalLine2 = "Digital Experiences."
    let iter1 = 0
    let iter2 = 0
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&'

    const interval = setInterval(() => {
      if (iter1 < originalLine1.length) {
        const d1 = originalLine1.split('').map((c, i) => {
          if (i < iter1) return c
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
        
        const partA = d1.substring(0, 7)
        const partB = d1.substring(7)
        line1El.innerHTML = `${partA}<span class="outline">${partB}</span>`
        iter1 += 0.5
      } else {
        line1El.innerHTML = `Turning Ideas <span class="outline">Into</span>`
      }

      if (iter1 >= originalLine1.length / 2) {
        if (iter2 < originalLine2.length) {
          const d2 = originalLine2.split('').map((c, i) => {
            if (i < iter2) return c
            return chars[Math.floor(Math.random() * chars.length)]
          }).join('')
          
          const partA = d2.substring(0, 7)
          const partB = d2.substring(7)
          line2El.innerHTML = `<span class="it accent">Digital</span>${partB}`
          iter2 += 0.5
        } else {
          line2El.innerHTML = `<span class="it accent">Digital</span> Experiences.`
        }
      }

      if (iter1 >= originalLine1.length && iter2 >= originalLine2.length) {
        clearInterval(interval)
        line1El.innerHTML = `Turning Ideas <span class="outline">Into</span>`
        line2El.innerHTML = `<span class="it accent">Digital</span> Experiences.`
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  // Top scroll progress bar & general reveal items
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0
      const progEl = document.getElementById('progress')
      if (progEl) progEl.style.width = `${progress}%`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

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
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  // Constellation star system canvas
  useEffect(() => {
    const canvas = constellationRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const particles = []
    const particleCount = 45

    class Particle {
      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.radius = Math.random() * 1.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(242, 242, 237, 0.45)'
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    const drawLinks = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(242, 242, 237, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      drawLinks()
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // GSAP animations with scoping/React 18 StrictMode compatibility
  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. City pinned timeline switching (La Chaux-de-Fonds ➔ Paris ➔ New York)
      const cities = document.querySelectorAll('.city')
      const counterEl = document.querySelector('.origin-counter b')

      // Set initial values (y: 60 for fade-ins)
      gsap.set(cities, { opacity: 0, autoAlpha: 0 })
      gsap.set(cities[0], { opacity: 1, autoAlpha: 1 })
      
      const cityContents = document.querySelectorAll('.city .city-content')
      gsap.set(cityContents, { y: 60 })
      gsap.set(cityContents[0], { y: 0 })

      const cityTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#origin-pin',
          start: 'top top',
          end: '+=120%',
          pin: '#origin-stage',
          scrub: true,
        }
      })

      cityTl
        // City 0 (Switzerland) fades out & shifts up; City 1 (Paris) fades in & shifts up to center
        .to(cities[0], { opacity: 0, autoAlpha: 0, duration: 0.5 }, 0.3)
        .to(cityContents[0], { y: -60, duration: 0.5 }, 0.3)
        .to(cities[1], { opacity: 1, autoAlpha: 1, duration: 0.5 }, 0.5)
        .to(cityContents[1], { y: 0, duration: 0.5 }, 0.5)
        .call(() => { if (counterEl) counterEl.textContent = '02' }, null, 0.5)

        // City 1 (Paris) fades out & shifts up; City 2 (New York) fades in & shifts up to center
        .to(cities[1], { opacity: 0, autoAlpha: 0, duration: 0.5 }, 1.3)
        .to(cityContents[1], { y: -60, duration: 0.5 }, 1.3)
        .to(cities[2], { opacity: 1, autoAlpha: 1, duration: 0.5 }, 1.5)
        .to(cityContents[2], { y: 0, duration: 0.5 }, 1.5)
        .call(() => { if (counterEl) counterEl.textContent = '03' }, null, 1.5)

        // Reverse labels for scroll direction reversals
        .call(() => { if (counterEl) counterEl.textContent = '01' }, null, 0.2)
        .call(() => { if (counterEl) counterEl.textContent = '02' }, null, 1.2)

      // 2. Opposites Split Pinned shifts (Staggered merge from sides to center)
      const splitRows = document.querySelectorAll('.vs-row')
      
      // Set initial state
      splitRows.forEach((row) => {
        const leftEl = row.querySelector('.l')
        const rightEl = row.querySelector('.r')
        const crossEl = row.querySelector('.x')
        if (leftEl && rightEl && crossEl) {
          gsap.set(leftEl, { x: -180, opacity: 0 })
          gsap.set(rightEl, { x: 180, opacity: 0 })
          gsap.set(crossEl, { scale: 0, opacity: 0 })
        }
      })

      const splitTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#split-pin',
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 1,
        }
      })

      splitRows.forEach((row, idx) => {
        const leftEl = row.querySelector('.l')
        const rightEl = row.querySelector('.r')
        const crossEl = row.querySelector('.x')
        const timeOffset = idx * 0.45

        if (leftEl && rightEl && crossEl) {
          splitTl
            .to(leftEl, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, timeOffset)
            .to(rightEl, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, timeOffset)
            .to(crossEl, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)' }, timeOffset + 0.3)
        }
      })

      // 2.5. HUMAN × AI Pinned Scroll Scramble and Slide Merge
      const mergeH = document.getElementById('mergeH')
      if (mergeH) {
        const humanEl = mergeH.querySelector('.human-text')
        const aiEl = mergeH.querySelector('.ai-text')
        const crossEl = mergeH.querySelector('.x')
        const smallEl = document.querySelector('#merge .small')

        if (humanEl && aiEl) {
          const originalHuman = "HUMAN"
          const originalAI = "AI"
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%"
          let hasDecoded = false

          const startDecode = () => {
            if (hasDecoded) return
            hasDecoded = true
            let iterHuman = 0
            let iterAI = 0

            const interval = setInterval(() => {
              if (iterHuman < originalHuman.length) {
                humanEl.textContent = originalHuman.split('').map((c, i) => {
                  if (i < iterHuman) return c
                  return chars[Math.floor(Math.random() * chars.length)]
                }).join('')
                iterHuman += 0.3
              } else {
                humanEl.textContent = originalHuman
              }

              if (iterAI < originalAI.length) {
                aiEl.textContent = originalAI.split('').map((c, i) => {
                  if (i < iterAI) return c
                  return chars[Math.floor(Math.random() * chars.length)]
                }).join('')
                iterAI += 0.3
              } else {
                aiEl.textContent = originalAI
              }

              if (iterHuman >= originalHuman.length && iterAI >= originalAI.length) {
                clearInterval(interval)
                humanEl.textContent = originalHuman
                aiEl.textContent = originalAI
              }
            }, 35)
          }

          // Initial positions (Blurred, wide letter tracking, scaled down)
          gsap.set(humanEl, { filter: 'blur(15px)', letterSpacing: '0.25em', opacity: 0, scale: 0.9 })
          gsap.set(aiEl, { filter: 'blur(15px)', letterSpacing: '0.25em', opacity: 0, scale: 0.9 })
          gsap.set(crossEl, { scale: 0, opacity: 0, rotate: -180 })
          gsap.set(smallEl, { opacity: 0, y: 15 })

          const mergeTl = gsap.timeline({
            scrollTrigger: {
              trigger: '#merge',
              start: 'top top',
              end: '+=75%',
              pin: true,
              scrub: 1,
              onEnter: () => {
                startDecode()
              },
              onLeaveBack: () => {
                hasDecoded = false
              }
            }
          })

          mergeTl
            .to(humanEl, { filter: 'blur(0px)', letterSpacing: '0em', opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
            .to(aiEl, { filter: 'blur(0px)', letterSpacing: '0em', opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 0)
            .to(crossEl, { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.5)' }, 0.4)
            .to(smallEl, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.5)
        }
      }

      // 3. Taste Pinned word storm & flash highlight (GSAP Timeline)
      const noiseWords = document.querySelectorAll('.noise-word')
      const tasteFlash = document.getElementById('taste-flash')
      const tasteStatement = document.querySelector('#taste-core .statement')
      const tasteWord = document.getElementById('tasteWord')
      const tasteAfter = document.querySelector('#taste-core .after')

      // Set initial values
      gsap.set(tasteFlash, { opacity: 0 })
      gsap.set(tasteWord, { opacity: 0, scale: 0.85 })
      gsap.set(tasteAfter, { opacity: 0 })
      gsap.set(tasteStatement, { opacity: 1 })
      gsap.set(noiseWords, { opacity: 0, scale: 0.7, filter: 'blur(0px)' })

      const tasteTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#taste-pin',
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 1,
        }
      })

      // Step 1: Words appear, scale up, blur out, and disappear
      noiseWords.forEach((word, idx) => {
        // Random drift direction for organic feel
        const xOffset = (idx % 2 === 0 ? 40 : -40)
        const yOffset = (idx % 3 === 0 ? -50 : 50)

        tasteTl
          // Phase A: Scale up and fade in
          .to(word, {
            x: xOffset * 0.5,
            y: yOffset * 0.5,
            opacity: 0.7,
            scale: 1.3,
            duration: 0.6,
            ease: 'power1.out'
          }, 0)
          // Phase B: Grow larger, blur, and fade out
          .to(word, {
            x: xOffset,
            y: yOffset,
            opacity: 0,
            scale: 2.4,
            filter: 'blur(12px)',
            duration: 0.7,
            ease: 'power1.in'
          }, 0.6)
      })

      // Step 2: Bright solid yellow flash coverage
      tasteTl
        .to(tasteFlash, { opacity: 1, duration: 0.6, ease: 'power2.in' }, 1.2)
        
        // Step 3: Swap contents at the peak of the flash (t=1.8s)
        .set(tasteStatement, { opacity: 0 }, 1.8)
        .set(noiseWords, { opacity: 0 }, 1.8)
        .set(tasteWord, { opacity: 1 }, 1.8)
        .set(tasteAfter, { opacity: 1 }, 1.8)
        
        // Step 4: Flash fades out, revealing the TASTE word
        .to(tasteFlash, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.8)
        
        // Step 5: Scale the TASTE word slightly
        .to(tasteWord, { scale: 1.05, duration: 1.5, ease: 'power1.out' }, 1.8)

      // 4. Creed scrolling character-level GSAP animations (Crisp Vertical Stagger Reveal)
      const creeds = document.querySelectorAll('.creed')
      creeds.forEach((creed) => {
        const chars = creed.querySelectorAll('.fx-target .char')
        const label = creed.querySelector('.n')
        if (chars.length === 0) return

        // Set initial states (Hidden, shifted down vertically, no 3D transforms or blurs)
        gsap.set(chars, { 
          opacity: 0, 
          y: 60,
        })
        if (label) gsap.set(label, { opacity: 0, y: 15 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: creed,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 1,
          }
        })

        if (label) {
          tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0)
        }

        tl.to(chars, {
          opacity: 1,
          y: 0,
          stagger: 0.02,
          duration: 1.2,
          ease: 'power2.out'
        }, 0.1)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Metric numbers auto count-up trigger
  useEffect(() => {
    const metrics = document.querySelectorAll('.metric .num')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetVal = parseInt(entry.target.getAttribute('data-count') || '0', 10)
            const suffix = entry.target.getAttribute('data-suffix') || ''
            if (!targetVal) return

            let start = 0
            const duration = 1200
            const stepTime = Math.abs(Math.floor(duration / targetVal))
            const timer = setInterval(() => {
              start += 1
              entry.target.textContent = `${start}${suffix}`
              if (start >= targetVal) {
                clearInterval(timer)
              }
            }, stepTime)

            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    metrics.forEach((num) => {
      if (num.getAttribute('data-count')) {
        observer.observe(num)
      }
    })

    return () => observer.disconnect()
  }, [])

  // 3D card tilt effect (Personal Layer)
  const handleMouseMoveCard = (e, card) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 20
    const rotateX = (((y / rect.height) - 0.5) * -20)
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeaveCard = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <main className="about-v2" ref={containerRef}>
      <div id="progress" />

      {/* ─── Section: Arrival (Hero) ─── */}
      <section id="arrival">
        <canvas id="constellation" ref={constellationRef} aria-hidden="true" />
        <div className="boot-line" id="bootline" aria-hidden="true">
          <span>SYS.INIT</span><span className="ok">OK</span>
          <span>REACT.MODULE</span><span className="ok">LOADED</span>
          <span>WP.MODULE</span><span className="ok">ACTIVE</span>
        </div>
        <h1 className="display-xl" id="arrival-h">
          <span className="line-1" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            Turning Ideas <span className="outline">Into</span>
          </span>
          <br />
          <span className="line-2" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <span className="it accent">Digital</span> Experiences.
          </span>
        </h1>
        <div className="sub reveal">
          <span><b>React Developer</b></span><span className="dot">·</span>
          <span><b>WordPress Specialist</b></span><span className="dot">·</span>
          <span><b>Indore, India</b></span>
        </div>
        <div className="scroll-cue">Enter the system</div>
      </section>

      {/* ─── Section: Marquee ─── */}
      <div className="marquee reveal" aria-hidden="true">
        <div className="marquee__track">
          {[
            'React', 'WordPress', 'Shopify', 
            'WooCommerce', 'Performance Optimization', 'AI Automation', 'API Integrations'
          ].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
          {[
            'React', 'WordPress', 'Shopify', 
            'WooCommerce', 'Performance Optimization', 'AI Automation', 'API Integrations'
          ].map((item, index) => (
            <span key={`${item}-${index}-dup`}>{item}</span>
          ))}
        </div>
      </div>

      {/* ─── Section: Origin ─── */}
      <section id="origin-head">
        <span className="eyebrow">01 / The Focus</span>
        <h2 className="display-lg reveal" style={{ marginTop: '28px' }}>
          Based in <span className="outline">Indore, India.</span><br />
          Serving clients <span className="it accent">worldwide.</span>
        </h2>
      </section>

      <div id="origin-pin">
        <div id="origin-stage">
          <div className="origin-counter"><b>01</b> / 03</div>
          <div className="city" data-city="1">
            <div className="city-bg" style={{ background: 'linear-gradient(135deg, #111 0%, #000 100%)' }} />
            <div className="city-content">
              <span className="latlon">Modern Apps</span>
              <div className="place">React & Next.js</div>
              <p className="mood">Building single page applications, optimizing state management, and connecting REST APIs.</p>
              <span className="gives">Provides my <i>engineering velocity</i></span>
            </div>
          </div>
          <div className="city" data-city="2">
            <div className="city-bg" style={{ background: 'linear-gradient(135deg, #222 0%, #050505 100%)' }} />
            <div className="city-content">
              <span className="latlon">Global Coverage</span>
              <div className="place">WordPress & Shopify</div>
              <p className="mood">Developing responsive, customized WooCommerce and ecommerce workflows that convert.</p>
              <span className="gives">Provides my <i>CMS expertise</i></span>
            </div>
          </div>
          <div className="city" data-city="3">
            <div className="city-bg" style={{ background: 'linear-gradient(135deg, #333 0%, #0a0a0a 100%)' }} />
            <div className="city-content">
              <span className="latlon">Backend Logic</span>
              <div className="place">Node.js & PHP</div>
              <p className="mood">Implementing secure server architecture, managing databases, and designing fast web APIs.</p>
              <span className="gives">Provides my <i>backend logic</i></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Section: Role ─── */}
      <section id="role" className="hairline-top">
        <span className="eyebrow">02 / My Role</span>
        <h2 className="display-lg reveal" style={{ marginTop: '28px' }}>
          Frontend engineering at the<br />
          intersection of clean design,<br />
          <span className="it accent">performance</span> &amp; CMS.
        </h2>
        <p className="body-lg body-muted lede reveal">
          For the past two years, I&apos;ve been working on business websites, ecommerce stores, healthcare platforms, portfolio websites, and agency projects using React, WordPress, Shopify, JavaScript, PHP, and modern frontend technologies.
        </p>

        {/* System Node Connection Map */}
        <div className="sysmap reveal" id="sysmap" ref={sysmapRef}>
          <svg id="sysmapSvg" preserveAspectRatio="none" aria-hidden="true">
            {/* Dashed Concentric Orbit Rings */}
            <ellipse cx="50%" cy="50%" rx="24%" ry="22%" className="ring" />
            <ellipse cx="50%" cy="50%" rx="38%" ry="34%" className="ring" />
            <ellipse cx="50%" cy="50%" rx="50%" ry="44%" className="ring" />

            {/* Connection Line when hovered */}
            {activeNode && lineCoords && (
              <line
                x1={lineCoords.x1}
                y1={lineCoords.y1}
                x2={lineCoords.x2}
                y2={lineCoords.y2}
                className="link on"
              />
            )}
          </svg>
          <div className="node node--core" id="coreNode" style={{ left: '50%', top: '50%' }}>Mazhar Khan</div>
          {systemNodes.map((node) => (
            <button
              key={node.id}
              id={`node-${node.id}`}
              className={`node ${activeNode === node.id ? 'active' : ''}`}
              onMouseEnter={(e) => handleMouseEnterNode(node, e)}
              onMouseLeave={handleMouseLeaveNode}
            >
              {node.label}
            </button>
          ))}
        </div>
        <p className="node-story" id="nodeStory">
          <b>{nodeStory.title}</b>
          {nodeStory.desc}
        </p>
      </section>

      {/* ─── Section: The Split ─── */}
      <div id="split-pin" className="hairline-top">
        <div className="head">
          <span className="eyebrow">03 / The Split</span>
          <h2 className="display-lg reveal" style={{ marginTop: '28px' }}>
            I balance between<br /><span className="it accent">requirements.</span>
          </h2>
        </div>
        <div id="split-stage">
          <div className="vs-row"><span className="l">Design</span><span className="x">×</span><span className="r">Clean Code</span></div>
          <div className="vs-row"><span className="l">Performance</span><span className="x">×</span><span className="r">Speed</span></div>
          <div className="vs-row"><span className="l">React App</span><span className="x">×</span><span className="r">WordPress CMS</span></div>
          <div className="vs-row"><span className="l">Custom UI</span><span className="x">×</span><span className="r">Responsive Layouts</span></div>
          <div className="vs-row"><span className="l">Manual Customization</span><span className="x">×</span><span className="r">AI Workflows</span></div>
          <div className="vs-row"><span className="l">Client Goal</span><span className="x">×</span><span className="r">Technical Scalability</span></div>
        </div>
      </div>

      {/* ─── Section: Merge ─── */}
      <div id="merge">
        <p className="small">The future of development is</p>
        <h2 id="mergeH">
          <span className="outline human-text">HUMAN DEV</span>{' '}
          <span className="x" style={{ display: 'inline-block' }}>×</span>{' '}
          <span className="ai-text">AI WORKFLOWS</span>
        </h2>
      </div>

      {/* ─── Section: Taste ─── */}
      <div id="taste-pin" className="hairline-top">
        <div id="taste-stage">
          <div id="taste-flash" />
          <span className="noise-word" style={{ left: '6%', top: '14%', fontSize: 'clamp(28px, 5vw, 72px)' }}>React</span>
          <span className="noise-word" style={{ right: '8%', top: '20%', fontSize: 'clamp(22px, 4vw, 56px)' }}>WordPress</span>
          <span className="noise-word" style={{ left: '12%', bottom: '22%', fontSize: 'clamp(24px, 4.4vw, 64px)' }}>Shopify</span>
          <span className="noise-word" style={{ right: '10%', bottom: '14%', fontSize: 'clamp(26px, 4.6vw, 68px)' }}>SEO</span>
          <span className="noise-word" style={{ left: '42%', top: '8%', fontSize: 'clamp(20px, 3.4vw, 48px)' }}>APIs</span>
          <span className="noise-word" style={{ right: '30%', bottom: '36%', fontSize: 'clamp(18px, 3vw, 40px)' }}>HTML5</span>
          <span className="noise-word" style={{ left: '28%', top: '32%', fontSize: 'clamp(20px, 3.6vw, 52px)' }}>GSAP</span>
          <span className="noise-word" style={{ left: '60%', bottom: '24%', fontSize: 'clamp(18px, 3.2vw, 44px)' }}>SCSS</span>
          <div id="taste-core">
            <p className="statement">
              Great websites are more than beautiful interfaces—they should be fast, accessible, scalable, and built to solve real business problems.
            </p>
            <h2 id="tasteWord">Performance</h2>
            <p className="after">is still the core metric</p>
          </div>
        </div>
      </div>

      {/* ─── Section: Career System ─── */}
      <section id="career" className="hairline-top">
        <span className="eyebrow">04 / My Evolution</span>
        <h2 className="display-lg reveal" style={{ marginTop: '28px' }}>
          2+ years of professional <span className="it accent">development.</span>
        </h2>
        <div className="metrics reveal">
          <div className="metric"><span className="num" data-count="2" data-suffix="+">00</span><span className="label">Years Experience</span></div>
          <div className="metric"><span className="num" data-count="20" data-suffix="+">00</span><span className="label">Projects Delivered</span></div>
          <div className="metric"><span className="num" data-count="100" data-suffix="%">00</span><span className="label">Responsive Websites</span></div>
          <div className="metric"><span className="num" data-count="10" data-suffix="+">00</span><span className="label">Tech Stack Tools</span></div>
          <div className="metric"><span className="num" data-count="100" data-suffix="%">00</span><span className="label">Skill Mastery</span></div>
        </div>
      </section>

      {/* ─── Section: Personal Layer ─── */}
      <section id="personal" className="hairline-top">
        <span className="eyebrow">05 / The Core Strengths</span>
        <h2 className="display-lg reveal" style={{ marginTop: '28px' }}>
          Why work with <span className="it accent">me.</span>
        </h2>
        <div className="objects reveal" id="objects">
          {[
            ['01', 'Clean Code', 'Writing clean, commented, and highly maintainable codebase structured logically.'],
            ['02', 'Responsive Design', 'Ensuring absolute responsiveness across all screen sizes and mobile device layouts.'],
            ['03', 'Optimized Performance', 'Focusing on Core Web Vitals, page speed, caching, and optimized assets.'],
            ['04', 'Modern UI', 'Designing interfaces with modern aesthetics, rich micro-interactions, and GSAP animations.'],
            ['05', 'SEO Friendly', 'Semantic HTML5 layouts built with accessibility and search engines in mind.'],
            ['06', 'Communication', 'Providing reliable, transparent, and prompt updates throughout the development lifecycle.'],
            ['07', 'Timely Delivery', 'Adhering to launch timelines and ensuring milestones are met systematically.'],
            ['08', 'Scalable Solutions', 'Structuring architectures and plugins to support future growth and integrations.'],
          ].map(([idx, name, story]) => (
            <div
              key={name}
              className="object"
              tabIndex="0"
              onMouseMove={(e) => handleMouseMoveCard(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeaveCard(e.currentTarget)}
            >
              <span className="idx">S / {idx}</span>
              <div>
                <div className="name">{name}</div>
                <p className="story">{story}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section: Manifesto (Creeds) ─── */}
      <section id="manifesto">
        <div className="creed">
          <h2 className="fx-target">
            <span className="n">Belief / 01</span>
            {splitText('Clean code is the foundation of ')}
            <em>{splitText('great UX.')}</em>
          </h2>
        </div>
        <div className="creed">
          <h2 className="fx-target">
            <span className="n">Belief / 02</span>
            {splitText('Websites should load ')}
            <em>{splitText('instantly')}</em>
            {splitText(' on any network.')}
          </h2>
        </div>
        <div className="creed">
          <h2 className="h-amp fx-target">
            <span className="n">Belief / 03</span>
            <span className="l-a">
              {splitText('CMS platforms should ')}
              <em className="accent">{splitText('empower')}</em>
            </span>{' '}
            <span className="l-b">{splitText('clients,')}</span>{' '}
            <span className="l-c">{splitText('not restrict them.')}</span>
          </h2>
        </div>
        <div className="creed">
          <h2 className="fx-target">
            <span className="n">Belief / 04</span>
            {splitText('A responsive design is not optional. It is ')}
            <em>{splitText('standard.')}</em>
          </h2>
        </div>
      </section>

      {/* ─── Section: Final ─── */}
      <section id="final" className="hairline-top">
        <span className="eyebrow">06 / The Developer</span>
        <div className="final-grid">
          <div className="portrait" id="portrait">
            <span className="frame-label">MK / INDORE</span>
            <div className="scan" id="scanline" />
            <img src={profileImg} alt="Mazhar Khan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="final-copy">
            <h2 className="reveal">I am <span className="outline">Mazhar</span> <span className="it accent">Khan.</span></h2>
            <div className="roles reveal">
              <span><b>Frontend</b> Developer</span>
              <span><b>React</b> Developer</span>
              <span><b>WordPress</b> Specialist</span>
              <span><b>Shopify & WooCommerce</b> Expert</span>
              <span><b>API & AI Automation</b> Enthusiast</span>
              <span>Based in <b>Indore, India</b></span>
            </div>
            <p className="body-lg body-muted reveal">
              I build fast, scalable, and user-friendly digital experiences that help businesses grow.
            </p>
            <div className="cta-row reveal">
              <Link className="final-cta" to="/#work">View Work</Link>
              <Link className="final-cta" to="/contact">Connect</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer>
        <span>© 2026 Mazhar Khan</span>
        <div className="socials">
          <a href="https://www.linkedin.com/in/mazhar-khan-545b32266/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:mk5334485@gmail.com">Email</a>
        </div>
      </footer>
    </main>
  )
}

export default AboutPage
