<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
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
      'inline-flex',
      isVertical ? 'flex-col' : 'flex-row',
      props.class,

      attached ? 'attached-group' : 'gap-2',

      // Vertical Attached
      attached && isVertical ? 'vertical-group' : '',
    ]">
    <slot></slot>
  </div>
</template>

<style scoped>
/* Horizontal Attached (Default) */
/* Horizontal Attached (Default) */
.attached-group:not(.vertical-group) :deep(button) {
  border-radius: 0;
  /* border-right-width: 0; 
     Note: we handle border overlap via margin-left: -1px below, so we keep border width.
     Actually, if we rely on margin overlap, we don't need to zero the border width technically,
     but we DO need to ensure corners are square.
  */
}

/* Reset border reset */
.attached-group:not(.vertical-group) :deep(button) {
  /* Ensure border exists if it was removed elsewhere, standard standardizing */
}

/**
 * STRATEGY: Negative Margins for fused look with proper borders.
 * We need to ensure the focused button is raised (z-index) so the ring shows fully.
 */

/* GENERAL SHARED */
.attached-group :deep(button) {
  position: relative;
  /* Default rounded-md is usually 0.375rem (6px) or 0.25rem (4px). 
       We use 0.375rem as safe default or 'inherit' if we could, 
       but for specific corners we must set explicitly.
    */
  --radius: 0.375rem;
}
.attached-group :deep(button:focus-visible),
.attached-group :deep(button:hover) {
  z-index: 10;
}

/* HORIZONTAL */
.attached-group:not(.vertical-group) :deep(button:not(:first-child)) {
  margin-left: -1px; /* Overlap borders */
}

/* Rounded corners - Horizontal */
/* First Child */
.attached-group:not(.vertical-group) :deep(button:first-child) {
  border-top-left-radius: var(--radius);
  border-bottom-left-radius: var(--radius);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/* Middle Children */
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}
/* Last Child */
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
/* First */
.vertical-group :deep(button:first-child) {
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
/* Middle */
.vertical-group :deep(button:not(:first-child):not(:last-child)) {
  border-radius: 0;
}
/* Last */
.vertical-group :deep(button:last-child) {
  border-bottom-left-radius: var(--radius);
  border-bottom-right-radius: var(--radius);
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* --- DIVIDERS FOR SOLID VARIANTS --- */

/* 
   Strategy: Use a pseudo-element divider that inherits 'currentColor' (text color).
   This ensures:
   1. If button is dark (text white), divider is white/transparent.
   2. If button is light (text black), divider is black/transparent.
   3. Works automatically for new variants without hardcoding class names.
   
   Exclude .border classes (Outline variants) as they have their own borders.
*/

.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(.border))::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0; /* Full height */
  width: 1px;
  background-color: currentColor;
  opacity: 0.15; /* Subtle contrast */
  z-index: 5; /* Above background, below sticky content */
  pointer-events: none;
  /* Adjust for vertical vertical centering if needed, but top:0 bottom:0 is safer for full stretch */
}

/* Vertical Dividers */
.vertical-group :deep(button:not(:first-child):not(.border))::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0; /* Full width */
  height: 1px;
  background-color: currentColor;
  opacity: 0.15;
  z-index: 5;
  pointer-events: none;
  width: auto; /* Reset width from horizontal rule if cascading */
}

/* Ensure no conflict with horizontal rule on width for vertical */
.vertical-group :deep(button:not(:first-child):not(.border))::before {
  width: 100%;
}
.attached-group:not(.vertical-group) :deep(button:not(:first-child):not(.border))::before {
  height: 100%;
}
</style>
