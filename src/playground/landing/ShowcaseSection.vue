<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import ShowcaseCard from './components/ShowcaseCard.vue'
import { allComponents } from './data/showcaseData'

const router = useRouter()
</script>

<template>
  <section class="py-24 bg-muted/20 border-y border-border overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" v-scroll-reveal>
        <span class="text-sm font-semibold text-primary uppercase tracking-wider"
          >Component Grid</span
        >
        <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          A glimpse into <span class="text-primary">the ecosystem</span>
        </h2>
        <p class="mt-4 text-lg text-muted-foreground leading-relaxed">
          Every piece works harmoniously together to build enterprise-grade applications.
        </p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style="will-change: transform; contain: layout style">
        <ShowcaseCard
          v-for="(comp, i) in allComponents"
          :key="i"
          v-memo="[comp.name]"
          v-scroll-reveal="{ delay: (i % 4) * 50 }"
          :comp="comp"
        />
      </div>

      <div class="mt-20 text-center border-t border-border pt-12" v-scroll-reveal>
        <h3 class="text-2xl font-bold text-foreground mb-4">Ready to see more?</h3>
        <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
          Explore the full collection of accessible, customizable, and beautifully designed
          components built for modern Vue applications.
        </p>
        <Button
          @click="router.push('/components')"
          size="lg"
          class="rounded-full h-12 px-8 text-base font-medium shadow-none group">
          Explore All Components
          <Icon icon="lucide:arrow-right" class="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </section>
</template>
