<script setup lang="ts">
import { computed, ref, watch, inject, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
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
import FormField from './FormField.vue'
import Button from '@/components/Button.vue'
import BackButton from '@/components/BackButton.vue'
import { Timeline } from '../Timeline'
import type { TimelineStep } from '@/types'
import { useVLiteConfig } from '@/core'
import { $t } from '@/utils/i18n'
import { resolveFieldType } from './utils/form.utils'

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
  groupBodyClass?: string
  groupContainerClass?: string
  headerClass?: string
  footerClass?: string
  timelineTextPosition?: TimelineTextPosition
  emitFields?: string[]
  showRequiredAsterisk?: boolean
  /** Pin footer to bottom of viewport/container */
  stickyFooter?: boolean
  isPage?: boolean
  pageTitle?: string
  pageTitleI18n?: string
  pageTitleClass?: string
  pageHeaderClass?: string
  backButtonProps?: ButtonProps
  backButtonPath?: string
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
  groupBodyClass: '',
  groupContainerClass: '',
  headerClass: '',
  footerClass: '',
  timelineTextPosition: 'right',
  emitFields: () => ['__typename'],
  stickyFooter: true,
  isPage: false,
  pageTitleClass: 'text-2xl font-bold',
  pageHeaderClass: '',
  backButtonProps: () => ({ size: 'sm', variant: 'ghost', icon: 'heroicons-solid:arrow-left' }),
})

const emit = defineEmits<{
  (e: 'onSubmit', payload: IFormSubmitPayload, close: () => void): void
  (e: 'onCancel'): void
  (e: 'onStepChange', step: number): void
  (e: 'onAddonAction', action: string): void
  (e: 'onBack'): void
}>()

const modalContext = inject<{
  close: () => void
  setSubmitting?: (val: boolean) => void
  registerFormFooter?: (active: boolean) => void
} | null>('modal-context', null)

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

// Footer is sticky when:
// 1. The explicit stickyFooter prop is passed, OR
// 2. The form is rendered inside a Modal (always sticky in that context)
const isFooterSticky = computed(() => props.stickyFooter || isInsideModal.value)

// Notify the parent Modal that this Form has a visible sticky footer so the
// modal can zero its own bottom padding — no manual fix needed per usage site.
onMounted(() => {
  if (props.footer && isInsideModal.value) {
    modalContext?.registerFormFooter?.(true)
  }
})

onUnmounted(() => {
  if (isInsideModal.value) {
    modalContext?.registerFormFooter?.(false)
  }
})

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

// ─── ThumbnailSelector side-panel extraction ──────────────────────────────────
/**
 * Scans a flat schema and returns the first field whose resolved type is
 * 'thumbnailSelector'. Multi-step and grouped modes are intentionally excluded
 * (the thumbnail panel only applies to the single flat-schema layout) so we
 * never accidentally hide a field from a step or group.
 *
 * We re-use resolveFieldType from form.utils so dynamic type functions are
 * evaluated correctly — same context the rest of the form uses.
 */
const thumbnailField = computed<IForm | null>(() => {
  if (isGroupedMode.value) return null // Groups/multi-step: render inline as usual
  const flatSchema = props.schema as IForm[]
  return (
    flatSchema.find((f) => {
      const resolved = resolveFieldType(f, {
        values: formValues.value,
        globalValues: formValues.value,
        isUpdate: props.isUpdate,
      })
      return resolved === 'thumbnailSelector'
    }) ?? null
  )
})

/**
 * True when there is a thumbnailSelector field in a non-grouped schema.
 * Drives the side-panel layout switch.
 */
const hasThumbnailPanel = computed(() => !!thumbnailField.value)

