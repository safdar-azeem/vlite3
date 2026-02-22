<script setup lang="ts">
import { computed, ref, watch, inject } from 'vue'
import type { IForm, IFormStep, IFormSubmitPayload } from './types'
import type {
  InputVariant,
  InputSize,
  InputRounded,
  TimelineTextPosition,
  ButtonProps,
} from '@/types'
import { useForm } from './composables/useForm'
import FormFields from './FormFields.vue'
import Button from '@/components/Button.vue'
import Timeline from '@/components/Timeline.vue'
import type { TimelineStep } from '@/types'

interface Props {
  /** Schema - single array or grouped arrays */
  schema: IForm[] | IForm[][]
  /** Initial/bound values */
  values?: Record<string, any>
  /** Input variant applied to all fields */
  variant?: InputVariant
  /** Input size applied to all fields */
  size?: InputSize
  /** Input rounded applied to all fields */
  rounded?: InputRounded
  /** Loading state during submit */
  loading?: boolean
  /** Show/hide default footer with submit button */
  footer?: boolean
  /** Headings for grouped schemas */
  groupsHeadings?: string[]
  /** Descriptions for grouped schemas */
  groupHeadingsDescription?: string[]
  /** Timeline steps for multi-step form mode */
  tabs?: IFormStep[]
  /** Submit button text */
  submitText?: string
  /* submit button props */
  submitProps?: ButtonProps
  /** Cancel button text */
  cancelText?: string
  /** Show cancel button */
  showCancel?: boolean
  /** Whether this is an update operation */
  isUpdate?: boolean
  /** Folder ID for file uploads */
  folderId?: string
  /** Custom class for form element */
  class?: string
  /** Custom class for the grid layout (overrides columns) */
  className?: string
  /** Custom class for group containers */
  groupClass?: string
  /** Custom class for group/step headers */
  headerClass?: string
  /** Custom class for the footer area */
  footerClass?: string
  /** Timeline text position */
  timelineTextPosition?: TimelineTextPosition
}

const props = withDefaults(defineProps<Props>(), {
  values: () => ({}),
  variant: 'outline',
  size: 'md',
  rounded: 'md',
  loading: false,
  footer: true,
  groupsHeadings: () => [],
  groupHeadingsDescription: () => [],
  submitText: 'Submit',
  cancelText: 'Cancel',
  showCancel: false,
  isUpdate: false,
  folderId: undefined,
  class: '',
  className: '',
  groupClass: '',
  headerClass: '',
  footerClass: '',
  timelineTextPosition: 'bottom',
})

const emit = defineEmits<{
  (e: 'onSubmit', payload: IFormSubmitPayload, close: () => void): void
  (e: 'onCancel'): void
  (e: 'onStepChange', step: number): void
  (e: 'onAddonAction', action: string): void
}>()

// Inject modal context if available
const modalContext = inject<{ close: () => void } | null>('modal-context', null)

// Determine if Cancel button should be shown (Explicit prop OR inside modal)
const shouldShowCancel = computed(() => props.showCancel || !!modalContext)

// Check if form is inside a modal to apply sticky footer styles
const isInsideModal = computed(() => !!modalContext)

// Determine form mode
const isGroupedMode = computed(() => {
  if (!props.schema || props.schema.length === 0) return false
  return Array.isArray(props.schema[0])
})

const isMultiStepMode = computed(() => {
  return props.tabs && props.tabs.length > 0 && isGroupedMode.value
})

// Current step for multi-step mode
const currentStep = ref(0)

// Convert props.tabs to TimelineStep format
const timelineSteps = computed((): TimelineStep[] => {
  if (!props.tabs) return []
  return props.tabs.map((tab, index) => ({
    id: tab.id?.toString() || index.toString(),
    title: tab.title,
    icon: tab.icon,
    description: tab.description,
    status:
      index < currentStep.value
        ? 'completed'
        : index === currentStep.value
          ? 'current'
          : 'upcoming',
  }))
})

