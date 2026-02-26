<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import Icon from '../Icon.vue'
import Button from '@/components/Button.vue'
import type { InputVariant, InputSize, InputRounded } from '@/types'

defineOptions({
  name: 'FilePicker',
})

export interface FilePickerValue {
  fileName: string
  fileType: string
  fileSize: number
  file: File
  base64: string
}

interface Props {
  modelValue?: FilePickerValue | FilePickerValue[] | null
  multiSelect?: boolean
  fileTypes?: string[]
  returnFormat?: 'file' | 'base64'
  loading?: boolean
  disabled?: boolean
  maxSize?: number
  maxFiles?: number
  variant?: 'dropzone' | 'input'
  placeholder?: string
  size?: InputSize
  rounded?: InputRounded
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  multiSelect: false,
  fileTypes: () => [],
  returnFormat: 'file',
  loading: false,
  disabled: false,
  variant: 'dropzone',
  size: 'md',
  rounded: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilePickerValue | FilePickerValue[] | null): void
  (e: 'change', value: FilePickerValue | FilePickerValue[] | null): void
  (e: 'error', error: string): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)

const slots = useSlots()

const acceptAttribute = computed(() => {
  return props.fileTypes.join(',')
})

const hasValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.length > 0
  }
  return props.modelValue !== null
})

const displayFiles = computed(() => {
  let values: any[] = []
  if (Array.isArray(props.modelValue)) {
    values = props.modelValue
  } else if (props.modelValue) {
    values = [props.modelValue]
  }

  // Normalize strings (URLs) to objects for display
  return values.map((val) => {
    if (typeof val === 'string') {
      const fileName = val.split('/').pop() || 'Unknown File'
      return {
        fileName: decodeURIComponent(fileName),
        fileType: 'unknown',
        fileSize: 0,
        file: null,
        base64: val,
        isUrl: true,
      }
    }
    return val
  })
})

const triggerInput = () => {
  if (props.disabled || props.loading || isProcessing.value) return
  
  if (props.multiSelect && props.maxFiles) {
    const existingCount = Array.isArray(props.modelValue) ? props.modelValue.length : (props.modelValue ? 1 : 0)
    if (existingCount >= props.maxFiles) {
      emit('error', `Maximum ${props.maxFiles} files allowed`)
      return
    }
  }
  
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (props.disabled || props.loading) return
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (props.disabled || props.loading || isProcessing.value) return

  if (e.dataTransfer?.files) {
    processFiles(e.dataTransfer.files)
  }
}

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    processFiles(target.files)
  }
  // Reset input so same file can be selected again if needed
  target.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0 || !bytes) return ''
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as base64'))
      }
    }
    reader.onerror = (error) => reject(error)
  })
}

const processFiles = async (fileList: FileList) => {
  if (fileList.length === 0) return

  isProcessing.value = true
  const processed: FilePickerValue[] = []
  const errors: string[] = []

  // Convert FileList to Array
  const files = Array.from(fileList)

  // Single select validation
  let filesToProcess = props.multiSelect ? files : [files[0]]
  
  // Enforce Limit
  if (props.multiSelect && props.maxFiles) {
    const existingCount = Array.isArray(props.modelValue) ? props.modelValue.length : (props.modelValue ? 1 : 0)
    const availableSlots = props.maxFiles - existingCount
    
    if (availableSlots <= 0) {
      emit('error', `Maximum ${props.maxFiles} files allowed`)
      isProcessing.value = false
      return
    }
    
    if (filesToProcess.length > availableSlots) {
      errors.push(`Only ${availableSlots} more file(s) allowed. Maximum ${props.maxFiles} files.`)
      filesToProcess = filesToProcess.slice(0, availableSlots)
    }
  }

  try {
    for (const file of filesToProcess) {
      // Validate file type if fileTypes prop is provided
      if (props.fileTypes.length > 0) {
        // Simple check: extension or mime type
        // Note: detailed mime matching can be complex, doing basic check here
        // This relies on the input 'accept' doing most heavy lifting, but drag/drop needs manual check
        // Implementing a basic check:
        const isAccepted = props.fileTypes.some((type) => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          if (type.endsWith('/*')) {
            const mainType = type.split('/')[0]
            return file.type.startsWith(mainType)
          }
          return file.type === type
        })

        if (!isAccepted) {
          errors.push(`File type not allowed: ${file.name}`)
          continue
        }
      }

      let isTooLarge = false
      if (props.maxSize && file.size > props.maxSize) {
        errors.push(`File too large: ${file.name}`)
        isTooLarge = true
      }

      let base64 = ''
      if (props.returnFormat === 'base64' && !isTooLarge) {
        try {
          base64 = await readFileAsBase64(file)
        } catch (e) {
          console.error('Base64 read failed', e)
        }
      }

      processed.push({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        file: file,
        base64: base64,
      })
    }

    if (errors.length > 0) {
      emit('error', errors.join('; '))
    }

    if (processed.length > 0) {
      let result: FilePickerValue | FilePickerValue[]
      if (props.multiSelect) {
        const existing = Array.isArray(props.modelValue) ? props.modelValue : (props.modelValue ? [props.modelValue] : [])
        result = [...existing, ...processed]
      } else {
        result = processed[0]
      }
      emit('update:modelValue', result)
      emit('change', result)
    }
  } catch (error) {
    console.error('Error processing files:', error)
    emit('error', 'Failed to process files')
  } finally {
    isProcessing.value = false
  }
}

