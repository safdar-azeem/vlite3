<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { AppShell } from '@/components/AppShell'
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
    label: 'Overview',
    icon: 'lucide:book-open',
    children: [
      { label: 'Getting Started', to: '/components/getting-started', icon: 'lucide:rocket' },
    ],
  },
  {
    label: 'Theme & Style',
    icon: 'lucide:palette',
    children: [
      { label: 'Colors', to: '/components/colors', icon: 'lucide:palette' },
      { label: 'Theme Toggle', to: '/components/themetoggle', icon: 'lucide:sun' },
    ],
  },
  {
    label: 'Buttons & Indicators',
    icon: 'lucide:mouse-pointer-2',
    children: [
      { label: 'Button', to: '/components/button', icon: 'lucide:mouse-pointer-2' },
      { label: 'Button Group', to: '/components/buttongroup', icon: 'lucide:git-merge' },
      { label: 'Clipboard', to: '/components/clipboard', icon: 'lucide:clipboard' },
      { label: 'Badge', to: '/components/badge', icon: 'lucide:tag' },
      { label: 'Chip', to: '/components/chip', icon: 'lucide:sticker' },
      { label: 'StatusChip', to: '/components/statuschip', icon: 'lucide:badge-check' },
      { label: 'Beacon', to: '/components/beacon', icon: 'lucide:radio' },
    ],
  },
  {
    label: 'Text Inputs',
    icon: 'lucide:type',
    children: [
      { label: 'Input', to: '/components/input', icon: 'lucide:text-cursor-input' },
      { label: 'Textarea', to: '/components/textarea', icon: 'lucide:align-left' },
      { label: 'Number Input', to: '/components/numberinput', icon: 'lucide:hash' },
      { label: 'OTP Input', to: '/components/otpinput', icon: 'lucide:shield-check' },
      { label: 'Rich Text Editor', to: '/components/richtexteditor', icon: 'lucide:type' },
      { label: 'TagInput', to: '/components/taginput', icon: 'lucide:tags' },
    ],
  },
  {
    label: 'Selects & Toggles',
    icon: 'lucide:check-square',
    children: [
      { label: 'CheckBox', to: '/components/checkbox', icon: 'lucide:check-square' },
      { label: 'Radio', to: '/components/radio', icon: 'lucide:circle-dot' },
      { label: 'Switch', to: '/components/switch', icon: 'lucide:toggle-left' },
      { label: 'Slider', to: '/components/slider', icon: 'lucide:sliders-horizontal' },
      { label: 'MultiSelect', to: '/components/multiselect', icon: 'lucide:list-checks' },
      { label: 'ChoiceBox', to: '/components/choicebox', icon: 'lucide:layout-grid' },
      { label: 'Rating', to: '/components/rating', icon: 'lucide:star' },
    ],
  },
  {
    label: 'Pickers & Upload',
    icon: 'lucide:mouse-pointer-click',
    children: [
      { label: 'ColorPicker', to: '/components/colorpicker', icon: 'lucide:palette' },
      { label: 'IconPicker', to: '/components/iconpicker', icon: 'lucide:smile' },
      { label: 'DatePicker', to: '/components/datepicker', icon: 'lucide:calendar' },
      {
        label: 'DateRangePicker',
        to: '/components/daterangepicker',
        icon: 'lucide:calendar-range',
      },
      { label: 'FilePicker', to: '/components/filepicker', icon: 'lucide:upload-cloud' },
      { label: 'ThumbnailSelector', to: '/components/thumbnailselector', icon: 'lucide:image' },
    ],
  },
  {
    label: 'Avatars & People',
    icon: 'lucide:users',
    children: [
      { label: 'Avatar', to: '/components/avatar', icon: 'lucide:user' },
      { label: 'Persona', to: '/components/persona', icon: 'lucide:user-circle' },
      { label: 'Avatar Group', to: '/components/avatargroup', icon: 'lucide:users' },
      { label: 'Avatar Uploader', to: '/components/avatar-uploader', icon: 'lucide:camera' },
    ],
  },
  {
    label: 'Tables & Lists',
    icon: 'lucide:table',
    children: [
      { label: 'DataTable', to: '/components/datatable', icon: 'lucide:table-2' },
      { label: 'DataList', to: '/components/datalist', icon: 'lucide:layout-grid' },
      { label: 'List', to: '/components/list', icon: 'lucide:layout-list' },
      { label: 'Custom Fields', to: '/components/customfieldsdisplay', icon: 'lucide:list-tree' },
    ],
  },
  {
    label: 'Metrics & Data',
    icon: 'lucide:bar-chart-2',
    children: [
      { label: 'Stats', to: '/components/stats', icon: 'lucide:bar-chart-2' },
      { label: 'Charts', to: '/components/chart', icon: 'lucide:chart-line' },
      { label: 'Gantt Chart', to: '/components/ganttchart', icon: 'lucide:gantt-chart' },
      { label: 'Heatmap', to: '/components/heatmap', icon: 'lucide:activity' },
      { label: 'ProgressBar', to: '/components/progressbar', icon: 'lucide:bar-chart-3' },
      { label: 'Price', to: '/components/price', icon: 'lucide:circle-dollar-sign' },
    ],
  },
  {
    label: 'Time & Dates',
    icon: 'lucide:calendar-days',
    children: [
      { label: 'Calendar', to: '/components/calendar', icon: 'lucide:calendar-days' },
      { label: 'Date Built-in', to: '/components/datetime', icon: 'lucide:calendar' },
      { label: 'Clock', to: '/components/clock', icon: 'lucide:clock-3' },
      { label: 'Timeline', to: '/components/timeline', icon: 'lucide:clock' },
    ],
  },
  {
    label: 'App & Shell',
    icon: 'lucide:layout-dashboard',
    children: [
      { label: 'App Shell', to: '/components/appshell', icon: 'lucide:layout-dashboard' },
      { label: 'Screen', to: '/components/screen', icon: 'lucide:monitor' },
      { label: 'Navbar', to: '/components/navbar', icon: 'lucide:layout-template' },
      { label: 'Sidebar Menu', to: '/components/sidebarmenu', icon: 'lucide:sidebar' },
      { label: 'Footer', to: '/components/footer', icon: 'lucide:panel-bottom' },
    ],
  },
  {
    label: 'Layout Blocks',
    icon: 'lucide:columns',
    children: [
      { label: 'Accordion', to: '/components/accordion', icon: 'lucide:list' },
      { label: 'Tabs', to: '/components/tabes', icon: 'lucide:panels-top-left' },
      { label: 'Splitter', to: '/components/splitter', icon: 'lucide:columns' },
      { label: 'Masonry Grid', to: '/components/masonry', icon: 'lucide:layout-dashboard' },
      { label: 'Carousel', to: '/components/carousel', icon: 'lucide:gallery-horizontal' },
      { label: 'Image Comparison', to: '/components/image-comparison', icon: 'lucide:image-minus' },
    ],
  },
  {
    label: 'Navigation Elements',
    icon: 'lucide:navigation',
    children: [
      { label: 'Breadcrumb', to: '/components/breadcrumb', icon: 'lucide:chevrons-right' },
      { label: 'Pagination', to: '/components/pagination', icon: 'lucide:arrow-left-right' },
      { label: 'Command Palette', to: '/components/commandpalette', icon: 'lucide:command' },
      { label: 'File Tree', to: '/components/filetree', icon: 'lucide:folder-tree' },
    ],
  },
  {
    label: 'Modals & Popovers',
    icon: 'lucide:app-window',
    children: [
      { label: 'Modal', to: '/components/modal', icon: 'lucide:app-window' },
      { label: 'SidePanel', to: '/components/sidepanel', icon: 'lucide:panel-right' },
      { label: 'Dropdown', to: '/components/dropdown', icon: 'lucide:chevron-down-square' },
      { label: 'Tooltip', to: '/components/tooltip', icon: 'lucide:message-square' },
    ],
  },
  {
    label: 'Alerts & Status',
    icon: 'lucide:bell',
    children: [
      { label: 'Toast', to: '/components/toast', icon: 'lucide:bell' },
      { label: 'Alert', to: '/components/alert', icon: 'lucide:alert-circle' },
      { label: 'Spinner', to: '/components/spinner', icon: 'lucide:loader-2' },
      { label: 'Skeleton', to: '/components/skeleton', icon: 'lucide:layout-template' },
      { label: 'Empty State', to: '/components/empty', icon: 'lucide:inbox' },
      { label: 'Scroll Reveal', to: '/components/scroll-reveal', icon: 'lucide:move-down' },
    ],
  },
  {
    label: 'Collaboration',
    icon: 'lucide:message-square',
    children: [
      { label: 'Chat Interface', to: '/components/chat', icon: 'lucide:message-circle' },
      { label: 'Comment Thread', to: '/components/comment', icon: 'lucide:message-square-dashed' },
      { label: 'Attachments', to: '/components/attachments', icon: 'lucide:paperclip' },
    ],
  },
  {
    label: 'Tools & Utilities',
    icon: 'lucide:wrench',
    children: [
      { label: 'Form Builder', to: '/components/form', icon: 'lucide:file-input' },
      { label: 'Kanban', to: '/components/kanban', icon: 'lucide:kanban' },
      { label: 'Category Manager', to: '/components/categorymanager', icon: 'lucide:folder-tree' },
      { label: 'Workbook', to: '/components/workbook', icon: 'lucide:folder-edit' },
      { label: 'Invoice', to: '/components/invoice', icon: 'lucide:receipt' },
      { label: 'Pricing Plan', to: '/components/pricing', icon: 'lucide:credit-card' },
      { label: 'Export Data', to: '/components/export-data', icon: 'lucide:file-down' },
      { label: 'Import Data', to: '/components/import-data', icon: 'lucide:file-up' },
      { label: 'Barcode', to: '/components/barcode', icon: 'lucide:barcode' },
      { label: 'QRCode', to: '/components/qrcode', icon: 'lucide:qr-code' },
      { label: 'Google Login', to: '/components/googlelogin', icon: 'lucide:chrome' },
      {
        label: 'Permission Matrix',
        to: '/components/permissionmatrix',
        icon: 'lucide:shield-check',
      },
      { label: 'i18n Support', to: '/components/i18n', icon: 'lucide:globe' },
    ],
  },
]
</script>