// Get grouped schemas
const groupedSchemas = computed((): IForm[][] => {
  if (!isGroupedMode.value) {
    return [props.schema as IForm[]]
  }
  return props.schema as IForm[][]
})

// Get current step schema for multi-step mode
const currentStepSchema = computed((): IForm[] => {
  if (!isMultiStepMode.value) return []
  return groupedSchemas.value[currentStep.value] || []
})

// Initialize form hook
const {
  formValues,
  errors,
  isSubmitting,
  handleFieldChange,
  validateField,
  validateAll,
  isFieldVisible,
  isFieldDisabled,
  isFieldReadonly,
  getFieldValue,
  handleSubmit: formSubmit,
  flatSchema,
} = useForm({
  schema: props.schema,
  values: props.values,
  isUpdate: props.isUpdate,
  folderId: props.folderId,
  onSubmit: (payload) => {
    emit('onSubmit', payload, modalContext?.close)
  },
})

// Watch for external value changes
watch(
  () => props.values,
  (newValues) => {
    if (newValues) {
      // Re-initialize is handled in useForm watch
    }
  },
  { deep: true }
)

// Handle field change from FormFields
const onFieldChange = (name: string, payload: { value: any; data?: any }) => {
  handleFieldChange(name, payload.value, payload.data)
}

// Validate current step (for multi-step mode)
const validateCurrentStep = (): boolean => {
  if (!isMultiStepMode.value) return true

  const stepSchema = currentStepSchema.value
  let isValid = true

  for (const field of stepSchema) {
    if (!isFieldVisible(field)) continue
    if (isFieldDisabled(field)) continue

    const error = validateField(field)
    if (error) {
      isValid = false
    }
  }

  return isValid
}

// Can go to next step?
const canGoNext = computed(() => {
  if (!isMultiStepMode.value) return false
  return currentStep.value < groupedSchemas.value.length - 1
})

// Can go to previous step?
const canGoPrevious = computed(() => {
  if (!isMultiStepMode.value) return false
  return currentStep.value > 0
})

// Is on last step?
const isLastStep = computed(() => {
  if (!isMultiStepMode.value) return true
  return currentStep.value === groupedSchemas.value.length - 1
})

// Go to next step
const goNext = () => {
  if (!canGoNext.value) return

  // Validate current step first
  if (!validateCurrentStep()) {
    return
  }

  currentStep.value++
  emit('onStepChange', currentStep.value)
}

// Go to previous step
const goPrevious = () => {
  if (!canGoPrevious.value) return
  currentStep.value--
  emit('onStepChange', currentStep.value)
}

// Go to specific step (via timeline click)
const goToStep = (step: TimelineStep, index: number) => {
  // Only allow going back or to already completed steps
  if (index <= currentStep.value) {
    currentStep.value = index
    emit('onStepChange', currentStep.value)
  }
}

// Handle form submit
const handleSubmit = async () => {
  // For multi-step mode, validate current step first
  if (isMultiStepMode.value && !isLastStep.value) {
    goNext()
    return
  }

  try {
    await formSubmit()
  } catch (error) {
    // Error handling is done in useForm, we catch here to prevent modal closing
  }
}

// Handle cancel
const handleCancel = () => {
  emit('onCancel')
  // If inside a modal, close it
  if (modalContext) {
    modalContext?.close?.()
  }
}
</script>

