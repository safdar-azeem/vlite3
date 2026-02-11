import { onMounted, onUnmounted, type Ref } from 'vue'

type KeyStrokeHandler = (event: KeyboardEvent) => void
type KeyStrokeOptions = {
  target?: Ref<HTMLElement | null> | HTMLElement | null
  preventDefault?: boolean
  stopPropagation?: boolean
  passive?: boolean
  capture?: boolean
}

interface KeyStrokeComposable {
  onKeyStroke: (
    key: string | string[],
    handler: KeyStrokeHandler,
    options?: KeyStrokeOptions
  ) => void
  offKeyStroke: (key: string | string[], handler?: KeyStrokeHandler) => void
  destroy: () => void
}

export const useKeyStroke = (): KeyStrokeComposable => {
  const listeners = new Map<
    string,
    Set<{ handler: KeyStrokeHandler; options?: KeyStrokeOptions }>
  >()

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = normalizeKey(event.key)
    const keyListeners = listeners.get(key)

    if (keyListeners) {
      keyListeners.forEach(({ handler, options }) => {
        if (options?.preventDefault) event.preventDefault()
        if (options?.stopPropagation) event.stopPropagation()
        handler(event)
      })
    }
  }

  const normalizeKey = (key: string): string => {
    return key ? key.toLowerCase() : ''
  }

  const getTarget = (
    target?: Ref<HTMLElement | null> | HTMLElement | null
  ): HTMLElement | Document => {
    if (!target) return document
    if ('value' in target) return target.value || document
    return target || document
  }

  const onKeyStroke = (
    key: string | string[],
    handler: KeyStrokeHandler,
    options: KeyStrokeOptions = {}
  ) => {
    const keys = Array.isArray(key) ? key : [key]
    const target = getTarget(options.target)

    keys.forEach((k) => {
      const normalizedKey = normalizeKey(k)

      if (!listeners.has(normalizedKey)) {
        listeners.set(normalizedKey, new Set())
        target.addEventListener('keydown', handleKeyDown, {
          passive: options.passive ?? true,
          capture: options.capture ?? false,
        })
      }

      listeners.get(normalizedKey)!.add({ handler, options })
    })
  }

  const offKeyStroke = (key: string | string[], handler?: KeyStrokeHandler) => {
    const keys = Array.isArray(key) ? key : [key]

    keys.forEach((k) => {
      const normalizedKey = normalizeKey(k)
      const keyListeners = listeners.get(normalizedKey)

      if (keyListeners) {
        if (handler) {
          keyListeners.forEach((listener) => {
            if (listener.handler === handler) {
              keyListeners.delete(listener)
            }
          })
        } else {
          keyListeners.clear()
        }

        if (keyListeners.size === 0) {
          listeners.delete(normalizedKey)
          document.removeEventListener('keydown', handleKeyDown)
        }
      }
    })
  }

  const destroy = () => {
    document.removeEventListener('keydown', handleKeyDown)
    listeners.clear()
  }

  onUnmounted(() => {
    destroy()
  })

  return {
    onKeyStroke,
    offKeyStroke,
    destroy,
  }
}

