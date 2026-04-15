<script setup lang="ts">
import { ref } from 'vue'
import ButtonGroup from '@/components/ButtonGroup.vue'
import Button from '@/components/Button.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './ButtonGroupDemo.vue?raw'

const activeView    = ref<'grid' | 'list' | 'kanban'>('grid')
const activeAlign   = ref<'left' | 'center' | 'right' | 'justify'>('left')
const activePeriod  = ref<'day' | 'week' | 'month' | 'year'>('week')
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex flex-col space-y-2 pb-6 mb-8 border-b border-border/30">
      <h2 class="text-3xl font-bold tracking-tight text-foreground">ButtonGroup</h2>
      <p class="text-base text-muted-foreground max-w-[800px]">
        Groups a set of related buttons into a cohesive unit. Supports attached and
        detached modes, horizontal and vertical layouts, and all button sizes.
      </p>
    </div>

    <!-- ── Attached (text + icon mix) -->
    <DemoSection title="Attached — Text with Icons" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-6">
        <ButtonGroup>
          <Button size="sm" icon="lucide:plus">New</Button>
          <Button size="sm" icon="lucide:upload">Import</Button>
          <Button size="sm" icon="lucide:download">Export</Button>
          <Button size="sm" icon="lucide:settings" />
        </ButtonGroup>
      </div>
    </DemoSection>

    <!-- ── Stateful toggle: view mode -->
    <DemoSection title="Stateful Toggle — View Mode" :code="sourceCode">
      <div class="flex flex-col items-center gap-4">
        <ButtonGroup>
          <Button
            size="sm"
            icon="lucide:layout-grid"
            :variant="activeView === 'grid' ? 'primary' : 'outline'"
            @click="activeView = 'grid'">
            Grid
          </Button>
          <Button
            size="sm"
            icon="lucide:list"
            :variant="activeView === 'list' ? 'primary' : 'outline'"
            @click="activeView = 'list'">
            List
          </Button>
          <Button
            size="sm"
            icon="lucide:kanban"
            :variant="activeView === 'kanban' ? 'primary' : 'outline'"
            @click="activeView = 'kanban'">
            Kanban
          </Button>
        </ButtonGroup>
        <p class="text-sm text-muted-foreground">
          Active view: <strong class="text-foreground">{{ activeView }}</strong>
        </p>
      </div>
    </DemoSection>

    <!-- ── Icon-only sizes -->
    <DemoSection title="Sizes — Icon Only" :code="sourceCode">
      <div class="space-y-4">
        <div v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" class="flex items-center gap-6">
          <label class="w-10 text-sm text-muted-foreground capitalize">{{ size }}</label>
          <ButtonGroup>
            <Button
              :size="size"
              icon="lucide:align-left"
              :variant="activeAlign === 'left' ? 'primary' : 'outline'"
              @click="activeAlign = 'left'" />
            <Button
              :size="size"
              icon="lucide:align-center"
              :variant="activeAlign === 'center' ? 'primary' : 'outline'"
              @click="activeAlign = 'center'" />
            <Button
              :size="size"
              icon="lucide:align-right"
              :variant="activeAlign === 'right' ? 'primary' : 'outline'"
              @click="activeAlign = 'right'" />
            <Button
              :size="size"
              icon="lucide:align-justify"
              :variant="activeAlign === 'justify' ? 'primary' : 'outline'"
              @click="activeAlign = 'justify'" />
          </ButtonGroup>
        </div>
      </div>
    </DemoSection>

    <!-- ── Period selector (text only) -->
    <DemoSection title="Stateful Toggle — Time Period" :code="sourceCode">
      <div class="flex flex-col items-center gap-4">
        <ButtonGroup>
          <Button
            v-for="p in (['day', 'week', 'month', 'year'] as const)"
            :key="p"
            size="sm"
            :variant="activePeriod === p ? 'primary' : 'outline'"
            @click="activePeriod = p">
            {{ p.charAt(0).toUpperCase() + p.slice(1) }}
          </Button>
        </ButtonGroup>
        <p class="text-sm text-muted-foreground">
          Showing data for: <strong class="text-foreground">this {{ activePeriod }}</strong>
        </p>
      </div>
    </DemoSection>

    <!-- ── Detached -->
    <DemoSection title="Detached (Gap between buttons)" :code="sourceCode">
      <div class="flex flex-wrap items-center justify-center gap-6">
        <ButtonGroup :attached="false">
          <Button variant="outline" icon="lucide:x">Discard</Button>
          <Button variant="outline" icon="lucide:save">Save Draft</Button>
          <Button icon="lucide:send">Publish</Button>
        </ButtonGroup>
      </div>
    </DemoSection>

    <!-- ── Vertical -->
    <DemoSection title="Vertical Layout" :code="sourceCode">
      <div class="flex flex-wrap items-start justify-center gap-8">
        <ButtonGroup direction="vertical">
          <Button variant="secondary" icon="lucide:bold" size="sm" />
          <Button variant="secondary" icon="lucide:italic" size="sm" />
          <Button variant="secondary" icon="lucide:underline" size="sm" />
          <Button variant="secondary" icon="lucide:strikethrough" size="sm" />
        </ButtonGroup>

        <ButtonGroup direction="vertical">
          <Button variant="outline" icon="lucide:zoom-in">Zoom In</Button>
          <Button variant="outline" icon="lucide:zoom-out">Zoom Out</Button>
          <Button variant="outline" icon="lucide:maximize-2">Fit View</Button>
        </ButtonGroup>
      </div>
    </DemoSection>
  </div>
</template>
