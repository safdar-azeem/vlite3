import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Playground from './playground/Playground.vue'
import Landing from './playground/Landing.vue'

const demoModules = import.meta.glob('./playground/demos/*Demo.vue')

const children: RouteRecordRaw[] = Object.entries(demoModules).map(([path, component]) => {
  // Extract file name without "Demo.vue" and path
  const rawName = path.split('/').pop()?.replace('Demo.vue', '') || ''

  // Format the route path. Examples:
  // "AvatarUploader" -> "avatar-uploader"
  // "ButtonGroup" -> "buttongroup" (keeping consistent with existing playground paths)
  let routePath = rawName.toLowerCase()
  if (rawName === 'AvatarUploader') routePath = 'avatar-uploader'
  if (rawName === 'DateRangePicker') routePath = 'daterangepicker'
  if (rawName === 'ThemeToggle') routePath = 'themetoggle'
  if (rawName === 'ScrollReveal') routePath = 'scroll-reveal'
  if (rawName === 'SidebarMenu') routePath = 'sidebarmenu'
  if (rawName === 'ExportData') routePath = 'export-data'
  if (rawName === 'ImportData') routePath = 'import-data'
  if (rawName === 'PricingPlan') routePath = 'pricing'
  if (rawName === 'RichTextEditor') routePath = 'richtexteditor'
  if (rawName === 'GettingStarted') routePath = 'getting-started'
  if (rawName === 'ImageComparison') routePath = 'image-comparison'

  return {
    path: routePath,
    name: rawName,
    component,
  }
})

// Add an empty default component or redirect to a specific demo
children.push({
  path: '',
  name: 'Default',
  redirect: '/components/getting-started',
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing,
    },
    {
      path: '/components',
      component: Playground,
      children,
    },
  ],
})

export default router
