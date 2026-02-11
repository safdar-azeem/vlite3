<script setup lang="ts">
import { computed } from 'vue'
import type { PricingPlanItemSchema } from './types'
import Icon from '../Icon.vue'
import Button from '../Button.vue'
import Badge from '../Badge.vue'

interface Props {
  item: PricingPlanItemSchema
  selected?: boolean
  variant?: 'outline' | 'solid'
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  variant: 'outline',
  selectable: true,
})

const emit = defineEmits<{
  (e: 'select', item: PricingPlanItemSchema): void
}>()

const handleClick = () => {
  if (props.selectable) {
    emit('select', props.item)
  }
}

// Computeds
const isPopular = computed(() => props.item.popular || props.item.recommended)

const containerClasses = computed(() => {
  const base =
    'relative flex flex-col p-8 rounded-2xl transition-all duration-300 cursor-pointer group isolation-auto'

  // Base White Styling
  // We strictly use bg-card (usually white) or explicit white to ensure it pops against any background.
  let styleClasses = 'bg-background text-card-foreground'

  if (props.selected) {
    // Selected State: White card with Strong Border + Shadow
    // No background tint to keep it "Clean White"
    styleClasses += ' border-2 border-primary shadow scale-[1.02] z-10'
  } else {
    // Normal State
    styleClasses += ' border hover:border-gray-400 hover:shadow-lg hover:-translate-y-1'
  }

  return `${base} ${styleClasses}`
})

const badgeVariant = computed(() => {
  return props.selected ? 'default' : 'secondary'
})

const buttonVariant = computed(() => {
  // If selected, primary button.
  // If popular, primary button.
  // Otherwise outline.
  if (props.selected) return 'primary'
  if (isPopular.value) return 'primary'
  return 'outline'
})

// Feature Helper
const getFeatureText = (feature: string | { text: string }) => {
  return typeof feature === 'string' ? feature : feature.text
}

const isFeatureIncluded = (feature: string | { included?: boolean }) => {
  if (typeof feature === 'string') return true
  return feature.included !== false
}
</script>

<template>
  <div :class="containerClasses" @click="handleClick">
    <!-- Popular Badge -->
    <div v-if="isPopular" class="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
      <Badge
        :variant="badgeVariant"
        class="shadow-sm px-4 py-1 text-xs uppercase tracking-wider font-bold">
        {{ item.recommended ? 'Recommended' : 'Most Popular' }}
      </Badge>
    </div>

    <!-- Header -->
    <div class="mb-3 text-center">
      <h3 class="text-xl font-bold text-foreground tracking-tight">{{ item.title }}</h3>
      <p
        v-if="item.description"
        class="text-sm text-muted-foreground mt-2 min-h-[40px] leading-relaxed">
        {{ item.description }}
      </p>
    </div>

    <!-- Price -->
    <div class="mb-8 text-center flex items-center justify-center">
      <span class="text-4xl font-extrabold text-foreground tracking-tight">{{ item.price }}</span>
      <span
        v-if="item.period"
        class="text-muted-foreground text-sm font-medium ml-1 self-end mb-1.5 opacity-80"
        >{{ item.period }}</span
      >
    </div>

    <!-- Divider (Subtle) -->
    <!-- <div class="h-px w-full bg-border/50 mb-6"></div> -->

    <!-- Features -->
    <ul class="flex-1 space-y-2.5 mb-8">
      <li
        v-for="(feature, idx) in item.features"
        :key="idx"
        class="flex items-start gap-3 text-sm group/feature">
        <div class="mt-0 shrink-0 transition-transform group-hover/feature:scale-110">
          <Icon
            v-if="isFeatureIncluded(feature)"
            icon="lucide:check"
            class="w-4 h-4 text-primary font-bold" />
          <Icon v-else icon="lucide:minus" class="w-4 h-4 text-muted-foreground/30" />
        </div>
        <span
          :class="
            isFeatureIncluded(feature)
              ? 'text-foreground/90 font-medium'
              : 'text-muted-foreground/60 decoration-slate-300/50'
          ">
          {{ getFeatureText(feature) }}
        </span>
      </li>
    </ul>

    <!-- Action Button -->
    <div class="mt-auto pt-4 border-t border-border/70">
      <Button
        :variant="buttonVariant"
        class="w-full font-semibold shadow-sm rounded-lg"
        :class="{ 'ring-2 ring-primary ring-offset-2': selected }"
        size="lg">
        {{ item.buttonText || (selected ? 'Selected' : 'Choose Plan') }}
      </Button>
    </div>
  </div>
</template>
