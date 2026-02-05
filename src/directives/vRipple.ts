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
  circle.classList.add('ripple')

  const ripple = document.getElementsByClassName('ripple')[0]

  if (ripple) {
    ripple.remove()
  }

  el.appendChild(circle)

  setTimeout(() => {
    circle.remove()
  }, 600)
}

export const vRipple = {
  mounted(el: HTMLElement) {
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
    el.addEventListener('click', (ev) => handleRipple(ev, el))
  },
  unmounted(el: HTMLElement) {
    // Clean up if strictly necessary, but click listeners are removed with element usually.
    // Better practice: save the handler to remove it properly.
  },
}
