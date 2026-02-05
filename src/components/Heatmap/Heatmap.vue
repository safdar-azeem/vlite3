<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  type HeatmapProps,
  type HeatmapCell,
  type HeatmapColorScheme,
  type HeatmapLegendItem,
  type HeatmapDataPoint,
} from './types'
import Tooltip from '@/components/Tooltip.vue'
import { debounce } from '@/utils'

const props = withDefaults(defineProps<HeatmapProps>(), {
  layout: 'grid',
  interactive: true,
  showLegend: true,
  showLabels: false,
  minValue: undefined,
  maxValue: undefined,
  responsive: true,
  minCellSize: 8,
  maxCellSize: 20,
  class: '',
  cellClass: '',
  emptyCellClass: '',
})

const emit = defineEmits<{
  (e: 'cell-click', cell: HeatmapCell, event: MouseEvent): void
  (e: 'cell-hover', cell: HeatmapCell | null, event: MouseEvent): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const hoveredCell = ref<HeatmapCell | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)
const resizeObserver = ref<ResizeObserver | null>(null)

const colorSchemes: Record<HeatmapColorScheme, string[]> = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  green: ['#f0f9f4', '#a7f3d0', '#34d399', '#10b981', '#059669'],
  blue: ['#eff6ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#2563eb'],
  red: ['#fef2f2', '#fecaca', '#f87171', '#ef4444', '#dc2626'],
  purple: ['#faf5ff', '#e9d5ff', '#c084fc', '#a855f7', '#9333ea'],
  orange: ['#fff7ed', '#fed7aa', '#fb923c', '#f97316', '#ea580c'],
  grayscale: ['#f9fafb', '#e5e7eb', '#9ca3af', '#6b7280', '#374151'],
  custom: [],
}

const getColorScheme = computed(() => {
  const config = props.colorConfig || {}
  const scheme = config.scheme || 'github'

  if (scheme === 'custom' && config.colors) {
    return config.colors
  }

  if (config.minColor && config.maxColor) {
    return [config.minColor, config.maxColor]
  }

  return colorSchemes[scheme] || colorSchemes.github
})

const emptyColor = computed(() => {
  return props.colorConfig?.emptyColor || '#ebedf0'
})

const minValue = computed(() => {
  if (props.minValue !== undefined) return props.minValue
  if (props.data.length === 0) return 0
  return Math.min(...props.data.map((d) => d.value))
})

const maxValue = computed(() => {
  if (props.maxValue !== undefined) return props.maxValue
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map((d) => d.value))
})

const valueRange = computed(() => {
  return maxValue.value - minValue.value || 1
})

const normalizeValue = (value: number): number => {
  if (valueRange.value === 0) return 0
  return (value - minValue.value) / valueRange.value
}

const getColorForValue = (normalizedValue: number): string => {
  if (normalizedValue === 0) return emptyColor.value

  const colors = getColorScheme.value
  if (colors.length === 0) return emptyColor.value

  if (colors.length === 1) return colors[0]

  if (colors.length === 2) {
    const r1 = parseInt(colors[0].slice(1, 3), 16)
    const g1 = parseInt(colors[0].slice(3, 5), 16)
    const b1 = parseInt(colors[0].slice(5, 7), 16)
    const r2 = parseInt(colors[1].slice(1, 3), 16)
    const g2 = parseInt(colors[1].slice(3, 5), 16)
    const b2 = parseInt(colors[1].slice(5, 7), 16)

    const r = Math.round(r1 + (r2 - r1) * normalizedValue)
    const g = Math.round(g1 + (g2 - g1) * normalizedValue)
    const b = Math.round(b1 + (b2 - b1) * normalizedValue)

    return `rgb(${r}, ${g}, ${b})`
  }

  const index = Math.min(Math.floor(normalizedValue * (colors.length - 1)), colors.length - 1)
  return colors[index]
}

