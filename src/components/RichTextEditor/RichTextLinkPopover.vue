<script setup lang="ts">
import { ref, nextTick } from 'vue'
import Icon from '../Icon.vue'

interface Props {
  visible: boolean
  isEditing: boolean
  url: string
  popoverStyle?: Record<string, string | number>
}

defineProps<Props>()

const emit = defineEmits<{
  'update:url': [val: string]
  apply: []
  unlink: []
  openTab: []
  close: []
}>()

const linkInputRef = ref<HTMLInputElement | null>(null)

function focusInput(): void {
  nextTick(() => {
    linkInputRef.value?.focus()
  })
}

defineExpose({
  focusInput,
  el: linkInputRef, // fallback if needed
})

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault()
    emit('apply')
  }
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}
</script>

<template>
  <Transition name="rte-pop">
    <div
      v-if="visible"
      class="rte-link-popover"
      :style="popoverStyle"
      role="dialog"
      aria-label="Link editor"
      aria-modal="false"
      @mousedown.stop>

      <!-- URL input -->
      <div class="rte-link-input-row">
        <Icon icon="lucide:link-2" class="rte-link-icon-prefix" aria-hidden="true" />
        <input
          ref="linkInputRef"
          :value="url"
          @input="emit('update:url', ($event.target as HTMLInputElement).value)"
          type="url"
          placeholder="https://example.com"
          class="rte-link-input"
          aria-label="URL to link to"
          @keydown="onKeydown" />
        <!-- Apply button -->
        <button
          type="button"
          class="rte-btn rte-link-apply-btn"
          title="Apply link"
          aria-label="Apply link"
          :disabled="!url.trim()"
          @mousedown.prevent="emit('apply')">
          <Icon icon="lucide:check" class="rte-icon" aria-hidden="true" />
        </button>
      </div>

      <!-- Actions row -->
      <div class="rte-link-actions-row">
        <button
          v-if="isEditing"
          type="button"
          class="rte-link-action-btn rte-link-action-btn--danger"
          @mousedown.prevent="emit('unlink')">
          <Icon icon="lucide:unlink" class="rte-icon" aria-hidden="true" />
          Unlink
        </button>
        <button
          v-if="isEditing && url"
          type="button"
          class="rte-link-action-btn"
          @mousedown.prevent="emit('openTab')">
          <Icon icon="lucide:external-link" class="rte-icon" aria-hidden="true" />
          Open
        </button>
      </div>
    </div>
  </Transition>
</template>

<style>
.rte-link-popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 60;
  width: 300px;
  max-width: min(300px, calc(100vw - 24px));
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  will-change: transform, opacity;
}

.rte-link-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 8px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.rte-link-input-row:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--color-primary) 12%, transparent);
}
.rte-link-icon-prefix {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-muted-foreground);
  flex-shrink: 0;
}

.rte-link-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.8rem;
  color: var(--color-foreground);
  padding: 7px 0;
  min-width: 0;
  font-family: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
.rte-link-input::placeholder {
  color: var(--color-muted-foreground);
  font-family: inherit;
}

.rte-link-actions-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rte-link-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-muted-foreground);
  transition: background 0.12s ease, color 0.12s ease;
}
.rte-link-action-btn:hover { background: var(--color-accent); color: var(--color-foreground); }
.rte-link-action-btn--danger { color: var(--color-destructive); }
.rte-link-action-btn--danger:hover { background: color-mix(in oklab, var(--color-destructive) 10%, transparent); color: var(--color-destructive); }

.rte-link-apply-btn {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  width: 24px;
  height: 24px;
  padding: 4px;
  cursor: pointer;
}
.rte-link-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.rte-link-apply-btn:hover:not(:disabled) {
  background: color-mix(in oklab, var(--color-primary) 88%, var(--color-primary-foreground));
  color: var(--color-primary-foreground);
}
</style>
