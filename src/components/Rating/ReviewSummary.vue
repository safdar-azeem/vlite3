<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ReviewSummaryProps } from './types'

const props = withDefaults(defineProps<ReviewSummaryProps>(), {
  showTotal: true
})

const sortedDistribution = computed(() => {
  return [...props.ratingDistribution].sort((a, b) => b.rating - a.rating)
})

const computedAverage = computed(() => {
  if (props.averageRating !== undefined) return props.averageRating
  if (props.ratingDistribution.length === 0) return 0
  
  let totalRating = 0
  let totalCount = 0
  
  for (const item of props.ratingDistribution) {
    if (item.count !== undefined) {
      totalRating += item.rating * item.count
      totalCount += item.count
    }
  }
  
  return totalCount > 0 ? Number((totalRating / totalCount).toFixed(1)) : 0
})

const computedTotal = computed(() => {
  if (props.totalReviews !== undefined) return props.totalReviews
  return props.ratingDistribution.reduce((sum, item) => sum + (item.count || 0), 0)
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-6 md:gap-10 items-start w-full" :class="props.class">
    <!-- Average Summary Column -->
    <div class="flex flex-col items-center justify-center py-4 sm:w-1/3 w-full shrink-0">
      <div class="text-5xl font-bold tracking-tighter text-foreground">
        {{ computedAverage }}
      </div>
      
      <div class="flex items-center gap-1 mt-3 text-amber-400">
        <Icon
          v-for="i in 5"
          :key="i"
          icon="lucide:star"
          class="w-5 h-5 transition-all"
          :class="{ 'fill-amber-400 text-amber-400': computedAverage >= i, 
                   'fill-muted/20 text-muted-foreground/30': computedAverage < i }"
        />
      </div>
      
      <p v-if="showTotal" class="text-sm text-muted-foreground mt-2 font-medium">
        Based on {{ computedTotal }} global ratings
      </p>
    </div>
    
    <!-- Distribution Progress Bars -->
    <div class="flex flex-col gap-2 w-full flex-grow">
      <div 
        v-for="item in sortedDistribution" 
        :key="item.rating"
        class="flex items-center gap-3 w-full"
      >
        <div class="flex items-center gap-1 text-sm font-medium text-foreground min-w-[70px]">
          {{ item.rating }} 
          <Icon icon="lucide:star" class="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>
        
        <div class="h-3.5 bg-muted rounded-full w-full overflow-hidden flex-grow shrink-0 relative shadow-inner">
          <div 
            class="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${item.percentage}%` }"
          ></div>
        </div>
        
        <div class="text-sm font-medium text-muted-foreground text-right min-w-[36px]">
          {{ item.percentage }}%
        </div>
      </div>
    </div>
  </div>
</template>
