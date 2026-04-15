<script setup lang="ts">
import { ref } from 'vue'
import SidePanel from '@/components/SidePanel.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './SidePanelSizes.vue?raw'

const openSize = ref<string | null>(null)

const sizes = [
  { key: 'sm', label: 'Small (sm)',     desc: 'Compact sidebar for quick references.' },
  { key: 'md', label: 'Medium (md)',    desc: 'Default balanced width for most use cases.' },
  { key: 'lg', label: 'Large (lg)',     desc: 'Wider panel for detailed forms or previews.' },
  { key: 'xl', label: 'Extra Large (xl)', desc: 'Great for rich editors or data views.' },
  { key: 'full', label: 'Full Width',   desc: 'Covers the entire screen — like a new page.' },
] as const
</script>

<template>
  <DemoSection title="Sizes" :code="sourceCode">
    <div class="flex flex-wrap items-center gap-3">
      <Button
        v-for="s in sizes"
        :key="s.key"
        :variant="s.key === 'full' ? 'outline' : 'secondary'"
        size="sm"
        @click="openSize = s.key">
        {{ s.label }}
      </Button>
    </div>

    <SidePanel
      v-for="s in sizes"
      :key="s.key"
      :size="s.key"
      :title="s.label"
      :description="s.desc"
      :show="openSize === s.key"
      @close="openSize = null">
      <div class="space-y-4">
        <div class="p-4 rounded-lg bg-muted/30 border border-border/40 text-center">
          <p class="text-2xl font-bold text-foreground">{{ s.key.toUpperCase() }}</p>
          <p class="text-sm text-muted-foreground mt-1">Panel size · max-w-{{ s.key }}</p>
        </div>
        <p class="text-sm text-muted-foreground">{{ s.desc }}</p>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="i in 4" :key="i" class="h-16 rounded-md bg-muted/20 border border-border/30 animate-pulse" />
        </div>
      </div>

      <template #footer="{ close }">
        <Button class="w-full" @click="close">Close</Button>
      </template>
    </SidePanel>
  </DemoSection>
</template>
