<script setup lang="ts">
import { Timeline } from '@/components/Timeline'
import Button from '@/components/Button.vue'
import Icon from '@/components/Icon.vue'
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import sourceCode from './TimelineDemo.vue?raw'
import type { TimelineStep } from '@/types'

const activeStep = ref(1)

// Example 1: Basic Horizontal
const basicSteps: TimelineStep[] = [
  { id: 1, title: 'Ordered', icon: 'lucide:shopping-cart' },
  { id: 2, title: 'Processing', icon: 'lucide:settings' },
  { id: 3, title: 'Shipped', icon: 'lucide:truck' },
  { id: 4, title: 'Delivered', icon: 'lucide:check' },
]

// Example 2: Approval Workflow (Vertical, Numbered, Dashed, Custom Body)
const approvalSteps: TimelineStep[] = [
  {
    id: 1,
    title: 'step',
    subtitle: 'Initial Review',
    status: 'Pending',
    user: { name: 'Private Development Corp', role: 'Project Owner', initials: 'PD' },
  },
  {
    id: 2,
    title: 'step',
    subtitle: 'Technical Review',
    status: 'Pending',
    user: {
      name: 'XYZ Builders',
      role: 'Project Contractor',
      img: 'https://i.pravatar.cc/150?u=1',
    },
  },
  {
    id: 3,
    title: 'step',
    subtitle: 'Final Review',
    status: 'Pending',
    user: { name: 'Employee 1', role: 'Consultant', img: 'https://i.pravatar.cc/150?u=2' },
  },
]

// Example 3: Review Processes (Vertical, Custom Content Slot)
const reviewSteps: TimelineStep[] = [
  {
    id: 1,
    label: 'Step 1',
    title: 'Step completed, moving forward',
    date: '06 March 2026 1:26 am',
    status: 'Completed',
    logo: 'lucide:image',
  },
  {
    id: 2,
    label: 'Step 1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    date: '06 March 2026 1:26 am',
    status: 'Approved',
    logo: 'lucide:image',
  },
  {
    id: 3,
    label: 'Step 1',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    date: '06 March 2026 1:26 am',
    status: 'In Progress',
    logo: 'lucide:image',
  },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Timeline</h2>
      <p class="text-gray-500">
        Visualizes a sequence of events or steps. Built for extreme flexibility.
      </p>
    </div>

    <DemoSection title="Horizontal (Basic)" align="stretch" :code="sourceCode">
      <div class="flex flex-col w-full max-w-3xl mx-auto">
        <div class="flex items-center justify-between w-full mb-6">
          <div class="flex gap-2">
            <Button size="sm" variant="outline" :disabled="activeStep <= 0" @click="activeStep--"
              >Prev</Button
            >
            <Button
              size="sm"
              variant="outline"
              :disabled="activeStep >= basicSteps.length"
              @click="activeStep++"
              >Next</Button
            >
          </div>
        </div>
        <div class="p-6 border rounded-lg w-full">
          <Timeline :steps="basicSteps" :active-step="activeStep" />
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Vertical: Approval Workflow" align="stretch" :code="sourceCode">
      <div class="flex flex-col w-full max-w-2xl mx-auto">
        <p class="text-sm text-muted-foreground mb-4 text-center">
          Using `indicator-type="number"`, `line-style="dashed"`, and `#body` slot injections.
        </p>
        <div class="p-6 border rounded-lg w-full bg-background">
          <Timeline
            :steps="approvalSteps"
            :active-step="activeStep"
            direction="vertical"
            indicator-type="number"
            line-style="dashed">
            <template #body="{ step }">
              <div
                class="mt-4 flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border shadow-sm">
                <img
                  v-if="step.user.img"
                  :src="step.user.img"
                  class="w-12 h-12 rounded-lg object-cover bg-muted" />
                <div
                  v-else
                  class="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  {{ step.user.initials }}
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-foreground">{{ step.user.name }}</span>
                  <span class="text-xs text-muted-foreground mt-0.5">{{ step.user.role }}</span>
                </div>
              </div>
            </template>
          </Timeline>
        </div>
      </div>
    </DemoSection>

    <DemoSection title="Vertical: Complex Content Cards" align="stretch" :code="sourceCode">
      <div class="flex flex-col w-full max-w-3xl mx-auto">
        <p class="text-sm text-muted-foreground mb-4 text-center">
          Taking over the entire `#content` slot for complete layout freedom.
        </p>
        <div class="p-6 w-full">
          <Timeline :steps="reviewSteps" :active-step="2" direction="vertical" indicator-type="dot">
            <template #content="{ step }">
              <div
                class="border border-border rounded-xl p-5 bg-card shadow-sm mb-2 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start">
                  <div class="flex gap-4 items-center mb-4">
                    <div
                      class="h-12 w-12 rounded-xl border bg-background flex items-center justify-center">
                      <Icon :icon="step.logo" class="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold">Acme</span>
                      <span class="text-xs text-muted-foreground mt-0.5">{{ step.label }}</span>
                    </div>
                  </div>

                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    :class="[
                      step.status === 'Completed'
                        ? 'bg-primary-light text-primary border-primary/20'
                        : '',
                      step.status === 'Approved'
                        ? 'bg-success-light text-success border-success/20'
                        : '',
                      step.status === 'In Progress'
                        ? 'bg-primary-light text-primary border-primary/20'
                        : '',
                    ]">
                    <Icon v-if="step.status === 'Approved'" icon="lucide:check" class="h-3 w-3" />
                    <Icon
                      v-else-if="step.status === 'In Progress'"
                      icon="lucide:loader-2"
                      class="h-3 w-3 animate-spin" />
                    <Icon
                      v-else-if="step.status === 'Completed'"
                      icon="lucide:history"
                      class="h-3 w-3" />
                    {{ step.status }}
                  </span>
                </div>

                <div class="flex justify-between items-end mt-2">
                  <p class="text-sm text-foreground max-w-md">{{ step.title }}</p>
                  <span class="text-xs text-muted-foreground">{{ step.date }}</span>
                </div>
              </div>
            </template>
          </Timeline>
        </div>
      </div>
    </DemoSection>
  </div>
</template>
