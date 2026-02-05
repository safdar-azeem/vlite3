<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from '../Icon.vue'
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
  // Simple check against context activeItem which is now managed by SidebarMenu
  // For visual highlighting, SidebarMenu sets activeItem based on route.
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

  // In Popover mode, Dropdown handles selection if we use options.
  // But here we are the TRIGGER for the root popover OR a tree item.
  // If we click the trigger, we don't necessarily set active unless it's a link?
  // Usually folder clicks don't set active.
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
  return {
    marginLeft: `${props.depth * indentSize.value}px`,
    width: `calc(100% - ${props.depth * indentSize.value}px)`,
  }
})

const itemClass = computed(() => {
  const base =
    'group flex items-center justify-between py-1.5 px-2 text-sm font-medium rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative border border-transparent select-none cursor-pointer'

  let variantClass = ''
  if (isActive.value) {
    variantClass = 'bg-primary/5 text-primary'
  } else {
    variantClass = 'text-muted-foreground hover:bg-accent/80 hover:text-foreground'
  }

  if (props.item.disabled) {
    variantClass = 'opacity-50 cursor-not-allowed pointer-events-none'
  }

  return `${base} ${variantClass} ${props.item.class || ''}`
})

// Mappers for Dropdown
const mapItemToDropdown = (item: SidebarMenuItemSchema): IDropdownOption => {
  return {
    label: item.label,
    value: item.id || item.label, // Use stable ID for value
    icon: item.icon,
    disabled: item.disabled,
    children: item.children ? item.children.map(mapItemToDropdown) : undefined,
    data: item, // Store full item schema in data for custom slot rendering
  }
}

const dropdownOptions = computed<IDropdownOptions>(() => {
  if (!props.item.children) return []
  return props.item.children.map(mapItemToDropdown)
})

// We need a separate click handler for items inside the dropdown (emitted by Dropdown)
const handleDropdownSelect = (option: any) => {
  // The option.data contains the SidebarMenuItemSchema
  const schema = option.data as SidebarMenuItemSchema
  if (schema) {
    if (schema.action) schema.action(schema)
    // If it has a link, navigation happens via router-link in slot technically?
    // Wait, DropdownItem renders the slot. If slot contains router-link, click propagates?
    // Dropdown usually handles click and emits select.
    // If we use <router-link> in the slot, the link click happens.
    // We should ensure we update active state.

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
  element.style.overflow = 'hidden' // Force hidden during leave
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
  <div class="w-full relative">
    <!-- Case 1: Popover Mode (Wrapper is Dropdown) -->
    <Dropdown
      v-if="usePopover"
      position="right-start"
      :offset="[0, 10]"
      class="w-full"
      :searchable="false"
      width="220px"
      :options="dropdownOptions"
      @onSelect="handleDropdownSelect">
      <template #trigger="{ isOpen }">
        <!-- Helper Trigger Div to handle layout -->
        <div class="w-full">
          <component
            :is="componentIs"
            v-bind="componentProps"
            :class="[itemClass, isOpen ? 'bg-muted text-foreground' : '']"
            :style="itemStyle"
            :aria-haspopup="true"
            :aria-expanded="isOpen"
            @click="handleClick">
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <Icon
                v-if="item.icon"
                :icon="item.icon"
                class="h-4 w-4 shrink-0 transition-colors opacity-70 group-hover:opacity-100"
                :class="isActive || isOpen ? 'opacity-100' : ''" />
              <span class="truncate leading-none pt-0.5">{{ item.label }}</span>
              <span
                v-if="item.badge"
                class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                :class="item.badgeClass || 'bg-muted text-muted-foreground'">
                {{ item.badge }}
              </span>
            </div>
            <!-- Chevron Right for Popover -->
            <div
              class="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
              <Icon icon="lucide:chevron-right" class="h-3 w-3" />
            </div>
          </component>
        </div>
      </template>

      <!-- Custom rendering for dropdown items (recursive via Dropdown logic) -->
      <!-- Dropdown exposes 'item' slot for each option -->
      <template #item="{ option }">
        <!-- We want to render this similarly to our sidebar item but inside dropdown -->
        <!-- Use router-link if 'to' is present in the schema (option.data) -->
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

    <!-- Case 2: Tree Mode (Standard) -->
    <template v-else>
      <!-- Item Row -->
      <component
        :is="componentIs"
        v-bind="componentProps"
        :class="itemClass"
        :style="itemStyle"
        :aria-expanded="hasChildren ? isExpanded : undefined"
        :aria-current="isActive ? 'page' : undefined"
        @click="handleClick">
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <Icon
            v-if="item.icon"
            :icon="item.icon"
            class="h-4 w-4 shrink-0 transition-colors opacity-70 group-hover:opacity-100"
            :class="isActive ? 'opacity-100' : ''" />
          <span class="truncate leading-none pt-0.5">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
            :class="item.badgeClass || 'bg-muted text-muted-foreground'">
            {{ item.badge }}
          </span>
        </div>

        <!-- Chevron Down for Tree -->
        <div
          v-if="hasChildren"
          role="button"
          tabindex="0"
          class="ml-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
          @click="handleChevronClick"
          @keydown.enter.space.prevent="handleChevronClick">
          <Icon
            icon="lucide:chevron-down"
            class="h-3 w-3 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }" />
        </div>
      </component>

      <!-- Children Recursion -->
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
          <!-- Tree Guide -->
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

<style scoped>
/* No extra styles */
</style>
