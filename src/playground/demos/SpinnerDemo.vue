<script setup lang="ts">
import { ref } from 'vue'
import { Spinner } from '@/components/Spinner'
import DemoSection from '../DemoSection.vue'
import sourceCode from './SpinnerDemo.vue?raw'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Spinner</h2>
      <p class="text-gray-500">Indicate loading state with a variety of spinners.</p>
    </div>

    <!-- Variants -->
    <DemoSection title="Variants" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-8">
        <div class="flex flex-col items-center gap-2">
          <Spinner />
          <span class="text-xs text-muted-foreground">Border (Default)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner variant="dots" />
          <span class="text-xs text-muted-foreground">Dots</span>
        </div>
        <div class="flex flex-col items-center gap-2 h-10 justify-end">
          <Spinner variant="bars" />
          <span class="text-xs text-muted-foreground">Bars</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner variant="ping" />
          <span class="text-xs text-muted-foreground">Ping</span>
        </div>
      </div>
    </DemoSection>

    <!-- Sizes -->
    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-wrap items-end gap-6">
        <Spinner size="xs" />
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="xl" />
      </div>
    </DemoSection>

    <!-- Colors -->
    <DemoSection title="Colors" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-6">
        <Spinner color="primary" />
        <Spinner color="secondary" />
        <Spinner color="success" />
        <Spinner color="warning" />
        <Spinner color="danger" />
        <div class="p-2 bg-black rounded-md">
          <Spinner color="white" />
        </div>
      </div>
    </DemoSection>

    <!-- Custom Styling -->
    <DemoSection title="Custom Styling" :code="sourceCode">
      <div class="flex flex-wrap items-center gap-6">
        <Spinner class="text-indigo-500 w-10 h-10" />
        <Spinner variant="dots" class="text-pink-500 w-8 h-8" />
      </div>
    </DemoSection>
  </div>
</template>
