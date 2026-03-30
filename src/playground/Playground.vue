<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { Navbar } from '@/components/Navbar'
import SidebarMenu from '@/components/SidebarMenu/SidebarMenu.vue'
import type { SidebarMenuItemSchema } from '@/components/SidebarMenu'
import ThemeToggle from '@/components/ThemeToggle.vue'
import Button from '@/components/Button.vue'
import Avatar from '@/components/Avatar.vue'
import NavbarCommandPalette from '@/components/NavbarCommandPalette.vue'
import { Breadcrumb } from '@/components/Breadcrumb'

const isSidebarCompact = useLocalStorage<boolean>('vlite-navbar-sidebar-compact', false)

const toggleCompact = () => {
  isSidebarCompact.value = !isSidebarCompact.value
}

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
      { label: 'ThumbnailSelector', to: '/thumbnailselector', icon: 'lucide:image' },
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
      { label: 'Chat Interface', to: '/chat', icon: 'lucide:message-circle' },
      { label: 'Alert', to: '/alert', icon: 'lucide:alert-circle' },
      { label: 'Modal', to: '/modal', icon: 'lucide:app-window' },
      { label: 'SidePanel', to: '/sidepanel', icon: 'lucide:panel-right' },
      { label: 'Dropdown', to: '/dropdown', icon: 'lucide:chevron-down-square' },
      { label: 'Tooltip', to: '/tooltip', icon: 'lucide:message-square' },
      { label: 'Toast', to: '/toast', icon: 'lucide:bell' },
      { label: 'Spinner', to: '/spinner', icon: 'lucide:loader-2' },
      { label: 'Scroll Reveal', to: '/scroll-reveal', icon: 'lucide:move-down' },
      { label: 'Empty State', to: '/empty', icon: 'lucide:inbox' },
      { label: 'Attachments', to: '/attachments', icon: 'lucide:paperclip' },
    ],
  },
  {
    label: 'Navigation & Data',
    icon: 'lucide:navigation',
    children: [
      { label: 'Screen', to: '/screen', icon: 'lucide:monitor' },
      { label: 'Stats', to: '/stats', icon: 'lucide:bar-chart-2' },
      { label: 'StatusChip', to: '/statuschip', icon: 'lucide:badge-check' },
      { label: 'Price', to: '/price', icon: 'lucide:circle-dollar-sign' },
      { label: 'Date', to: '/datetime', icon: 'lucide:calendar-days' },
      { label: 'Clock', to: '/clock', icon: 'lucide:clock-3' },
      { label: 'List', to: '/list', icon: 'lucide:layout-list' },
      { label: 'DataTable', to: '/datatable', icon: 'lucide:table-2' },
      { label: 'DataList', to: '/datalist', icon: 'lucide:layout-grid' },
      { label: 'Custom Fields Display', to: '/customfieldsdisplay', icon: 'lucide:list-tree' },
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
      { label: 'Category Manager', to: '/categorymanager', icon: 'lucide:folder-tree' },
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
  <div class="h-screen w-full overflow-hidden">
    <Navbar
      variant="sidebar"
      layout-mode="classic"
      mobileBreakpoint="md"
      breadcrumb
      :render-nested-tabs="isSidebarCompact"
      class="border-r border-border"
      :class="isSidebarCompact ? 'w-28' : 'w-64'">
      <template #default>
        <div class="py-3" :class="isSidebarCompact ? 'px-1' : 'px-2'">
          <SidebarMenu
            class="hidden md:flex"
            :show-tooltip="isSidebarCompact"
            :items="menuItems"
            :allow-multiple="true"
            :compact="isSidebarCompact"
            :render-mode="isSidebarCompact ? 'popover' : 'tree'"
            show-compact-labels
            :default-expanded="[
              'Core',
              'Forms & Auth',
              'Feedback & Overlays',
              'Navigation & Data',
            ]" />
          <SidebarMenu
            class="md:hidden"
            :show-tooltip="false"
            :allow-multiple="true"
            :items="menuItems"
            :force-tree-view="true" />
        </div>
      </template>

      <template #right>
        <div
          class="flex items-center gap-2 px-2 py-2"
          :class="isSidebarCompact ? 'flex-col justify-center' : 'flex-row justify-between'">
          <ThemeToggle />
          <p v-if="!isSidebarCompact" class="text-xs text-muted-foreground">v0.6.2</p>
        </div>
      </template>

      <template #logo>
        <div class="font-bold text-lg flex items-center gap-2 mr-6">
          <div class="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
            V
          </div>
          Vlite3
        </div>
      </template>

      <template #header="{ toggleSidebar, toggle, breadcrumbItems }">
        <div
          class="h-13 border-b bg-background flex items-center justify-between px-4 w-full shadow-sm">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <Button variant="ghost" icon="lucide:menu" @click="toggle" class="md:hidden shrink-0" />
            <Button
              variant="ghost"
              :icon="isSidebarCompact ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
              @click="toggleCompact"
              class="max-md:hidden shrink-0" />

            <div class="font-bold text-lg flex items-center gap-2 mr-6">
              <div class="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
                V
              </div>
              Vlite3
            </div>

            <NavbarCommandPalette
              :enabled="true"
              triggerClass="w-[200px] hidden sm:inline-flex"
              :menu-items="menuItems"
              placeholder="Search components..."
              shortcut-key="k" />

            <div
              v-if="breadcrumbItems?.length > 1"
              class="hidden md:flex items-center pl-3 border-l border-border ml-1">
              <Breadcrumb :items="breadcrumbItems" separator="slash" size="sm" />
            </div>
          </div>

          <div class="flex gap-2 items-center shrink-0">
            <Button variant="ghost" size="sm" icon="lucide:bell" rounded="full" />
            <Avatar size="sm" fallback="JD" class="bg-primary/20 text-primary" />
          </div>
        </div>
      </template>

      <template #main>
        <div class="px-10 py-7">
          <router-view></router-view>
        </div>
      </template>
    </Navbar>
  </div>
</template>
