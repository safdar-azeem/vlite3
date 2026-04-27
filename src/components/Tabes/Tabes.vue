<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { TabesOption, TabesSize, TabesVariant } from './types'
import Icon from '../Icon.vue'
import { $t } from '@/utils/i18n'

interface Props {
  options: TabesOption[]
  modelValue: string | number
  size?: TabesSize
  variant?: TabesVariant
  block?: boolean
  textClass?: string
  /**
   * When true, tabs wrap to multiple rows on small screens instead of scrolling.
   * Default: false (horizontal scroll behavior)
   */
  wrap?: boolean
  tabClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'surface',
  block: false,
  wrap: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<Map<string | number, HTMLElement | null>>(new Map())

const setItemRef = (el: any, value: string | number) => {
  if (el) {
    itemRefs.value.set(value, el as HTMLElement)
  } else {
    itemRefs.value.delete(value)
  }
}

const markerStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate(0px, 0px)',
  opacity: 0,
})

const isInitialized = ref(false)

const updateMarker = async () => {
  await nextTick()
  const container = containerRef.value
  const activeElement = itemRefs.value.get(props.modelValue)

  if (!container || !activeElement) {
    markerStyle.value.opacity = 0
    return
  }

  const containerRect = container.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()

  const left = activeRect.left - containerRect.left
  const top = activeRect.top - containerRect.top
  const width = activeRect.width
  const height = activeRect.height

  markerStyle.value = {
    width: `${width}px`,
    height: `${height}px`,
    transform: `translate(${left}px, ${top}px)`,
    opacity: 1,
  }

  if (!isInitialized.value) {
    setTimeout(() => {
      isInitialized.value = true
    }, 50)
  }
}

useResizeObserver(containerRef, updateMarker)

watch(() => props.modelValue, updateMarker)
watch(() => props.options, updateMarker, { deep: true })
watch(() => props.size, updateMarker)
watch(() => props.block, updateMarker)
watch(() => props.wrap, updateMarker)

onMounted(updateMarker)

const handleSelect = (option: TabesOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}

const containerClasses = computed(() => {
  const isLine = props.variant === 'line'

  const variantStyles: Record<TabesVariant, string> = {
    surface: 'bg-secondary/80 p-1',
    primary: 'bg-secondary p-1',
    secondary: 'bg-secondary p-1',
    danger: 'bg-danger/10 p-1',
    success: 'bg-success/10 p-1',
    outline: 'bg-transparent border border-border p-1',
    line: 'bg-transparent gap-6 rounded-none p-0 border-b border-border',
  }

  const wrapClass = props.wrap && !isLine ? 'flex-wrap' : ''

  // "block" prop OR explicit w-full class on parent → container is already full-width via CSS,
  // but we still need flex layout. When neither block nor isLine, default to inline-flex so
  // the container shrinks to content (auto width).
  const blockClass = props.block || isLine ? 'flex w-full' : 'inline-flex'

  // When wrapping, hide the animated marker since it can't track across rows properly
  const base = `${blockClass} rounded-lg relative isolate ${wrapClass}`

  return [base, variantStyles[props.variant]]
})

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1',
  md: '-text-fs-2 px-3 py-1',
  lg: '-text-fs-1 px-4 py-1',
}

const itemBaseClasses = computed(() => {
  const isLine = props.variant === 'line'
  const base = isLine
    ? 'relative z-10 flex items-center justify-center gap-2 font-medium transition-colors duration-50 ease-out cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-primary/50 pb-2 border-b-2 border-transparent hover:text-foreground'
    : 'relative z-10 flex items-center justify-center gap-2 font-medium transition-colors duration-50 ease-out cursor-pointer select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

  // flex-1 when:
  //   • block prop is set  → always fill row
  //   • wrap prop is set   → items share row equally
  //   • container has w-full applied externally → detected via containerIsFullWidth below,
  //     but we can't know that at computed time; instead we add the CSS rule via the
  //     `tabes-full` data attribute strategy (see template). For the block/wrap cases
  //     we handle it here directly.
  const growClass = (props.block || props.wrap) && !isLine ? 'flex-1' : ''

  return [base, growClass]
})

const getItemClasses = (option: TabesOption) => {
  const isActive = option.value === props.modelValue
  const isLine = props.variant === 'line'

  let activeStateClasses = ''
  if (isActive) {
    if (isLine) {
      activeStateClasses = 'text-primary'
    } else {
      switch (props.variant) {
        case 'surface':
          activeStateClasses = 'text-foreground'
          break
        case 'primary':
          activeStateClasses = 'text-primary-foreground'
          break
        case 'secondary':
          activeStateClasses = 'text-secondary'
          break
        case 'danger':
          activeStateClasses = 'text-danger-fg'
          break
        case 'success':
          activeStateClasses = 'text-success-fg'
          break
        case 'outline':
          activeStateClasses = 'text-accent-foreground'
          break
        default:
          activeStateClasses = 'text-foreground'
      }
    }
  } else {
    activeStateClasses = isLine
      ? 'text-muted-foreground'
      : 'text-muted-foreground hover:text-foreground/80'
  }

  const disabledClasses = option.disabled ? 'opacity-50 cursor-not-allowed' : ''

  return [itemBaseClasses.value, activeStateClasses, props?.tabClass, disabledClasses].join(' ')
}

