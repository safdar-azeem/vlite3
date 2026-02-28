import { createApp } from 'vue'
import './css/main.css'
import App from './App.vue'
import router from './router'
import { vScrollReveal } from './directives/vScrollReveal'
import { createVLite } from './core'

const app = createApp(App)

// Example dictionary for demonstration purposes
const dummyDictionary: Record<string, string> = {
  'common.words.name': 'Translated Branch Name',
  'hrm.branch.form.managerPlaceholder': 'Translated Add Manager',
  'hrm.branch.form.managerLabel': 'Translated Manager'
}

// Setup vLite with global i18n handler
const vlite = createVLite({
  services: {
    t: (key: string) => dummyDictionary[key] || key
  }
})

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

// Setup plugins
app.use(vlite)
app.use(router)

app.mount('#app')
