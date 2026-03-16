<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw } from 'vue'
import { $t } from '@/utils/i18n'
import { useVLiteConfig } from '@/core'
import { EmptyVariant } from '.'

interface Props {
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  icon?: string
  variant?: EmptyVariant
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:inbox',
})

const config = useVLiteConfig()

// Priority: prop > global createVLite config > default 'variant1'
const activeVariant = computed<EmptyVariant>(() => {
  return props.variant || (config?.components as any)?.empty?.variant || 'variant1'
})

const displayTitle = computed(() => {
  if (props.titleI18n) return $t(props.titleI18n)
  if (props.title) return props.title
  const res = $t('vlite.empty.title')
  return res !== 'vlite.empty.title' ? res : 'No data found'
})

const displayDescription = computed(() => {
  if (props.descriptionI18n) return $t(props.descriptionI18n)
  if (props.description) return props.description
  const res = $t('vlite.empty.description')
  return res !== 'vlite.empty.description' ? res : 'There is nothing to display here right now.'
})

const variantComponents: Record<string, any> = {
  variant1: markRaw(defineAsyncComponent(() => import('./variants/Variant1.vue'))),
  variant2: markRaw(defineAsyncComponent(() => import('./variants/Variant2.vue'))),
  variant3: markRaw(defineAsyncComponent(() => import('./variants/Variant3.vue'))),
  variant4: markRaw(defineAsyncComponent(() => import('./variants/Variant4.vue'))),
  variant5: markRaw(defineAsyncComponent(() => import('./variants/Variant5.vue'))),
  variant6: markRaw(defineAsyncComponent(() => import('./variants/Variant6.vue'))),
  variant7: markRaw(defineAsyncComponent(() => import('./variants/Variant7.vue'))),
  variant8: markRaw(defineAsyncComponent(() => import('./variants/Variant8.vue'))),
  variant9: markRaw(defineAsyncComponent(() => import('./variants/Variant9.vue'))),
  variant10: markRaw(defineAsyncComponent(() => import('./variants/Variant10.vue'))),
  variant11: markRaw(defineAsyncComponent(() => import('./variants/Variant11.vue'))),
}

const SelectedVariant = computed(
  () => variantComponents[activeVariant.value] || variantComponents.variant1
)
</script>

<template>
  <div class="flex items-center justify-center min-h-[300px] w-full py-8">
    <component
      :is="SelectedVariant"
      :title="displayTitle"
      :description="displayDescription"
      :icon="icon">
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </component>
  </div>
</template>