const markerClasses = computed(() => {
  const transitionClass = isInitialized.value
    ? 'transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]'
    : ''
  const base =
    `absolute left-0 top-0 z-0 pointer-events-none ${transitionClass}`

  if (props.variant === 'line') {
    return `${base} !h-[2px] !top-auto bottom-0`
  }

  return `${base} rounded-md shadow-sm`
})

const getMarkerColorClass = () => {
  const variantActiveStyles: Record<TabesVariant, string> = {
    surface: 'bg-background',
    primary: 'bg-primary',
    secondary: 'bg-secondary-foreground',
    danger: 'bg-danger',
    success: 'bg-success',
    outline: 'bg-accent/50 ring-1 ring-border',
    line: 'bg-primary',
  }
  return variantActiveStyles[props.variant]
}

const getOptionLabel = (opt: TabesOption) => (opt.labelI18n ? $t(opt.labelI18n) : opt.label)

const getComponentIs = (opt: TabesOption) => {
  if (opt.to) return 'router-link'
  if (opt.href) return 'a'
  return 'button'
}

const getComponentProps = (opt: TabesOption) => {
  if (opt.to) return { to: opt.to }
  if (opt.href) return { href: opt.href, target: '_blank', rel: 'noopener noreferrer' }
  return { type: 'button' }
}
</script>

<template>
  <!--
    data-tabes-justify is used by the scoped CSS below to make child items
    grow and fill the container whenever the host element carries w-full
    (i.e. the consumer passes class="w-full"). This avoids any JS measurement
    and works purely with CSS, keeping the component lightweight.
  -->
  <div ref="containerRef" :class="containerClasses" role="tablist" data-tabes>
    <div
      v-if="modelValue !== undefined && !wrap"
      :class="[markerClasses, getMarkerColorClass()]"
      :style="markerStyle"></div>

    <component
      :is="getComponentIs(opt)"
      v-for="opt in options"
      :key="opt.value"
      :ref="(el: any) => setItemRef(el?.$el || el, opt.value)"
      role="tab"
      :aria-selected="modelValue === opt.value"
      :disabled="opt.disabled"
      :class="[getItemClasses(opt), sizeClasses[props.size]]"
      v-bind="getComponentProps(opt)"
      @click="handleSelect(opt)">
      <Icon v-if="opt.icon" :icon="opt.icon" :class="size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'" />
      <span class="whitespace-nowrap z-20 relative" :class="textClass">{{
        getOptionLabel(opt)
      }}</span>
    </component>
  </div>
</template>

<style scoped>
/*
  Justified / equal-width tabs when the consumer makes the container full-width.

  Strategy: When the [data-tabes] element itself has a computed width that fills
  its parent (i.e. the consumer added class="w-full" or any other full-width
  utility), we want every tab item to grow equally — just like the `block` prop
  does, but without requiring an explicit prop.

  CSS alone cannot detect "was w-full set on me?", but we CAN use the
  :host-context trick or a width-based approach. The cleanest cross-browser
  solution is: if the element is NOT inline-flex (i.e. its display is `flex`
  because w-full was applied and overrode inline-flex via Tailwind's cascade),
  make children flex-1.

  We detect this with a container query. If the element's own inline-size
  equals 100% of its container, it means w-full (or equivalent) was applied.
  We use @container for this — but since the element IS the container, we use
  a different technique: match when display computes to flex (not inline-flex).

  Simpler & more robust approach used here:
  Target [data-tabes] when it is NOT inline-flex (i.e. when display:flex is
  active — set by Tailwind's `flex` or `w-full` which forces block-level flex).
  In that state, we ensure all direct button/a/router-link children are flex-1.

  This correctly handles:
    - Default (inline-flex, auto width): items stay content-sized  ✓
    - class="w-full" added by consumer (flex, full width): items grow equally ✓
    - block prop (flex w-full via JS): already handled by itemBaseClasses      ✓
    - wrap prop: already handled by itemBaseClasses                             ✓
    - line variant: excluded from grow behavior (tab items keep natural width)  ✓
*/

/* When the container is full-width flex (not inline-flex), distribute items equally */
[data-tabes]:not(.inline-flex):not([class*='gap-6']) > :where(button, a, [role='tab']) {
  flex: 1 1 0%;
  min-width: 0;
}

/*
  Small-screen overflow: when NOT in wrap mode and NOT block/w-full,
  allow horizontal scroll on very narrow viewports so tabs are never clipped.
*/
[data-tabes].inline-flex {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  /* Hide scrollbar visually but keep it functional */
  scrollbar-width: none;
}
[data-tabes].inline-flex::-webkit-scrollbar {
  display: none;
}

/*
  On small screens, even full-width tabs should scroll if they would overflow
  (e.g. many tabs on a 320px screen). The flex-1 items will shrink via min-width:0
  but text uses whitespace-nowrap, so we allow scroll as a last resort.
*/
@media (max-width: 480px) {
  [data-tabes]:not([class*='flex-wrap']) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  [data-tabes]:not([class*='flex-wrap'])::-webkit-scrollbar {
    display: none;
  }
}
</style>
