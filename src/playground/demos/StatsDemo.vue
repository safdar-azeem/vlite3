<script setup lang="ts">
import Stats from '@/components/Stats/Stats.vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './StatsDemo.vue?raw'

const standardItems = [
  {
    id: 1,
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: 'lucide:dollar-sign',
    color: 'success',
    trend: { value: '+20.1%', isPositive: true, label: 'from last month' },
  },
  {
    id: 2,
    title: 'Subscriptions',
    value: '+2350',
    icon: 'lucide:users',
    color: 'primary',
    trend: { value: '+180.1%', isPositive: true, label: 'from last month' },
  },
  {
    id: 3,
    title: 'Sales',
    value: '+12,234',
    icon: 'lucide:credit-card',
    color: 'warning',
    trend: { value: '+19%', isPositive: true, label: 'from last month' },
  },
  {
    id: 4,
    title: 'Active Now',
    value: '+573',
    icon: 'lucide:activity',
    color: 'info',
    trend: { value: '-201', isPositive: false, label: 'since last hour' },
  },
]

const minimalItems = [
  {
    id: 1,
    title: 'Bounce Rate',
    value: '24.5%',
    icon: 'lucide:mouse-pointer-click',
    color: 'danger',
  },
  { id: 2, title: 'Page Views', value: '1.2M', icon: 'lucide:eye', color: 'primary' },
  { id: 3, title: 'Avg. Duration', value: '2m 15s', icon: 'lucide:clock', color: 'secondary' },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Stats</h2>
      <p class="text-gray-500">A customizable component to display key metrics and statistics.</p>
    </div>

    <DemoSection title="Variants" :code="sourceCode">
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Outline (Default)</h4>
          <Stats :items="standardItems" variant="outline" />
        </div>

        <div class="bg-muted p-6 -mx-6 rounded-xl">
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Solid</h4>
          <Stats :items="standardItems" variant="solid" />
        </div>

        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Shadow</h4>
          <Stats :items="standardItems" variant="shadow" />
        </div>

        <div class="bg-muted p-6 -mx-6 rounded-xl">
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Transparent</h4>
          <Stats :items="standardItems" variant="transparent" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Attached (Fused Borders)" :code="sourceCode">
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Attached Outline</h4>
          <Stats :items="standardItems" attached variant="outline" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Attached Shadow</h4>
          <Stats :items="standardItems" attached variant="shadow" />
        </div>
        <div class="bg-muted p-6 -mx-6 rounded-xl">
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Attached Transparent</h4>
          <Stats :items="standardItems" attached variant="transparent" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Layouts" :code="sourceCode">
      <div class="space-y-8">
        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Icon Right</h4>
          <Stats :items="minimalItems" :columns="3" layout="icon-right" variant="outline" />
        </div>

        <div>
          <h4 class="text-sm font-medium text-muted-foreground mb-3">Icon Top</h4>
          <Stats :items="minimalItems" :columns="3" layout="icon-top" variant="outline" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Custom Sizing" :code="sourceCode">
      <div>
        <Stats
          :items="minimalItems.slice(0, 2)"
          :columns="2"
          variant="outline"
          title-size="text-lg font-semibold text-gray-600"
          value-size="text-5xl font-black text-primary"
          icon-size="w-8 h-8" />
      </div>
    </DemoSection>
  </div>
</template>
