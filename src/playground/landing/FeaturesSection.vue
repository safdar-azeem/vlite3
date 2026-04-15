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
  <section class="py-24 bg-background border-t border-border">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
        <span class="text-sm font-semibold text-primary uppercase tracking-wider">Why vlite3</span>
        <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Crafted for developers who value <span class="text-primary">simplicity</span>
        </h2>
        <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
          Every pixel is intentional. Every API is ergonomic. Built for teams that ship fast.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(feature, i) in features" 
          :key="i" 
          class="bg-background border border-border/60 hover:border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
          :style="{ animationDelay: `${150 + i * 80}ms` }"
        >
          <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Icon :icon="feature.icon" class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-foreground mb-3">{{ feature.title }}</h3>
          <p class="text-muted-foreground leading-relaxed">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
