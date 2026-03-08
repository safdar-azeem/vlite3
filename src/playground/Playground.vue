<script setup lang="ts">
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Navbar, NavbarGroup, NavbarItem } from '@/components/Navbar'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import Icon from '@/components/Icon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/Button.vue'
import Avatar from '@/components/Avatar.vue'
import NavbarCommandPalette, {
  type CommandPlateSchema,
} from '@/components/NavbarCommandPalette.vue'
import { Breadcrumb } from '@/components/Breadcrumb'

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
      { label: 'i18n Support', to: '/i18n', icon: 'lucide:globe' },
      { label: 'ProgressBar', to: '/progressbar', icon: 'lucide:bar-chart-3' },
    ],
  },
  {
    label: 'Forms & Auth',
    icon: 'lucide:text-cursor-input',
    children: [
      { label: 'Input', to: '/input', icon: 'lucide:text-cursor-input' },
      { label: 'Number Input', to: '/numberinput', icon: 'lucide:hash' },
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
      { label: 'DateRangePicker', to: '/daterangepicker', icon: 'lucide:calendar-range' },
      { label: 'Google Login', to: '/googlelogin', icon: 'lucide:chrome' },
      { label: 'Permission Matrix', to: '/permissionmatrix', icon: 'lucide:shield-check' },
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
      { label: 'Spinner', to: '/spinner', icon: 'lucide:loader-2' },
      { label: 'Scroll Reveal', to: '/scroll-reveal', icon: 'lucide:move-down' },
    ],
  },
  {
    label: 'Navigation & Data',
    icon: 'lucide:navigation',
    children: [
      { label: 'Screen', to: '/screen', icon: 'lucide:monitor' },
      { label: 'Stats', to: '/stats', icon: 'lucide:bar-chart-2' },
      { label: 'List', to: '/list', icon: 'lucide:layout-list' },
      { label: 'DataTable', to: '/datatable', icon: 'lucide:table-2' },
      { label: 'DataList', to: '/datalist', icon: 'lucide:layout-grid' },
      { label: 'Sidebar Menu', to: '/sidebarmenu', icon: 'lucide:sidebar' },
      { label: 'Navbar', to: '/navbar', icon: 'lucide:layout-template' },
      { label: 'Command Palette', to: '/commandpalette', icon: 'lucide:command' },
      { label: 'Link/Label', to: '/label', icon: 'lucide:type' },
      { label: 'Pagination', to: '/pagination', icon: 'lucide:arrow-left-right' },
      { label: 'Tabs', to: '/tabes', icon: 'lucide:toggle-left' },
      { label: 'Accordion', to: '/accordion', icon: 'lucide:list' },
      { label: 'Timeline', to: '/timeline', icon: 'lucide:clock' },
      { label: 'Masonry Grid', to: '/masonry', icon: 'lucide:layout-dashboard' },
      { label: 'Pricing Plan', to: '/pricing', icon: 'lucide:credit-card' },
      { label: 'Heatmap', to: '/heatmap', icon: 'lucide:activity' },
      { label: 'File Tree', to: '/filetree', icon: 'lucide:folder-tree' },
      { label: 'Kanban', to: '/kanban', icon: 'lucide:kanban' },
      { label: 'Workbook', to: '/workbook', icon: 'lucide:folder-edit' },
      { label: 'Carousel', to: '/carousel', icon: 'lucide:gallery-horizontal' },
      { label: 'Breadcrumb', to: '/breadcrumb', icon: 'lucide:chevrons-right' },
      { label: 'Barcode', to: '/barcode', icon: 'lucide:barcode' },
      { label: 'QRCode', to: '/qrcode', icon: 'lucide:qr-code' },
      { label: 'Export Data', to: '/export-data', icon: 'lucide:file-down' },
      { label: 'Import Data', to: '/import-data', icon: 'lucide:file-up' },
    ],
  },
]
</script>

<template>
  <div class="h-screen w-full bg-body text-gray-900 flex max-md:flex-col overflow-hidden">
    <Navbar
      variant="sidebar"
      mobileBreakpoint="md"
      sidebarToggle
      breadcrumb
      class="bg-body border-r border-border h-max shrink-0 z-20">
      <template #header="{ toggleSidebar, toggle, breadcrumbItems }">
        <div class="h-13 border-b bg-white flex items-center justify-between px-6 w-full shadow-sm">
          <div class="flex items-center w-full justify-between gap-8">
            <div class="flex gap-3 items-center">
              <Button variant="ghost" icon="lucide:menu" @click="toggle" class="md:hidden" />
              <Button
                variant="ghost"
                icon="lucide:menu"
                @click="toggleSidebar"
                class="max-md:hidden" />
              <div class="font-bold text-lg flex items-center gap-2 mr-6">
                <div class="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
                  V
                </div>
                Vlite3
              </div>

              <NavbarCommandPalette
                :enabled="true"
                triggerClass="w-[300px]"
                :menu-items="menuItems"
                placeholder="Search components..."
                shortcut-key="k" />

              <div
                v-if="breadcrumbItems?.length > 1"
                class="hidden md:flex items-center pl-4 border-l border-border">
                <Breadcrumb :items="breadcrumbItems" separator="slash" size="sm" />
              </div>
            </div>
            <div class="flex gap-4">
              <Button variant="ghost" size="sm" icon="lucide:bell" rounded="full" />
              <Avatar size="sm" fallback="JD" class="bg-primary/20 text-primary" />
            </div>
          </div>
        </div>
      </template>

      <template #default>
        <div class="space-y-6 md:py-3">
          <SidebarMenu
            :items="menuItems"
            :allow-multiple="true"
            show-compact-labels
            :default-expanded="[
              'Core',
              'Forms & Auth',
              'Feedback & Overlays',
              'Navigation & Data',
            ]" />
        </div>
      </template>

      <template #right>
        <div class="flex items-center justify-between gap-2">
          <ThemeToggle />
          <p class="text-xs text-muted-foreground">v0.5.2</p>
        </div>
      </template>

      <template #main>
        <div class="flex-1 w-full flex flex-col h-full bg-body relative z-0">
          <div class="flex-1 overflow-y-auto scroll-smooth">
            <div class="max-w-[1950px] mx-auto px-14 py-6 md:py-5">
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
        </div>
      </template>
    </Navbar>
  </div>
</template>
