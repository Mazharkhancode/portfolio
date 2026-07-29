import { useEffect, useRef } from 'react'

function CursorFx() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring || !window.matchMedia('(pointer: fine)').matches) return undefined

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rafId = 0

    const move = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      rafId = window.requestAnimationFrame(animate)
    }

    const setActive = (event) => {
      const target = event.target
      const isInteractive = target.closest('a, button, input, textarea, select, .project-card, .service-row')
      document.body.classList.toggle('is-cursor-active', Boolean(isInteractive))
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', setActive)
    rafId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', setActive)
      window.cancelAnimationFrame(rafId)
      document.body.classList.remove('is-cursor-active')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}

export default CursorFx
