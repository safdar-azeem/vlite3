<script setup lang="ts">
import { computed, inject, ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../Icon.vue'
import Tooltip from '@/components/Tooltip.vue'
import type { SidebarMenuItemSchema, SidebarMenuContext } from './types'
import { Dropdown } from '@/components/Dropdown'
import type { IDropdownOptions, IDropdownOption } from '@/types'
import { $t } from '@/utils/i18n'

interface Props {
  item: SidebarMenuItemSchema
  depth?: number
  menuOffset?: [number, number]
  itemClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
})

const context = inject<SidebarMenuContext>('sidebar-menu-ctx')
const router = useRouter()
const route = useRoute()

if (!context) {
  throw new Error('SidebarMenuItem must be used within a SidebarMenu')
}

const itemRef = ref<HTMLElement | null>(null)

const isHorizontal = computed(
  () => context.currentOrientation === 'horizontal' && props.depth === 0
)
const hasChildren = computed(() => !!props.item.children?.length)

// Render Mode Logic
const computedRenderMode = computed(() => {
  if (isHorizontal.value && hasChildren.value) return 'popover'
  if (context.compact && hasChildren.value) return 'popover'
  const mode = props.item.renderMode || context.renderMode || 'tree'
  return mode
})

const useDrilldown = computed(() => {
  if (context.renderNestedTabs && props.depth === 0) return false
  return computedRenderMode.value === 'drilldown' && hasChildren.value
})

const usePopover = computed(() => {
  if (context.renderNestedTabs && props.depth === 0) return false
  if (useDrilldown.value) return false
  return computedRenderMode.value === 'popover' && hasChildren.value
})

const itemId = computed(() => {
  if (props.item.id) return props.item.id
  if (props.item.to && typeof props.item.to === 'string') return props.item.to
  return props.item.label
})

const isExpanded = computed(() => {
  if (usePopover.value) return false
  if (useDrilldown.value) return false
  if (context.renderNestedTabs && props.depth === 0) return false
  return context.expandedItems.includes(itemId.value)
})

const showChevron = computed(() => {
  if (!hasChildren.value) return false
  if (useDrilldown.value) return false // drilldown shows its own chevron
  if (context.renderNestedTabs && props.depth === 0) return false
  return true
})

const showDrilldownChevron = computed(() => {
  return useDrilldown.value && hasChildren.value
})

/**
 * Recursively checks whether a given item or any of its descendants
 * matches the provided active id or current route path.
 */
const itemOrDescendantIsActive = (
  item: SidebarMenuItemSchema,
  activeId: string | null,
  currentPath: string
): boolean => {
  const id = item.id || (typeof item.to === 'string' ? item.to : null) || item.label

  // Direct active id match
  if (activeId && id === activeId) return true

  // Direct path match (for cases where activeItem hasn't been resolved yet)
  if (item.to) {
    const itemPath = typeof item.to === 'string' ? item.to : (item.to as any).path
    if (itemPath) {
      if (currentPath === itemPath) return true
      if (itemPath !== '/' && itemPath.length > 1 && currentPath.startsWith(itemPath)) {
        const next = currentPath[itemPath.length]
        if (!next || next === '/' || next === '?') return true
      }
    }
  }

  // Recurse into children
  if (item.children?.length) {
    return item.children.some((child) => itemOrDescendantIsActive(child, activeId, currentPath))
  }

  return false
}

const isActive = computed(() => {
  const currentPath = route?.path || ''
  const activeId = context.activeItem

  // For items with children (parent groups), check if any descendant is active
  if (hasChildren.value) {
    return itemOrDescendantIsActive(props.item, activeId, currentPath)
  }

  // Leaf item: match by activeItem id
  return activeId === itemId.value
})

const isExactlyActive = computed(() => {
  return context.activeItem === itemId.value
})

const scrollToNode = (smooth = true) => {
  if (isExactlyActive.value && itemRef.value) {
    itemRef.value.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' })
  }
}

onMounted(() => {
  if (isExactlyActive.value) {
    nextTick(() => {
      scrollToNode(false) // Instant scroll on load
    })
  }
})

watch(isExactlyActive, (isActive) => {
  if (isActive) {
    setTimeout(() => {
      scrollToNode(true) // Smooth scroll when dynamically changing
    }, 250) // Slight delay to allow any expand animations to finish
  }
})

