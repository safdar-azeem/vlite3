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
  emit('update:modelValue', [...internalList.value])
  emit('change')
}

const onChange = () => emit('change')

const isReadonly = computed(() => ctx?.readonly.value || false)

const nodeTextClass = computed(() => {
  if (props.level === 0) return 'text-sm font-semibold text-foreground'
  if (props.level === 1) return 'text-sm font-medium text-gray-800 dark:text-gray-200'
  return 'text-sm text-gray-600 dark:text-gray-400'
})
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
    <div v-for="item in internalList" :key="item.id" class="mb-1.5 flex flex-col">
      <div
        class="group flex items-center justify-between p-2 rounded-lg transition-colors bg-background dark:bg-card hover:bg-muted/30 border border-border shadow-sm">
        <div class="flex items-center gap-2 overflow-hidden flex-1">
          <button
            v-if="item.children && item.children.length > 0"
            @click="ctx?.toggleExpand(item.id)"
            class="flex items-center justify-center w-5 h-5 shrink-0 text-muted-foreground hover:bg-muted rounded transition-colors">
            <Icon
              :icon="
                ctx?.expandedIds.value.has(item.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'
              "
              class="w-4 h-4" />
          </button>

          <div
            v-if="!isReadonly"
            class="drag-handle cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-colors p-0.5 shrink-0">
            <Icon icon="lucide:grip-vertical" class="w-4 h-4" />
          </div>

          <IconPicker
            v-if="!isReadonly"
            :value="item.icon"
            :btn-props="{
              variant: 'ghost',
              size: 'xs',
              iconClass: 'h-4 w-4',
              class: 'h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-md',
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
            class="w-4 h-4 shrink-0 text-muted-foreground" />

          <input
            v-if="!isReadonly"
            v-model="item.title"
            :class="[
              'bg-transparent border-0 border-b border-transparent hover:border-border focus:border-primary outline-none focus:ring-0 px-1 py-0.5 -ml-1 transition-colors w-full truncate cursor-text min-w-0 rounded-none shadow-none',
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
          class="flex items-center gap-2 py-1 px-2 bg-transparent w-full mb-1.5 pl-6">
          <IconPicker
            v-model="ctx.inlineState.value.icon"
            :btn-props="{
              variant: 'ghost',
              size: 'xs',
              class: 'h-6 w-6 p-0 text-muted-foreground hover:text-foreground shrink-0 rounded-md',
            }"
            position="bottom-start" />
          <input
            v-model="ctx.inlineState.value.title"
            class="flex-1 bg-transparent border-0 border-b border-primary/40 focus:border-primary outline-none focus:ring-0 px-1 py-0.5 text-sm transition-colors w-full rounded-none shadow-none"
            placeholder="New subcategory..."
            autofocus
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
