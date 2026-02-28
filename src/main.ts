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

  // Internal global keys
  'vlite.customFields.emptyTitle': 'No hay elementos (Translated)',
  'vlite.customFields.emptyDescription': 'Agregue un nuevo elemento para comenzar (Translated)',
  'vlite.dropdown.empty': 'No se encontraron opciones (Translated)',
  'vlite.dropdown.search': 'Buscar... (Translated)',
  'vlite.filePicker.clickToUpload': 'Haga clic para subir (Translated)',
  'vlite.filePicker.dragAndDrop': 'o arrastrar y soltar (Translated)',
  'vlite.filePicker.addMore': 'Añadir más (Translated)',

  // DataList / Empty
  'vlite.empty.title': 'No se encontraron datos (Translated)',
  'vlite.empty.description': 'No hay nada que mostrar aquí en este momento. (Translated)',

  // DataTable
  'vlite.dataTable.searchPlaceholder': 'Buscar en la tabla... (Translated)',
  'vlite.dataTable.confirmDeleteTitle': 'Confirmar Eliminación (Translated)',
  'vlite.dataTable.confirmDeleteDesc':
    '¿Estás seguro de que quieres eliminar los elementos seleccionados? (Translated)',
  'vlite.dataTable.deleteBtn': 'Eliminar (Translated)',
  'vlite.dataTable.cancelBtn': 'Cancelar (Translated)',

  // Screen
  'vlite.screen.deleteSelected': 'Eliminar Seleccionado (Translated)',
  'vlite.screen.listView': 'Vista de Lista (Translated)',
  'vlite.screen.tableView': 'Vista de Tabla (Translated)',
  'vlite.screen.refresh': 'Actualizar (Translated)',
  'vlite.screen.searchPlaceholder': 'Buscar... (Translated)',
  'vlite.screen.confirmDeleteTitle': 'Confirmar Eliminación (Translated)',
  'vlite.screen.confirmDeleteDesc':
    '¿Estás seguro de que deseas eliminar este elemento? (Translated)',
  'vlite.screen.confirmDeleteBtn': 'Eliminar (Translated)',
  'vlite.screen.cancelBtn': 'Cancelar (Translated)',
  'vlite.screen.missingView': 'Por favor proporcione un componente de vista. (Translated)',
  'vlite.screen.addNew': 'Añadir Nuevo (Translated)',
  'vlite.screen.filters': 'Filtros (Translated)',
  'vlite.screen.applyFilters': 'Aplicar Filtros (Translated)',
  'vlite.screen.filter': 'Filtrar (Translated)',

  // FileTree
  'vlite.fileTree.emptyText': 'No se encontraron resultados. (Translated)',

  // MultiSelect
  'vlite.multiSelect.placeholder': 'Seleccionar elementos... (Translated)',

  // Pagination
  'vlite.pagination.show': 'Mostrar (Translated)',
  'vlite.pagination.perPage': 'por página (Translated)',
  'vlite.pagination.page': 'Página (Translated)',
  'vlite.pagination.of': 'de (Translated)',
  'vlite.pagination.previous': 'Anterior (Translated)',
  'vlite.pagination.next': 'Siguiente (Translated)',

  // PricingPlan
  'vlite.pricingPlan.selected': 'Seleccionado (Translated)',
  'vlite.pricingPlan.choosePlan': 'Elegir Plan (Translated)',
  'vlite.pricingPlan.recommended': 'Recomendado (Translated)',
  'vlite.pricingPlan.mostPopular': 'Más Popular (Translated)',

  // Workbook
  'vlite.workbook.rename': 'Renombrar (Translated)',
  'vlite.workbook.duplicate': 'Duplicar (Translated)',
  'vlite.workbook.delete': 'Eliminar (Translated)',
  'vlite.workbook.addSheet': 'Añadir Hoja (Translated)',
}

// Setup vLite with global i18n handler
const vlite = createVLite({
  services: {
    t: (key: string, ...args: any[]) => {
      // Basic interpolation support for demonstration (e.g. {count})
      let translation = dummyDictionary[key] || key
      if (args.length > 0 && typeof args[0] === 'object') {
        Object.entries(args[0]).forEach(([k, v]) => {
          translation = translation.replace(new RegExp(`{${k}}`, 'g'), String(v))
        })
      }
      return translation
    },
  },
})

const app = createApp(App)

// Register global directives
app.directive('scroll-reveal', vScrollReveal)

// Setup plugins
app.use(vlite)
app.use(router)

app.mount('#app')
