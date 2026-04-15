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
  <section v-once class="py-28 bg-background">
    <div class="max-w-6xl mx-auto px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-20">
        <div class="lg:col-span-4 mb-16 lg:mb-0">
          <div class="lg:sticky lg:top-28">
            <p
              class="text-xs font-semibold text-primary-fg w-max rounded-full px-3 py-1 bg-primary uppercase tracking-widest mb-5">
              Why vlite3
            </p>
            <h2 class="text-4xl font-bold text-foreground tracking-tight leading-[1.2]">
              Crafted for developers who value simplicity
            </h2>
            <p class="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              Every pixel is intentional. Every API is ergonomic. Built for teams that ship fast.
            </p>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div v-for="(feature, i) in features" :key="i" class="flex flex-col gap-4">
              <div
                class="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-primary">
                <Icon :icon="feature.icon" class="w-5 h-5" />
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-[17px] font-semibold text-foreground leading-snug">
                  {{ feature.title }}
                </h3>
                <p class="text-[15px] text-muted-foreground leading-relaxed">{{ feature.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
