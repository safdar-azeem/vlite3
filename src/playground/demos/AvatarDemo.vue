<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">Avatar</h2>
      <p class="text-gray-500">An image element with a fallback for representing the user.</p>
    </div>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Sizes</h3>
      <div class="flex items-end gap-3 flex-wrap">
         <Avatar size="xs" src="https://i.pravatar.cc/150?u=1" />
         <Avatar size="sm" src="https://i.pravatar.cc/150?u=2" />
         <Avatar size="md" src="https://i.pravatar.cc/150?u=3" />
         <Avatar size="lg" src="https://i.pravatar.cc/150?u=4" />
         <Avatar size="xl" src="https://i.pravatar.cc/150?u=5" />
         <Avatar size="2xl" src="https://i.pravatar.cc/150?u=6" />
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Shapes</h3>
      <div class="flex gap-4">
         <Avatar rounded="none" fallback="Sq" />
         <Avatar rounded="md" fallback="Md" />
         <Avatar rounded="full" fallback="Fu" />
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold">Fallbacks</h3>
      <div class="flex gap-4">
        <Avatar alt="John Doe" />
        <Avatar />
      </div>
    </section>
  </div>
</template>
