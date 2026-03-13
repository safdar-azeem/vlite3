<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dropdown } from '@/components/Dropdown'
import ColorIro from './ColorIro.vue'
import Button from '@/components/Button.vue'
import Input from '@/components/Input.vue'
import { useEyeDropper } from '@vueuse/core'
import type { TooltTipPlacement } from 'v-tooltip-lite/types'
import type { ButtonProps } from '@/types'

interface Props {
  modelValue?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  position?: TooltTipPlacement
  btnProps?: ButtonProps
  showInput?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  disabled: false,
  size: 'md',
  position: 'bottom',
  showInput: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const isOpen = ref(false)
const localHex = ref(props.modelValue || '#000000')

const { isSupported, open, sRGBHex } = useEyeDropper()

watch(sRGBHex, (newColor) => {
  if (newColor) {
    localHex.value = newColor
    // The localHex watcher will emit and update
  }
})

const openEyeDropper = async () => {
  try {
    await open()
  } catch (error) {
    console.error('Error opening eyedropper:', error)
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal !== localHex.value) {
      localHex.value = newVal
    }
  }
)

watch(localHex, (newHex) => {
  // Validate that it's a valid hex code before emitting to prevent breaking Iro
  if (/^#([0-9A-F]{3,8})$/i.test(newHex) && newHex !== props.modelValue) {
    emit('update:modelValue', newHex)
    emit('change', newHex)
  }
})

const handleColorChange = (color: string) => {
  localHex.value = color // The watcher will take care of validating and emitting
}
</script>

<template>
  <Dropdown
    :disabled="disabled"
    class="w-auto"
    :position="position"
    :offset="[0, 8]"
    :searchable="false"
    :close-on-select="false"
    @on-open="isOpen = true"
    @on-close="isOpen = false">
    <template #trigger="{ isOpen: triggerIsOpen }">
      <Button
        :style="{ backgroundColor: modelValue }"
        v-bind="{
          rounded: 'full',
          size: 'xs',
          icon: ' ',
          variant: 'outline',
          ...(btnProps || {}),
        }" />
    </template>

    <div v-if="isOpen" class="p-2 w-max flex flex-col justify-center">
      <ColorIro
        :color="modelValue"
        :show-header="false"
        :size="size"
        @update:color="handleColorChange">
        <template #bottom>
          <div v-if="showInput" class="flex items-center gap-1.5 w-full">
            <Button
              v-if="isSupported"
              @click="openEyeDropper"
              icon="pepicons-pop:color-picker"
              variant="outline"
              size="sm"
              class="px-2 shrink-0" />
            <div class="w-32">
              <Input
                v-model="localHex"
                size="sm"
                :show-clear-button="false"
                placeholder="#000000"
                class="flex-1 w-full"
                input-class="font-mono text-xs uppercase " />
            </div>
          </div>
        </template>
      </ColorIro>
    </div>
  </Dropdown>
</template>