const handleClick = (e: MouseEvent) => {
  if (props.item.disabled) return

  // Drilldown mode: clicking a parent with children drills into them
  // — no navigation, just replace sidebar content with children
  if (useDrilldown.value) {
    if (props.item.action) props.item.action(props.item)
    context.drillInto(props.item)
    return
  }

  if (context.renderNestedTabs && props.depth === 0) {
    if (props.item.action) props.item.action(props.item)

    if (props.item.to) {
      router.push(props.item.to).catch(() => {})
    } else if (props.item.href) {
      window.open(props.item.href, '_blank')
    } else if (hasChildren.value) {
      const firstChild = props.item.children?.[0]
      if (firstChild) {
        if (firstChild.to) {
          router.push(firstChild.to).catch(() => {})
        } else if (firstChild.href) {
          window.open(firstChild.href, '_blank')
        }
      }
    }

    context.setActive(itemId.value)
    return
  }

  if (hasChildren.value) {
    if (!props.item.to && !props.item.href) {
      if (!usePopover.value) {
        context.toggleExpand(itemId.value)
      }
    }
  }

  if (props.item.action) {
    props.item.action(props.item)
  }

  if (!hasChildren.value || props.item.to) {
    context.setActive(itemId.value)
  }
}

const handleChevronClick = (e: Event) => {
  e.stopPropagation()
  if (context.renderNestedTabs && props.depth === 0) {
    if (props.item.action) props.item.action(props.item)

    if (props.item.to) {
      router.push(props.item.to).catch(() => {})
    } else if (props.item.href) {
      window.open(props.item.href, '_blank')
    } else if (hasChildren.value) {
      const firstChild = props.item.children?.[0]
      if (firstChild) {
        if (firstChild.to) {
          router.push(firstChild.to).catch(() => {})
        } else if (firstChild.href) {
          window.open(firstChild.href, '_blank')
        }
      }
    }

    context.setActive(itemId.value)
    return
  }

  if (!usePopover.value) {
    context.toggleExpand(itemId.value)
  }
}

// Styling
const indentSize = computed(() => context.indentSize || 12)

// Compute the tree line left position: aligns with parent icon center
const treeLineLeft = computed(() => {
  const iconPx = parseInt(context.iconSize || '16', 10)
  // The parent item has px-2 = 8px padding, icon center = 8 + iconPx/2
  const parentIconCenter = 8 + iconPx / 2
  // For nested levels, offset by parent's depth indent
  return `${props.depth * indentSize.value + parentIconCenter}px`
})

const itemStyle = computed(() => {
  if (isHorizontal.value) return {}
  if (context.compact) {
    return { width: '100%' }
  }
  if (props.depth > 0) {
    // Child items: indent from left edge, reduce width accordingly
    const iconPx = parseInt(context.iconSize || '16', 10)
    const parentIconCenter = 8 + iconPx / 2
    const indent = (props.depth - 1) * indentSize.value + parentIconCenter + 8
    return {
      marginLeft: `${indent}px`,
      width: `calc(100% - ${indent}px)`,
    }
  }
  return {}
})

const itemClass = computed(() => {
  const widthClass = isHorizontal.value ? 'w-auto' : 'w-full'
  const base = `group flex items-center justify-between font-medium rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative border border-transparent select-none cursor-pointer ${widthClass} ${props?.itemClass || ''} ${context.labelClass}`

  let paddingClass = context.compact ? context.compactItemPadding : context.itemPadding
  if (!context.compact && props.depth > 0) {
    paddingClass = paddingClass.replace(/py-[\d\.]+/, 'py-1.5')
  }

  const layout = context.compact
    ? `justify-center ${paddingClass}`
    : `justify-between ${paddingClass}`

  let variantClass = ''
  if (isActive.value) {
    variantClass = 'bg-primary-light text-primary-fg-light'
  } else {
    variantClass = 'text-muted hover:bg-accent/80 hover:text-foreground'
  }

  if (props.item.disabled) {
    variantClass = 'opacity-50 cursor-not-allowed pointer-events-none'
  }

  return `${base} ${layout} ${variantClass} ${props.item.class || ''}`
})

const showCompactLabel = computed(() => {
  return context.compact && context.showCompactLabels
})

const displayLabel = computed(() =>
  props.item.labelI18n ? $t(props.item.labelI18n) : props.item.label
)

// Mappers for Dropdown
const mapItemToDropdown = (item: SidebarMenuItemSchema): IDropdownOption => {
  return {
    label: item.labelI18n ? $t(item.labelI18n) : item.label,
    value: item.id || item.label,
    icon: item.icon,
    disabled: item.disabled,
    children: item.children ? item.children.map(mapItemToDropdown) : undefined,
    data: item,
  }
}

