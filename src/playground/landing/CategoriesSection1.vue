<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'

const router = useRouter()

const navigateToComponents = () => {
  router.push('/components/button')
}

const categories = [
  {
    title: 'Forms & Inputs',
    icon: 'lucide:text-cursor-input',
    count: 17,
    desc: 'Essential controls for user data collection, complex schema validation, and multi-step forms.',
    items: ['Input', 'Textarea', 'DatePicker', 'MultiSelect', 'Switch', 'Slider', 'OTP Input', 'ColorPicker', 'Form'],
  },
  {
    title: 'Data Display',
    icon: 'lucide:layout-template',
    count: 16,
    desc: 'Powerful components to cleanly organize and present your complex datasets.',
    items: ['DataTable', 'DataList', 'Calendar', 'Heatmap', 'Charts', 'Timeline', 'Stats', 'Avatar'],
  },
  {
    title: 'Navigation & Layout',
    icon: 'lucide:panel-left',
    count: 14,
    desc: 'Structural elements and AppShells to intuitively guide users through your application.',
    items: ['Navbar', 'Sidebar Menu', 'Breadcrumb', 'Tabs', 'Accordion', 'Splitter', 'File Tree', 'Carousel'],
  },
  {
    title: 'Overlays & Feedback',
    icon: 'lucide:layers',
    count: 13,
    desc: 'Contextual popups, dialogs, and messaging for immediate user interactions.',
    items: ['Modal', 'SidePanel', 'Dropdown', 'Toast', 'Tooltip', 'Alert', 'Chat', 'Command Palette'],
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
  <section class="py-24 bg-background border-t border-border">
    <div class="max-w-5xl mx-auto px-6 lg:px-8">
      <div class="mb-16 animate-fade-up">
        <h2 class="text-3xl font-bold text-foreground tracking-tight mb-4">
          Component Directory
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl">
          A minimalist, list-driven approach to browsing the ecosystem. Clean lines and typography-first design.
        </p>
      </div>

      <div class="flex flex-col divide-y divide-border">
        <div 
          v-for="(cat, i) in categories" 
          :key="i"
          class="py-8 flex flex-col md:flex-row gap-8 items-start group animate-fade-up hover:bg-muted/20 transition-colors px-4 -mx-4 rounded-xl"
          :style="{ animationDelay: `${100 + i * 50}ms` }"
        >
          <div class="md:w-1/3 shrink-0 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon :icon="cat.icon" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{{ cat.title }}</h3>
              <span class="text-sm font-medium text-muted-foreground">{{ cat.count }} Components</span>
            </div>
          </div>
          
          <div class="md:w-2/3 flex flex-col gap-4 pt-1">
            <p class="text-muted-foreground leading-relaxed">
              {{ cat.desc }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="item in cat.items" 
                :key="item" 
                class="text-xs font-medium text-muted-foreground hover:text-foreground cursor-default"
              >
                {{ item }}<span class="text-border mx-1 last:hidden">/</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 pt-8 border-t border-border animate-fade-up delay-4">
        <Button @click="navigateToComponents" variant="outline" icon-right="lucide:arrow-right">
          Explore All Components
        </Button>
      </div>
    </div>
  </section>
</template>