const processData = computed((): HeatmapCell[] => {
  const dataMap = new Map<string, HeatmapDataPoint>()

  props.data.forEach((point) => {
    const key = `${point.x},${point.y}`
    const existing = dataMap.get(key)
    if (!existing || point.value > existing.value) {
      dataMap.set(key, point)
    }
  })

  const cells: HeatmapCell[] = []

  if (props.layout === 'grid') {
    const config = props.gridConfig || {}
    const rows = config.rows || 7
    const cols = config.cols || Math.ceil(props.data.length / rows)

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const key = `${x},${y}`
        const dataPoint = dataMap.get(key)
        const value = dataPoint?.value || 0
        const normalizedValue = normalizeValue(value)

        cells.push({
          x,
          y,
          value,
          normalizedValue,
          displayValue: dataPoint?.displayValue || value,
          tooltip: props.tooltipConfig?.formatter
            ? props.tooltipConfig.formatter(
                {
                  x,
                  y,
                  value,
                  normalizedValue,
                },
                dataPoint || { x, y, value }
              )
            : dataPoint?.tooltip || `${value} at (${x}, ${y})`,
          ...dataPoint,
        })
      }
    }
  } else if (props.layout === 'sequential') {
    const config = props.sequentialConfig || {}
    const itemsPerRow = config.itemsPerRow || 7

    props.data.forEach((point, index) => {
      const x = index % itemsPerRow
      const y = Math.floor(index / itemsPerRow)
      const normalizedValue = normalizeValue(point.value)

      cells.push({
        x,
        y,
        value: point.value,
        normalizedValue,
        displayValue: point.displayValue || point.value,
        tooltip: props.tooltipConfig?.formatter
          ? props.tooltipConfig.formatter(
              {
                x,
                y,
                value: point.value,
                normalizedValue,
              },
              point
            )
          : point.tooltip || `${point.value}`,
        ...point,
      })
    })
  } else {
    props.data.forEach((point) => {
      const normalizedValue = normalizeValue(point.value)
      cells.push({
        x: point.x,
        y: point.y,
        value: point.value,
        normalizedValue,
        displayValue: point.displayValue || point.value,
        tooltip: props.tooltipConfig?.formatter
          ? props.tooltipConfig.formatter(
              {
                x: point.x,
                y: point.y,
                value: point.value,
                normalizedValue,
              },
              point
            )
          : point.tooltip || `${point.value}`,
        ...point,
      })
    })
  }

  return cells
})

const cells = computed(() => processData.value)

const calculateOptimalCellSize = (
  containerWidth: number,
  containerHeight: number,
  cols: number,
  rows: number,
  gap: number
): number => {
  if (containerWidth === 0 || containerHeight === 0 || cols === 0 || rows === 0) {
    return props.minCellSize
  }

  const padding = 32
  const availableWidth = Math.max(0, containerWidth - padding)
  const availableHeight = Math.max(0, containerHeight - padding)

  if (availableWidth <= 0 || availableHeight <= 0) {
    return props.minCellSize
  }

  const widthBasedSize = (availableWidth - (cols - 1) * gap) / cols
  const heightBasedSize = (availableHeight - (rows - 1) * gap) / rows

  const optimalSize = Math.min(widthBasedSize, heightBasedSize)
  const calculatedSize = Math.max(
    props.minCellSize,
    Math.min(props.maxCellSize, Math.floor(optimalSize))
  )

  return calculatedSize
}

const gridConfig = computed(() => {
  const config = props.gridConfig || {}
  const rows = config.rows || 7
  const cols = config.cols || Math.ceil(cells.value.length / rows)

  let cellSize = config.cellSize
  const gap = config.gap || 3

  if (props.responsive && !cellSize && containerWidth.value > 0) {
    cellSize = calculateOptimalCellSize(
      containerWidth.value,
      containerHeight.value,
      cols,
      rows,
      gap
    )
  } else if (!cellSize) {
    cellSize = 12
  }

  return {
    rows,
    cols,
    cellSize,
    gap,
  }
})

