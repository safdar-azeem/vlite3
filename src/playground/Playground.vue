<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Navbar, NavbarGroup, NavbarItem } from '@/components/Navbar'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/Button.vue'

const router = useRouter()

// Convert categories to SidebarMenuItemSchema
// We use a computed or just static definition since it doesn't change much.
// Using 'children' to create collapsible sections for categories.

const menuItems: SidebarMenuItemSchema[] = [
  {
    label: 'Theme & Style',
    icon: 'lucide:palette',
    children: [
      { label: 'Colors', to: '/colors', icon: 'lucide:palette' },
      { label: 'Theme Toggle', to: '/themetoggle', icon: 'lucide:sun' },
    ],
  },
  {
    label: 'Core',
    icon: 'lucide:box',
    children: [
      { label: 'Button', to: '/button', icon: 'lucide:mouse-pointer-2' },
      { label: 'Button Group', to: '/buttongroup', icon: 'lucide:git-merge' },
      { label: 'Badge', to: '/badge', icon: 'lucide:tag' },
      { label: 'Chip', to: '/chip', icon: 'lucide:sticker' },
      { label: 'Avatar', to: '/avatar', icon: 'lucide:user' },
      { label: 'Avatar Uploader', to: '/avatar-uploader', icon: 'lucide:camera' },
    ],
  },
  {
    label: 'Forms',
    icon: 'lucide:text-cursor-input',
    children: [
      { label: 'Input', to: '/input', icon: 'lucide:text-cursor-input' },
      { label: 'OTP Input', to: '/otpinput', icon: 'lucide:hash' },
      { label: 'Form', to: '/form', icon: 'lucide:file-input' },
      { label: 'MultiSelect', to: '/multiselect', icon: 'lucide:list-checks' },
      { label: 'ChoiceBox', to: '/choicebox', icon: 'lucide:layout-grid' },
      { label: 'FilePicker', to: '/filepicker', icon: 'lucide:upload-cloud' },
      { label: 'Textarea', to: '/textarea', icon: 'lucide:align-left' },
      { label: 'CheckBox', to: '/checkbox', icon: 'lucide:check-square' },
      { label: 'Switch', to: '/switch', icon: 'lucide:toggle-left' },
      { label: 'Slider', to: '/slider', icon: 'lucide:sliders-horizontal' },
      { label: 'ColorPicker', to: '/colorpicker', icon: 'lucide:palette' },
      { label: 'IconPicker', to: '/iconpicker', icon: 'lucide:smile' },
      { label: 'DatePicker', to: '/datepicker', icon: 'lucide:calendar' },
    ],
  },
  {
    label: 'Feedback & Overlays',
    icon: 'lucide:message-square',
    children: [
      { label: 'Alert', to: '/alert', icon: 'lucide:alert-circle' },
      { label: 'Modal', to: '/modal', icon: 'lucide:app-window' },
      { label: 'SidePanel', to: '/sidepanel', icon: 'lucide:panel-right' },
      { label: 'Dropdown', to: '/dropdown', icon: 'lucide:chevron-down-square' },
      { label: 'Tooltip', to: '/tooltip', icon: 'lucide:message-square' },
      { label: 'Toast', to: '/toast', icon: 'lucide:bell' },
    ],
  },
  {
    label: 'Navigation & Data',
    icon: 'lucide:navigation',
    children: [
      { label: 'DataTable', to: '/datatable', icon: 'lucide:table-2' },
      { label: 'Sidebar Menu', to: '/sidebarmenu', icon: 'lucide:sidebar' },
      { label: 'Navbar', to: '/navbar', icon: 'lucide:layout-template' },
      { label: 'Link/Label', to: '/label', icon: 'lucide:type' },
      { label: 'Pagination', to: '/pagination', icon: 'lucide:arrow-left-right' },
      { label: 'Tabs', to: '/tabes', icon: 'lucide:toggle-left' },
      { label: 'Accordion', to: '/accordion', icon: 'lucide:list' },
      { label: 'Timeline', to: '/timeline', icon: 'lucide:clock' },
      { label: 'Masonry Grid', to: '/masonry', icon: 'lucide:layout-dashboard' },
      { label: 'Pricing Plan', to: '/pricing', icon: 'lucide:credit-card' },
      { label: 'Heatmap', to: '/heatmap', icon: 'lucide:activity' },
      { label: 'File Tree', to: '/filetree', icon: 'lucide:folder-tree' },
      { label: 'Workbook', to: '/workbook', icon: 'lucide:folder-edit' },
      { label: 'Carousel', to: '/carousel', icon: 'lucide:gallery-horizontal' },
    ],
  },
]
</script>

<template>
  <div class="h-screen w-full bg-body text-gray-900 flex max-md:flex-col overflow-hidden">
    <!-- Navbar (Sidebar Variant) -->
    <Navbar
      variant="sidebar"
      mobileBreakpoint="md"
      class="bg-body border-r border-border h-max shrink-0 z-20"
      width="w-64">
      <template #logo>
        <div class="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div
            class="w-8 h-8 bg-primary text-primary-fg rounded-lg flex items-center justify-center shrink-0">
            <Icon icon="lucide:box" class="w-5 h-5" />
          </div>
          vLite3
        </div>
      </template>

      <!-- Sidebar Content -->
      <template #default>
        <div class="space-y-6">
          <SidebarMenu :items="menuItems" :allow-multiple="true" :default-expanded="['Core']" />
        </div>
      </template>

      <!-- Sidebar Footer -->
      <template #right>
        <div class="flex items-center justify-between gap-2">
          <ThemeToggle />
          <p class="text-xs text-muted-foreground">v0.1.5</p>
        </div>
      </template>
    </Navbar>

    <!-- Main Content Area -->
    <main class="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-body relative z-0">
      <!-- Header for Mobile/Context -->
      <!-- 
        Note: The Navbar(sidebar) handles the mobile toggle button on small screens.
        But we might want a top header for the main content area on desktop or mobile?
        The original design had a top header inside the main area.
      -->

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto px-6 py-6 md:py-12">
          <!-- Header -->
          <div
            class="mb-10 pb-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Component Playground
              </h1>
              <p class="text-gray-500">
                A comprehensive suite of UI components built for speed and consistency.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <a href="https://github.com/safdar-azeem/vlite3" target="_blank">
                <Button variant="outline" size="sm" icon="lucide:github">Docs</Button>
              </a>
            </div>
          </div>

          <!-- Router View -->
          <router-view v-slot="{ Component }">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-2">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>
