<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const props = withDefaults(
  defineProps<{
    /** dayjs-compatible format string for the time portion. Default: 'hh:mm:ss A' */
    timeFormat?: string
    /** dayjs-compatible format string for the date portion. Default: 'dddd, MMMM D, YYYY' */
    dateFormat?: string
    /** Whether to render the time heading. Default: true */
    showTime?: boolean
    /** Whether to render the date paragraph. Default: true */
    showDate?: boolean
    /**
     * Milliseconds between each clock tick.
     * Reactive — changing this prop will immediately restart the interval.
     * Default: 1000
     */
    tickInterval?: number
    /** Additional Tailwind/CSS classes applied to the time <h2> element */
    timeClass?: string
    /** Additional Tailwind/CSS classes applied to the date <p> element */
    dateClass?: string
    /** Additional Tailwind/CSS classes applied to the root wrapper <div> */
    wrapperClass?: string
  }>(),
  {
    timeFormat: 'hh:mm:ss A',
    dateFormat: 'dddd, MMMM D, YYYY',
    showTime: true,
    showDate: true,
    tickInterval: 1000,
    timeClass: '',
    dateClass: '',
    wrapperClass: '',
  }
)

// ── reactive clock state ───────────────────────────────────
const currentTime = ref(new Date())

// ── interval management ────────────────────────────────────
// Keeping the timer id in a plain variable (NOT ref/reactive) — it is a
// plain numeric handle, not reactive state. Wrapping it would add
// unnecessary proxy overhead (performance directive: no deep proxy trap).
let timer: ReturnType<typeof setInterval> | undefined

function startTimer(interval: number) {
  // Always clear any existing timer before starting a new one
  // (performance directive: memory leak prevention — always clean up intervals)
  if (timer !== undefined) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, interval)
}

// Watch tickInterval so changing the prop restarts the interval correctly.
// This is what fixes the "Custom Tick Interval" not working — previously the
// interval was started once in onMounted and never reacted to prop changes.
watch(
  () => props.tickInterval,
  (newInterval) => {
    startTimer(newInterval)
  }
)

onMounted(() => {
  startTimer(props.tickInterval)
})

// Performance directive: memory leak prevention — always clean up
onUnmounted(() => {
  if (timer !== undefined) {
    clearInterval(timer)
  }
})

// ── formatted display values ───────────────────────────────
const formattedTime = computed(() => dayjs(currentTime.value).format(props.timeFormat))
const formattedDate = computed(() => dayjs(currentTime.value).format(props.dateFormat))
</script>

<template>
  <!--
    Performance directive: GPU layer promotion.
    will-change: transform isolates repaints from the rest of the DOM.
    contain: layout style bounds the layout/style recalculation scope.
  -->
  <div
    class="flex flex-col items-center z-10 w-full"
    :class="wrapperClass"
    style="will-change: transform; contain: layout style">
    <!-- Time display -->
    <h2
      v-if="showTime"
      class="text-5xl md:text-6xl font-extralight text-foreground tracking-tight tabular-nums"
      :class="timeClass">
      {{ formattedTime }}
    </h2>

    <!-- Date display -->
    <p
      v-if="showDate"
      class="text-fs-1 font-normal text-muted-foreground mt-2.5 tracking-wide"
      :class="dateClass">
      {{ formattedDate }}
    </p>
  </div>
</template>