const {
  formValues,
  errors,
  isSubmitting,
  fieldLoading,
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

const validateCurrentStep = async (): Promise<boolean> => {
  if (!isMultiStepMode.value) return true

  const stepSchema = currentStepSchema.value
  let isValid = true

  for (const field of stepSchema) {
    if (!isFieldVisible(field)) continue
    if (isFieldDisabled(field)) continue

    const error = await validateField(field)
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

const goNext = async () => {
  if (!canGoNext.value) return
  const isValid = await validateCurrentStep()
  if (!isValid) return
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
      await goNext()
      return
    }

    // Update mode or last step → validate all steps and submit
    const isValid = await validateAll()
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
    <!-- ── Page header (isPage mode) ──────────────────────────────────────── -->
    <div
      v-if="isPage"
      :class="[
        'form-page-header sticky top-0 z-30 bg-background flex items-center justify-between  pb-3.5 pt-4 -mt-4 mb-4.5',
        pageHeaderClass,
      ]">
      <div class="flex items-center gap-3">
        <BackButton
          v-bind="backButtonProps"
          :fallback="backButtonPath"
          class="max-sm:w-8 max-sm:h-8 max-sm:min-w-8 max-sm:min-h-8 max-sm:px-0 shrink-0" />
        <h1 :class="['text-foreground max-sm:text-lg text-fs-5 truncate', pageTitleClass]">
          {{ pageTitleI18n ? $t(pageTitleI18n) : pageTitle }}
        </h1>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <slot
          name="header-actions"
          :values="formValues"
          :isSubmitting="isSubmitting"
          :handleSubmit="handleSubmit"></slot>
        <Button
          type="button"
          :variant="isUpdate ? 'outline' : 'primary'"
          :text="submitText"
          v-bind="submitProps"
          :loading="loading || isSubmitting"
          @click="handleSubmit"
          class="max-sm:hidden" />
      </div>
    </div>

    <!-- ── Multi-step timeline ─────────────────────────────────────────────── -->
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

    <!-- ── Body ───────────────────────────────────────────────────────────── -->
    <div :class="footer && isFooterSticky ? 'pb-2' : ''">
      <!--
        FLAT SCHEMA — single array (no groups, no steps)
        When a thumbnailSelector field is detected, we split the layout into:
          LEFT  (flex-1)         : all regular fields
          RIGHT (min-w-[350px])  : ThumbnailSelector panel

        On small screens the thumbnail panel moves to the TOP so the user sees
        the image picker before the text fields — consistent with the task spec.

        The thumbnailSelector field is filtered OUT of the <FormFields> pass
        via the `excludeTypes` prop so it is never rendered twice.
      -->
      <div v-if="!isGroupedMode">
        <!-- Side-panel layout when thumbnailSelector is present -->
        <div v-if="hasThumbnailPanel" class="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <!--
            Thumbnail panel
            - Mobile  : order-first → renders on TOP
            - Desktop : order-last  → renders on RIGHT, min-width 350px
          -->
          <div class="w-full order-first lg:order-last lg:min-w-100 lg:max-w-[380px] shrink-0">
            <FormField
              v-if="thumbnailField && isFieldVisible(thumbnailField)"
              :field="thumbnailField"
              :value="formValues[thumbnailField.name]"
              :values="formValues"
              :errors="errors"
              :variant="resolvedVariant"
              :size="resolvedSize"
              :rounded="resolvedRounded"
              :disabled="isFieldDisabled(thumbnailField)"
              :readonly="isFieldReadonly(thumbnailField)"
              :error="errors[thumbnailField.name] || ''"
              :isUpdate="isUpdate"
              :loading="fieldLoading[thumbnailField?.name]"
              @change="(payload) => onFieldChange(thumbnailField!.name, payload)" />
          </div>

          <!-- Regular fields (thumbnailSelector excluded) -->
          <div class="flex-1 min-w-0 order-last lg:order-first">
            <FormFields
              :schema="schema as IForm[]"
              :values="formValues"
              :errors="errors"
              :fieldLoading="fieldLoading"
              :variant="resolvedVariant"
              :size="resolvedSize"
              :rounded="resolvedRounded"
              :className="className"
              :isUpdate="isUpdate"
              :showRequiredAsterisk="resolvedShowRequiredAsterisk"
              :isFieldVisible="isFieldVisible"
              :isFieldDisabled="isFieldDisabled"
              :isFieldReadonly="isFieldReadonly"
              :excludeTypes="['thumbnailSelector']"
              @change="onFieldChange"
              @addonAction="(action: string) => emit('onAddonAction', action)" />
          </div>
        </div>

        <!-- Normal flat layout (no thumbnailSelector in schema) -->
        <FormFields
          v-else
          :schema="schema as IForm[]"
          :values="formValues"
          :errors="errors"
          :fieldLoading="fieldLoading"
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

      <!-- ── Grouped schema (no steps) ──────────────────────────────────── -->
      <div
        v-else-if="isGroupedMode && !isMultiStepMode"
        class="form-groups space-y-6"
        :class="groupContainerClass">
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

          <div class="form-group-body p-4.5" :class="groupBodyClass">
            <FormFields
              :schema="groupSchema"
              :values="formValues"
              :errors="errors"
              :fieldLoading="fieldLoading"
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

      <!-- ── Multi-step schema ───────────────────────────────────────────── -->
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
          :fieldLoading="fieldLoading"
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

      <!-- Default slot — available in all modes -->
      <slot
        :values="formValues"
        :errors="errors"
        :isSubmitting="isSubmitting"
        :handleSubmit="handleSubmit" />

      <div ref="sentinelRef" class="form-scroll-sentinel h-px w-full" aria-hidden="true" />
    </div>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <div
      v-if="footer"
      ref="footerRef"
      :class="[
        'form-footer items-center gap-3 z-20 rounded-b-md!',
        isPage ? 'flex sm:hidden' : 'flex',
        footerClass,
        isMultiStepMode ? 'justify-between' : 'justify-end',
        // Sticky footer: always applied when inside a modal or when stickyFooter prop is set.
        // `sticky bottom-0` anchors the footer to the bottom of the nearest scrollable ancestor
        // (the modal's overflow-y-auto body), keeping it visible at all times without leaving
        // the normal document flow (unlike `fixed` which would escape the modal bounds).
        isFooterSticky
          ? 'sticky bottom-0 bg-body pt-3 pb-3 -mx-0.5 px-0.5 border-t border-border/75'
          : 'mt-6',
        // Show a subtle top shadow while content is scrolling beneath the sticky footer
        isFooterSticky && isFooterStuck ? '' : '',
        // Inside modal: extend footer flush to modal edge padding
        isInsideModal ? '-mx-4 px-4 pb-3! mt-4.5!' : '',
        // Non-sticky inside modal keeps the original border styling
        !isFooterSticky && isInsideModal ? 'border-t border-border/75 mt-5' : '',
        !isFooterSticky && !isInsideModal ? 'mt-6' : '',
      ]">
      <div class="flex gap-3 items-center">
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

      <div class="flex gap-3 items-center" :class="isMultiStepMode && 'ml-auto'">
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
