<script setup lang="ts">
import { ref } from 'vue'
import { Splitter } from '@/components/Splitter'
import DemoSection from '../DemoSection.vue'
import sourceCode from './SplitterDemo.vue?raw'

const splitSize = ref(30)
const vSplitSize = ref(50)
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-foreground">Splitter</h1>
      <p class="text-muted-foreground w-full max-w-[80%]">
        A layout primitive that allows users to resize adjacent directional panels. Ideal for complex dashboards, IDEs, and data viewers.
      </p>
    </div>

    <!-- Horizontal Splitter Demo -->
    <DemoSection title="Horizontal (Default)" :code="sourceCode">
      <div class="h-64 w-full border border-border rounded-xl overflow-hidden bg-background">
        <Splitter v-model="splitSize" :min="15" :max="85" layout="horizontal">
          <template #start>
            <div class="h-full flex items-center justify-center bg-card p-4">
              <span class="text-sm font-medium text-muted-foreground text-center">
                Sidebar ({{ splitSize.toFixed(0) }}%)
              </span>
            </div>
          </template>
          <template #end>
            <div class="h-full flex flex-col items-center justify-center p-4">
              <span class="text-sm font-medium text-foreground">Main Content Area</span>
              <span class="text-xs text-muted-foreground mt-1">Drag the divider to resize</span>
            </div>
          </template>
        </Splitter>
      </div>
    </DemoSection>

    <!-- Vertical Splitter Demo -->
    <DemoSection title="Vertical" :code="sourceCode">
      <div class="h-[400px] w-full border border-border rounded-xl overflow-hidden bg-background">
        <Splitter v-model="vSplitSize" :min="20" :max="80" layout="vertical">
          <template #start>
            <div class="h-full flex items-center justify-center bg-card">
              <span class="text-sm font-medium text-muted-foreground">Editor View</span>
            </div>
          </template>
          <template #end>
            <div class="h-full w-full">
              <!-- Nested Splitter is also possible! -->
              <Splitter :model-value="40" :min="20" :max="80" layout="horizontal">
                <template #start>
                  <div class="h-full flex items-center justify-center bg-background border-r border-border">
                     <span class="text-sm font-medium text-muted-foreground">Console</span>
                  </div>
                </template>
                <template #end>
                  <div class="h-full flex items-center justify-center bg-card">
                     <span class="text-sm font-medium text-muted-foreground">Network</span>
                  </div>
                </template>
              </Splitter>
            </div>
          </template>
        </Splitter>
      </div>
    </DemoSection>
  </div>
</template>
