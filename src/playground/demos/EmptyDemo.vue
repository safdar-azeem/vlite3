<script setup lang="ts">
import { Empty } from '@/components/Empty'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './EmptyDemo.vue?raw'

const variants = [
  { id: 'variant1', name: '01. Industrial', theme: 'Apple setup' },
  { id: 'variant2', name: '02. Balanced', theme: 'Notion inline' },
  { id: 'variant3', name: '03. Editorial', theme: 'Typo Clean' },
  { id: 'variant4', name: '04. Structural', theme: 'Geometric' },
  { id: 'variant5', name: '05. Atmospheric', theme: 'Moody' },
  { id: 'variant6', name: '06. Interactive', theme: 'Elevation' },
  { id: 'variant7', name: '07. Narrative', theme: 'Sequence' },
  { id: 'variant8', name: '08. Floating', theme: 'Depth' },
  { id: 'variant9', name: '09. Asymmetric', theme: 'Experimental' },
  { id: 'variant10', name: '10. Essential', theme: 'Habit Style' },
] as const
</script>

<template>
  <div class="space-y-24 pb-40">
    <div class="space-y-4">
      <h2 class="text-3xl font-black tracking-tighter text-gray-900 uppercase">
        Empty State Variants
      </h2>
      <p class="text-gray-500 text-lg font-medium max-w-2xl leading-relaxed">
        Ten reinterpretations of the same architectural component. Minimal, clean, and designed for
        high-end interfaces.
      </p>
    </div>

    <div class="space-y-32">
      <div v-for="v in variants" :key="v.id">
        <div class="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
          <div>
            <h4 class="text-xl font-black text-gray-900 uppercase tracking-tighter">
              {{ v.name }}
            </h4>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {{ v.theme }}
            </p>
          </div>
        </div>
        <div>
          <Empty
            :variant="v.id"
            title="No habits tracked"
            description="Your journey is waiting. Start building consistency today by defining your first daily ritual."
            icon="lucide:sparkles">
            <template #action>
              <Button class="rounded-full px-8 bg-primary text-primary-fg hover:opacity-90"
                >Get Started</Button
              >
            </template>
          </Empty>
        </div>
      </div>
    </div>
  </div>
</template>
