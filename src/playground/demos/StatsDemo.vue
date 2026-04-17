<script setup lang="ts">
import VariantsDemo from './StatsDemo/VariantsDemo.vue'
import AttachedDemo from './StatsDemo/AttachedDemo.vue'
import LayoutsDemo from './StatsDemo/LayoutsDemo.vue'
import IconStyleDemo from './StatsDemo/IconStyleDemo.vue'
import LoadingDemo from './StatsDemo/LoadingDemo.vue'
import CustomSizingDemo from './StatsDemo/CustomSizingDemo.vue'
</script>

<template>
  <div class="space-y-2 pb-20">
    <!-- Page Header -->
    <div class="flex flex-col space-y-2 pb-6 mb-6 border-b border-border/30">
      <div class="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        <span>Components</span>
        <span class="text-muted-foreground/40">›</span>
        <span class="text-foreground">Stats</span>
      </div>
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Stats</h2>
      <p class="text-lg text-muted-foreground max-w-[70ch]">
        Display key metrics and KPIs with a rich set of layout options, variants, icon styles, and
        trend indicators — ready for any dashboard.
      </p>
    </div>

    <!-- Demo sections — each lives in its own focused file under StatsDemo/ -->
    <VariantsDemo />
    <AttachedDemo />
    <LayoutsDemo />
    <IconStyleDemo />
    <LoadingDemo />
    <CustomSizingDemo />
  </div>
</template>
