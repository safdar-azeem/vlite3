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
    items: ['Input', 'Textarea', 'DatePicker', 'MultiSelect', 'Switch', 'Slider', 'OTP Input', 'ColorPicker', 'Form'],
    color: 'from-blue-500/10 to-indigo-500/10',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Data Display',
    icon: 'lucide:layout-template',
    count: 16,
    items: ['DataTable', 'DataList', 'Calendar', 'Heatmap', 'Charts', 'Timeline', 'Stats', 'Avatar'],
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: 'Navigation & Layout',
    icon: 'lucide:panel-left',
    count: 14,
    items: ['Navbar', 'Sidebar Menu', 'Breadcrumb', 'Tabs', 'Accordion', 'Splitter', 'File Tree', 'Carousel'],
    color: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'Overlays & Feedback',
    icon: 'lucide:layers',
    count: 13,
    items: ['Modal', 'SidePanel', 'Dropdown', 'Toast', 'Tooltip', 'Alert', 'Chat', 'Command Palette'],
    color: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Buttons & Actions',
    icon: 'lucide:mouse-pointer-click',
    count: 4,
    items: ['Button', 'Button Group', 'Badge', 'Chip'],
    color: 'from-rose-500/10 to-pink-500/10',
    borderColor: 'border-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    title: 'Tools & Utilities',
    icon: 'lucide:wrench',
    count: 10,
    items: ['Kanban', 'Invoice', 'Pricing Plan', 'Export', 'Import', 'Barcode', 'QRCode', 'i18n'],
    color: 'from-cyan-500/10 to-sky-500/10',
    borderColor: 'border-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
]
</script>

<template>
  <section class="py-24 bg-muted/30">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
        <span class="text-sm font-semibold text-primary uppercase tracking-wider">Component Categories</span>
        <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Everything you need, <span class="text-primary">nothing you don't</span>
        </h2>
        <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
          From basic inputs to complex data grids and kanban boards — all with a consistent, clean API.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(cat, i) in categories" 
          :key="i" 
          class="bg-background border border-border/60 hover:border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up flex flex-col"
          :style="{ animationDelay: `${150 + i * 80}ms` }"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br" :class="cat.color">
              <Icon :icon="cat.icon" class="w-6 h-6" :class="cat.iconColor" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-foreground">{{ cat.title }}</h3>
              <span class="text-sm font-medium text-muted-foreground">{{ cat.count }} components</span>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-auto pt-4">
            <span v-for="item in cat.items" :key="item" class="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-full border border-border/50">
              {{ item }}
            </span>
            <span v-if="cat.count > cat.items.length" class="text-xs font-medium px-2.5 py-1 text-primary bg-primary/10 rounded-full border border-primary/20">
              +{{ cat.count - cat.items.length }} more
            </span>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center animate-fade-up delay-4">
        <Button @click="navigateToComponents" size="lg" class="rounded-full h-12 px-8 text-base font-medium shadow-md">
          Browse All Components
          <Icon icon="lucide:arrow-right" class="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
