<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import Button from '@/components/Button.vue'
import IconPicker from 'iconify-icon-picker'
import 'iconify-icon-picker/style.css'
import type { ButtonProps } from '@/types'
import type { TooltTipPlacement } from 'v-tooltip-lite/types'
import { $t } from '@/utils/i18n'

interface Props {
  btnProps?: ButtonProps
  value?: string
  position?: TooltTipPlacement
  placeholder?: string
  placeholderI18n?: string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  value: 'tabler:icons-filled',
})

const emit = defineEmits<{
  (e: 'onSelect', value: string, svg: string): void
  (e: 'onTrigger'): void
  (e: 'onClose'): void
}>()

const isOpen = ref(false)

const close = () => {
  isOpen.value = false
}

const handleSelect = (value: string, svg: string) => {
  emit('onSelect', value, svg)
  close()
}

const displayPlaceholder = computed(() => {
  if (props.placeholderI18n) return $t(props.placeholderI18n)
  if (props.placeholder) return props.placeholder
  const res = $t('vlite.iconPicker.search')
  return res !== 'vlite.iconPicker.search' ? res : 'Search 1000+ icons...'
})

const defaultIcons = [
  'ri:alert-line',
  'heroicons:arrow-right',
  'lucide:arrow-left',
  'tabler:arrow-down',
  'feather:arrow-up',
  'tabler:battery',
  'lucide:bookmark',
  'flowbite:briefcase-outline',
  'heroicons:calendar',
  'material-symbols:menu-rounded',
  'lucide:chevron-down',
  'lucide:chevron-up',
  'lucide:chevron-left',
  'lucide:chevron-right',
  'tabler:aperture',
  'feather:archive',
  'mdi:cart-outline',
  'mdi:settings',
  'tabler:dots',
  'mingcute:check-fill',
  'mdi:user',
  'feather:power',
  'lucide:phone',
  'tabler:dots-vertical',
  'material-symbols:home-outline-rounded',
  'mdi:microphone',
  'bytesize:message',
  'feather:activity',
  'mdi:brush',
  'tabler:eraser',
  'mdi:database',
  'heroicons:pencil',
  'mdi:crop',
  'heroicons:magnifying-glass-plus',
  'heroicons:magnifying-glass-minus',
  'tabler:corner-up-left',
  'heroicons:arrow-path',
  'mi:layers',
  'mdi:palette',
  'mdi:eye',
  'mdi:eye-off',
  'heroicons:arrows-pointing-in',
  'tabler:scissors',
  'heroicons:photo',
  'feather:grid',
  'lucide:ruler',
  'lucide:alert-octagon',
  'tabler:battery-4',
  'lucide:bookmark-minus',
  'heroicons:calendar',
  'tabler:share',
  'heroicons:power',
  'feather:phone',
  'tabler:microphone-2',
  'lucide:bar-chart',
  'famicons:brush-outline',
  'mdi:eraser',
  'fa6-regular:pen-to-square',
  'tabler:refresh',
  'lucide:palette',
  'lucide:move-diagonal',
  'feather:scissors',
  'tabler:rotate-clockwise',
  'lucide:type',
  'heroicons:photo',
  'feather:grid',
  'tabler:ruler-2',
  'material-symbols:download-rounded',
]
</script>

<template>
  <Dropdown
    className="max-h-[392px]! min-w-[250px]"
    @on-close="emit('onClose')"
    :position="position">
    <template #trigger>
      <slot>
        <Button
          v-bind="{
            icon: value,
            rounded: 'md',
            variant: 'outline',
            ...(btnProps || {}),
          }"
          @click="emit('onTrigger')" />
      </slot>
    </template>
    <template #menu>
      <slot name="menu-top" :close="close" />
      <IconPicker
        id="icon-picker"
        :placeholder="displayPlaceholder"
        :items-per-page="35"
        :value="value"
        @on-select="handleSelect"
        :defaultIcons="defaultIcons" />
    </template>
  </Dropdown>
</template>