<template>
  <form :class="['form-container', props.class]" @submit.prevent="handleSubmit">
    <div v-if="isMultiStepMode && timelineSteps.length > 0" class="form-timeline mb-18">
      <Timeline
        :steps="timelineSteps"
        :activeStep="currentStep"
        direction="horizontal"
        :textPosition="timelineTextPosition"
        :clickable="true"
        @step-click="goToStep" />
    </div>

    <div v-if="!isGroupedMode" class="form-fields-single">
      <FormFields
        :schema="schema as IForm[]"
        :values="formValues"
        :errors="errors"
        :variant="variant"
        :size="size"
        :rounded="rounded"
        :className="className"
        :isUpdate="isUpdate"
        :isFieldVisible="isFieldVisible"
        :isFieldDisabled="isFieldDisabled"
        :isFieldReadonly="isFieldReadonly"
        @change="onFieldChange"
        @addonAction="(action: string) => emit('onAddonAction', action)" />
    </div>

    <div v-else-if="isGroupedMode && !isMultiStepMode" class="form-groups space-y-6">
      <div
        v-for="(groupSchema, groupIndex) in groupedSchemas"
        :key="groupIndex"
        :class="['form-group border rounded-lg overflow-hidden', groupClass]">
        <div
          v-if="groupsHeadings?.[groupIndex]"
          :class="['form-group-header bg-muted/50 px-6 py-4 border-b', headerClass]">
          <h3 class="text-base font-semibold text-foreground">
            {{ groupsHeadings[groupIndex] }}
          </h3>
          <p
            v-if="groupHeadingsDescription?.[groupIndex]"
            class="text-sm text-muted-foreground mt-1">
            {{ groupHeadingsDescription[groupIndex] }}
          </p>
        </div>

        <div class="form-group-body p-6">
          <FormFields
            :schema="groupSchema"
            :values="formValues"
            :errors="errors"
            :variant="variant"
            :size="size"
            :rounded="rounded"
            :className="className"
            :isUpdate="isUpdate"
            :isFieldVisible="isFieldVisible"
            :isFieldDisabled="isFieldDisabled"
            :isFieldReadonly="isFieldReadonly"
            @change="onFieldChange"
            @addonAction="(action: string) => emit('onAddonAction', action)" />
        </div>
      </div>
    </div>

    <div v-else-if="isMultiStepMode" class="form-step">
      <div v-if="tabs?.[currentStep]" :class="['form-step-header mb-6', headerClass]">
        <h2 class="text-lg font-semibold text-foreground">
          {{ tabs[currentStep].title }}
        </h2>
        <p v-if="tabs[currentStep].description" class="text-sm text-muted-foreground mt-1">
          {{ tabs[currentStep].description }}
        </p>
      </div>

      <FormFields
        :schema="currentStepSchema"
        :values="formValues"
        :errors="errors"
        :variant="variant"
        :size="size"
        :rounded="rounded"
        :className="className"
        :isUpdate="isUpdate"
        :isFieldVisible="isFieldVisible"
        :isFieldDisabled="isFieldDisabled"
        :isFieldReadonly="isFieldReadonly"
        @change="onFieldChange"
        @addonAction="(action: string) => emit('onAddonAction', action)" />
    </div>

    <slot
      :values="formValues"
      :errors="errors"
      :isSubmitting="isSubmitting"
      :handleSubmit="handleSubmit" />

    <div
      v-if="footer"
      :class="[
        'form-footer flex items-center justify-end gap-3',
        footerClass,
        isInsideModal
          ? 'sticky bottom-0 z-20 bg-body pt-4 border-t border-border/75 -mx-4 px-4  mt-8'
          : 'mt-6',
      ]">
      <Button
        v-if="shouldShowCancel"
        type="button"
        variant="outline"
        :text="cancelText"
        :disabled="loading || isSubmitting"
        @click="handleCancel" />

      <Button
        v-if="isMultiStepMode && canGoPrevious"
        type="button"
        variant="outline"
        icon="lucide:arrow-left"
        text="Previous"
        @click="goPrevious" />

      <Button
        v-if="isMultiStepMode && !isLastStep"
        type="button"
        variant="primary"
        text="Next"
        iconRight="lucide:arrow-right"
        @click="goNext" />

      <Button
        v-else
        type="submit"
        variant="primary"
        :text="submitText"
        v-bind="submitProps"
        :loading="loading || isSubmitting" />
    </div>
  </form>
</template>

<style scoped>
.form-container {
  width: 100%;
}
</style>
