import { createApp } from 'vue'
import './css/main.css'
import App from './App.vue'
import router from './router'
import { vScrollReveal } from './directives/vScrollReveal'
import { createVLite } from './core'

// Example dictionary for demonstration purposes
const dummyDictionary: Record<string, string> = {
  'common.words.name': 'Nombre de la Sucursal (Translated)',
  'common.buttons.save': 'Guardar Cambios (Translated)',
  'hrm.branch.form.namePlaceholder': 'Ingrese el nombre de la sucursal...',
  'hrm.branch.form.managerLabel': 'Gerente (Translated)',
  'hrm.branch.form.managerPlaceholder': 'Seleccionar gerente...',
  'upload.dragDropText': 'Arrastra y suelta tu archivo aquí (Translated)',
  'upload.selectFile': 'Seleccionar un archivo (Translated)',
  'dashboard.welcome': 'Welcome back to the dashboard!',
  'dropdown.settings.label': 'Configuración General (Translated)',
  'dropdown.settings.description': 'Administrar tus preferencias (Translated)',
  'dropdown.security.label': 'Seguridad y Privacidad (Translated)',
  'dropdown.security.subtitle': 'Alta Prioridad (Translated)',
  // New internal global keys
  'vlite.customFields.emptyTitle': 'No hay elementos (Translated)',
  'vlite.customFields.emptyDescription': 'Agregue un nuevo elemento para comenzar (Translated)',
  'vlite.dropdown.empty': 'No se encontraron opciones (Translated)',
  'vlite.dropdown.search': 'Buscar... (Translated)',
  'vlite.filePicker.clickToUpload': 'Haga clic para subir (Translated)',
  'vlite.filePicker.dragAndDrop': 'o arrastrar y soltar (Translated)',
  'vlite.filePicker.addMore': 'Añadir más (Translated)',
}

// Setup vLite with global i18n handler
const vlite = createVLite({
  services: {
    t: (key: string) => dummyDictionary[key] || key
  }
})

const app = createApp(App)

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

// Setup plugins
app.use(vlite)
app.use(router)

app.mount('#app')
