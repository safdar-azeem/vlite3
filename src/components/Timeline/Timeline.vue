<script setup lang="ts">
import { computed } from 'vue'
import TimelineItem from './TimelineItem.vue'
import type {
  TimelineStep,
  TimelineDirection,
  TimelineTextPosition,
  TimelineLineStyle,
  TimelineIndicatorType,
} from '@/types'

interface Props {
  steps: TimelineStep[]
  activeStep?: number
  direction?: TimelineDirection
  textPosition?: TimelineTextPosition
  lineStyle?: TimelineLineStyle
  indicatorType?: TimelineIndicatorType
  clickable?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeStep: 0,
  direction: 'horizontal',
  textPosition: 'bottom',
  lineStyle: 'solid',
  indicatorType: 'icon',
  clickable: false,
  class: '',
})

const emit = defineEmits<{
  (e: 'step-click', step: TimelineStep, index: number): void
}>()

const isVertical = computed(() => props.direction === 'vertical')

const progressPercentage = computed(() => {
  if (props.steps.length <= 1) return 0
  const effectiveStep = Math.min(props.activeStep, props.steps.length - 1)
  return (effectiveStep / (props.steps.length - 1)) * 100
})

const handleStepClick = (step: TimelineStep, index: number) => {
  emit('step-click', step, index)
}
</script>

<template>
  <nav :aria-label="'Progress'" :class="['w-full pb-5', props.class]">
    <ol
      role="list"
      :class="[
        'relative flex',
        isVertical ? 'flex-col space-y-0' : '',
        !isVertical && textPosition === 'bottom'
          ? 'flex-row w-full justify-between items-center'
          : '',
        !isVertical && textPosition === 'right' ? 'flex-row w-full' : '',
      ]">
      <div
        v-if="!isVertical && textPosition === 'bottom'"
        class="absolute top-4 left-4 right-4 h-0.5 bg-border"
        aria-hidden="true">
        <div
          class="h-full bg-primary transition-all duration-300 ease-in-out"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <div
        v-if="!isVertical && textPosition === 'right'"
        class="absolute top-4 left-4 right-4 h-0.5 bg-border block sm:hidden"
        aria-hidden="true">
        <div
          class="h-full bg-primary transition-all duration-300 ease-in-out"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>

      <TimelineItem
        v-for="(step, index) in steps"
        :key="step.id"
        v-memo="[
          step,
          index,
          activeStep,
          direction,
          textPosition,
          lineStyle,
          indicatorType,
          clickable,
          steps.length,
        ]"
        :step="step"
        :index="index"
        :is-last="index === steps.length - 1"
        :active-step="activeStep"
        :direction="direction"
        :text-position="textPosition"
        :line-style="lineStyle"
        :indicator-type="indicatorType"
        :clickable="clickable"
        @step-click="handleStepClick">
        <template #indicator="slotProps"><slot name="indicator" v-bind="slotProps" /></template>
        <template #title="slotProps"><slot name="title" v-bind="slotProps" /></template>
        <template #subtitle="slotProps"><slot name="subtitle" v-bind="slotProps" /></template>
        <template #status="slotProps"><slot name="status" v-bind="slotProps" /></template>
        <template #content="slotProps"><slot name="content" v-bind="slotProps" /></template>
        <template #body="slotProps"><slot name="body" v-bind="slotProps" /></template>
      </TimelineItem>
    </ol>
  </nav>
</template>