const sequentialConfig = computed(() => {
  const config = props.sequentialConfig || {}
  const itemsPerRow = config.itemsPerRow || 7
  const totalItems = cells.value.length
  const rows = Math.ceil(totalItems / itemsPerRow)

  let cellSize = config.cellSize
  const gap = config.gap || 3

  if (props.responsive && !cellSize && containerWidth.value > 0) {
    cellSize = calculateOptimalCellSize(
      containerWidth.value,
      containerHeight.value,
      itemsPerRow,
      rows,
      gap
    )
  } else if (!cellSize) {
    cellSize = 12
  }

  return {
    itemsPerRow,
    cellSize,
    gap,
    rows,
  }
})

const gridStyle = computed(() => {
  if (props.layout === 'grid') {
    const config = gridConfig.value
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${config.cols}, ${config.cellSize}px)`,
      gap: `${config.gap}px`,
      gridAutoRows: `${config.cellSize}px`,
    }
  } else if (props.layout === 'sequential') {
    const config = sequentialConfig.value
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${config.itemsPerRow}, ${config.cellSize}px)`,
      gap: `${config.gap}px`,
      gridAutoRows: `${config.cellSize}px`,
    }
  } else {
    return {
      display: 'grid',
      gridAutoColumns: 'auto',
      gap: '4px',
    }
  }
})

const legendItems = computed((): HeatmapLegendItem[] => {
  if (!props.showLegend) return []

  const colors = getColorScheme.value
  const steps = Math.min(colors.length, 5)
  const items: HeatmapLegendItem[] = []

  for (let i = 0; i < steps; i++) {
    const normalizedValue = i / (steps - 1)
    const value = minValue.value + normalizedValue * valueRange.value
    items.push({
      value: Math.round(value * 100) / 100,
      color: getColorForValue(normalizedValue),
      label: i === 0 ? 'Less' : i === steps - 1 ? 'More' : undefined,
    })
  }

  return items
})

const handleCellClick = (cell: HeatmapCell, event: MouseEvent) => {
  if (!props.interactive) return
  emit('cell-click', cell, event)
}

const handleCellMouseEnter = (cell: HeatmapCell, event: MouseEvent) => {
  if (!props.interactive) return
  hoveredCell.value = cell
  emit('cell-hover', cell, event)
}

const handleCellMouseLeave = () => {
  if (!props.interactive) return
  hoveredCell.value = null
  emit('cell-hover', null, null as any)
}

const updateContainerSize = () => {
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect()
    containerWidth.value = Math.max(0, rect.width)
    containerHeight.value = Math.max(0, rect.height)
  }
}

const handleResize = debounce((entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  if (entry && props.responsive) {
    containerWidth.value = Math.max(0, entry.contentRect.width)
    containerHeight.value = Math.max(0, entry.contentRect.height)
  }
}, 100)

onMounted(() => {
  nextTick(() => {
    updateContainerSize()

    if (containerRef.value) {
      resizeObserver.value = new ResizeObserver(handleResize)
      resizeObserver.value.observe(containerRef.value)
    }

    window.addEventListener('resize', updateContainerSize)
  })
})

onUnmounted(() => {
  if (resizeObserver.value && containerRef.value) {
    resizeObserver.value.unobserve(containerRef.value)
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }

  window.removeEventListener('resize', updateContainerSize)
})

watch(
  () => [containerWidth.value, containerHeight.value, props.responsive, props.data.length],
  () => {
    if (props.responsive) {
      nextTick(() => {
        updateContainerSize()
      })
    }
  }
)
</script>

