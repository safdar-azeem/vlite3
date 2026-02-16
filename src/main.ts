import { createApp } from 'vue'
import './css/main.css'
import App from './App.vue'
import router from './router'
import { vScrollReveal } from './directives/vScrollReveal'
import { env } from './utils'

const app = createApp(App)

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

// Register Google Sign-In Plugin for script injection
// app.use(GoogleSignInPlugin, {
//   clientId: env.VITE_GOOGLE_CLIENT_ID,
// })

app.use(router)
app.mount('#app')
