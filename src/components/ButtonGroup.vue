<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonGroupDirection, ButtonVariant, ButtonSize } from '@/types'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  direction?: ButtonGroupDirection
  attached?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  attached: true,
  class: '',
})

const isVertical = computed(() => props.direction === 'vertical')
</script>

<template>
  <div
    role="group"
    :class="[
      'inline-flex button-group',
      isVertical ? 'flex-col items-stretch' : 'flex-row items-center',
      props.class,
      attached ? 'attached-group' : 'gap-2',
      attached && isVertical ? 'vertical-group' : '',
    ]">
    <slot></slot>
  </div>
</template>

<style scoped>
/* GENERAL SHARED */
.attached-group :deep(button) {
  position: relative;
}
.attached-group :deep(button:focus-visible),
.attached-group :deep(button:hover) {
  z-index: 10;
}

/* HORIZONTAL */
.attached-group:not(.vertical-group) :deep(button:not(:first-child)) {
  margin-inline-start: -1px;
}

/* Rounded corners - Horizontal */
/* We use !important here so that if the user applies a `rounded-full` prop to the button, 
   the inner edges are properly squared off, while the outer edges remain perfectly rounded! */
.attached-group:not(.vertical-group) :deep(button:first-child) {
  border-start-end-radius: 0 !important;
  border-end-end-radius: 0 !important;
}
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0 !important;
}
.attached-group:not(.vertical-group) :deep(button:last-child) {
  border-start-start-radius: 0 !important;
  border-end-start-radius: 0 !important;
}

/* VERTICAL */
.vertical-group :deep(button:not(:first-child)) {
  margin-block-start: -1px;
}

/* Rounded corners - Vertical */
.vertical-group :deep(button:first-child) {
  border-end-start-radius: 0 !important;
  border-end-end-radius: 0 !important;
}
.vertical-group :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0 !important;
}
.vertical-group :deep(button:last-child) {
  border-start-start-radius: 0 !important;
  border-start-end-radius: 0 !important;
}

/* --- DIVIDERS FOR SOLID VARIANTS --- */
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(.border))::before {
  content: '';
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: currentColor;
  opacity: 0.15;
  z-index: 5;
  pointer-events: none;
  height: 100%;
}

.vertical-group :deep(button:not(:first-child):not(.border))::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  width: 100%;
  background-color: currentColor;
  opacity: 0.15;
  z-index: 5;
  pointer-events: none;
}
</style>
