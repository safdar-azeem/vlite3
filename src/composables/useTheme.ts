import { onMounted, ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>(loadTheme())

function loadTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const savedTheme = localStorage.getItem('builto-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'

  return 'light'
}

function applyTheme(newTheme: Theme) {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(newTheme)
}

function bindSystemListener() {
  if (typeof window === 'undefined' || !window.matchMedia) return

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('builto-theme')) {
      theme.value = e.matches ? 'dark' : 'light'
      applyTheme(theme.value)
    }
  })
}

export function initializeTheme() {
  theme.value = loadTheme()
  applyTheme(theme.value)
  bindSystemListener()
}

export function useTheme() {
  watch(
    theme,
    (newTheme) => {
      localStorage.setItem('builto-theme', newTheme)
      applyTheme(newTheme)
    },
    { immediate: true }
  )

  onMounted(() => {
    document.documentElement.classList.add('bg-body')
  })

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return {
    theme,
    toggleTheme,
  }
}
