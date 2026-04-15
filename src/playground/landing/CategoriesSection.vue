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
  <section class="categories-section">
    <div class="landing-container">
      <div class="section-header animate-fade-up">
        <span class="section-eyebrow">Component Categories</span>
        <h2 class="section-title">
          Everything you need, <span class="text-primary">nothing you don't</span>
        </h2>
        <p class="section-subtitle">
          From basic inputs to complex data grids and kanban boards — all with a consistent, clean API.
        </p>
      </div>

      <div class="categories-grid">
        <div v-for="(cat, i) in categories" :key="i" class="category-card animate-fade-up" :style="{ animationDelay: `${200 + i * 80}ms` }">
          <div class="category-header">
            <div class="category-icon" :class="cat.iconColor">
              <Icon :icon="cat.icon" class="w-[22px] h-[22px]" />
            </div>
            <div>
              <h3 class="category-title">{{ cat.title }}</h3>
              <span class="category-count">{{ cat.count }} components</span>
            </div>
          </div>
          <div class="category-items">
            <span v-for="item in cat.items" :key="item" class="category-tag">{{ item }}</span>
            <span v-if="cat.count > cat.items.length" class="category-tag category-tag-more">
              +{{ cat.count - cat.items.length }} more
            </span>
          </div>
        </div>
      </div>

      <div class="categories-cta animate-fade-up">
        <Button @click="navigateToComponents" size="lg" class="rounded-full h-12 px-10 text-base font-medium shadow-md">
          Browse All Components
          <Icon icon="lucide:arrow-right" class="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import './shared.css';

/* ── Categories Section ── */
.categories-section {
  padding: 6rem 0;
  background: color-mix(in srgb, var(--color-muted) 30%, transparent);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.category-card {
  background: var(--color-background);
  border: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: color-mix(in srgb, var(--color-border) 100%, transparent);
  box-shadow: 0 4px 20px -2px color-mix(in srgb, var(--color-foreground) 5%, transparent);
}

.category-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.category-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-foreground);
}

.category-count {
  font-size: 0.8125rem;
  color: var(--color-muted-foreground);
  font-weight: 500;
}

.category-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  border-radius: 9999px;
  border: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
}

.category-tag-more {
  background: transparent;
  border-color: transparent;
  color: var(--color-primary);
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.categories-cta {
  margin-top: 4rem;
  text-align: center;
}
</style>
