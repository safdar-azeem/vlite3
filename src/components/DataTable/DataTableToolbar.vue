<script setup lang="ts">
import { computed } from 'vue'
import Input from '../Input.vue'
import { $t } from '@/utils/i18n'

interface Props {
  modelValue?: string
  showSearch?: boolean
  placeholder?: string
  placeholderI18n?: string
  class?: string
  searchClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  showSearch: true,
  class: '',
  searchClass: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const searchValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) return $t(props.placeholderI18n)
  if (props.placeholder) return props.placeholder
  const res = $t('vlite.dataTable.searchPlaceholder')
  return res !== 'vlite.dataTable.searchPlaceholder' ? res : 'Search...'
})
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-4 p-1" :class="props.class">
    <div class="flex items-center gap-3 mr-auto" v-if="$slots?.left">
      <slot name="left" />
    </div>
    <div class="ml-auto">
      <slot name="delete" />
    </div>
    <div class="w-full sm:w-72!" :class="searchClass" v-if="showSearch">
      <Input
        v-model="searchValue"
        :placeholder="displayPlaceholder"
        icon="lucide:search"
        variant="outline"
        class="bg-background"
        :show-clear-button="true" />
    </div>
    <div class="flex items-center gap-3">
      <slot name="right" />
    </div>
  </div>
</template>

