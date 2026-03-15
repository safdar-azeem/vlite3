<script setup lang="ts">
import { computed, ref, watch, inject, onMounted, onUnmounted } from 'vue'
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
import { Timeline } from '../Timeline'
import type { TimelineStep } from '@/types'
import { useVLiteConfig } from '@/core'

interface Props {
  schema: IForm[] | IForm[][]
  values?: Record<string, any>
  variant?: InputVariant
  size?: InputSize
  rounded?: InputRounded
  loading?: boolean
  footer?: boolean
  groupsHeadings?: string[]
  groupHeadingsDescription?: string[]
  tabs?: IFormStep[]
  submitText?: string
  submitProps?: ButtonProps
  cancelText?: string
  showCancel?: boolean
  isUpdate?: boolean
  folderId?: string
  class?: string
  className?: string
  groupClass?: string
  headerClass?: string
  footerClass?: string
  timelineTextPosition?: TimelineTextPosition
  emitFields?: string[]
  showRequiredAsterisk?: boolean
  /** Pin footer to bottom of viewport/container */
  stickyFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  values: () => ({}),
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
  timelineTextPosition: 'right',
  emitFields: () => ['__typename'],
  stickyFooter: true,
})

const emit = defineEmits<{
  (e: 'onSubmit', payload: IFormSubmitPayload, close: () => void): void
  (e: 'onCancel'): void
  (e: 'onStepChange', step: number): void
  (e: 'onAddonAction', action: string): void
}>()

const modalContext = inject<{ close: () => void; setSubmitting?: (val: boolean) => void } | null>(
  'modal-context',
  null
)

const vliteConfig = useVLiteConfig()
const globalFormConfig = computed(() => vliteConfig?.components?.form || {})

const resolvedVariant = computed(() => props.variant ?? globalFormConfig.value.variant ?? 'outline')
const resolvedSize = computed(() => props.size ?? globalFormConfig.value.size ?? 'md')
const resolvedRounded = computed(() => props.rounded ?? globalFormConfig.value.rounded ?? 'md')
const resolvedShowRequiredAsterisk = computed(
  () => props.showRequiredAsterisk ?? globalFormConfig.value.showRequiredAsterisk ?? true
)

const shouldShowCancel = computed(() => props.showCancel || !!modalContext)
const isInsideModal = computed(() => !!modalContext)

// Whether to render footer as sticky
const isFooterSticky = computed(() => props.stickyFooter)

// Intersection Observer: toggle shadow when footer is actually "stuck"
const footerRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)
const isFooterStuck = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinelRef.value) return
  observer = new IntersectionObserver(
    ([entry]) => {
      // When the sentinel (spacer at bottom of form content) is NOT visible,
      // the footer is stuck to the viewport/container boundary.
      isFooterStuck.value = !entry.isIntersecting
    },
    { threshold: 0 }
  )
  observer.observe(sentinelRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})

const isGroupedMode = computed(() => {
  if (!props.schema || props.schema.length === 0) return false
  return Array.isArray(props.schema[0])
})

const isMultiStepMode = computed(() => {
  return props.tabs && props.tabs.length > 0 && isGroupedMode.value
})

const currentStep = ref(0)

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

const groupedSchemas = computed((): IForm[][] => {
  if (!isGroupedMode.value) {
    return [props.schema as IForm[]]
  }
  return props.schema as IForm[][]
})

const currentStepSchema = computed((): IForm[] => {
  if (!isMultiStepMode.value) return []
  return groupedSchemas.value[currentStep.value] || []
})

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
  handleSubmit: formSubmit,
} = useForm({
  schema: props.schema,
  values: props.values,
  isUpdate: props.isUpdate,
  folderId: props.folderId,
  emitFields: props.emitFields,
  onSubmit: (payload) => {
    emit('onSubmit', payload, modalContext?.close || (() => {}))
  },
})