<template>
  <div class="h-screen w-full overflow-hidden">
    <AppShell
      variant="sidebar"
      layout-mode="variant2"
      mobileBreakpoint="md"
      breadcrumb
      :contentClass="isSidebarCompact ? 'px-2!' : 'px-2.5'"
      :render-nested-tabs="isSidebarCompact"
      class="border-r border-border"
      :class="isSidebarCompact ? 'w-28' : 'w-64'">
      <template #sidebar>
        <div class="h-full">
          <SidebarMenu
            class="hidden md:flex"
            :items="menuItems"
            :allow-multiple="true"
            :compact="isSidebarCompact"
            :item-class="isSidebarCompact && 'rounded-md!'"
            :render-mode="isSidebarCompact ? 'popover' : 'tree'"
            show-compact-labels
            :default-expanded="[
              'Overview',
              'Buttons & Indicators',
              'Text Inputs',
              'Avatars & People',
              'Alerts & Status',
              'Layout Blocks',
              'Modals & Popovers',
            ]" />
          <SidebarMenu
            class="md:hidden"
            :show-tooltip="false"
            :allow-multiple="true"
            :items="menuItems"
            :force-tree-view="true" />
        </div>
      </template>

      <template #sidebar-footer>
        <div
          class="flex items-center gap-2 px-2 py-2"
          :class="isSidebarCompact ? 'flex-col justify-center' : 'flex-row justify-between'">
          <ThemeToggle />
          <p v-if="!isSidebarCompact" class="text-xs text-muted-foreground">v1.2.5</p>
        </div>
      </template>

      <template #sidebar-header>
        <router-link
          to="/"
          class="font-bold text-lg flex items-center gap-2 w-full px-4.5 py-3 hover:opacity-80 transition-opacity"
          :class="isSidebarCompact ? 'md:flex-col md:justify-center' : 'flex-row'">
          <div class="w-7 h-7 rounded bg-primary text-white flex items-center justify-center">
            V
          </div>
          <span v-if="!isSidebarCompact">Vlite3</span>
        </router-link>
      </template>

      <template #header="{ toggleSidebar, toggle, breadcrumbItems, pageTitle }">
        <div class="h-13 bg-background flex items-center justify-between px-4 w-full shadow-sm">
          <div class="flex items-center min-w-0 flex-1">
            <Button variant="ghost" icon="lucide:menu" @click="toggle" class="md:hidden shrink-0" />
            <Button
              variant="ghost"
              :icon="isSidebarCompact ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
              @click="toggleCompact"
              class="max-md:hidden shrink-0 text-muted-foreground mr-2" />

            <NavbarCommandPalette
              :enabled="true"
              triggerClass="w-[200px] hidden sm:inline-flex"
              :menu-items="menuItems"
              placeholder="Search components..."
              shortcut-key="k" />

            <div
              v-if="breadcrumbItems?.length > 1"
              class="hidden lg:flex items-center pl-4 ml-3 border-l border-border">
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
        <div class="px-10 py-5">
          <router-view></router-view>
        </div>
      </template>
    </AppShell>
  </div>
</template>
