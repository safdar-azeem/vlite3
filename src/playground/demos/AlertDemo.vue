<script setup lang="ts">
import Alert from '@/components/Alert.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Alert</h2>
      <p class="text-gray-500">Displays a callout for user attention.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Variants</h3>
      <div class="space-y-3 max-w-xl">
         <Alert title="Primary" description="This is a primary alert." variant="primary" />
         <Alert title="Success" description="Operation completed successfully." icon="lucide:check-circle" variant="success" />
         <Alert title="Warning" description="Please review your inputs." icon="lucide:alert-triangle" variant="warning" />
         <Alert title="Error" description="Something went wrong." icon="lucide:x-circle" variant="danger" />
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Title Only</h3>
      <div class="max-w-xl">
        <Alert title="Short message here" variant="primary" />
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Closable</h3>
      <div class="max-w-xl">
        <Alert title="Dismiss me" description="Click the X icon to close." closable variant="primary" />
      </div>
    </section>
  </div>
</template>