<template>
  <div ref="containerRef" :class="['heatmap-container', props.class]">
    <div ref="wrapperRef" class="heatmap-wrapper">
      <div ref="gridRef" :class="['heatmap-grid', props.layout]" :style="gridStyle">
        <template v-for="(cell, index) in cells" :key="`${cell.x}-${cell.y}-${index}`">
          <Tooltip
            v-if="tooltipConfig?.enabled !== false && cell.tooltip"
            :content="cell.tooltip"
            :placement="tooltipConfig?.position || 'top'"
            triggerClass="w-full">
            <div
              :class="[
                'heatmap-cell',
                {
                  'heatmap-cell-empty': cell.value === 0,
                  'heatmap-cell-hovered': hoveredCell?.x === cell.x && hoveredCell?.y === cell.y,
                  'heatmap-cell-interactive': interactive,
                },
                cell.value === 0 ? emptyCellClass : cellClass,
              ]"
              :style="{
                backgroundColor: getColorForValue(cell.normalizedValue),
              }"
              @click="handleCellClick(cell, $event)"
              @mouseenter="handleCellMouseEnter(cell, $event)"
              @mouseleave="handleCellMouseLeave">
              <span v-if="showLabels && cell.displayValue !== undefined" class="heatmap-cell-label">
                {{ cell.displayValue }}
              </span>
            </div>
          </Tooltip>
          <div
            v-else
            :class="[
              'heatmap-cell',
              {
                'heatmap-cell-empty': cell.value === 0,
                'heatmap-cell-hovered': hoveredCell?.x === cell.x && hoveredCell?.y === cell.y,
                'heatmap-cell-interactive': interactive,
              },
              cell.value === 0 ? emptyCellClass : cellClass,
            ]"
            :style="{
              backgroundColor: getColorForValue(cell.normalizedValue),
            }"
            @click="handleCellClick(cell, $event)"
            @mouseenter="handleCellMouseEnter(cell, $event)"
            @mouseleave="handleCellMouseLeave">
            <span v-if="showLabels && cell.displayValue !== undefined" class="heatmap-cell-label">
              {{ cell.displayValue }}
            </span>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showLegend && legendItems.length > 0" class="heatmap-legend">
      <span class="heatmap-legend-label">Less</span>
      <div class="heatmap-legend-colors">
        <div
          v-for="(item, index) in legendItems"
          :key="index"
          class="heatmap-legend-item"
          :style="{ backgroundColor: item.color }"
          :title="`${item.value}`" />
      </div>
      <span class="heatmap-legend-label">More</span>
    </div>
  </div>
</template>

<style scoped>
.heatmap-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.heatmap-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
}

.heatmap-grid {
  width: fit-content;
  height: fit-content;
  transition: all 0.2s ease-in-out;
}

.heatmap-cell {
  aspect-ratio: 1 / 1;
  border-radius: 2px;
  transition: all 0.15s ease-in-out;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.heatmap-cell-interactive {
  cursor: pointer;
}

.heatmap-cell-interactive:hover {
  transform: scale(1.1);
  border-color: var(--border);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 10;
  position: relative;
}

.heatmap-cell-empty {
  opacity: 0.6;
}

.heatmap-cell-hovered {
  outline: 2px solid var(--primary);
  outline-offset: 1px;
}

.heatmap-cell-label {
  font-size: 8px;
  font-weight: 500;
  color: var(--foreground);
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  flex-shrink: 0;
}

.heatmap-legend-label {
  font-weight: 500;
}

.heatmap-legend-colors {
  display: flex;
  gap: 0.125rem;
}

.heatmap-legend-item {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--border);
}

@media (max-width: 640px) {
  .heatmap-wrapper {
    padding: 12px;
  }

  .heatmap-cell {
    border-radius: 2px;
  }

  .heatmap-cell-label {
    font-size: 7px;
  }
}

@media (min-width: 641px) and (max-width: 1023px) {
  .heatmap-wrapper {
    padding: 14px;
  }

  .heatmap-cell {
    border-radius: 2px;
  }
}

@media (min-width: 1024px) {
  .heatmap-wrapper {
    padding: 16px;
  }

  .heatmap-cell {
    border-radius: 3px;
  }
}
</style>
