<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { $t } from '@/utils/i18n'
import { useVLiteConfig } from '@/core'
import { EmptyVariant } from '.'

import Variant1 from './variants/Variant1.vue'
import Variant2 from './variants/Variant2.vue'
import Variant3 from './variants/Variant3.vue'
import Variant4 from './variants/Variant4.vue'
import Variant5 from './variants/Variant5.vue'
import Variant6 from './variants/Variant6.vue'
import Variant7 from './variants/Variant7.vue'
import Variant8 from './variants/Variant8.vue'
import Variant9 from './variants/Variant9.vue'
import Variant10 from './variants/Variant10.vue'
import Variant11 from './variants/Variant11.vue'

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
  variant1: markRaw(Variant1),
  variant2: markRaw(Variant2),
  variant3: markRaw(Variant3),
  variant4: markRaw(Variant4),
  variant5: markRaw(Variant5),
  variant6: markRaw(Variant6),
  variant7: markRaw(Variant7),
  variant8: markRaw(Variant8),
  variant9: markRaw(Variant9),
  variant10: markRaw(Variant10),
  variant11: markRaw(Variant11),
}

const SelectedVariant = computed(
  () => variantComponents[activeVariant.value] || variantComponents.variant1
)
</script>

<template>
  <div class="flex items-center justify-center min-h-[300px] w-full py-2">
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
