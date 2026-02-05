import { ref } from 'vue'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

interface NotificationAction {
  label: string
  onClick: () => void
}

export interface Notification {
  id: number
  message: string
  description?: string
  type: 'success' | 'error' | 'info' | 'warning' | 'default'
  duration?: number
  action?: NotificationAction
  position: ToastPosition
  promise?: Promise<any>
}

export interface ToastOptions {
  description?: string
  duration?: number
  action?: NotificationAction
  position?: ToastPosition
}

export interface ToastConfig {
  position?: ToastPosition
  duration?: number
  expand?: boolean // For stacking behavior configuration
}

const globalConfig = ref<ToastConfig>({
  position: 'bottom-right', // Sonner defaults to bottom-right usually
  duration: 4000,
  expand: false,
})

const notifications = ref<Notification[]>([])

// Timer management
interface TimerData {
  remaining: number
  start: number
  timerId?: ReturnType<typeof setTimeout>
}
const timeouts = new Map<number, TimerData>()

export function useNotifications() {
  let idCounter = 0

  function configure(config: ToastConfig) {
    Object.assign(globalConfig.value, config)
  }

  // Helper to clear specific timer
  function clearTimer(id: number) {
    const timer = timeouts.get(id)
    if (timer?.timerId) {
      clearTimeout(timer.timerId)
      timer.timerId = undefined // Clear ID so we know it's paused
    }
  }

  function createToast(
    message: string,
    type: Notification['type'] = 'default',
    options: ToastOptions = {}
  ) {
    if (notifications.value.length > 20) {
      const removed = notifications.value.shift()
      if (removed) removeToast(removed.id)
    }

    const id = idCounter++
    const finalDuration = options.duration ?? globalConfig.value.duration ?? 4000
    const finalPosition = options.position ?? globalConfig.value.position ?? 'bottom-right'

    const notification: Notification = {
      id,
      message,
      description: options.description,
      type,
      duration: finalDuration,
      action: options.action,
      position: finalPosition,
    }

    notifications.value.push(notification)

    if (finalDuration !== Infinity) {
      // Start timer
      const timerData: TimerData = {
        remaining: finalDuration,
        start: Date.now(),
      }

      timerData.timerId = setTimeout(() => {
        removeToast(id)
      }, finalDuration)

      timeouts.set(id, timerData)
    }

    return id
  }

  function pauseTimers() {
    timeouts.forEach((timer) => {
      if (timer.timerId) {
        clearTimeout(timer.timerId)
        timer.timerId = undefined
        timer.remaining -= Date.now() - timer.start
      }
    })
  }

  function resumeTimers() {
    timeouts.forEach((timer, id) => {
      if (!timer.timerId && timer.remaining > 0) {
        timer.start = Date.now()
        timer.timerId = setTimeout(() => {
          removeToast(id)
        }, timer.remaining)
      }
    })
  }

  // Overloads for different usage patterns
  function showToast(message: string, options?: ToastOptions): number | string
  function showToast(
    message: string,
    type?: Notification['type'],
    duration?: number,
    action?: NotificationAction,
    position?: ToastPosition
  ): number | string
  function showToast(
    message: string,
    typeOrOptions?: Notification['type'] | ToastOptions,
    duration?: number,
    action?: NotificationAction,
    position?: ToastPosition
  ) {
    if (typeof typeOrOptions === 'object' && typeOrOptions !== null) {
      return createToast(message, 'default', typeOrOptions)
    }
    return createToast(message, typeOrOptions as any, {
      duration,
      action,
      position,
    })
  }

  // Proxies for specific types
  const toast = (message: string, options?: ToastOptions) =>
    createToast(message, 'default', options)
  toast.success = (message: string, options?: ToastOptions) =>
    createToast(message, 'success', options)
  toast.error = (message: string, options?: ToastOptions) => createToast(message, 'error', options)
  toast.info = (message: string, options?: ToastOptions) => createToast(message, 'info', options)
  toast.warning = (message: string, options?: ToastOptions) =>
    createToast(message, 'warning', options)

  toast.promise = <T>(
    promise: Promise<T>,
    data: {
      loading: string
      success: (data: T) => string
      error: string | ((err: any) => string)
    }
  ) => {
    const id = createToast(data.loading, 'default', { duration: Infinity })

    promise
      .then((res) => {
        removeToast(id)
        toast.success(data.success(res))
      })
      .catch((err) => {
        removeToast(id)
        const errMsg = typeof data.error === 'function' ? data.error(err) : data.error
        toast.error(errMsg)
      })

    return promise
  }

  function removeToast(id: number) {
    clearTimer(id)
    timeouts.delete(id)
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) notifications.value.splice(index, 1)
  }

  return {
    notifications,
    showToast, // Legacy support if needed, but toast .methods are better
    toast, // New Sonner-like API
    removeToast,
    configure,
    globalConfig,
    pauseTimers,
    resumeTimers,
  }
}
