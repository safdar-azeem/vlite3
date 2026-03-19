<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../../Icon.vue'
import Tooltip from '../../Tooltip.vue'
import { $t } from '@/utils/i18n'

const props = defineProps<{
  title?: string
  titleI18n?: string
  description?: string
  descriptionI18n?: string
  info?: string
  infoI18n?: string
  titleClass?: string
  descriptionClass?: string
}>()

const displayTitle = computed(() => (props.titleI18n ? $t(props.titleI18n) : props.title))
const displayDescription = computed(() =>
  props.descriptionI18n ? $t(props.descriptionI18n) : props.description
)
</script>

<template>
  <div class="flex flex-col shrink-0">
    <slot name="title">
      <div v-if="displayTitle" class="flex items-center! gap-2">
        <h1 class="text-fs-7.5 font-bold text-foreground" :class="titleClass">
          {{ displayTitle }}
        </h1>
        <Tooltip v-if="info || infoI18n" :content="info" :content-i18n="infoI18n" placement="right">
          <Icon
            icon="lucide:info"
            class="w-[18px] h-[18px] mt-3! text-muted-foreground hover:text-foreground cursor-pointer transition-colors outline-none" />
        </Tooltip>
      </div>
    </slot>
    <slot name="description">
      <p
        v-if="displayDescription"
        class="text-sm text-gray-700 mt-1 md:max-w-[450px]"
        :class="descriptionClass">
        {{ displayDescription }}
      </p>
    </slot>
  </div>
</template>
