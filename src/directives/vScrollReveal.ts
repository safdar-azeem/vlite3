import type { Directive, DirectiveBinding } from 'vue'
import ScrollReveal from 'scrollreveal'

// Store instances per container to avoid memory leaks and duplicates
const srInstances = new WeakMap<HTMLElement | Window, scrollReveal.ScrollRevealObject>()

const defaultOptions: scrollReveal.ScrollRevealObjectOptions = {
  distance: '50px',
  duration: 800,
  delay: 200,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
  origin: 'bottom',
  interval: 0,
  opacity: 0,
  scale: 1,
  cleanup: false,
  mobile: true,
  reset: false, // true = animations repeat on scroll up/down
  useDelay: 'always',
  viewFactor: 0.0,
}

/**
 * Traverses up the DOM to find the nearest scrollable parent.
 */
function getScrollParent(node: HTMLElement | null): HTMLElement | Window {
  if (!node) return window

  // If we reach the top, return window/document
  if (node === document.body || node === document.documentElement) {
    return document.documentElement
  }

  const style = getComputedStyle(node)
  const overflowY = style.overflowY
  const isScrollable = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'

  if (isScrollable && node.scrollHeight > node.clientHeight) {
    return node
  }

  return getScrollParent(node.parentElement)
}

export const vScrollReveal: Directive = {
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {
    if (typeof window === 'undefined') return

    // 1. Auto-detect the scroll container
    const scrollContainer = getScrollParent(el.parentElement)

    // 2. Get or Create ScrollReveal instance for this container
    let sr = srInstances.get(scrollContainer)
    if (!sr) {
      sr = ScrollReveal({
        // If container is window/html, ScrollReveal expects 'document.documentElement' usually,
        // but 'container' option defaults to window.document.documentElement.
        // If it's a specific div, we pass that div.
        container:
          scrollContainer === window ? document.documentElement : (scrollContainer as HTMLElement),
      })
      srInstances.set(scrollContainer, sr)
    }

    // 3. Reveal the element
    const options = Object.assign({}, defaultOptions, binding.value)

    // Add a marker class
    el.classList.add('v-scroll-reveal')

    sr.reveal(el, options)
  },

  updated: (el: HTMLElement, binding: DirectiveBinding) => {
    if (typeof window === 'undefined') return
    // Only update if options changed deeply
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
      const scrollContainer = getScrollParent(el.parentElement)
      const sr = srInstances.get(scrollContainer)
      if (sr) {
        sr.reveal(el, Object.assign({}, defaultOptions, binding.value))
      }
    }
  },
}
