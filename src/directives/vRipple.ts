interface RippleElement extends HTMLElement {
  _rippleHandler?: (ev: MouseEvent) => void
}

const handleRipple = (event: MouseEvent, el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const circle = document.createElement('span')
  const diameter = Math.max(rect.width, rect.height)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${x - radius}px`
  circle.style.top = `${y - radius}px`
  circle.style.position = 'absolute'
  circle.style.pointerEvents = 'none'
  circle.classList.add('ripple')

  // Only remove existing ripples belonging to this specific element
  const existingRipples = el.querySelectorAll('.ripple')
  existingRipples.forEach((ripple) => ripple.remove())

  el.appendChild(circle)

  setTimeout(() => {
    if (circle && circle.parentNode) {
      circle.remove()
    }
  }, 600)
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
    const existingRipples = el.querySelectorAll('.ripple')
    existingRipples.forEach((ripple) => ripple.remove())
  },
}
