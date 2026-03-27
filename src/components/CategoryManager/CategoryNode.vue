<script setup lang="ts">
import { computed, inject } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import Icon from '@/components/Icon.vue'
import Button from '@/components/Button.vue'
import IconPicker from '@/components/IconPicker.vue'
import type { CategoryItem, CategoryManagerContext } from './types'

interface Props {
  modelValue: CategoryItem[]
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: CategoryItem[]): void
  (e: 'change'): void
}>()

const ctx = inject<CategoryManagerContext>('categoryManager')

const internalList = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const handleUpdate = (val: CategoryItem[], item: CategoryItem) => {
  item.children = val
  // Fix nested dropping bug by emitting a local change event up the tree instead of aggressively emitting stale state.
  emit('change')
}

const onChange = () => emit('change')

const isReadonly = computed(() => ctx?.readonly.value || false)
const size = computed(() => ctx?.size.value || 'md')

const nodePaddingClass = computed(() => {
  if (size.value === 'sm') return 'p-1 md:p-1.5'
  if (size.value === 'lg') return 'p-2 md:p-3'
  return 'p-1.5 md:p-2'
})

const nodeTextClass = computed(() => {
  const isRoot = props.level === 0
  const weight = isRoot ? 'font-semibold' : 'font-medium'
  if (size.value === 'sm') return `text-xs ${weight} text-foreground`
  if (size.value === 'lg') return `text-base ${weight} text-foreground`
  return `text-sm ${weight} text-foreground`
})

const iconSizeClass = computed(() => {
  if (size.value === 'sm') return 'w-3.5 h-3.5'
  if (size.value === 'lg') return 'w-5 h-5'
  return 'w-4 h-4'
})

// Custom focus directive to ensure reliable focus when nested inputs appear
const vFocus = {
  mounted: (el: HTMLElement) => {
    setTimeout(() => el.focus(), 10)
  },
}
</script>

<template>
  <VueDraggable
    v-model="internalList"
    group="category-manager"
    :animation="150"
    handle=".drag-handle"
    ghost-class="opacity-50"
    :disabled="isReadonly"
    class="min-h-[2px]"
    @change="onChange">
    <div
      v-for="item in internalList"
      :key="item.id"
      class="mb-1.5 flex flex-col"
      v-memo="[
        item.id,
        item.title,
        item.icon,
        item.children?.length,
        ctx?.expandedIds.value.has(item.id),
        ctx?.inlineState.value.targetId === item.id,
        ctx?.inlineState.value.mode,
        isReadonly,
        size
      ]">
      <div
        :class="[
          'group flex items-center justify-between rounded-lg transition-colors bg-background border border-border shadow-sm',
          nodePaddingClass
        ]">
        <div class="flex items-center gap-1.5 overflow-hidden flex-1">
          <button
            v-if="item.children && item.children.length > 0"
            @click="ctx?.toggleExpand(item.id)"
            :class="[
              'flex items-center justify-center shrink-0 text-muted-foreground hover:bg-muted rounded transition-colors',
              size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
            ]">
            <Icon
              :icon="ctx?.expandedIds.value.has(item.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
              :class="iconSizeClass" />
          </button>

          <div
            v-if="!isReadonly"
            class="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground transition-colors p-0.5 shrink-0">
            <Icon icon="lucide:grip-vertical" :class="iconSizeClass" />
          </div>

          <IconPicker
            v-if="!isReadonly"
            :value="item.icon"
            :btn-props="{
              variant: 'ghost',
              size: 'xs',
              iconClass: iconSizeClass,
              class: (size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-7 w-7' : 'h-6 w-6') + ' p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-md',
            }"
            position="bottom-start"
            @onSelect="
              (val) => {
                console.log('IconPicker value :>> ', val)
                item.icon = val
                ctx?.saveItem(item)
              }
            " />
          <Icon
            v-else-if="item.icon"
            :icon="item.icon"
            :class="[iconSizeClass, 'shrink-0 text-muted-foreground']" />

          <input
            v-if="!isReadonly"
            v-model="item.title"
            :class="[
              'bg-transparent border-0 outline-none focus:ring-0 px-1 py-0.5 -ml-1 transition-colors w-full truncate cursor-text min-w-0 shadow-none caret-primary',
              nodeTextClass,
            ]"
            placeholder="Category title..."
            @change="ctx?.saveItem(item)"
            @keyup.enter="$event.target.blur()"
            @click.stop />
          <span v-else :class="['truncate', nodeTextClass]">{{ item.title }}</span>
        </div>

        <div
          v-if="!isReadonly"
          class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 bg-background/80 px-1 rounded ml-2">
          <Button
            variant="ghost"
            size="xs"
            icon="lucide:plus"
            title="Quick Add Subcategory"
            class="h-7 w-7 px-0 text-muted-foreground hover:text-primary"
            @click="ctx?.startInline('add-child', item.id)" />
          <Button
            variant="ghost"
            size="xs"
            icon="lucide:settings"
            title="Advanced Details"
            class="h-7 w-7 px-0 text-muted-foreground hover:text-primary"
            @click="ctx?.openModalForm('edit', item)" />
          <Button
            variant="ghost"
            size="xs"
            icon="lucide:trash-2"
            title="Delete"
            class="h-7 w-7 px-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            @click="ctx?.deleteItem(item)" />
        </div>
      </div>

      <div
        v-show="ctx?.expandedIds.value.has(item.id)"
        v-if="
          (item.children && item.children.length > 0) ||
          (ctx?.inlineState.value.mode === 'add-child' &&
            ctx.inlineState.value.targetId === item.id)
        "
        class="ml-6 pl-3 border-l-2 border-border/40 mt-1.5 flex flex-col relative">
        <CategoryNode
          v-if="item.children && item.children.length > 0"
          :modelValue="item.children"
          @update:modelValue="(val) => handleUpdate(val, item)"
          :level="level + 1"
          @change="onChange" />

        <div
          v-if="
            ctx?.inlineState.value.mode === 'add-child' &&
            ctx.inlineState.value.targetId === item.id
          "
          class="flex items-center gap-1.5 py-1.5 px-2 bg-background border border-border shadow-sm rounded-lg w-full mb-1.5">
          <IconPicker
            v-model="ctx.inlineState.value.icon"
            :btn-props="{
              variant: 'ghost',
              size: 'xs',
              class: 'h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-md',
            }"
            position="bottom-start" />
          <input
            v-focus
            v-model="ctx.inlineState.value.title"
            class="flex-1 bg-transparent border-0 outline-none focus:ring-0 px-1 py-0.5 text-sm transition-colors w-full shadow-none caret-primary text-foreground placeholder:text-muted-foreground"
            placeholder="New subcategory title..."
            @keyup.enter="ctx.saveInline()"
            @keyup.esc="ctx.cancelInline()" />
          <Button
            variant="primary"
            size="xs"
            icon="lucide:check"
            class="shrink-0 h-6 w-6 px-0"
            title="Save"
            @click="ctx.saveInline()" />
          <Button
            variant="ghost"
            size="xs"
            icon="lucide:x"
            class="shrink-0 h-6 w-6 px-0"
            title="Cancel"
            @click="ctx.cancelInline()" />
        </div>
      </div>
    </div>
  </VueDraggable>
</template>
