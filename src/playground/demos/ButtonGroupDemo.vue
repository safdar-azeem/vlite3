<script setup lang="ts">
import ButtonGroup from '@/components/ButtonGroup.vue'
import Button from '@/components/Button.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">ButtonGroup</h2>
      <p class="text-gray-500">Group a series of buttons together on a single line.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Attached (Default)</h3>
      <ButtonGroup>
        <Button>Years</Button>
        <Button>Months</Button>
        <Button>Days</Button>
      </ButtonGroup>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Detached</h3>
      <ButtonGroup :attached="false">
        <Button variant="outline">Cancel</Button>
        <Button variant="outline">Save</Button>
      </ButtonGroup>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Vertical</h3>
      <ButtonGroup direction="vertical">
        <Button variant="secondary">Top</Button>
        <Button variant="secondary">Middle</Button>
        <Button variant="secondary">Bottom</Button>
      </ButtonGroup>
    </section>
  </div>
</template>