watch(
  () => props.loading || isSubmitting.value,
  (val) => {
    if (modalContext?.setSubmitting) {
      modalContext.setSubmitting(val)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (modalContext?.setSubmitting) {
    modalContext.setSubmitting(false)
  }
})

watch(
  () => props.values,
  (newValues) => {
    if (newValues) {
      // Re-initialize is handled in useForm watch
    }
  },
  { deep: true }
)

const onFieldChange = (name: string, payload: { value: any; data?: any }) => {
  handleFieldChange(name, payload.value, payload.data)
}

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

const canGoNext = computed(() => {
  if (!isMultiStepMode.value) return false
  return currentStep.value < groupedSchemas.value.length - 1
})

const canGoPrevious = computed(() => {
  if (!isMultiStepMode.value) return false
  return currentStep.value > 0
})

const isLastStep = computed(() => {
  if (!isMultiStepMode.value) return true
  return currentStep.value === groupedSchemas.value.length - 1
})

const goNext = () => {
  if (!canGoNext.value) return
  if (!validateCurrentStep()) return
  currentStep.value++
  emit('onStepChange', currentStep.value)
}

const goPrevious = () => {
  if (!canGoPrevious.value) return
  currentStep.value--
  emit('onStepChange', currentStep.value)
}

const goToStep = (step: TimelineStep, index: number) => {
  if (index <= currentStep.value) {
    currentStep.value = index
    emit('onStepChange', currentStep.value)
  }
}

/**
 * Handles both Enter-key form submission and explicit button clicks.
 * In multi-step mode on intermediate steps, always advances to next step.
 * On the last step (or non-multi-step), performs full validation and submits.
 */
const handleSubmit = async () => {
  if (isMultiStepMode.value) {
    // Intermediate step in create mode → go next
    if (!isLastStep.value && !props.isUpdate) {
      goNext()
      return
    }

    // Update mode or last step → validate all steps and submit
    const isValid = validateAll()
    if (!isValid) {
      const firstErrorStepIndex = groupedSchemas.value.findIndex((group) =>
        group.some((field) => !!errors.value[field.name])
      )
      if (firstErrorStepIndex !== -1 && firstErrorStepIndex !== currentStep.value) {
        currentStep.value = firstErrorStepIndex
        emit('onStepChange', currentStep.value)
      }
      return
    }
  }

  try {
    await formSubmit()
  } catch (error) {
    // Errors handled inside useForm; catch here to prevent unhandled rejection
  }
}

/**
 * Intercepts the native Enter keydown on the form to ensure it always
 * triggers handleSubmit (next step or submit) rather than relying on the
 * browser's implicit submit which can be swallowed by embedded components
 * like Dropdown or DatePicker.
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter') return

  const target = event.target as HTMLElement
  const tag = target.tagName.toLowerCase()

  // Allow Enter to create newlines in textareas
  if (tag === 'textarea') return

  // Allow Enter inside buttons so they fire their own click handlers
  if (tag === 'button') return

  event.preventDefault()
  handleSubmit()
}

/**
 * Cmd+S / Ctrl+S keyboard shortcut triggers submit with immediate
 * loading-state feedback regardless of scroll position.
 */
const handleSaveShortcut = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault()
    handleSubmit()
  }
}

const handleCancel = () => {
  emit('onCancel')
  if (modalContext) {
    modalContext?.close?.()
  }
}
</script>

