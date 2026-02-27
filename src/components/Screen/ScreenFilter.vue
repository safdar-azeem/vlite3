<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '../Button.vue'
import Modal from '../Modal.vue'
import Icon from '../Icon.vue'
import { Form } from '../Form'

const props = defineProps<{
  schema: any[]
  modelValue: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const showModal = ref(false)

const filterCount = computed(() => {
  if (!props.modelValue) return 0
  return Object.keys(props.modelValue).filter(
    (k) =>
      props.modelValue[k] !== '' &&
      props.modelValue[k] !== null &&
      props.modelValue[k] !== undefined
  ).length
})

const applyFilters = (payload: any) => {
  emit('update:modelValue', payload.values)
  emit('change', payload.values)
  showModal.value = false
}

const clearFilters = () => {
  emit('update:modelValue', {})
  emit('change', {})
}
</script>

<template>
  <Modal title="Filters" v-model:show="showModal" max-width="sm:max-w-md">
    <template #trigger>
      <Button
        v-if="filterCount > 0"
        variant="secondary"
        class="flex items-center gap-1.5 pl-3 pr-1.5 shrink-0"
        @click="showModal = true">
        <Icon icon="ci:filter" class="w-4 h-4" />
        <span>Filters ({{ filterCount }})</span>
        <div
          @click.stop="clearFilters"
          class="ml-1 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <Icon icon="lucide:x" class="w-4 h-4" />
        </div>
      </Button>
      <Button
        v-else
        variant="outline"
        icon="hugeicons:filter-add"
        @click="showModal = true"
        title="Filter"
        size="lg"
        class="shrink-0 h-9! w-9!" />
    </template>
    <div class="p-4">
      <Form
        :schema="schema"
        :values="modelValue"
        submit-text="Apply Filters"
        @on-submit="applyFilters" />
    </div>
  </Modal>
</template>
