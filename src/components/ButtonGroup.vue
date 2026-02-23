<script setup lang="ts">
import { computed, provide } from 'vue'
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

provide('buttonGroup', { isInGroup: true })
</script>

<template>
  <div
    role="group"
    :class="[
      'inline-flex button-group',
      isVertical ? 'flex-col' : 'flex-row',
      props.class,
      attached ? 'attached-group' : 'gap-2',
      attached && isVertical ? 'vertical-group' : '',
    ]">
    <slot></slot>
  </div>
</template>

<style scoped>
/* Normalize icon-only buttons to match text button height inside a group */
.button-group :deep(button) {
  align-self: stretch;
  height: auto !important;
  min-height: unset !important;
  min-width: unset !important;
  width: auto !important;
}

/* For icon-only buttons in a horizontal group, constrain width to be square based on height */
.button-group:not(.vertical-group) :deep(button) {
  aspect-ratio: unset;
}

/* GENERAL SHARED */
.attached-group :deep(button) {
  position: relative;
  --radius: 0.375rem;
}
.attached-group :deep(button:focus-visible),
.attached-group :deep(button:hover) {
  z-index: 10;
}

/* HORIZONTAL */
.attached-group:not(.vertical-group) :deep(button:not(:first-child)) {
  margin-left: -1px;
}

/* Rounded corners - Horizontal */
.attached-group:not(.vertical-group) :deep(button:first-child) {
  border-top-left-radius: var(--radius);
  border-bottom-left-radius: var(--radius);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}
.attached-group:not(.vertical-group) :deep(button:last-child) {
  border-top-right-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Vertical */
.vertical-group :deep(button:not(:first-child)) {
  margin-top: -1px;
}

/* Rounded corners - Vertical */
.vertical-group :deep(button:first-child) {
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.vertical-group :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}
.vertical-group :deep(button:last-child) {
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* --- DIVIDERS FOR SOLID VARIANTS --- */
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(.border))::before {
  content: '';
  position: absolute;
  left: 0;
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
