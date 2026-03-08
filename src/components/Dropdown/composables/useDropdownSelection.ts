import { computed } from 'vue'
import { deepMerge } from '@/utils/object'
import type { IDropdownOption, IDropdownOptions } from '@/types'
import { $t } from '@/utils/i18n'

interface UseDropdownSelectionProps {
  modelValue: any
  selected?: any
  toggleSelection?: boolean
  showSelectedLabel?: boolean
  selectable?: boolean
  options?: IDropdownOptions
}

type EmitFn = (event: 'update:modelValue' | 'onSelect', ...args: any[]) => void

export function useDropdownSelection(props: UseDropdownSelectionProps, emit: EmitFn) {
  // Unified Value
  const currentValue = computed(() => {
    return props.modelValue !== undefined ? props.modelValue : props.selected
  })

  // Label Resolution
  const getLabelFromValue = (options: IDropdownOptions = [], value: any): string => {
    for (const opt of options) {
      const displayLabel = opt.labelI18n ? $t(opt.labelI18n) : opt.label
      
      // Exact match
      if (opt.value === value) return displayLabel

      // Key/Object match
      if (opt.key && typeof value === 'object' && value !== null && opt.key in value) {
        if (opt.children) {
          const childLabel = getLabelFromValue(opt.children, value[opt.key])
          if (childLabel) return `${displayLabel} / ${childLabel}`
        }
        // If no children but key matched (top level leaf with key)
        if (opt.value === value[opt.key]) return displayLabel

        return displayLabel
      }
    }
    return ''
  }

  const selectedLabel = computed(() => {
    if (!props.showSelectedLabel) return ''
    if (!props.selectable) return ''
    if (!props.options?.length) return ''
    return getLabelFromValue(props.options, currentValue.value)
  })

  // Selection Logic
  const selectOption = (option: IDropdownOption) => {
    if (typeof option !== 'string' && option?.disabled) return undefined

    const currentVal = currentValue.value
    let value = option?.value ?? option?.label
    const data = option.data

    let finalValue: any

    // Recursive / Partial Update Logic
    if (option.key) {
      const isWrapped = typeof value === 'object' && value !== null && option.key in value

      if (!isWrapped) {
        value = { [option.key]: value }
      }
    }

    // Merge Logic: If currentValue is an object (config mode)
    if (currentVal && typeof currentVal === 'object' && !Array.isArray(currentVal) && option.key) {
      // Toggle Logic: Check if already selected
      const key = option.key
      const targetVal = option.value ?? option.label

      const isSelected = currentVal[key] === targetVal

      // If toggle enabled and already selected, remove it
      if (props.toggleSelection && isSelected) {
        const clone = { ...currentVal }
        delete clone[key]
        finalValue = clone
        emit('update:modelValue', finalValue)
        emit('onSelect', { value: finalValue, data, option })
        return finalValue
      }

      // Otherwise Merge
      finalValue = deepMerge(currentVal, value)
      emit('update:modelValue', finalValue)
      emit('onSelect', { value: finalValue, data, option })
    } else {
      // Standard replace (Primitive or Single Object)
      // Toggle logic for simple mode
      if (props.toggleSelection && currentVal === (option.value ?? option.label)) {
        finalValue = undefined
        emit('update:modelValue', undefined)
        emit('onSelect', { value: undefined, data, option })
      } else {
        finalValue = value
        emit('update:modelValue', finalValue)
        emit('onSelect', { value: finalValue, data, option })
      }
    }

    return finalValue
  }

  return {
    currentValue,
    selectedLabel,
    selectOption,
  }
}

