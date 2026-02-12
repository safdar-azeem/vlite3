<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '../Icon.vue'
import Tooltip from '@/components/Tooltip.vue'
import type { SidebarMenuItemSchema, SidebarMenuContext } from './types'
import { Dropdown } from '@/components/Dropdown'
import type { IDropdownOptions, IDropdownOption } from '@/types/styles'

interface Props {
  item: SidebarMenuItemSchema
  depth?: number
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
})

const context = inject<SidebarMenuContext>('sidebar-menu-ctx')

if (!context) {
  throw new Error('SidebarMenuItem must be used within a SidebarMenu')
}

// Render Mode Logic
const computedRenderMode = computed(() => {
  if (context.compact && hasChildren.value) return 'popover'
  return props.item.renderMode || context.renderMode || 'tree'
})

const usePopover = computed(() => {
  return computedRenderMode.value === 'popover' && hasChildren.value
})

const itemId = computed(() => {
  if (props.item.id) return props.item.id
  if (props.item.to && typeof props.item.to === 'string') return props.item.to
  return props.item.label
})

const hasChildren = computed(() => !!props.item.children?.length)

const isExpanded = computed(() => {
  if (usePopover.value) return false
  return context.expandedItems.includes(itemId.value)
})

const isActive = computed(() => {
  return context.activeItem === itemId.value
})

const handleClick = (e: MouseEvent) => {
  if (props.item.disabled) return

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
  if (!usePopover.value) {
    context.toggleExpand(itemId.value)
  }
}

// Styling
const indentSize = computed(() => context.indentSize || 12)
const itemStyle = computed(() => {
  // If in compact mode, we want full width regardless of depth (usually depth is 0 for root)
  // unless strictly in tree mode inside compact sidebar (uncommon).
  if (context.compact) {
    return { width: '100%' }
  }
  return {
    marginLeft: `${props.depth * indentSize.value}px`,
    width: `calc(100% - ${props.depth * indentSize.value}px)`,
  }
})

const itemClass = computed(() => {
  const base =
    'group flex items-center justify-between text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative border border-transparent select-none cursor-pointer w-full'

  // Center content if compact and on desktop
  const layout = context.compact ? 'justify-center py-2 px-1' : 'justify-between py-2 px-2'

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

// Mappers for Dropdown
const mapItemToDropdown = (item: SidebarMenuItemSchema): IDropdownOption => {
  return {
    label: item.label,
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
  }
}

// Animation Hooks (Tree only)
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
  <div class="w-full relative sidebar-manu-item">
    <Dropdown
      v-if="usePopover"
      position="right-start"
      :offset="[0, 10]"
      class="w-full"
      :searchable="false"
      width="220px"
      :options="dropdownOptions"
      @onSelect="handleDropdownSelect">
      <template #header>
        <div
          v-if="context.compact"
          class="px-3 py-1.5 text-sm flex items-center gap-2 font-medium border-b bg-muted-light rounded-t-md text-center truncate">
          <Icon
            v-if="item.icon"
            :icon="item.icon"
            class="shrink-0 transition-colors opacity-80 group-hover:opacity-100" />
          {{ item.label }}
        </div>
      </template>

      <template #trigger="{ isOpen }">
        <Tooltip
          :content="item.label"
          placement="right"
          className="sidebar-menu-tooltip"
          :disabled="!context.compact || isOpen"
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
                  showCompactLabel
                    ? 'flex-col items-center justify-center gap-1'
                    : context.compact
                      ? 'justify-center'
                      : 'items-center gap-2.5',
                ]">
                <Icon
                  v-if="item.icon"
                  :icon="item.icon"
                  class="shrink-0 transition-colors opacity-70 group-hover:opacity-100"
                  :class="[
                    isActive || isOpen ? 'opacity-100' : '',
                    context.compact ? 'h-5 w-5' : 'h-4 w-4',
                  ]" />

                <span
                  class="truncate leading-none pt-0.5"
                  :class="{
                    'text-[10px]': showCompactLabel,
                    hidden: context.compact && !showCompactLabel,
                    'md:hidden': context.compact && !showCompactLabel,
                  }">
                  {{ item.label }}
                </span>

                <span
                  v-if="item.badge && (!context.compact || !showCompactLabel)"
                  class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :class="[
                    item.badgeClass || 'bg-muted text-muted-foreground',
                    { 'md:hidden': context.compact },
                  ]">
                  {{ item.badge }}
                </span>
              </div>

              <div
                class="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
                :class="{ 'md:hidden': context.compact }">
                <Icon icon="lucide:chevron-right" class="h-3 w-3" />
              </div>
            </component>
          </div>
        </Tooltip>
      </template>

      <template #item="{ option }">
        <component
          :is="option.data?.to ? 'router-link' : option.data?.href ? 'a' : 'div'"
          :to="option.data?.to"
          :href="option.data?.href"
          target="option.data?.href ? '_blank' : undefined"
          class="flex items-center w-full gap-2 text-sm">
          <Icon v-if="option.icon" :icon="option.icon" class="h-4 w-4 shrink-0 opacity-70" />
          <span class="truncate flex-1">{{ option.label }}</span>
          <span
            v-if="option.data?.badge"
            class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
            :class="option.data?.badgeClass || 'bg-muted text-muted-foreground'">
            {{ option.data.badge }}
          </span>
        </component>
      </template>
    </Dropdown>

    <template v-else>
      <Tooltip
        :content="item.label"
        placement="right"
        :disabled="!context.compact"
        class="w-full block">
        <component
          :is="componentIs"
          v-bind="componentProps"
          :class="itemClass"
          :style="itemStyle"
          :aria-expanded="hasChildren ? isExpanded : undefined"
          :aria-current="isActive ? 'page' : undefined"
          @click="handleClick">
          <div
            class="min-w-0 flex-1 flex"
            :class="[
              showCompactLabel
                ? 'flex-col items-center justify-center gap-1'
                : context.compact
                  ? 'justify-center'
                  : 'items-center gap-2.5',
            ]">
            <Icon
              v-if="item.icon"
              :icon="item.icon"
              class="shrink-0 transition-colors opacity-70 group-hover:opacity-100"
              :class="[isActive ? 'opacity-100' : '', context.compact ? 'h-5 w-5' : 'h-4 w-4']" />

            <span
              class="truncate leading-none pt-0.5"
              :class="{
                'text-[10px]': showCompactLabel,
                hidden: context.compact && !showCompactLabel,
                'md:hidden': context.compact && !showCompactLabel,
              }">
              {{ item.label }}
            </span>

            <span
              v-if="item.badge && (!context.compact || !showCompactLabel)"
              class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
              :class="[
                item.badgeClass || 'bg-muted text-muted-foreground',
                { 'md:hidden': context.compact },
              ]">
              {{ item.badge }}
            </span>
          </div>

          <div
            v-if="hasChildren"
            role="button"
            tabindex="0"
            class="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
            :class="{ 'md:hidden': context.compact }"
            @click="handleChevronClick"
            @keydown.enter.space.prevent="handleChevronClick">
            <Icon
              icon="lucide:chevron-down"
              class="h-3 w-3 transition-transform duration-200"
              :class="{ 'rotate-180': isExpanded }" />
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
          v-if="hasChildren && isExpanded"
          class="overflow-hidden transition-all duration-300 ease-in-out relative">
          <div
            v-if="context.variant === 'default'"
            class="absolute top-0 bottom-2 w-px bg-border"
            :style="{
              left: `${(depth + 1) * indentSize - indentSize / 2}px`,
            }"></div>

          <div class="mt-0.5 space-y-0.5">
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
