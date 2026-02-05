<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon.vue'

export interface ChoiceBoxOption {
  id: string | number
  title: string
  description?: string
  icon?: string
  disabled?: boolean
  badge?: string
}

interface Props {
  modelValue?: string | number | (string | number)[] | null
  options: ChoiceBoxOption[]
  multiple?: boolean
  title?: string
  description?: string
  disabled?: boolean
  grid?: number
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  multiple: false,
  disabled: false,
  grid: 1,
  gap: 4,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | (string | number)[] | null): void
  (e: 'change', value: string | number | (string | number)[] | null): void
}>()

const isSelected = (id: string | number) => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(id)
  }
  return props.modelValue === id
}

const toggleOption = (id: string | number) => {
  if (props.disabled) return
  const option = props.options.find((o) => o.id === id)
  if (option?.disabled) return

  let newValue: any

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = current.indexOf(id)
    if (index === -1) {
      current.push(id)
    } else {
      current.splice(index, 1)
    }
    newValue = current
  } else {
    // If clickable again, do we unselect? Usually radio behavior implies no unselect on click, but let's stick to standard "select this one"
    newValue = id
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)
}

const gridClass = computed(() => {
  switch (props.grid) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-1 sm:grid-cols-2'
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1'
  }
})

const gapClass = computed(() => {
  switch (props.gap) {
    case 2:
      return 'gap-2'
    case 3:
      return 'gap-3'
    case 4:
      return 'gap-4'
    case 6:
      return 'gap-6'
    case 8:
      return 'gap-8'
    default:
      return 'gap-4'
  }
})
</script>

<template>
  <div class="w-full">
    <!-- Group Header -->
    <div v-if="title || description" class="mb-4">
      <h3 v-if="title" class="text-base font-semibold text-foreground">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-muted-foreground mt-1">
        {{ description }}
      </p>
    </div>

    <!-- Grid Container -->
    <div class="grid" :class="[gridClass, gapClass]">
      <div
        v-for="option in options"
        :key="option.id"
        class="relative flex cursor-pointer rounded-xl border border-border p-4 shadow-sm transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        :class="[
          isSelected(option.id)
            ? 'border-primary bg-accent'
            : 'bg-card hover:border-primary/50 hover:bg-accent',
          disabled || option.disabled ? 'opacity-50 cursor-not-allowed grayscale' : '',
        ]"
        @click="toggleOption(option.id)"
        tabindex="0"
        @keydown.enter.space.prevent="toggleOption(option.id)">
        <div class="flex flex-1 gap-3">
          <!-- Icon -->
          <div v-if="option.icon" class="shrink-0 pt-0.5">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              :class="
                isSelected(option.id)
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              ">
              <Icon :icon="option.icon" class="h-5 w-5" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span
                class="font-semibold text-foreground"
                :class="{
                  'text-primary': isSelected(option.id),
                }">
                {{ option.title }}
              </span>
              <span
                v-if="option.badge"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  isSelected(option.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                ">
                {{ option.badge }}
              </span>
            </div>
            <span
              v-if="option.description"
              class="mt-1 text-sm text-muted-foreground leading-relaxed">
              {{ option.description }}
            </span>
          </div>
        </div>

        <!-- Check Indicator (Top Right) -->
        <div v-if="isSelected(option.id)" class="absolute top-4 right-4 text-primary">
          <Icon v-if="multiple" icon="lucide:check-square" class="h-5 w-5" />
          <Icon v-else icon="lucide:check-circle-2" class="h-5 w-5" />
        </div>
      </div>
    </div>
  </div>
</template>
