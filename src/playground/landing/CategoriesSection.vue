<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const router = useRouter()
const navigateToComponents = () => router.push('/components/button')

const categories = [
  {
    title: 'Forms & Inputs',
    icon: 'lucide:text-cursor-input',
    count: 17,
    desc: 'Essential controls for user data collection, complex schema validation, and multi-step forms.',
    items: [
      'Input',
      'Textarea',
      'DatePicker',
      'MultiSelect',
      'Switch',
      'Slider',
      'OTP Input',
      'ColorPicker',
      'Form',
    ],
  },
  {
    title: 'Data Display',
    icon: 'lucide:layout-template',
    count: 17,
    desc: 'Powerful components to cleanly organize and present your complex datasets.',
    items: [
      'DataTable',
      'DataList',
      'Calendar',
      'Heatmap',
      'Charts',
      'Timeline',
      'Gantt Chart',
      'Stats',
      'Avatar',
    ],
  },
  {
    title: 'Navigation & Layout',
    icon: 'lucide:panel-left',
    count: 14,
    desc: 'Structural elements and AppShells to intuitively guide users through your application.',
    items: [
      'Navbar',
      'Sidebar Menu',
      'Breadcrumb',
      'Tabs',
      'Accordion',
      'Splitter',
      'File Tree',
      'Carousel',
    ],
  },
  {
    title: 'Overlays & Feedback',
    icon: 'lucide:layers',
    count: 13,
    desc: 'Contextual popups, dialogs, and messaging for immediate user interactions.',
    items: [
      'Modal',
      'SidePanel',
      'Dropdown',
      'Toast',
      'Tooltip',
      'Alert',
      'Chat',
      'Command Palette',
    ],
  },
  {
    title: 'Buttons & Actions',
    icon: 'lucide:mouse-pointer-click',
    count: 4,
    desc: 'Interactive triggers for commands and core operations.',
    items: ['Button', 'Button Group', 'Badge', 'Chip'],
  },
  {
    title: 'Tools & Utilities',
    icon: 'lucide:wrench',
    count: 10,
    desc: 'Specialized enterprise components for advanced, specific use cases.',
    items: ['Kanban', 'Invoice', 'Pricing Plan', 'Export', 'Import', 'Barcode', 'QRCode', 'i18n'],
  },
]
</script>

<template>
  <section v-once class="py-24 bg-muted/20 border-y border-border">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <div class="mb-14">
        <h2 class="text-3xl font-bold text-foreground tracking-tight mb-3">Component Directory</h2>
        <p class="text-base text-muted-foreground max-w-2xl leading-relaxed">
          A minimalist, list-driven approach to browsing the ecosystem.
        </p>
      </div>

      <div class="flex flex-col">
        <div
          v-for="(cat, i) in categories"
          :key="i"
          class="flex items-start gap-6 py-5 border-t border-border last:border-b hover:bg-muted/20 px-3 -mx-3 rounded-md">
          <!-- Icon -->
          <div
            class="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
            <Icon :icon="cat.icon" class="w-4 h-4" />
          </div>

          <!-- Main content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4 mb-1.5">
              <h3
                class="text-sm font-semibold text-foreground">
                {{ cat.title }}
              </h3>
              <span class="text-sm font-semibold text-muted-foreground tabular-nums shrink-0">{{
                cat.count
              }}</span>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed mb-2.5">{{ cat.desc }}</p>
            <div class="flex flex-wrap gap-x-2 gap-y-1">
              <span
                v-for="item in cat.items"
                :key="item"
                class="text-xs text-muted-foreground/60 hover:text-foreground cursor-default">
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <Button @click="navigateToComponents" variant="outline" icon-right="lucide:arrow-right">
          Explore All Components
        </Button>
      </div>
    </div>
  </section>
</template>
