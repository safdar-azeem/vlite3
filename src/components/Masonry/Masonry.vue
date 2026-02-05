<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { MasonryProps } from './types'
import { MASONRY_BREAKPOINTS } from './types'
import { debounce } from '@/utils'

const props = withDefaults(defineProps<MasonryProps>(), {
  cols: () => ({ default: 1, sm: 2, lg: 3 }),
  gap: 16,
  tag: 'div',
  itemKey: 'id',
})

const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
const resizeObserver = ref<ResizeObserver | null>(null)

const updateWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
  }
}

// Compute current column count based on width and breakpoints
const columnCount = computed(() => {
  // If cols is just a number, fixed columns
  if (typeof props.cols === 'number') return props.cols

  const width = containerWidth.value
  // Default to 1 if 0 width (initial render/SSR)
  if (!width) return props.cols.default || 1

  let count = props.cols.default || 1

  // Sort breakpoints to find the largest matching one
  const sortedBreakpoints = Object.keys(props.cols)
    .map((k) => {
      let px = 0
      if (typeof k === 'number' || !isNaN(Number(k))) {
        px = Number(k)
      } else if (k in MASONRY_BREAKPOINTS) {
        px = MASONRY_BREAKPOINTS[k]
      }
      return { k, px, val: props.cols[k as keyof typeof props.cols] }
    })
    .filter((bp) => bp.val !== undefined)
    .sort((a, b) => a.px - b.px)

  // Iterate to find the highest match
  for (const bp of sortedBreakpoints) {
    if (width >= bp.px) {
      count = bp.val
    }
  }

  return count || 1
})

// Distribute items into columns
const columns = computed(() => {
  const count = columnCount.value
  // Initialize columns
  const result: any[][] = Array.from({ length: count }, () => [])

  // Round Robin Distribution (Fastest O(N))
  // Optimized for stability: only appending items changes the last arrays,
  // unless column count changes.
  const len = props.data.length
  for (let i = 0; i < len; i++) {
    // Store both data and original index
    result[i % count].push({
      data: props.data[i],
      index: i,
    })
  }

  // Note: We avoid .forEach for slightly better raw perf on thousands of items
  return result
})

// Lifecycle
onMounted(() => {
  // Initial measure
  updateWidth()

  const onResize = debounce((entries: ResizeObserverEntry[]) => {
    const entry = entries[0]
    if (entry) {
      containerWidth.value = entry.contentRect.width
    }
  }, 100)

  resizeObserver.value = new ResizeObserver(onResize)
  if (containerRef.value) {
    resizeObserver.value.observe(containerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
})

// Helpers for keys
const getItemKey = (wrapper: any, index: number) => {
  // If wrapper has data property (which it should), use it
  const item = wrapper.data
  if (item && typeof item === 'object' && props.itemKey in item) {
    return item[props.itemKey]
  }
  return index
}
</script>

<template>
  <component :is="tag" ref="containerRef" class="flex w-full" :style="{ gap: `${gap}px` }">
    <div
      v-for="(col, colIndex) in columns"
      :key="colIndex"
      class="flex flex-col flex-1 min-w-0"
      :style="{ gap: `${gap}px` }"
      role="list">
      <div
        v-for="(wrapper, listIndex) in col"
        :key="getItemKey(wrapper, listIndex)"
        class="masonry-item"
        role="listitem">
        <slot :data="wrapper.data" :index="wrapper.index" :colIndex="colIndex"></slot>
      </div>
    </div>
  </component>
</template>

<style scoped>
/* 
   Content Visibility Optimization 
   Allows browser to skip layout/paint for off-screen items.
   'content-visibility: auto' is the key for scroll performance with large DOMs.
   'contain-intrinsic-size' provides a placeholder size to minimize scrollbar jumpiness.
   We assume a rough average height of 150px-300px for masonry items.
*/
.masonry-item {
  content-visibility: auto;
  contain-intrinsic-size: 1px 200px;
}
</style>