const dropdownOptions = computed<IDropdownOptions>(() => {
  if (!props.item.children) return []
  return props.item.children.map(mapItemToDropdown)
})

const handleDropdownSelect = (option: any) => {
  const schema = option.data as SidebarMenuItemSchema
  if (schema) {
    if (schema.action) schema.action(schema)
    const id = schema.id || schema.label || (typeof schema.to === 'string' ? schema.to : '')
    if (id) context.setActive(id)

    // Handle Navigation Programmatically
    if (schema.to) {
      router.push(schema.to).catch(() => {})
    } else if (schema.href) {
      window.open(schema.href, '_blank')
    }
  }
}

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.opacity = '0'
}
const enter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.opacity = '1'
}
const afterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
  element.style.overflow = 'visible'
}
const beforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = element.scrollHeight + 'px'
  element.style.overflow = 'hidden'
  element.style.opacity = '1'
}
const leave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0'
  element.style.opacity = '0'
}

const componentIs = computed(() => {
  if (props.item.to) return 'router-link'
  if (props.item.href) return 'a'
  return 'button'
})

const componentProps = computed(() => {
  if (props.item.to) return { to: props.item.to }
  if (props.item.href)
    return {
      href: props.item.href,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  return { type: 'button' }
})
</script>

<template>
  <div
    ref="itemRef"
    :class="[
      'relative sidebar-manu-item',
      isHorizontal ? 'w-auto' : 'w-full',
      context.compact && 'mb-px',
    ]">
    <Dropdown
      v-if="usePopover"
      :position="isHorizontal ? 'bottom-start' : 'right-start'"
      :offset="menuOffset"
      class="w-full block"
      :searchable="false"
      :width="context.nestedMenuWidth"
      :maxHeight="context.nestedMenuMaxHeight"
      :options="dropdownOptions"
      @onSelect="handleDropdownSelect">
      <template #header>
        <div
          v-if="context.compact && !isHorizontal"
          class="px-3 py-1.5 text-sm flex items-center gap-2 font-medium border-b bg-muted-light rounded-t-md text-center truncate">
          <Icon
            v-if="item.icon"
            :icon="item.icon"
            class="shrink-0 transition-colors opacity-90 group-hover:opacity-100" />
          {{ displayLabel }}
        </div>
      </template>

      <template #trigger="{ isOpen }">
        <Tooltip
          :content="displayLabel"
          :placement="isHorizontal ? 'bottom' : 'right'"
          className="sidebar-menu-tooltip"
          :disabled="!context.showTooltip || (!context.compact && !isHorizontal) || isOpen"
          class="w-full block">
          <div class="w-full">
            <component
              :is="componentIs"
              v-bind="componentProps"
              :class="[itemClass, isOpen ? 'bg-muted text-foreground' : '']"
              :style="itemStyle"
              :aria-haspopup="true"
              :aria-expanded="isOpen"
              @click="handleClick">
              <div
                class="min-w-0 flex-1 flex"
                :class="[
                  showCompactLabel && !isHorizontal
                    ? 'flex-col items-center justify-center text-center gap-1'
                    : context.compact && !isHorizontal
                      ? 'justify-center'
                      : 'items-center gap-2.5',
                ]">
                <Icon
                  v-if="item.icon"
                  :icon="item.icon"
                  class="shrink-0 transition-colors opacity-90 group-hover:opacity-100"
                  :class="[isActive || isOpen ? 'opacity-100' : '']"
                  :style="{
                    width:
                      context.compact && !isHorizontal ? context.compactIconSize : context.iconSize,
                    height:
                      context.compact && !isHorizontal ? context.compactIconSize : context.iconSize,
                  }" />

                <span
                  class="truncate leading-none pt-0.5 text-wrap"
                  :class="{
                    [context.compactLabelClass]: showCompactLabel && !isHorizontal,
                    'w-full text-center': context.compact,
                    hidden: context.compact && !showCompactLabel && !isHorizontal,
                    'md:hidden': context.compact && !showCompactLabel && !isHorizontal,
                  }">
                  {{ displayLabel }}
                </span>

                <span
                  v-if="item.badge && (!context.compact || !showCompactLabel || isHorizontal)"
                  class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :class="[
                    item.badgeClass || 'bg-muted text-muted-foreground',
                    { 'md:hidden': context.compact && !isHorizontal },
                  ]">
                  {{ item.badge }}
                </span>
              </div>

              <div
                class="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
                :class="{ 'md:hidden': context.compact && !isHorizontal }">
                <Icon
                  :icon="isHorizontal ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                  class="h-3 w-3" />
              </div>
            </component>
          </div>
        </Tooltip>
      </template>

      <template #item="{ option }">
        <div class="flex items-center w-full gap-2 text-sm">
          <Icon
            v-if="option.icon"
            :icon="option.icon"
            class="shrink-0 opacity-90"
            :style="{ width: context.iconSize, height: context.iconSize }" />
          <span class="truncate flex-1 font-medium">{{ option.label }}</span>
          <span
            v-if="option.data?.badge"
            class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
            :class="option.data?.badgeClass || 'bg-muted text-muted-foreground'">
            {{ option.data.badge }}
          </span>
        </div>
      </template>
    </Dropdown>

    <template v-else>
      <Tooltip
        :content="displayLabel"
        :placement="isHorizontal ? 'bottom' : 'right'"
        :disabled="!context.showTooltip || (!context.compact && !isHorizontal)"
        class="w-full block">
        <component
          :is="componentIs"
          v-bind="componentProps"
          :class="itemClass"
          :style="itemStyle"
          :aria-expanded="showChevron ? isExpanded : undefined"
          :aria-current="isActive ? 'page' : undefined"
          @click="handleClick">
          <div
            class="min-w-0 flex-1 flex py-0.5"
            :class="[
              showCompactLabel && !isHorizontal
                ? 'flex-col items-center justify-center text-center gap-1'
                : context.compact && !isHorizontal
                  ? 'justify-center'
                  : 'items-center gap-2.5',
            ]">
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              class="shrink-0 transition-colors opacity-90 group-hover:opacity-100"
              :class="[isActive ? 'opacity-100' : '']"
              :style="{
                width:
                  context.compact && !isHorizontal ? context.compactIconSize : context.iconSize,
                height:
                  context.compact && !isHorizontal ? context.compactIconSize : context.iconSize,
              }" />

            <span
              class="truncate leading-none pt-0.5 wrap-break-word flex-wrap text-wrap"
              :class="{
                [context.compactLabelClass]: showCompactLabel && !isHorizontal,
                'w-full text-center': context.compact,
                hidden: context.compact && !showCompactLabel && !isHorizontal,
                'md:hidden': context.compact && !showCompactLabel && !isHorizontal,
              }">
              {{ displayLabel }}
            </span>

            <span
              v-if="item.badge && (!context.compact || !showCompactLabel || isHorizontal)"
              class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
              :class="[
                item.badgeClass || 'bg-muted text-muted-foreground',
                { 'md:hidden': context.compact && !isHorizontal },
              ]">
              {{ item.badge }}
            </span>
          </div>

          <div
            v-if="showChevron"
            role="button"
            tabindex="0"
            class="ml-1.5 flex shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
            :class="{ 'md:hidden': context.compact && !isHorizontal }"
            @click="handleChevronClick"
            @keydown.enter.space.prevent="handleChevronClick">
            <Icon
              icon="lucide:chevron-down"
              class="h-3 w-3 transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded && !isHorizontal }" />
          </div>

          <!-- Drilldown chevron (right arrow, not expandable) -->
          <div
            v-if="showDrilldownChevron"
            class="ml-1.5 flex shrink-0 items-center justify-center text-muted-foreground"
            :class="{ 'md:hidden': context.compact && !isHorizontal }">
            <Icon
              icon="lucide:chevron-right"
              class="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-80" />
          </div>
        </component>
      </Tooltip>

      <Transition
        name="sidebar-slide"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave">
        <div
          v-if="hasChildren && isExpanded && !isHorizontal"
          class="sidebar-children-container overflow-hidden transition-all duration-300 ease-in-out relative">
          <!-- Shadcn-style tree line: positioned under parent icon center -->
          <div
            v-if="context.variant === 'default'"
            class="sidebar-tree-line absolute rounded-full z-[1]"
            :style="{
              left: treeLineLeft,
              top: '4px',
              bottom: '10px',
              width: '1px',
              backgroundColor: 'var(--color-border)',
            }"></div>

          <div class="pt-1 space-y-0.5">
            <SidebarMenuItem
              v-for="child in item.children"
              :key="child.id || child.label"
              :item="child"
              :depth="depth + 1" />
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style>
.sidebar-manu-item .tooltip-trigger {
  width: 100% !important;
}

.sidebar-menu-tooltip {
  margin-left: 4px !important;
}

[dir='rtl'] .sidebar-menu-tooltip {
  margin-right: 4px !important;
}
</style>
