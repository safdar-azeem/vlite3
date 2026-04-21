<script setup lang="ts">
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'
import ShowcasePreview from './ShowcasePreview.vue'

defineProps<{
  comp: { name: string; desc: string; link: string; previewType: string }
}>()

const router = useRouter()
</script>

<template>
  <div
    class="group bg-background border border-border/60 hover:border-border rounded-2xl overflow-hidden cursor-pointer flex flex-col"
    @click="router.push(comp.link)">
    <div
      class="h-40 bg-muted/30 flex items-center justify-center p-6 border-b border-border/50 relative overflow-hidden">
      <div
        class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="
          background-image: radial-gradient(#000 1px, transparent 1px);
          background-size: 10px 10px;
        "></div>

      <div class="relative z-10 w-full flex items-center justify-center select-none">
        <ShowcasePreview :previewType="comp.previewType" />
      </div>
    </div>
    <div class="p-5 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-base font-bold text-foreground">{{ comp.name }}</h3>
        <Icon
          icon="lucide:arrow-up-right"
          class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary" />
      </div>
      <p class="text-sm text-muted-foreground leading-relaxed">{{ comp.desc }}</p>
    </div>
  </div>
</template>
