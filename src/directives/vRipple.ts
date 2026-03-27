interface RippleElement extends HTMLElement {
  _rippleHandler?: (ev: MouseEvent) => void
}

const handleRipple = (event: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const diameter = Math.max(rect.width, rect.height)
  const radius = diameter / 2

  el.querySelectorAll('.ripple').forEach((r) => r.remove())

  const circle = document.createElement('span')
  circle.style.cssText = `
    width: ${diameter}px;
    height: ${diameter}px;
    left: ${x - radius}px;
    top: ${y - radius}px;
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    will-change: transform, opacity;
    background-color: rgba(255, 255, 255, 1);
  `
  circle.classList.add('ripple')
  el.appendChild(circle)

  let startTime: number | null = null
  const duration = 400

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = Math.min((timestamp - startTime) / duration, 1)

    // Ease-out
    const eased = 1 - Math.pow(1 - progress, 3)

    // Scale 0 -> 2.5 (subtle, not full coverage)
    const scale = eased * 2.5
    // Peak opacity 0.08, then fade out after 40%
    const opacity = progress < 0.4
      ? progress * 0.2
      : 0.08 * (1 - (progress - 0.4) / 0.6)

    circle.style.transform = `scale(${scale})`
    circle.style.opacity = `${opacity}`

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      circle.remove()
    }
  }

  requestAnimationFrame(animate)
}

export const vRipple = {
  mounted(el: RippleElement) {
    if (window.getComputedStyle(el).position === 'static') {
      el.style.position = 'relative'
    }
    el.style.overflow = 'hidden'
    el._rippleHandler = (ev: MouseEvent) => handleRipple(ev, el)
    el.addEventListener('click', el._rippleHandler)
  },
  unmounted(el: RippleElement) {
    if (el._rippleHandler) {
      el.removeEventListener('click', el._rippleHandler)
    }
    el.querySelectorAll('.ripple').forEach((r) => r.remove())
  },
}
