<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '../Icon.vue'
import { Dropdown, DropdownMenu } from '@/components/Dropdown'
import Badge from '@/components/Badge.vue'
import type { IDropdownOption, IDropdownOptions } from '@/types'

// Props
interface Props {
  modelValue?: any[]
  options?: IDropdownOptions
  placeholder?: string
  disabled?: boolean
  searchable?: boolean

  variant?: 'default' | 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  maxVisible?: number // Max tabs to show before +N
  // Advanced Dropdown Props
  loading?: boolean
  hasMore?: boolean
  remote?: boolean
  layout?: 'default' | 'grouped'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  placeholder: 'Select items...',
  disabled: false,
  searchable: true,
  variant: 'outline',
  size: 'md',
  maxVisible: 2,
  loading: false,
  hasMore: false,
  remote: false,
  layout: 'default',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
  (e: 'change', value: any[]): void
  (e: 'load-more'): void
  (e: 'search', query: string): void
}>()

const isOpen = ref(false)

// Computed
const selectedOptions = computed(() => {
  return props.options.filter((opt) => {
    const val = opt.value ?? opt.label
    return props.modelValue.includes(val)
  })
})

const visibleSelections = computed(() => {
  return selectedOptions.value.slice(0, props.maxVisible)
})

const hiddenCount = computed(() => {
  return selectedOptions.value.length - props.maxVisible
})

const handleSelect = (option: IDropdownOption) => {
  const val = option.value ?? option.label
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(val)

  if (index === -1) {
    newValue.push(val)
  } else {
    newValue.splice(index, 1)
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
  // Do not close on select for multi-select
}

const removeOption = (value: any) => {
  const newValue = props.modelValue.filter((v) => v !== value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const clearAll = () => {
  emit('update:modelValue', [])
  emit('change', [])
}

// Styling
const triggerClasses = computed(() => {
  return [
    'flex items-center justify-between w-full min-h-[40px] px-3 py-1.5 rounded-md border text-sm transition-colors cursor-pointer',
    props.disabled ? 'opacity-50 cursor-not-allowed bg-muted' : 'bg-background hover:bg-accent',
    props.variant === 'outline' ? 'border-input' : 'border-transparent bg-muted',
    isOpen.value ? 'border-primary' : '',
  ].join(' ')
})

const badgeSize = computed(() => (props.size === 'sm' ? 'xs' : 'sm'))
</script>

<template>
  <Dropdown
    v-model:isOpen="isOpen"
    :close-on-select="false"
    :selectable="true"
    :disabled="disabled">
    <template #trigger="{ isOpen }">
      <div :class="triggerClasses">
        <div class="flex flex-wrap gap-1.5 items-center flex-1 min-w-0 py-0.5">
          <span v-if="selectedOptions.length === 0" class="text-muted-foreground pl-1">
            {{ placeholder }}
          </span>

          <template v-else>
            <!-- Visible Badges -->
            <Badge
              v-for="opt in visibleSelections"
              :key="opt.value"
              variant="secondary"
              class="gap-1 pr-1 truncate max-w-[150px]">
              <span class="truncate">{{ opt.label }}</span>
              <button
                v-if="!disabled"
                @click.stop="removeOption(opt.value)"
                class="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors">
                <Icon icon="lucide:x" class="w-3 h-3" />
              </button>
            </Badge>

            <!-- +N Badge -->
            <Badge
              v-if="hiddenCount > 0"
              variant="secondary"
              class="font-normal text-muted-foreground">
              +{{ hiddenCount }}
            </Badge>
          </template>
        </div>

        <div class="flex items-center gap-2 pl-2 shrink-0 text-muted-foreground">
          <Icon
            v-if="selectedOptions.length > 0 && !disabled"
            icon="lucide:x"
            class="w-4 h-4 hover:text-foreground transition-colors"
            @click.stop="clearAll" />
          <div class="w-px h-4 bg-border mx-0.5"></div>
          <Icon
            icon="lucide:chevron-down"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen }" />
        </div>
      </div>
    </template>

    <template #default>
      <DropdownMenu
        :options="options"
        :selected="modelValue"
        class="min-w-[300px]"
        :loading="loading"
        :hasMore="hasMore"
        :searchable="searchable"
        :remote="remote"
        :layout="layout"
        @select="handleSelect"
        @close="isOpen = false"
        @load-more="$emit('load-more')"
        @search="(q) => $emit('search', q)" />
    </template>
  </Dropdown>
</template>
