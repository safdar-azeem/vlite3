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
      { label: 'Colors', to: '/components/colors', icon: 'lucide:palette' },
      { label: 'Theme Toggle', to: '/components/themetoggle', icon: 'lucide:sun' },
    ],
  },
  {
    label: 'Buttons & Actions',
    icon: 'lucide:mouse-pointer-2',
    children: [
      { label: 'Button', to: '/components/button', icon: 'lucide:mouse-pointer-2' },
      { label: 'Button Group', to: '/components/buttongroup', icon: 'lucide:git-merge' },
      { label: 'Badge', to: '/components/badge', icon: 'lucide:tag' },
      { label: 'Chip', to: '/components/chip', icon: 'lucide:sticker' },
    ],
  },
  {
    label: 'Forms & Inputs',
    icon: 'lucide:text-cursor-input',
    children: [
      { label: 'Input', to: '/components/input', icon: 'lucide:text-cursor-input' },
      { label: 'Number Input', to: '/components/numberinput', icon: 'lucide:hash' },
      { label: 'OTP Input', to: '/components/otpinput', icon: 'lucide:shield-check' },
      { label: 'Textarea', to: '/components/textarea', icon: 'lucide:align-left' },
      { label: 'CheckBox', to: '/components/checkbox', icon: 'lucide:check-square' },
      { label: 'Switch', to: '/components/switch', icon: 'lucide:toggle-left' },
      { label: 'Slider', to: '/components/slider', icon: 'lucide:sliders-horizontal' },
      { label: 'ColorPicker', to: '/components/colorpicker', icon: 'lucide:palette' },
      { label: 'IconPicker', to: '/components/iconpicker', icon: 'lucide:smile' },
      { label: 'DatePicker', to: '/components/datepicker', icon: 'lucide:calendar' },
      {
        label: 'DateRangePicker',
        to: '/components/daterangepicker',
        icon: 'lucide:calendar-range',
      },
      { label: 'MultiSelect', to: '/components/multiselect', icon: 'lucide:list-checks' },
      { label: 'ChoiceBox', to: '/components/choicebox', icon: 'lucide:layout-grid' },
      { label: 'FilePicker', to: '/components/filepicker', icon: 'lucide:upload-cloud' },
      { label: 'ThumbnailSelector', to: '/components/thumbnailselector', icon: 'lucide:image' },
      { label: 'TagInput', to: '/components/taginput', icon: 'lucide:tags' },
      { label: 'Form', to: '/components/form', icon: 'lucide:file-input' },
      { label: 'Google Login', to: '/components/googlelogin', icon: 'lucide:chrome' },
      {
        label: 'Permission Matrix',
        to: '/components/permissionmatrix',
        icon: 'lucide:shield-check',
      },
    ],
  },
  {
    label: 'Display & Data',
    icon: 'lucide:table-2',
    children: [
      { label: 'DataTable', to: '/components/datatable', icon: 'lucide:table-2' },
      { label: 'DataList', to: '/components/datalist', icon: 'lucide:layout-grid' },
      { label: 'List', to: '/components/list', icon: 'lucide:layout-list' },
      { label: 'Calendar', to: '/components/calendar', icon: 'lucide:calendar-days' },
      { label: 'Stats', to: '/components/stats', icon: 'lucide:bar-chart-2' },
      { label: 'Heatmap', to: '/components/heatmap', icon: 'lucide:activity' },
      { label: 'Charts', to: '/components/chart', icon: 'lucide:chart-line' },
      { label: 'Avatar', to: '/components/avatar', icon: 'lucide:user' },
      { label: 'Avatar Group', to: '/components/avatargroup', icon: 'lucide:users' },
      { label: 'Avatar Uploader', to: '/components/avatar-uploader', icon: 'lucide:camera' },
      { label: 'ProgressBar', to: '/components/progressbar', icon: 'lucide:bar-chart-3' },
      { label: 'StatusChip', to: '/components/statuschip', icon: 'lucide:badge-check' },
      { label: 'Price', to: '/components/price', icon: 'lucide:circle-dollar-sign' },
      { label: 'Date', to: '/components/datetime', icon: 'lucide:calendar-days' },
      { label: 'Clock', to: '/components/clock', icon: 'lucide:clock-3' },
      {
        label: 'Custom Fields Display',
        to: '/components/customfieldsdisplay',
        icon: 'lucide:list-tree',
      },
      { label: 'Timeline', to: '/components/timeline', icon: 'lucide:clock' },
    ],
  },
  {
    label: 'Navigation & Layout',
    icon: 'lucide:layout-template',
    children: [
      { label: 'Navbar', to: '/components/navbar', icon: 'lucide:layout-template' },
      { label: 'Sidebar Menu', to: '/components/sidebarmenu', icon: 'lucide:sidebar' },
      { label: 'Breadcrumb', to: '/components/breadcrumb', icon: 'lucide:chevrons-right' },
      { label: 'Tabs', to: '/components/tabes', icon: 'lucide:panels-top-left' },
      { label: 'Accordion', to: '/components/accordion', icon: 'lucide:list' },
      { label: 'Pagination', to: '/components/pagination', icon: 'lucide:arrow-left-right' },
      { label: 'Command Palette', to: '/components/commandpalette', icon: 'lucide:command' },
      { label: 'Screen', to: '/components/screen', icon: 'lucide:monitor' },
      { label: 'Splitter', to: '/components/splitter', icon: 'lucide:columns' },
      { label: 'Masonry Grid', to: '/components/masonry', icon: 'lucide:layout-dashboard' },
      { label: 'File Tree', to: '/components/filetree', icon: 'lucide:folder-tree' },
      { label: 'Carousel', to: '/components/carousel', icon: 'lucide:gallery-horizontal' },
    ],
  },
  {
    label: 'Overlays & Feedback',
    icon: 'lucide:layers',
    children: [
      { label: 'Modal', to: '/components/modal', icon: 'lucide:app-window' },
      { label: 'SidePanel', to: '/components/sidepanel', icon: 'lucide:panel-right' },
      { label: 'Dropdown', to: '/components/dropdown', icon: 'lucide:chevron-down-square' },
      { label: 'Tooltip', to: '/components/tooltip', icon: 'lucide:message-square' },
      { label: 'Toast', to: '/components/toast', icon: 'lucide:bell' },
      { label: 'Alert', to: '/components/alert', icon: 'lucide:alert-circle' },
      { label: 'Spinner', to: '/components/spinner', icon: 'lucide:loader-2' },
      { label: 'Scroll Reveal', to: '/components/scroll-reveal', icon: 'lucide:move-down' },
      { label: 'Empty State', to: '/components/empty', icon: 'lucide:inbox' },
      { label: 'Chat Interface', to: '/components/chat', icon: 'lucide:message-circle' },
      { label: 'Comment Thread', to: '/components/comment', icon: 'lucide:message-square-dashed' },
      { label: 'Attachments', to: '/components/attachments', icon: 'lucide:paperclip' },
    ],
  },
  {
    label: 'Tools & Utilities',
    icon: 'lucide:wrench',
    children: [
      { label: 'Kanban', to: '/components/kanban', icon: 'lucide:kanban' },
      { label: 'Category Manager', to: '/components/categorymanager', icon: 'lucide:folder-tree' },
      { label: 'Workbook', to: '/components/workbook', icon: 'lucide:folder-edit' },
      { label: 'Invoice', to: '/components/invoice', icon: 'lucide:receipt' },
      { label: 'Pricing Plan', to: '/components/pricing', icon: 'lucide:credit-card' },
      { label: 'Export Data', to: '/components/export-data', icon: 'lucide:file-down' },
      { label: 'Import Data', to: '/components/import-data', icon: 'lucide:file-up' },
      { label: 'Barcode', to: '/components/barcode', icon: 'lucide:barcode' },
      { label: 'QRCode', to: '/components/qrcode', icon: 'lucide:qr-code' },
      { label: 'i18n Support', to: '/components/i18n', icon: 'lucide:globe' },
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
      :contentClass="isSidebarCompact ? 'px-0!' : 'px-2.5'"
      :render-nested-tabs="isSidebarCompact"
      class="border-r border-border"
      :class="isSidebarCompact ? 'w-28' : 'w-64'">
      <template #default>
        <div :class="isSidebarCompact ? '' : 'py-3'">
          <SidebarMenu
            class="hidden md:flex"
            :show-tooltip="isSidebarCompact"
            :items="menuItems"
            :allow-multiple="true"
            :compact="isSidebarCompact"
            :item-class="isSidebarCompact && 'rounded-none!'"
            :render-mode="isSidebarCompact ? 'popover' : 'tree'"
            show-compact-labels
            :default-expanded="[
              'Buttons & Actions',
              'Forms & Inputs',
              'Display & Data',
              'Navigation & Layout',
              'Overlays & Feedback',
              'Tools & Utilities',
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
        <!-- Adding much better space inside the page layout -->
        <div class="px-10 md:px-14 lg:px-16 py-8 lg:py-10 max-w-[1500px] mx-auto w-full">
          <router-view></router-view>
        </div>
      </template>
    </Navbar>
  </div>
</template>
