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
  expand?: boolean
  variant?: 'success' | 'error' | 'info' | 'warning' | 'default'
}

const globalConfig = ref<ToastConfig>({
  position: 'bottom-right',
  duration: 4000,
  expand: false,
  variant: 'default',
})

const notifications = ref<Notification[]>([])

interface TimerData {
  remaining: number
  start: number
  timerId?: ReturnType<typeof setTimeout>
}

const timeouts = new Map<number, TimerData>()

let idCounter = 0

function clearTimer(id: number) {
  const timer = timeouts.get(id)
  if (timer?.timerId) {
    clearTimeout(timer.timerId)
    timer.timerId = undefined
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
  const finalDuration =
    options.duration ?? globalConfig.value.duration ?? 4000
  const finalPosition =
    options.position ?? globalConfig.value.position ?? 'bottom-right'
  const finalType = type === 'default' ? (globalConfig.value.variant ?? 'default') : type

  const notification: Notification = {
    id,
    message,
    description: options.description,
    type: finalType,
    duration: finalDuration,
    action: options.action,
    position: finalPosition,
  }

  notifications.value.push(notification)

  if (finalDuration !== Infinity) {
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

function showToast(
  message: string,
  type?: Notification['type'],
  options?: ToastOptions
): number {
  const finalType = type ?? 'default'
  const finalOptions = options ?? {}
  return createToast(message, finalType, finalOptions)
}

const toast = (message: string, options?: ToastOptions) =>
  createToast(message, 'default', options)

toast.success = (message: string, options?: ToastOptions) =>
  createToast(message, 'success', options)

toast.error = (message: string, options?: ToastOptions) =>
  createToast(message, 'error', options)

toast.info = (message: string, options?: ToastOptions) =>
  createToast(message, 'info', options)

toast.warning = (message: string, options?: ToastOptions) =>
  createToast(message, 'warning', options)

toast.promise = <T = any>(
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
      const errMsg =
        typeof data.error === 'function' ? data.error(err) : data.error
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

function configure(config: ToastConfig) {
  Object.assign(globalConfig.value, config)
}

export function useNotifications() {
  return {
    notifications,
    showToast,
    toast,
    removeToast,
    configure,
    globalConfig,
    pauseTimers,
    resumeTimers,
  }
}

export { showToast, toast, removeToast, configure, pauseTimers, resumeTimers }
