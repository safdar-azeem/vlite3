<script setup lang="ts">
import { computed } from 'vue'
import Input from '../Input.vue'

interface Props {
  modelValue?: string
  showSearch?: boolean
  placeholder?: string
  class?: string
  searchClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  showSearch: true,
  placeholder: 'Search...',
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
        :placeholder="placeholder"
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