<template>
  <form
    :class="['form-container ', props.class]"
    @submit.prevent="handleSubmit"
    @keydown="handleKeydown"
    @keydown.meta.s.prevent="handleSaveShortcut"
    @keydown.ctrl.s.prevent="handleSaveShortcut">
    <div
      v-if="isMultiStepMode && timelineSteps.length > 0"
      class="form-timeline"
      :class="timelineTextPosition == 'right' ? 'mb-6.5' : 'mb-13'">
      <Timeline
        :steps="timelineSteps"
        :activeStep="currentStep"
        direction="horizontal"
        :textPosition="timelineTextPosition"
        :clickable="true"
        @step-click="goToStep" />
    </div>

    <!-- Form content wrapper: adds bottom padding so sticky footer never overlaps last field -->
    <div :class="footer && isFooterSticky ? 'pb-2' : ''">
      <div v-if="!isGroupedMode" class="form-fields-single">
        <FormFields
          :schema="schema as IForm[]"
          :values="formValues"
          :errors="errors"
          :variant="resolvedVariant"
          :size="resolvedSize"
          :rounded="resolvedRounded"
          :className="className"
          :isUpdate="isUpdate"
          :showRequiredAsterisk="resolvedShowRequiredAsterisk"
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
          :class="['form-group border rounded overflow-hidden bg-body', groupClass]">
          <div
            v-if="groupsHeadings?.[groupIndex]"
            :class="['form-group-header bg-muted/50 px-4 py-2.5 border-b', headerClass]">
            <h3 class="text-base font-semibold text-foreground">
              {{ groupsHeadings[groupIndex] }}
            </h3>
            <p
              v-if="groupHeadingsDescription?.[groupIndex]"
              class="text-sm text-muted-foreground mt-1">
              {{ groupHeadingsDescription[groupIndex] }}
            </p>
          </div>

          <div class="form-group-body p-4.5">
            <FormFields
              :schema="groupSchema"
              :values="formValues"
              :errors="errors"
              :variant="resolvedVariant"
              :size="resolvedSize"
              :rounded="resolvedRounded"
              :className="className"
              :isUpdate="isUpdate"
              :showRequiredAsterisk="resolvedShowRequiredAsterisk"
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
          :variant="resolvedVariant"
          :size="resolvedSize"
          :rounded="resolvedRounded"
          :className="className"
          :isUpdate="isUpdate"
          :showRequiredAsterisk="resolvedShowRequiredAsterisk"
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

      <!--
        Sentinel element: sits at the very end of the scrollable content.
        The IntersectionObserver watches this element. When it leaves the
        visible area the footer is truly "stuck", so we apply the shadow.
        When it becomes visible again (user scrolled to the bottom), the
        shadow disappears and the footer looks like a natural page element.
      -->
      <div ref="sentinelRef" class="form-scroll-sentinel h-px w-full" aria-hidden="true" />
    </div>

    <div
      v-if="footer"
      ref="footerRef"
      :class="[
        'form-footer flex items-center gap-3 z-20',
        footerClass,
        isMultiStepMode ? 'justify-between' : 'justify-end',
        // Sticky positioning
        isFooterSticky
          ? 'sticky bottom-0 bg-background/95 backdrop-blur-sm pt-3 pb-2 -mx-0.5 px-0.5'
          : 'mt-6',
        // Inside modal: extend to modal edges and add top border always
        isInsideModal ? '-mx-4 px-4 pb-0!' : '',
        // Shadow only while actually stuck (sentinel has scrolled out of view)
        isFooterSticky && isFooterStuck ? '' : isFooterSticky ? 'border-t border-transparent' : '',
        // Non-sticky inside modal keeps the original border styling
        !isFooterSticky && isInsideModal ? 'border-t border-border/75 mt-8' : '',
        !isFooterSticky && !isInsideModal ? 'mt-6' : '',
      ]">
      <div class="flex items-center gap-3">
        <Button
          v-if="shouldShowCancel"
          type="button"
          variant="outline"
          :text="cancelText"
          :disabled="loading || isSubmitting"
          @click="handleCancel" />

        <Button
          v-if="isMultiStepMode && isUpdate && !isLastStep"
          type="button"
          variant="primary"
          :text="submitText"
          v-bind="submitProps"
          :loading="loading || isSubmitting"
          @click="handleSubmit" />
      </div>

      <div class="flex items-center gap-3" :class="isMultiStepMode && 'ml-auto'">
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
          :variant="isUpdate ? 'outline' : 'primary'"
          text="Next"
          iconRight="lucide:arrow-right"
          @click="goNext" />

        <Button
          v-if="!isMultiStepMode || isLastStep"
          type="submit"
          variant="primary"
          :text="submitText"
          v-bind="submitProps"
          :loading="loading || isSubmitting" />
      </div>
    </div>
  </form>
</template>

<style scoped>
.form-container {
  width: 100%;
}
</style>
