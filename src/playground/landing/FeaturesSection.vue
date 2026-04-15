<script setup lang="ts">
import Icon from '@/components/Icon.vue'

const features = [
  {
    icon: 'lucide:sparkles',
    title: 'Clean by Default',
    desc: 'Every component is designed with minimal visual noise, ample whitespace, and purpose-driven aesthetics.',
  },
  {
    icon: 'lucide:palette',
    title: 'Semantic Theming',
    desc: 'CSS variable-driven design tokens with full dark mode. Customize your entire UI with a few token swaps.',
  },
  {
    icon: 'lucide:blocks',
    title: '80+ Components',
    desc: 'From simple buttons to complex Kanbans, DataTables, and Charts — everything you need in one library.',
  },
  {
    icon: 'lucide:settings-2',
    title: 'Global Config System',
    desc: 'Plugin-based architecture for app-wide defaults. Set form styles, upload handlers, and i18n in one place.',
  },
  {
    icon: 'lucide:zap',
    title: 'Vue 3 + Tailwind v4',
    desc: 'Built on the latest Vue 3 Composition API and Tailwind CSS v4 for cutting-edge developer experience.',
  },
  {
    icon: 'lucide:feather',
    title: 'Tree-Shakeable',
    desc: 'Import only what you use. Each component is independently importable for optimal bundle size.',
  },
]
</script>

<template>
  <section class="features-section">
    <div class="landing-container">
      <div class="section-header animate-fade-up">
        <span class="section-eyebrow">Why vlite3</span>
        <h2 class="section-title">
          Crafted for developers who value <span class="text-primary">simplicity</span>
        </h2>
        <p class="section-subtitle">
          Every pixel is intentional. Every API is ergonomic. Built for teams that ship fast.
        </p>
      </div>

      <div class="features-grid">
        <div v-for="(feature, i) in features" :key="i" class="feature-card animate-fade-up" :style="{ animationDelay: `${150 + i * 80}ms` }">
          <div class="feature-icon">
            <Icon :icon="feature.icon" class="w-6 h-6" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import './shared.css';

/* ── Features Section ── */
.features-section {
  padding: 5rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.feature-card {
  padding: 2rem;
  background: var(--color-background);
  border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
  border-radius: 1.5rem;
  transition: border-color 0.3s, transform 0.3s;
}

.feature-card:hover {
  border-color: var(--color-border);
  transform: translateY(-4px);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: var(--color-muted);
  color: var(--color-foreground);
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-foreground);
}

.feature-desc {
  font-size: 0.9375rem;
  color: var(--color-muted-foreground);
  line-height: 1.6;
}
</style>
