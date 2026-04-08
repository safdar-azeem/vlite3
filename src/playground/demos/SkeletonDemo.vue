<script setup lang="ts">
import { ref } from 'vue'
import DemoSection from '../DemoSection.vue'
import { Skeleton } from '@/components/Skeleton'
import Button from '@/components/Button.vue'
import sourceCode from './SkeletonDemo.vue?raw'

const loading = ref(true)

const toggleLoading = () => {
  loading.value = !loading.value
}
</script>

<template>
  <div class="space-y-12">
    <div class="space-y-4 pb-8 border-b border-border/50">
      <h2 class="text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground">Skeleton</h2>
      <p class="text-lg text-muted-foreground w-full max-w-[80%]">
        Pixel-perfect skeleton loading screens generated directly from your real UI layout without
        manual configuration.
      </p>
    </div>

    <DemoSection title="Auto-Generated Skeleton" :code="sourceCode">
      <div class="space-y-6 w-full max-w-2xl">
        <Button @click="toggleLoading" variant="outline">
          Toggle Loading State ({{ loading ? 'Loading' : 'Loaded' }})
        </Button>

        <Skeleton :loading="loading" auto animate="pulse" transition class="w-full">
          <div
            class="flex flex-col md:flex-row gap-6 p-6 border border-border rounded-xl bg-card shadow-sm w-full">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Avatar"
              class="w-20 h-20 rounded-full shrink-0" />
            <div class="flex-1 space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Sarah Connor</h3>
                <p class="text-sm text-muted-foreground">Lead Product Designer</p>
              </div>
              <p class="text-sm text-foreground leading-relaxed">
                Passionate about creating beautiful, functional, and accessible user interfaces.
                Always learning and exploring new design paradigms in the fast-paced world of modern
                web development.
              </p>
              <div class="flex gap-2 pt-2">
                <Button size="sm" variant="primary">Follow</Button>
                <Button size="sm" variant="outline">Message</Button>
              </div>
            </div>
          </div>
        </Skeleton>
      </div>
    </DemoSection>
  </div>
</template>
