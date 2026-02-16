import { createApp } from 'vue'
import './css/main.css'
import App from './App.vue'
import router from './router'
import { vScrollReveal } from './directives/vScrollReveal'

const app = createApp(App)

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

app.use(router)
app.mount('#app')