const removeFile = (index: number) => {
  if (props.disabled || props.loading) return

  if (props.multiSelect && Array.isArray(props.modelValue)) {
    const newValue = [...props.modelValue]
    newValue.splice(index, 1)
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    emit('update:modelValue', null)
    emit('change', null)
  }
}

const clearAll = () => {
  if (props.disabled || props.loading) return
  emit('update:modelValue', null)
  emit('change', null)
}

// Input Variant Logic
const inputDisplayValue = computed(() => {
  if (!hasValue.value) return ''
  // Use displayFiles which is already normalized
  const files = displayFiles.value
  return files.map((f: any) => f.fileName).join(', ')
})

const inputBaseClass = computed(() => {
  const base =
    'block w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all focus-visible:outline-none cursor-pointer'

  // Size styles
  const sizeStyles: Record<InputSize, string> = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  }

  // Rounded styles
  const roundedStyles: Record<InputRounded, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }

  return [
    base,
    'border border-input focus-visible:border-primary', // Default outline style
    sizeStyles[props.size],
    roundedStyles[props.rounded],
    'pr-10', // Space for icon
    props.disabled ? 'cursor-not-allowed opacity-50' : '',
  ].join(' ')
})
</script>

<template>
  <div class="w-full">
    <input
      ref="fileInput"
      type="file"
      :multiple="multiSelect"
      :accept="acceptAttribute"
      class="hidden"
      @change="handleInputChange" />

    <slot
      name="trigger"
      :trigger="triggerInput"
      :is-dragging="isDragging"
      :is-loading="loading || isProcessing"
      :files="displayFiles">
      <div v-if="variant === 'input'" class="relative" @click="triggerInput">
        <input
          type="text"
          :value="inputDisplayValue"
          :placeholder="placeholder || 'Select file...'"
          readonly
          :class="inputBaseClass"
          :disabled="disabled || loading || isProcessing" />

        <div
          class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 bg-background">
          <Icon
            v-if="loading || isProcessing"
            icon="lucide:loader-2"
            class="h-4 w-4 animate-spin text-muted-foreground" />

          <button
            v-else-if="hasValue && !disabled"
            type="button"
            class="text-muted-foreground hover:text-foreground focus:outline-none"
            @click.stop="clearAll">
            <Icon icon="lucide:x-circle" class="h-4 w-4" />
          </button>

          <Icon v-else icon="lucide:upload" class="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div
        v-else
        class="relative"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop">
        <div
          v-if="!hasValue"
          class="border-2 border-dashed border-border rounded-lg p-6 transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center text-center gap-2"
          :class="[
            isDragging
              ? 'border-primary bg-primary/5'
              : 'hover:border-primary/50 hover:bg-muted/50',
            disabled || loading || isProcessing ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          @click="triggerInput">
          <div class="p-3 bg-muted rounded-full text-muted-foreground">
            <Icon
              v-if="loading || isProcessing"
              icon="lucide:loader-2"
              class="w-6 h-6 animate-spin" />
            <Icon v-else icon="lucide:upload-cloud" class="w-6 h-6" />
          </div>

          <div class="space-y-1">
            <p class="text-sm font-medium text-foreground">
              <span class="text-primary hover:underline">Click to upload</span>
              or drag and drop
            </p>
            <p v-if="fileTypes.length" class="text-xs text-muted-foreground">
              {{ fileTypes.join(', ') }}
            </p>
          </div>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(file, index) in displayFiles"
            :key="index"
            class="relative flex items-center p-3 border border-border rounded-lg bg-card shadow-sm transition-colors group"
            :class="[!multiSelect && !disabled ? 'cursor-pointer hover:border-primary/50' : '']"
            @click="!multiSelect && !disabled ? triggerInput() : null">
            <div class="shrink-0 mr-3">
              <div class="p-2 bg-primary-light rounded text-primary-fg-light">
                <Icon icon="lucide:file-text" class="w-5 h-5" />
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncate">
                {{ file.fileName }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ formatFileSize(file.fileSize) }}
              </p>
            </div>

            <div class="flex-shrink-0 ml-3 flex gap-2">
              <Button
                v-if="!disabled && !loading"
                size="xs"
                variant="ghost"
                icon="lucide:x"
                rounded="full"
                class="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                @click.stop="removeFile(index)" />
            </div>
          </div>

          <div class="flex gap-2" v-if="multiSelect && (!maxFiles || displayFiles.length < maxFiles)">
            <Button
              size="sm"
              variant="outline"
              icon="lucide:plus"
              text="Add more"
              :disabled="disabled || loading || isProcessing"
              @click="triggerInput" />
          </div>
        </div>

        <div
          v-if="loading || isProcessing"
          class="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
          <div class="bg-white p-2 rounded-full shadow-lg">
            <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin text-primary" />
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>
