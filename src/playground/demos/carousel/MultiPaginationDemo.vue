<script setup lang="ts">
import { ref, computed } from 'vue'
import { Carousel } from '@/components/Carousel'
import type { PaginationType, PaginationPosition } from '@/components/Carousel/types'
import DemoSection from '../../DemoSection.vue'
import sourceCode from './MultiPaginationDemo.vue?raw'

const banners = [1, 2, 3, 4, 5]

interface PaginationConfig {
  type: PaginationType
  position: PaginationPosition
}

const activePaginations = ref<PaginationConfig[]>([
  { type: 'dots', position: 'bottom-center' },
  { type: 'buttons', position: 'center' }
])

const availableTypes: PaginationType[] = ['dots', 'buttons', 'lines', 'fraction']
const availablePositions: PaginationPosition[] = [
  'center',
  'bottom-center',
  'bottom-left',
  'bottom-right',
  'center-right',
  'bottom'
]

const addPagination = () => {
  if (activePaginations.value.length < 4) {
    activePaginations.value.push({ type: 'dots', position: 'bottom-center' })
  }
}

const removePagination = (index: number) => {
  activePaginations.value.splice(index, 1)
}

const carouselPagination = computed(() => activePaginations.value.map(p => p.type))
const carouselPositions = computed(() => activePaginations.value.map(p => p.position))

</script>

<template>
  <DemoSection title="Multiple Paginations" :code="sourceCode">
    <div class="w-full space-y-6">
      <!-- Configuration Panel -->
      <div class="p-6 border border-border bg-card rounded-xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configure Paginations</h3>
          <button 
            @click="addPagination" 
            :disabled="activePaginations.length >= 4"
            class="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium disabled:opacity-50 transition-opacity"
          >
            + Add Pagination
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(config, index) in activePaginations" 
            :key="index"
            class="p-4 border border-border/50 bg-muted/20 rounded-lg space-y-3 relative group"
          >
            <button 
              @click="removePagination(index)"
              class="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase text-muted-foreground/70">Type</label>
              <select 
                v-model="config.type"
                class="w-full bg-background border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary"
              >
                <option v-for="t in availableTypes" :key="String(t)" :value="t">{{ t }}</option>
              </select>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold uppercase text-muted-foreground/70">Position</label>
              <select 
                v-model="config.position"
                class="w-full bg-background border border-border rounded px-2 py-1 text-xs outline-none focus:border-primary"
              >
                <option v-for="p in availablePositions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Preview -->
      <div class="w-full p-8 border border-border bg-card rounded-xl">
        <Carousel
          :key="JSON.stringify(activePaginations)"
          :data="banners"
          :pagination="carouselPagination"
          :pagination-position="carouselPositions"
          :items-to-show="1"
          :gap="20"
          loop
          draggable
        >
          <template #default="{ item }">
            <div
              class="w-full flex flex-col items-center justify-center rounded-xl select-none bg-primary/5 border border-primary/10"
              style="height: 350px">
              <span class="text-6xl font-bold text-primary/20">{{ item }}</span>
              <h3 class="text-2xl font-bold text-foreground mt-4 tracking-tight">Slide {{ item }}</h3>
              <p class="text-muted-foreground mt-2">Demonstrating multiple pagination layers</p>
            </div>
          </template>
        </Carousel>
      </div>
    </div>
  </DemoSection>
</template>
