<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'
import TimelineIndicator from './TimelineIndicator.vue'
import type {
  TimelineStep,
  TimelineDirection,
  TimelineTextPosition,
  TimelineLineStyle,
  TimelineIndicatorType,
  TimelineProgressStatus,
} from '@/types'
import { $t } from '@/utils/i18n'

interface Props {
  step: TimelineStep
  index: number
  isLast: boolean
  activeStep: number
  direction: TimelineDirection
  textPosition: TimelineTextPosition
  lineStyle: TimelineLineStyle
  indicatorType: TimelineIndicatorType
  clickable: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'step-click', step: TimelineStep, index: number): void
}>()

const isVertical = computed(() => props.direction === 'vertical')

const progressStatus = computed<TimelineProgressStatus>(() => {
  if (props.step.progressStatus) return props.step.progressStatus
  if (props.index < props.activeStep) return 'completed'
  if (props.index === props.activeStep) return 'current'
  return 'upcoming'
})

const getStepTitle = (step: TimelineStep) => (step.titleI18n ? $t(step.titleI18n) : step.title)
const getStepSubtitle = (step: TimelineStep) =>
  step.subtitleI18n ? $t(step.subtitleI18n) : step.subtitle
const getStepDesc = (step: TimelineStep) =>
  step.descriptionI18n ? $t(step.descriptionI18n) : step.description

const onClick = () => {
  if (props.clickable) emit('step-click', props.step, props.index)
}
</script>

<template>
  <li
    v-if="isVertical"
    :class="['relative flex w-full', clickable ? 'cursor-pointer' : '']"
    @click="onClick">
    <div class="flex flex-col items-center shrink-0 mr-4 w-9">
      <TimelineIndicator
        :status="progressStatus"
        :type="indicatorType"
        :index="index"
        :icon="step.icon" />
      <div
        v-if="!isLast"
        class="my-2 flex-1 transition-colors duration-300"
        :class="[
          lineStyle === 'dashed' ? 'w-0 border-l-[1.5px] border-dashed' : 'w-0.5',
          progressStatus === 'completed'
            ? lineStyle === 'dashed'
              ? 'border-primary'
              : 'bg-primary'
            : lineStyle === 'dashed'
              ? 'border-border'
              : 'bg-border',
        ]"></div>
    </div>

    <div class="flex-1 flex flex-col pt-0.5" :class="isLast ? 'pb-0' : 'pb-5'">
      <slot name="content" :step="step" :index="index">
        <div class="flex flex-col gap-1">
          <div class="flex justify-between items-start gap-4">
            <div>
              <slot name="title" :step="step" :index="index">
                <h4 class="text-sm font-semibold text-foreground leading-none">
                  {{ getStepTitle(step) }}
                </h4>
              </slot>
              <slot name="subtitle" :step="step" :index="index">
                <p
                  v-if="step.subtitle || step.subtitleI18n"
                  class="text-sm text-muted-foreground mt-1">
                  {{ getStepSubtitle(step) }}
                </p>
              </slot>
            </div>

            <div v-if="step.status || $slots.status" class="shrink-0">
              <slot name="status" :step="step" :index="index">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="[
                    step.status?.toLowerCase().includes('approv') ||
                    step.status?.toLowerCase().includes('complet')
                      ? 'bg-success-light text-success-dark border-success/20'
                      : '',
                    step.status?.toLowerCase().includes('pend')
                      ? 'bg-muted text-muted-foreground border-border'
                      : '',
                    step.status?.toLowerCase().includes('progress')
                      ? 'bg-primary-light text-primary border-primary/20'
                      : '',
                  ]">
                  <span
                    v-if="step.status?.toLowerCase().includes('pend')"
                    class="h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                  <Icon
                    v-else-if="
                      step.status?.toLowerCase().includes('approv') ||
                      step.status?.toLowerCase().includes('complet')
                    "
                    icon="lucide:check"
                    class="h-3 w-3" />
                  <Icon
                    v-else-if="step.status?.toLowerCase().includes('progress')"
                    icon="lucide:loader-2"
                    class="h-3 w-3 animate-spin" />
                  {{ step.status }}
                </span>
              </slot>
            </div>
          </div>

          <div class="mt-1">
            <slot name="body" :step="step" :index="index">
              <component v-if="step.component" :is="step.component" v-bind="step.componentProps" />
              <p
                v-else-if="step.description || step.descriptionI18n"
                class="text-sm text-muted-foreground">
                {{ getStepDesc(step) }}
              </p>
            </slot>
          </div>
        </div>
      </slot>
    </div>
  </li>

  <li
    v-else
    @click="onClick"
    :class="[
      'relative',
      clickable ? 'cursor-pointer' : '',
      textPosition === 'bottom' ? 'flex-none w-8' : 'flex-1 last:flex-none',
    ]">
    <div
      :class="[
        'group relative flex',
        textPosition === 'bottom'
          ? 'flex-col items-center justify-center'
          : 'flex-col items-center sm:flex-row sm:items-center sm:gap-2 w-full',
      ]">
      <TimelineIndicator
        :status="progressStatus"
        :type="indicatorType"
        :index="index"
        :icon="step.icon" />

      <span
        :class="[
          'min-w-[max-content] flex-col hidden sm:flex',
          textPosition === 'bottom' ? 'absolute top-10 text-center' : '',
          textPosition === 'bottom' && index === 0 ? 'left-0 text-left items-start' : '',
          textPosition === 'bottom' && isLast ? 'right-0 text-right items-end' : '',
          textPosition === 'bottom' && index > 0 && !isLast
            ? 'left-1/2 -translate-x-1/2 items-center'
            : '',
        ]">
        <slot name="content" :step="step" :index="index">
          <span
            class="text-sm font-medium leading-tight"
            :class="progressStatus === 'upcoming' ? 'text-muted-foreground' : 'text-primary'">
            {{ getStepTitle(step) }}
          </span>
          <span
            v-if="step.description || step.descriptionI18n"
            class="text-xs text-muted-foreground mt-1">
            {{ getStepDesc(step) }}
          </span>
        </slot>
      </span>

      <div
        v-if="textPosition === 'right' && !isLast"
        class="hidden sm:block flex-1 h-0.5 bg-border ml-2"
        aria-hidden="true">
        <div
          class="h-full bg-primary transition-all duration-300"
          :class="index < activeStep ? 'w-full' : 'w-0'"></div>
      </div>
    </div>
  </li>
</template>
