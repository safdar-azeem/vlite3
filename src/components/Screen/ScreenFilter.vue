<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '../Button.vue'
import Modal from '../Modal.vue'
import { Dropdown } from '../Dropdown'
import Icon from '../Icon.vue'
import { Form } from '../Form'
import { $t } from '@/utils/i18n'

const props = withDefaults(
  defineProps<{
    schema: any[]
    modelValue: Record<string, any>
    type?: 'modal' | 'dropdown'
  }>(),
  {
    type: 'modal',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'change', val: Record<string, any>): void
}>()

const isOpen = ref(false)

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
  isOpen.value = false
}

const clearFilters = () => {
  emit('update:modelValue', {})
  emit('change', {})
}

const txtFilters = computed(() => { const r = $t('vlite.screen.filters'); return r !== 'vlite.screen.filters' ? r : 'Filters' })
const txtApplyFilters = computed(() => { const r = $t('vlite.screen.applyFilters'); return r !== 'vlite.screen.applyFilters' ? r : 'Apply Filters' })
const txtFilter = computed(() => { const r = $t('vlite.screen.filter'); return r !== 'vlite.screen.filter' ? r : 'Filter' })
</script>

<template>
  <Modal v-if="type === 'modal'" :title="txtFilters" v-model:show="isOpen" max-width="sm:max-w-md">
    <template #trigger>
      <Button
        v-if="filterCount > 0"
        variant="secondary"
        class="flex items-center gap-1.5 pl-3 pr-1.5 shrink-0"
        @click="isOpen = true">
        <Icon icon="ci:filter" class="w-4 h-4" />
        <span>{{ txtFilters }} ({{ filterCount }})</span>
        <div
          @click.stop="clearFilters"
          class="ml-1 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <Icon icon="lucide:x" class="w-4 h-4" />
        </div>
      </Button>
      <Button
        v-else
        variant="outline"
        @click="isOpen = true"
        :title="txtFilter"
        size="lg"
        asIcon
        class="shrink-0 h-9! w-9!">
        <div class="text-gray-800! h-4! w-4! flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.132em"
            height="1.132em"
            viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.67 7c.083-.182.127-.374.16-.627c.202-1.572.303-2.358-.158-2.866C20.212 3 19.396 3 17.766 3H6.234c-1.63 0-2.445 0-2.906.507c-.461.508-.36 1.294-.158 2.866c.06.459.158.72.457 1.076c.969 1.15 2.742 3.197 5.23 5.057c.228.17.377.448.402.755c.28 3.425.537 5.765.674 6.917c.071.604.741 1.069 1.293.678c.927-.655 2.66-1.39 2.888-2.612c.108-.577.267-1.585.445-3.244M17.5 8v7m3.5-3.5h-7" />
          </svg>
        </div>
      </Button>
    </template>
    <div class="">
      <Form
        :schema="schema"
        :values="modelValue"
        :submit-text="txtApplyFilters"
        @on-submit="applyFilters" />
    </div>
  </Modal>

  <Dropdown
    v-else
    v-model:isOpen="isOpen"
    :close-on-select="false"
    position="bottom-end"
    class="w-auto">
    <template #trigger>
      <Button
        v-if="filterCount > 0"
        variant="secondary"
        class="flex items-center gap-1.5 pl-3 pr-1.5 shrink-0 bg-gray-150! hover:bg-gray-100!"
        style="pointer-events: auto">
        <Icon icon="ci:filter" class="w-4 h-4" />
        <span>{{ txtFilters }} ({{ filterCount }})</span>
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
        :title="txtFilter"
        size="lg"
        class="shrink-0 h-9! w-9!" />
    </template>

    <div
      class="py-3 px-3.5 w-[300px] sm:w-[320px] max-h-[85vh] overflow-y-auto bg-card rounded-md border border-border shadow-lg text-left">
      <Form
        :schema="schema"
        :values="modelValue"
        :submit-text="txtApplyFilters"
        :submit-props="{
          size: 'sm',
          class: 'w-full',
          textClass: '-text-fs-1!',
        }"
        @on-submit="applyFilters" />
    </div>
  </Dropdown>
</template>

