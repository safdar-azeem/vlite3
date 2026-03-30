<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'
import { AvatarGroup } from '@/components/AvatarGroup'
import DemoSection from '../DemoSection.vue'
import sourceCode from './AvatarGroupDemo.vue?raw'

const users = [
  { src: 'https://i.pravatar.cc/150?u=1', alt: 'Alice Smith' },
  { src: 'https://i.pravatar.cc/150?u=2', alt: 'Bob Jones' },
  { src: 'https://i.pravatar.cc/150?u=3', alt: 'Carol White' },
  { src: 'https://i.pravatar.cc/150?u=4', alt: 'Dan Brown' },
  { src: 'https://i.pravatar.cc/150?u=5', alt: 'Eve Davis' },
  { src: 'https://i.pravatar.cc/150?u=6', alt: 'Frank Wilson' },
]

const fallbackUsers = [
  { alt: 'Alice Smith' },
  { alt: 'Bob Jones' },
  { alt: 'Carol White' },
  { alt: 'Dan Brown' },
  { alt: 'Eve Davis' },
]
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">AvatarGroup</h2>
      <p class="text-gray-500">Display multiple user avatars stacked together with an overflow count.</p>
    </div>

    <DemoSection title="Basic Group" :code="sourceCode">
      <AvatarGroup :items="users" />
    </DemoSection>

    <DemoSection title="With Max Limit & Overflow" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <AvatarGroup :items="users" :max="3" />
        <AvatarGroup :items="users" :max="4" />
        <AvatarGroup :items="users" :max="5" />
      </div>
    </DemoSection>

    <DemoSection title="Sizes" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <AvatarGroup :items="users" size="xs" :max="4" />
        <AvatarGroup :items="users" size="sm" :max="4" />
        <AvatarGroup :items="users" size="md" :max="4" />
        <AvatarGroup :items="users" size="lg" :max="4" />
        <AvatarGroup :items="users" size="xl" :max="4" />
      </div>
    </DemoSection>

    <DemoSection title="Rounded Shapes" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <AvatarGroup :items="users" rounded="full" :max="4" />
        <AvatarGroup :items="users" rounded="lg" :max="4" />
        <AvatarGroup :items="users" rounded="md" :max="4" />
        <AvatarGroup :items="users" rounded="none" :max="4" />
      </div>
    </DemoSection>

    <DemoSection title="Overlap Density" :code="sourceCode">
      <div class="flex flex-col gap-4">
        <AvatarGroup :items="users" overlap="sm" :max="5" />
        <AvatarGroup :items="users" overlap="md" :max="5" />
        <AvatarGroup :items="users" overlap="lg" :max="5" />
      </div>
    </DemoSection>

    <DemoSection title="Fallback Initials (no image)" :code="sourceCode">
      <AvatarGroup :items="fallbackUsers" :max="4" />
    </DemoSection>
  </div>
</template>
