<script setup lang="ts">
import { ref, computed } from 'vue'
import BreadcrumbItem from './BreadcrumbItem.vue'
import type {
  BreadcrumbProps,
  BreadcrumbItemSchema,
  BreadcrumbVariant,
  BreadcrumbSeparator,
  BreadcrumbSize,
} from './types'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  variant: 'default',
  separator: 'chevron',
  size: 'md',
  class: '',
})

const collapsed = ref(true)

const shouldCollapse = computed(() => {
  if (!props.maxItems || !props.items) return false
  return props.items.length > props.maxItems && collapsed.value
})

const visibleItems = computed<BreadcrumbItemSchema[]>(() => {
  if (!props.items) return []
  if (!shouldCollapse.value) return props.items

  const max = props.maxItems!
  // Show first item, then ellipsis, then last (max - 1) items
  const tailCount = Math.max(max - 1, 1)
  return [props.items[0], ...props.items.slice(-tailCount)]
})

const ellipsisIndex = computed(() => (shouldCollapse.value ? 1 : -1))

function expand() {
  collapsed.value = false
}

const wrapperClasses = computed(() => {
  const variantMap: Record<BreadcrumbVariant, string> = {
    default: 'breadcrumb--default',
    contained: 'breadcrumb--contained',
    pills: 'breadcrumb--pills',
    arrow: 'breadcrumb--arrow',
  }
  const sizeMap: Record<BreadcrumbSize, string> = {
    sm: 'breadcrumb--sm',
    md: 'breadcrumb--md',
    lg: 'breadcrumb--lg',
  }
  return ['breadcrumb', variantMap[props.variant], sizeMap[props.size], props.class]
    .filter(Boolean)
    .join(' ')
})

const separatorChar = computed(() => {
  const map: Record<BreadcrumbSeparator, string> = {
    slash: '/',
    chevron: '›',
    dot: '·',
    arrow: '→',
  }
  return map[props.separator] || '›'
})
</script>

<template>
  <nav :class="wrapperClasses" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <template v-if="items && items.length">
        <template v-for="(item, idx) in visibleItems" :key="item.label + idx">
          <!-- Separator before each item (except first) -->
          <li v-if="idx > 0" class="breadcrumb-separator" aria-hidden="true">
            <span>{{ separatorChar }}</span>
          </li>

          <!-- Ellipsis collapse button -->
          <template v-if="idx === ellipsisIndex">
            <li class="breadcrumb-separator" aria-hidden="true">
              <span>{{ separatorChar }}</span>
            </li>
            <li class="breadcrumb-ellipsis">
              <button
                type="button"
                class="breadcrumb-ellipsis-btn"
                aria-label="Show all breadcrumb items"
                @click="expand">
                …
              </button>
            </li>
          </template>

          <!-- Breadcrumb item -->
          <BreadcrumbItem
            v-bind="item"
            :size="size"
            :variant="variant"
            :is-current="idx === visibleItems.length - 1" />
        </template>
      </template>

      <!-- Slot-driven usage -->
      <template v-else>
        <slot />
      </template>
    </ol>
  </nav>
</template>

<style scoped>
/* ---- Layout ---- */
.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25em;
}

/* ---- Sizes ---- */
.breadcrumb--sm {
  font-size: var(--text--fs-2);
}
.breadcrumb--md {
  font-size: var(--text-fs-0.5, 1em);
}
.breadcrumb--lg {
  font-size: var(--text-fs-2);
}

/* ---- Separator ---- */
.breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  color: var(--color-gray-400);
  user-select: none;
  font-size: 0.9em;
  line-height: 1;
  padding: 0 0.1em;
}

/* ---- Ellipsis ---- */
.breadcrumb-ellipsis {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-ellipsis-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-muted-foreground);
  cursor: pointer;
  font-size: 0.9em;
  line-height: 1;
  letter-spacing: 0.05em;
  transition: all 0.15s ease;
}

.breadcrumb-ellipsis-btn:hover {
  background: var(--color-accent);
  color: var(--color-foreground);
  border-color: var(--color-gray-300);
}

/* ===== Variant: contained ===== */
.breadcrumb--contained {
  background: var(--color-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 0.45em 1em;
}

/* ===== Variant: pills ===== */
.breadcrumb--pills :deep(.breadcrumb-link) {
  padding: 0.2em 0.7em;
  border-radius: 9999px;
  background: var(--color-secondary);
  border: 1px solid var(--color-border);
}

.breadcrumb--pills :deep(.breadcrumb-link:not(.current):not(.disabled):hover) {
  background: var(--color-accent);
  border-color: var(--color-gray-300);
}

.breadcrumb--pills :deep(.breadcrumb-link.current) {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  border-color: var(--color-primary);
}

/* ===== Variant: arrow ===== */
.breadcrumb--arrow .breadcrumb-list {
  gap: 0;
}

.breadcrumb--arrow :deep(.breadcrumb-link) {
  padding: 0.35em 0.9em 0.35em 1.4em;
  background: var(--color-secondary);
  clip-path: polygon(
    0 0,
    calc(100% - 0.6em) 0,
    100% 50%,
    calc(100% - 0.6em) 100%,
    0 100%,
    0.6em 50%
  );
  border: none;
  margin-left: -0.3em;
}

.breadcrumb--arrow :deep(.breadcrumb-item:first-child .breadcrumb-link) {
  padding-left: 0.9em;
  clip-path: polygon(0 0, calc(100% - 0.6em) 0, 100% 50%, calc(100% - 0.6em) 100%, 0 100%);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  margin-left: 0;
}

.breadcrumb--arrow :deep(.breadcrumb-link:not(.current):not(.disabled):hover) {
  background: var(--color-accent);
}

.breadcrumb--arrow :deep(.breadcrumb-link.current) {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

.breadcrumb--arrow .breadcrumb-separator {
  display: none;
}
</style>