export const useAdvancedKeyStroke = () => {
  const pressedKeys = new Set<string>()
  const listeners = new Map<string, Set<KeyStrokeHandler>>()
  let keydownTimeout: number | null = null

  const normalizeModifierKey = (key: string): string => {
    if (!key) return ''
    const normalized = key.toLowerCase()
    if (normalized === 'cmd' || normalized === 'meta' || normalized === 'metakey') return 'meta'
    if (normalized === 'ctrl' || normalized === 'control' || normalized === 'controlkey')
      return 'ctrl'
    if (normalized === 'alt' || normalized === 'option' || normalized === 'altkey') return 'alt'
    if (normalized === 'shift' || normalized === 'shiftkey') return 'shift'
    return normalized
  }

  const parseKeyCombination = (keys: string): string[] => {
    return keys
      .toLowerCase()
      .split('+')
      .map((key) => key.trim())
      .map(normalizeModifierKey)
      .sort()
  }

  const getAlternativeCombinations = (keys: string[]): string[] => {
    const combinations: string[] = [keys.join('+')]
    const hasMeta = keys.includes('meta')
    const hasCtrl = keys.includes('ctrl')

    if (hasMeta) {
      const altKeys = keys.map((k) => (k === 'meta' ? 'ctrl' : k))
      combinations.push(altKeys.join('+'))
    } else if (hasCtrl) {
      const altKeys = keys.map((k) => (k === 'ctrl' ? 'meta' : k))
      combinations.push(altKeys.join('+'))
    }

    return combinations
  }

  const getCurrentModifiers = (event: KeyboardEvent): string[] => {
    const modifiers: string[] = []
    if (event.metaKey) modifiers.push('meta')
    if (event.ctrlKey) modifiers.push('ctrl')
    if (event.altKey) modifiers.push('alt')
    if (event.shiftKey) modifiers.push('shift')
    return modifiers.sort()
  }

  const isExactMatch = (required: string[], current: string[]): boolean => {
    if (required.length !== current.length) return false
    return required.every((key, idx) => key === current[idx])
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = normalizeModifierKey(event.key)

    if (keydownTimeout) {
      clearTimeout(keydownTimeout)
      keydownTimeout = null
    }

    const currentModifiers = getCurrentModifiers(event)
    const currentKeys = [...currentModifiers]

    if (!['meta', 'ctrl', 'alt', 'shift'].includes(key)) {
      currentKeys.push(key)
    }

    currentKeys.sort()

    listeners.forEach((handlers, combination) => {
      const requiredKeys = parseKeyCombination(combination)

      if (isExactMatch(requiredKeys, currentKeys)) {
        handlers.forEach((handler) => handler(event))
      }
    })

    keydownTimeout = window.setTimeout(() => {
      pressedKeys.clear()
      keydownTimeout = null
    }, 100)
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = normalizeModifierKey(event.key)
    pressedKeys.delete(key)

    if (keydownTimeout) {
      clearTimeout(keydownTimeout)
      keydownTimeout = null
    }
  }

  const handleBlur = () => {
    pressedKeys.clear()
    if (keydownTimeout) {
      clearTimeout(keydownTimeout)
      keydownTimeout = null
    }
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      pressedKeys.clear()
      if (keydownTimeout) {
        clearTimeout(keydownTimeout)
        keydownTimeout = null
      }
    }
  }

  const attachListeners = () => {
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp, { passive: false })
    window.addEventListener('blur', handleBlur, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
  }

  const detachListeners = () => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    window.removeEventListener('blur', handleBlur)
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    if (keydownTimeout) {
      clearTimeout(keydownTimeout)
      keydownTimeout = null
    }
  }

  const onKeyStroke = (keys: string, handler: KeyStrokeHandler) => {
    const keyCombo = parseKeyCombination(keys)
    const combinations = getAlternativeCombinations(keyCombo)

    combinations.forEach((combo) => {
      if (!listeners.has(combo)) {
        listeners.set(combo, new Set())
      }
      listeners.get(combo)!.add(handler)
    })

    if (listeners.size === combinations.length) attachListeners()
  }

  const offKeyStroke = (keys: string, handler?: KeyStrokeHandler) => {
    const keyCombo = parseKeyCombination(keys)
    const combinations = getAlternativeCombinations(keyCombo)

    combinations.forEach((combo) => {
      const comboListeners = listeners.get(combo)

      if (comboListeners) {
        if (handler) comboListeners.delete(handler)
        else comboListeners.clear()

        if (comboListeners.size === 0) listeners.delete(combo)
      }
    })

    if (listeners.size === 0) detachListeners()
  }

  const destroy = () => {
    detachListeners()
    listeners.clear()
    pressedKeys.clear()
  }

  onUnmounted(destroy)

  return { onKeyStroke, offKeyStroke, destroy }
}
